import { NextRequest, NextResponse } from "next/server";
import { generateText } from "ai";
import { getAIModel } from "@/lib/ai-model";
import { AGGREGATE_PROMPT } from "@/config/ai-prompts";
import type { Article, AISummary, AggregateAnalytics } from "@/types";

export async function POST(req: NextRequest) {
  const { articles, summaries } = (await req.json()) as {
    articles: Article[];
    summaries: Record<string, AISummary>;
  };

  const model = getAIModel();

  if (model && articles.length > 0) {
    try {
      const articleSummary = articles.slice(0, 40).map((a) => ({
        title: a.title,
        category: a.category,
        country: a.country,
        sentiment: summaries[a.id]?.sentiment || "neutral",
        topics: summaries[a.id]?.topics || [],
        published: a.published_at,
      }));

      const { text } = await generateText({
        model,
        system: AGGREGATE_PROMPT,
        prompt: JSON.stringify(articleSummary),
        maxOutputTokens: 1500,
        temperature: 0.2,
      });

      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]) as AggregateAnalytics;
        parsed.totalArticles = articles.length;
        parsed.lastUpdated = new Date().toISOString();
        return NextResponse.json({ analytics: parsed });
      }
    } catch (err) {
      console.error("AI analytics error:", err);
    }
  }

  const analytics = generateLocalAnalytics(articles, summaries);
  return NextResponse.json({ analytics });
}

function generateLocalAnalytics(
  articles: Article[],
  summaries: Record<string, AISummary>
): AggregateAnalytics {
  const categories = ["politics", "economy", "tech_ai", "industry", "environment"] as const;

  const sentiment = categories.map((cat) => {
    const catArticles = articles.filter((a) => a.category === cat);
    let positive = 0, negative = 0, neutral = 0;
    for (const a of catArticles) {
      const s = summaries[a.id]?.sentiment;
      if (s === "positive") positive++;
      else if (s === "negative") negative++;
      else neutral++;
    }
    return { category: cat, positive, negative, neutral };
  });

  const dateGroups: Record<string, Record<string, number>> = {};
  for (const a of articles) {
    const date = new Date(a.published_at).toISOString().split("T")[0];
    if (!dateGroups[date]) {
      dateGroups[date] = { politics: 0, economy: 0, tech_ai: 0, industry: 0, environment: 0 };
    }
    dateGroups[date][a.category]++;
  }
  const trends = Object.entries(dateGroups)
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-7)
    .map(([date, counts]) => ({ date, ...counts }));

  const topicCounts: Record<string, { count: number; category: string }> = {};
  for (const a of articles) {
    const s = summaries[a.id];
    if (s?.topics) {
      for (const t of s.topics) {
        if (!topicCounts[t]) topicCounts[t] = { count: 0, category: a.category };
        topicCounts[t].count++;
      }
    }
  }
  const topicHeat = Object.entries(topicCounts)
    .sort((a, b) => b[1].count - a[1].count)
    .slice(0, 15)
    .map(([topic, { count, category }]) => ({
      topic,
      heat: Math.min(count * 15, 100),
      category: category as typeof categories[number],
    }));

  const countryCounts: Record<string, { volume: number; sentiments: string[] }> = {};
  for (const a of articles) {
    const country = a.country || summaries[a.id]?.region;
    if (country) {
      if (!countryCounts[country]) countryCounts[country] = { volume: 0, sentiments: [] };
      countryCounts[country].volume++;
      countryCounts[country].sentiments.push(summaries[a.id]?.sentiment || "neutral");
    }
  }

  const countryVolume = Object.entries(countryCounts)
    .sort((a, b) => b[1].volume - a[1].volume)
    .slice(0, 20)
    .map(([country, data]) => {
      const sentimentMode = ([...["positive", "negative", "neutral"]] as ("positive" | "negative" | "neutral")[]).sort(
        (a, b) =>
          data.sentiments.filter((s) => s === b).length -
          data.sentiments.filter((s) => s === a).length
      )[0];

      return {
        country,
        country_code: country.slice(0, 2).toUpperCase(),
        lat: 0,
        lng: 0,
        volume: data.volume,
        dominant_sentiment: sentimentMode,
      };
    });

  return {
    trends: trends as AggregateAnalytics["trends"],
    sentiment,
    topicHeat,
    countryVolume,
    totalArticles: articles.length,
    lastUpdated: new Date().toISOString(),
  };
}
