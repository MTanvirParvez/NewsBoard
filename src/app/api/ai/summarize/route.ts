import { NextRequest, NextResponse } from "next/server";
import { generateText } from "ai";
import { getAIModel } from "@/lib/ai-model";
import { SUMMARIZE_PROMPT } from "@/config/ai-prompts";
import type { Article, AISummary } from "@/types";

export async function POST(req: NextRequest) {
  const { articles } = (await req.json()) as { articles: Article[] };

  if (!articles?.length) {
    return NextResponse.json({ summaries: {} });
  }

  const model = getAIModel();
  if (!model) {
    return NextResponse.json(
      { error: "No AI provider configured. Set OPENAI_API_KEY, ANTHROPIC_API_KEY, or XAI_API_KEY." },
      { status: 500 }
    );
  }

  const summaries: Record<string, AISummary> = {};

  // Process in batches of 5
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

        try {
          const jsonMatch = text.match(/\{[\s\S]*\}/);
          if (!jsonMatch) throw new Error("No JSON found");

          const parsed = JSON.parse(jsonMatch[0]);
          const summary: AISummary = {
            id: crypto.randomUUID(),
            article_id: article.id,
            bullets: parsed.bullets || ["Summary unavailable"],
            sentiment: parsed.sentiment || "neutral",
            sentiment_score: parsed.sentiment_score ?? 0,
            topics: parsed.topics || [],
            region: parsed.region || null,
            created_at: new Date().toISOString(),
          };
          return { articleId: article.id, summary };
        } catch {
          return {
            articleId: article.id,
            summary: {
              id: crypto.randomUUID(),
              article_id: article.id,
              bullets: ["AI summary processing failed for this article"],
              sentiment: "neutral" as const,
              sentiment_score: 0,
              topics: [],
              region: null,
              created_at: new Date().toISOString(),
            },
          };
        }
      })
    );

    for (const result of results) {
      if (result.status === "fulfilled") {
        summaries[result.value.articleId] = result.value.summary;
      }
    }
  }

  return NextResponse.json({ summaries });
}
