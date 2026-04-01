import { NextRequest, NextResponse } from "next/server";
import type { Article, AISummary, AggregateAnalytics } from "@/types";

export async function POST(req: NextRequest) {
  // Derive base URL from the incoming request
  const url = new URL(req.url);
  const baseUrl = `${url.protocol}//${url.host}`;

  try {
    // Step 1: Fetch news articles from RSS feeds + optional APIs
    const newsRes = await fetch(`${baseUrl}/api/news`, {
      headers: { "User-Agent": "LuminaBoard-Internal/1.0" },
    });
    if (!newsRes.ok) throw new Error(`News fetch failed: ${newsRes.status}`);
    const newsData = await newsRes.json();
    const articles: Article[] = newsData.articles || [];

    if (!articles.length) {
      return NextResponse.json({
        articles: [],
        summaries: {},
        analytics: null,
        message: "No articles fetched. RSS feeds may be temporarily unavailable — try again in a moment.",
      });
    }

    // Step 2: Generate summaries (local AI or API-based)
    let summaries: Record<string, AISummary> = {};
    try {
      const summaryRes = await fetch(`${baseUrl}/api/ai/summarize`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ articles: articles.slice(0, 50) }),
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
      source: newsData.source || "rss",
      message: `Processed ${articles.length} articles from ${newsData.source || "RSS feeds"}`,
    });
  } catch (err) {
    console.error("Update pipeline error:", err);
    return NextResponse.json(
      {
        error: "Update pipeline failed",
        details: String(err),
        message: "Failed to fetch news. Check your network connection and try again.",
      },
      { status: 500 }
    );
  }
}
