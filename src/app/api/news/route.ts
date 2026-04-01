import { NextResponse } from "next/server";
import Parser from "rss-parser";
import type { Article, Category } from "@/types";
import { RSS_FEEDS } from "@/config/rss-feeds";
import { NEWSDATA_CATEGORIES, CATEGORY_KEYWORDS } from "@/config/categories";
import { CATEGORIES } from "@/types";

const rssParser = new Parser({
  timeout: 10000,
  headers: {
    "User-Agent": "NewsBoard/1.0 (News Dashboard)",
    Accept: "application/rss+xml, application/xml, text/xml",
  },
});

// ─── RSS Fetching (FREE — no API key) ─────────────────────────

async function fetchRSSFeed(feed: { url: string; name: string; category: Category }): Promise<Article[]> {
  try {
    const parsed = await rssParser.parseURL(feed.url);

    return (parsed.items || []).slice(0, 8).map((item) => ({
      id: crypto.randomUUID(),
      external_id: item.guid || item.link || crypto.randomUUID(),
      title: item.title || "Untitled",
      description: cleanHTML(item.contentSnippet || item.content || item.summary || null),
      content: cleanHTML(item.content || item["content:encoded"] || null),
      source_name: feed.name,
      source_url: item.link || null,
      image_url: extractImage(item),
      published_at: item.isoDate || item.pubDate || new Date().toISOString(),
      category: feed.category,
      country: null,
      language: "en",
      keywords: item.categories?.slice(0, 5) || [],
      sentiment_score: null,
      created_at: new Date().toISOString(),
    }));
  } catch (err) {
    console.error(`RSS fetch failed for ${feed.name} (${feed.url}):`, err);
    return [];
  }
}

function cleanHTML(html: string | null): string | null {
  if (!html) return null;
  return html
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function extractImage(item: Record<string, unknown>): string | null {
  // Check common RSS image fields
  if (item.enclosure && typeof item.enclosure === "object") {
    const enc = item.enclosure as Record<string, string>;
    if (enc.url && enc.type?.startsWith("image")) return enc.url;
  }
  if (typeof item["media:content"] === "object") {
    const media = item["media:content"] as Record<string, string>;
    if (media.url) return media.url;
  }
  // Try to extract from content
  const content = (item.content || item["content:encoded"] || "") as string;
  const imgMatch = content.match(/<img[^>]+src=["']([^"']+)["']/);
  if (imgMatch) return imgMatch[1];
  return null;
}

// ─── NewsData.io Fetching (optional, if key provided) ─────────

interface NewsDataArticle {
  article_id: string;
  title: string;
  description: string | null;
  content: string | null;
  source_name?: string;
  source_id?: string;
  link: string;
  image_url: string | null;
  pubDate: string;
  country: string[];
  language: string;
  keywords: string[] | null;
}

async function fetchNewsDataIO(category: Category): Promise<Article[]> {
  const apiKey = process.env.NEWSDATA_API_KEY;
  if (!apiKey) return [];

  try {
    const cat = NEWSDATA_CATEGORIES[category];
    const keywords = CATEGORY_KEYWORDS[category].slice(0, 3).join(" OR ");
    const url = `https://newsdata.io/api/1/latest?apikey=${apiKey}&category=${cat}&language=en&q=${encodeURIComponent(keywords)}&size=10`;

    const res = await fetch(url, { next: { revalidate: 300 } });
    if (!res.ok) return [];

    const data = await res.json();
    if (!data.results) return [];

    return data.results.map((a: NewsDataArticle) => ({
      id: crypto.randomUUID(),
      external_id: a.article_id || crypto.randomUUID(),
      title: a.title,
      description: a.description,
      content: a.content,
      source_name: a.source_name || a.source_id || "Unknown",
      source_url: a.link,
      image_url: a.image_url,
      published_at: a.pubDate || new Date().toISOString(),
      category,
      country: a.country?.[0] || null,
      language: a.language || "en",
      keywords: a.keywords || [],
      sentiment_score: null,
      created_at: new Date().toISOString(),
    }));
  } catch (err) {
    console.error(`NewsData.io error for ${category}:`, err);
    return [];
  }
}

// ─── Main Handler ─────────────────────────────────────────────

export async function GET() {
  const allArticles: Article[] = [];

  // Strategy 1: If NewsData.io key exists, use it as primary
  if (process.env.NEWSDATA_API_KEY) {
    const apiResults = await Promise.all(
      CATEGORIES.map((cat) => fetchNewsDataIO(cat))
    );
    for (const articles of apiResults) {
      allArticles.push(...articles);
    }
  }

  // Strategy 2: Always fetch RSS feeds (free, no key needed)
  // This is the primary source when no API keys are configured
  const rssResults = await Promise.allSettled(
    RSS_FEEDS.map((feed) => fetchRSSFeed(feed))
  );

  for (const result of rssResults) {
    if (result.status === "fulfilled") {
      allArticles.push(...result.value);
    }
  }

  // Deduplicate by title similarity
  const seen = new Set<string>();
  const unique = allArticles.filter((a) => {
    const key = a.title.toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 50);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  // Sort by published date (newest first)
  unique.sort(
    (a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime()
  );

  return NextResponse.json({
    articles: unique.slice(0, 100), // Cap at 100 articles
    source: process.env.NEWSDATA_API_KEY ? "api+rss" : "rss",
    count: unique.length,
  });
}
