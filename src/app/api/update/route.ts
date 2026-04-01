import { NextResponse } from "next/server";
import type { Article, AISummary, AggregateAnalytics } from "@/types";

export async function POST() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  try {
    // Step 1: Fetch news articles
    const newsRes = await fetch(`${baseUrl}/api/news`);
    if (!newsRes.ok) throw new Error("Failed to fetch news");
    const { articles }: { articles: Article[] } = await newsRes.json();

    if (!articles?.length) {
      return NextResponse.json({
        articles: [],
        summaries: {},
        analytics: null,
        message: "No articles found. Check your API keys.",
      });
    }

    // Step 2: Generate AI summaries
    let summaries: Record<string, AISummary> = {};
    try {
      const summaryRes = await fetch(`${baseUrl}/api/ai/summarize`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ articles: articles.slice(0, 30) }),
      });
      if (summaryRes.ok) {
        const data = await summaryRes.json();
        summaries = data.summaries || {};
      }
    } catch (err) {
      console.error("Summary generation error:", err);
    }

    // Step 3: Generate aggregate analytics
    let analytics: AggregateAnalytics | null = null;
    try {
      const analyticsRes = await fetch(`${baseUrl}/api/ai/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ articles, summaries }),
      });
      if (analyticsRes.ok) {
        const data = await analyticsRes.json();
        analytics = data.analytics;
      }
    } catch (err) {
      console.error("Analytics generation error:", err);
    }

    return NextResponse.json({
      articles,
      summaries,
      analytics,
      message: `Successfully processed ${articles.length} articles`,
    });
  } catch (err) {
    console.error("Update pipeline error:", err);
    return NextResponse.json(
      { error: "Update pipeline failed", details: String(err) },
      { status: 500 }
    );
  }
}
