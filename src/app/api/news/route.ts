import { NextResponse } from "next/server";
import type { Article, Category } from "@/types";
import { NEWSDATA_CATEGORIES, NEWSAPI_CATEGORIES, CATEGORY_KEYWORDS } from "@/config/categories";
import { CATEGORIES } from "@/types";

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
  category: string[];
}

interface NewsAPIArticle {
  title: string;
  description: string | null;
  content: string | null;
  source: { name: string };
  url: string;
  urlToImage: string | null;
  publishedAt: string;
}

function classifyArticle(title: string, description: string | null): Category {
  const text = `${title} ${description || ""}`.toLowerCase();
  let bestCategory: Category = "politics";
  let bestScore = 0;

  for (const cat of CATEGORIES) {
    const keywords = CATEGORY_KEYWORDS[cat];
    let score = 0;
    for (const kw of keywords) {
      if (text.includes(kw.toLowerCase())) score++;
    }
    if (score > bestScore) {
      bestScore = score;
      bestCategory = cat;
    }
  }
  return bestCategory;
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

async function fetchNewsAPIOrg(category: Category): Promise<Article[]> {
  const apiKey = process.env.NEWSAPI_API_KEY;
  if (!apiKey) return [];

  try {
    const keywords = CATEGORY_KEYWORDS[category].slice(0, 2).join(" OR ");
    const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(keywords)}&language=en&sortBy=publishedAt&pageSize=10&apiKey=${apiKey}`;

    const res = await fetch(url, { next: { revalidate: 300 } });
    if (!res.ok) return [];

    const data = await res.json();
    if (!data.articles) return [];

    return data.articles
      .filter((a: NewsAPIArticle) => a.title && a.title !== "[Removed]")
      .map((a: NewsAPIArticle) => ({
        id: crypto.randomUUID(),
        external_id: `newsapi-${Buffer.from(a.url || "").toString("base64").slice(0, 50)}`,
        title: a.title,
        description: a.description,
        content: a.content,
        source_name: a.source?.name || "Unknown",
        source_url: a.url,
        image_url: a.urlToImage,
        published_at: a.publishedAt || new Date().toISOString(),
        category: classifyArticle(a.title, a.description),
        country: null,
        language: "en",
        keywords: [],
        sentiment_score: null,
        created_at: new Date().toISOString(),
      }));
  } catch (err) {
    console.error(`NewsAPI.org error for ${category}:`, err);
    return [];
  }
}

export async function GET() {
  const allArticles: Article[] = [];

  // Try primary source (NewsData.io) for each category
  const primaryResults = await Promise.all(
    CATEGORIES.map((cat) => fetchNewsDataIO(cat))
  );

  for (const articles of primaryResults) {
    allArticles.push(...articles);
  }

  // If we got fewer than 10 total, try fallback (NewsAPI.org)
  if (allArticles.length < 10) {
    const fallbackResults = await Promise.all(
      CATEGORIES.map((cat) => fetchNewsAPIOrg(cat))
    );
    for (const articles of fallbackResults) {
      allArticles.push(...articles);
    }
  }

  // Deduplicate by title similarity
  const seen = new Set<string>();
  const unique = allArticles.filter((a) => {
    const key = a.title.toLowerCase().slice(0, 60);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  // Sort by published date
  unique.sort(
    (a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime()
  );

  return NextResponse.json({ articles: unique });
}
