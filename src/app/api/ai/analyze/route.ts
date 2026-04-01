import { NextRequest, NextResponse } from "next/server";
import { generateAnalytics } from "@/lib/local-ai";
import { getAIModel } from "@/lib/ai-model";
import { AGGREGATE_PROMPT } from "@/config/ai-prompts";
import type { Article, AISummary, AggregateAnalytics } from "@/types";

export async function POST(req: NextRequest) {
  const { articles, summaries } = (await req.json()) as {
    articles: Article[];
    summaries: Record<string, AISummary>;
  };

  if (!articles?.length) {
    return NextResponse.json({ analytics: null, engine: "none" });
  }

  const model = getAIModel();

  // If we have an AI API key, try to get richer analytics
  if (model) {
    try {
      const { generateText } = await import("ai");

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
        return NextResponse.json({ analytics: parsed, engine: "api" });
      }
    } catch (err) {
      console.error("API analytics failed, using local engine:", err);
    }
  }

  // Default: Local analytics engine (no API key needed)
  const analytics = generateAnalytics(articles, summaries);
  return NextResponse.json({ analytics, engine: "local" });
}
