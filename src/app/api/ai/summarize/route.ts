import { NextRequest, NextResponse } from "next/server";
import { summarizeArticle } from "@/lib/local-ai";
import { getAIModel } from "@/lib/ai-model";
import { SUMMARIZE_PROMPT } from "@/config/ai-prompts";
import type { Article, AISummary } from "@/types";

export async function POST(req: NextRequest) {
  const { articles } = (await req.json()) as { articles: Article[] };

  if (!articles?.length) {
    return NextResponse.json({ summaries: {}, engine: "none" });
  }

  const model = getAIModel();

  // If we have an AI API key, use it for higher quality summaries
  if (model) {
    try {
      const { generateText } = await import("ai");
      const summaries: Record<string, AISummary> = {};

      const batchSize = 5;
      for (let i = 0; i < articles.length; i += batchSize) {
        const batch = articles.slice(i, i + batchSize);

        const results = await Promise.allSettled(
          batch.map(async (article) => {
            const { text } = await generateText({
              model,
              system: SUMMARIZE_PROMPT,
              prompt: `Title: ${article.title}\nSource: ${article.source_name}\nDescription: ${article.description || "N/A"}\nContent: ${(article.content || "").slice(0, 1500)}`,
              maxOutputTokens: 300,
              temperature: 0.3,
            });

            const jsonMatch = text.match(/\{[\s\S]*\}/);
            if (!jsonMatch) throw new Error("No JSON");

            const parsed = JSON.parse(jsonMatch[0]);
            return {
              articleId: article.id,
              summary: {
                id: crypto.randomUUID(),
                article_id: article.id,
                bullets: parsed.bullets || ["Summary unavailable"],
                sentiment: parsed.sentiment || "neutral",
                sentiment_score: parsed.sentiment_score ?? 0,
                topics: parsed.topics || [],
                region: parsed.region || null,
                created_at: new Date().toISOString(),
              } as AISummary,
            };
          })
        );

        for (const result of results) {
          if (result.status === "fulfilled") {
            summaries[result.value.articleId] = result.value.summary;
          }
        }
      }

      // For any articles that failed with API, fallback to local
      for (const article of articles) {
        if (!summaries[article.id]) {
          summaries[article.id] = summarizeArticle(article);
        }
      }

      return NextResponse.json({ summaries, engine: "api" });
    } catch (err) {
      console.error("API AI failed, falling back to local engine:", err);
    }
  }

  // Default: Local AI engine (no API key needed)
  const summaries: Record<string, AISummary> = {};
  for (const article of articles) {
    summaries[article.id] = summarizeArticle(article);
  }

  return NextResponse.json({ summaries, engine: "local" });
}
