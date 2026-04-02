/**
 * Local AI Engine — Zero API keys required.
 *
 * Provides extractive summarization, keyword-based sentiment analysis,
 * and topic extraction using pure TypeScript. No external services needed.
 */

import type { AISummary, Article, AggregateAnalytics, Category } from "@/types";
import { CATEGORIES } from "@/types";

// ─── Sentiment Lexicon ────────────────────────────────────────

const POSITIVE_WORDS = new Set([
  "good", "great", "excellent", "positive", "growth", "gain", "profit",
  "success", "win", "improve", "boost", "surge", "rise", "advance",
  "achievement", "breakthrough", "innovative", "progress", "recovery",
  "strong", "agreement", "peace", "cooperation", "hope", "optimistic",
  "benefit", "opportunity", "upgrade", "milestone", "record", "best",
  "support", "thrive", "flourish", "celebrate", "prosper", "sustainable",
  "clean", "renewable", "efficient", "safe", "protect", "solution",
  "launch", "expand", "invest", "fund", "approve", "resolve",
]);

const NEGATIVE_WORDS = new Set([
  "bad", "worse", "worst", "negative", "loss", "decline", "crash",
  "fail", "crisis", "threat", "war", "conflict", "attack", "kill",
  "destroy", "collapse", "recession", "inflation", "unemployment",
  "scandal", "corruption", "fraud", "protest", "riot", "sanction",
  "ban", "arrest", "death", "disaster", "catastrophe", "emergency",
  "pollution", "contamination", "wildfire", "flood", "drought",
  "extinction", "deforestation", "hack", "breach", "layoff", "cut",
  "shortage", "deficit", "debt", "default", "fear", "concern", "risk",
  "violation", "controversy", "strike", "shutdown", "plunge", "drop",
]);

// ─── Country Detection ────────────────────────────────────────

const COUNTRY_PATTERNS: [string, string, number, number][] = [
  ["United States", "US", 39.8, -98.5],
  ["United Kingdom", "GB", 54.0, -2.0],
  ["China", "CN", 35.0, 105.0],
  ["Russia", "RU", 60.0, 100.0],
  ["India", "IN", 22.0, 78.0],
  ["Japan", "JP", 36.0, 138.0],
  ["Germany", "DE", 51.0, 10.0],
  ["France", "FR", 46.0, 2.0],
  ["Brazil", "BR", -14.0, -51.0],
  ["Canada", "CA", 56.0, -106.0],
  ["Australia", "AU", -25.0, 134.0],
  ["South Korea", "KR", 36.0, 128.0],
  ["Italy", "IT", 42.5, 12.5],
  ["Spain", "ES", 40.0, -4.0],
  ["Mexico", "MX", 23.0, -102.0],
  ["Indonesia", "ID", -5.0, 120.0],
  ["Turkey", "TR", 39.0, 35.0],
  ["Saudi Arabia", "SA", 24.0, 45.0],
  ["Israel", "IL", 31.5, 34.8],
  ["Ukraine", "UA", 49.0, 32.0],
  ["Iran", "IR", 32.0, 53.0],
  ["Nigeria", "NG", 10.0, 8.0],
  ["South Africa", "ZA", -30.0, 25.0],
  ["Egypt", "EG", 27.0, 30.0],
  ["Poland", "PL", 52.0, 20.0],
  ["Taiwan", "TW", 23.5, 121.0],
  ["Netherlands", "NL", 52.5, 5.75],
  ["Switzerland", "CH", 47.0, 8.0],
  ["Sweden", "SE", 62.0, 15.0],
  ["Argentina", "AR", -34.0, -64.0],
];

// US state/city aliases that should map to "United States"
const US_ALIASES = [
  "washington", "congress", "senate", "white house", "pentagon",
  "wall street", "silicon valley", "california", "new york", "texas",
  "florida", "capitol hill", "federal reserve", "the fed",
];

// ─── Extractive Summarization ─────────────────────────────────

function splitSentences(text: string): string[] {
  return text
    .replace(/\s+/g, " ")
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 20 && s.length < 300);
}

function scoreSentence(sentence: string, titleWords: Set<string>): number {
  const words = sentence.toLowerCase().split(/\W+/);
  let score = 0;

  // Bonus for title-word overlap
  for (const w of words) {
    if (titleWords.has(w) && w.length > 3) score += 3;
  }

  // Bonus for informative length (prefer medium-length sentences)
  if (words.length >= 8 && words.length <= 25) score += 2;

  // Bonus for having numbers (data-rich)
  if (/\d/.test(sentence)) score += 2;

  // Bonus for quotes (attribution)
  if (sentence.includes('"') || sentence.includes("'")) score += 1;

  // Penalize questions
  if (sentence.endsWith("?")) score -= 3;

  // Penalize very short
  if (words.length < 6) score -= 2;

  return score;
}

function extractSummaryBullets(title: string, description: string | null, content: string | null): string[] {
  const titleWords = new Set(
    title.toLowerCase().split(/\W+/).filter((w) => w.length > 3)
  );

  // Combine available text
  const fullText = [description, content].filter(Boolean).join(" ");
  if (!fullText) {
    return [title, "No additional details available.", "Click to read the full article."];
  }

  const sentences = splitSentences(fullText);
  if (sentences.length === 0) {
    return [
      truncateSentence(fullText, 120),
      "Click to read the full article.",
      `Source provides additional context.`,
    ];
  }

  // Score and rank sentences
  const scored = sentences.map((s, i) => ({
    text: s,
    score: scoreSentence(s, titleWords) + (i < 3 ? 2 : 0), // boost early sentences
    index: i,
  }));

  scored.sort((a, b) => b.score - a.score);

  // Pick top 3, maintaining original order
  const top = scored.slice(0, 3).sort((a, b) => a.index - b.index);

  return top.map((s) => truncateSentence(s.text, 120));
}

function truncateSentence(s: string, maxLen: number): string {
  if (s.length <= maxLen) return s;
  const cut = s.slice(0, maxLen);
  const lastSpace = cut.lastIndexOf(" ");
  return (lastSpace > 60 ? cut.slice(0, lastSpace) : cut) + "…";
}

// ─── Sentiment Analysis ───────────────────────────────────────

function analyzeSentiment(text: string): { score: number; label: "positive" | "negative" | "neutral" } {
  const words = text.toLowerCase().split(/\W+/);
  let positive = 0;
  let negative = 0;

  for (const word of words) {
    if (POSITIVE_WORDS.has(word)) positive++;
    if (NEGATIVE_WORDS.has(word)) negative++;
  }

  const total = positive + negative;
  if (total === 0) return { score: 0, label: "neutral" };

  const score = (positive - negative) / Math.max(total, 1);
  const normalized = Math.max(-1, Math.min(1, score));

  return {
    score: Math.round(normalized * 100) / 100,
    label: normalized > 0.15 ? "positive" : normalized < -0.15 ? "negative" : "neutral",
  };
}

// ─── Topic Extraction ─────────────────────────────────────────

function extractTopics(title: string, description: string | null): string[] {
  const text = `${title} ${description || ""}`.toLowerCase();
  const words = text.split(/\W+/).filter((w) => w.length > 4);

  // Stop words to exclude
  const stopWords = new Set([
    "about", "after", "again", "being", "between", "could", "during",
    "every", "first", "found", "going", "would", "their", "there",
    "these", "think", "those", "through", "under", "using", "where",
    "which", "while", "world", "years", "other", "people", "states",
    "should", "still", "since", "before", "might", "according",
    "report", "reports", "saying", "latest", "update", "source",
  ]);

  // Count word frequency
  const freq: Record<string, number> = {};
  for (const w of words) {
    if (!stopWords.has(w)) {
      freq[w] = (freq[w] || 0) + 1;
    }
  }

  // Sort by frequency and take top 5
  return Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([word]) => word.charAt(0).toUpperCase() + word.slice(1));
}

// ─── Country Detection ────────────────────────────────────────

function detectCountry(text: string): string | null {
  const lower = text.toLowerCase();

  // Check US aliases first
  for (const alias of US_ALIASES) {
    if (lower.includes(alias)) return "United States";
  }

  // Check country names
  for (const [name] of COUNTRY_PATTERNS) {
    if (lower.includes(name.toLowerCase())) return name;
  }

  return null;
}

// ─── Public API ───────────────────────────────────────────────

export function summarizeArticle(article: Article): AISummary {
  const fullText = `${article.title} ${article.description || ""} ${article.content || ""}`;
  const sentiment = analyzeSentiment(fullText);
  const bullets = extractSummaryBullets(article.title, article.description, article.content);
  const topics = extractTopics(article.title, article.description);
  const region = detectCountry(fullText);

  return {
    id: crypto.randomUUID(),
    article_id: article.id,
    bullets,
    sentiment: sentiment.label,
    sentiment_score: sentiment.score,
    topics,
    region,
    created_at: new Date().toISOString(),
  };
}

export function generateAnalytics(
  articles: Article[],
  summaries: Record<string, AISummary>
): AggregateAnalytics {
  const categories = CATEGORIES;

  // ─── Sentiment per category ─────────────
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

  // ─── Trends (by date) ──────────────────
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
    .map(([date, counts]) => ({ date: date.slice(5), ...counts }));

  // ─── Topic Heat ─────────────────────────
  const topicCounts: Record<string, { count: number; category: Category }> = {};
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
      heat: Math.min(count * 12, 100),
      category,
    }));

  // ─── Country Volume ─────────────────────
  const countryCounts: Record<string, { volume: number; sentiments: string[] }> = {};
  for (const a of articles) {
    const region = summaries[a.id]?.region || detectCountry(`${a.title} ${a.description || ""}`);
    if (region) {
      if (!countryCounts[region]) countryCounts[region] = { volume: 0, sentiments: [] };
      countryCounts[region].volume++;
      countryCounts[region].sentiments.push(summaries[a.id]?.sentiment || "neutral");
    }
  }

  const countryVolume = Object.entries(countryCounts)
    .sort((a, b) => b[1].volume - a[1].volume)
    .slice(0, 20)
    .map(([country, data]) => {
      // Find coordinates
      const match = COUNTRY_PATTERNS.find(([name]) => name === country);
      const sentimentCounts = { positive: 0, negative: 0, neutral: 0 };
      for (const s of data.sentiments) {
        if (s === "positive") sentimentCounts.positive++;
        else if (s === "negative") sentimentCounts.negative++;
        else sentimentCounts.neutral++;
      }
      const dominant = (Object.entries(sentimentCounts).sort((a, b) => b[1] - a[1])[0][0]) as "positive" | "negative" | "neutral";

      return {
        country,
        country_code: match?.[1] || country.slice(0, 2).toUpperCase(),
        lat: match?.[2] || 0,
        lng: match?.[3] || 0,
        volume: data.volume,
        dominant_sentiment: dominant,
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
