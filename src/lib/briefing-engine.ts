import type { Article, AISummary, ExecutiveBriefing, CategoryDigest, KPIStat, Category } from "@/types";
import { CATEGORY_CONFIG, CATEGORIES } from "@/types";

export function generateBriefing(
  articles: Article[],
  summaries: Record<string, AISummary>,
  selectedCategories: Category[]
): ExecutiveBriefing {
  const now = new Date();
  const hour = now.getHours();
  const greeting = hour < 12 ? "Morning" : hour < 17 ? "Afternoon" : "Evening";

  // ─── KPI Stats ─────────────────────
  const totalArticles = articles.length;
  const withSummaries = Object.keys(summaries).length;
  const positiveCount = Object.values(summaries).filter((s) => s.sentiment === "positive").length;
  const negativeCount = Object.values(summaries).filter((s) => s.sentiment === "negative").length;
  const neutralCount = withSummaries - positiveCount - negativeCount;

  const sentimentRatio = withSummaries > 0 ? Math.round((positiveCount / withSummaries) * 100) : 50;

  const countriesSet = new Set<string>();
  articles.forEach((a) => { if (a.country) countriesSet.add(a.country); });
  Object.values(summaries).forEach((s) => { if (s.region) countriesSet.add(s.region); });

  const allTopics = Object.values(summaries).flatMap((s) => s.topics);
  const topicFreq: Record<string, number> = {};
  allTopics.forEach((t) => { topicFreq[t] = (topicFreq[t] || 0) + 1; });
  const breakingTopics = Object.entries(topicFreq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([t]) => t);

  const kpis: KPIStat[] = [
    { label: "Total Stories", value: totalArticles, change: 12, trend: "up", icon: "Newspaper", color: "#818cf8" },
    { label: "Categories", value: selectedCategories.length, change: 0, trend: "flat", icon: "LayoutGrid", color: "#22c55e" },
    { label: "Sentiment", value: sentimentRatio, change: sentimentRatio > 50 ? 5 : -3, trend: sentimentRatio > 50 ? "up" : "down", icon: "Heart", color: sentimentRatio > 50 ? "#22c55e" : "#ef4444" },
    { label: "Countries", value: countriesSet.size, change: 2, trend: "up", icon: "Globe", color: "#3b82f6" },
    { label: "Topics", value: breakingTopics.length, change: 1, trend: "up", icon: "Hash", color: "#f59e0b" },
    { label: "Sources", value: new Set(articles.map((a) => a.source_name)).size, change: 0, trend: "flat", icon: "Rss", color: "#a855f7" },
  ];

  // ─── Category Digests ──────────────
  const digests: CategoryDigest[] = selectedCategories
    .map((cat) => {
      const catArticles = articles.filter((a) => a.category === cat);
      if (catArticles.length === 0) return null;

      const catSummaries = catArticles
        .map((a) => summaries[a.id])
        .filter(Boolean);

      const sentimentScores = catSummaries.map((s) => s.sentiment_score);
      const avgSentiment = sentimentScores.length > 0
        ? sentimentScores.reduce((a, b) => a + b, 0) / sentimentScores.length
        : 0;

      const catTopics: Record<string, number> = {};
      catSummaries.forEach((s) => s.topics.forEach((t) => {
        catTopics[t] = (catTopics[t] || 0) + 1;
      }));
      const topTopics = Object.entries(catTopics)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([t]) => t);

      // Generate key insight from top story
      const topStory = catArticles[0];
      const topSummary = summaries[topStory.id];
      const keyInsight = topSummary
        ? topSummary.bullets[0]
        : topStory.description || topStory.title;

      return {
        category: cat,
        topStory,
        articleCount: catArticles.length,
        sentimentAvg: Math.round(avgSentiment * 100) / 100,
        keyInsight: keyInsight || "No insight available",
        topTopics,
        stories: catArticles.slice(0, 5),
      } as CategoryDigest;
    })
    .filter(Boolean) as CategoryDigest[];

  // ─── Market Mood ───────────────────
  const overallSentiment = withSummaries > 0
    ? (positiveCount - negativeCount) / withSummaries
    : 0;
  const marketMood = overallSentiment > 0.2
    ? "Optimistic — Positive developments dominate global headlines"
    : overallSentiment < -0.2
    ? "Cautious — Challenging news themes prevalent across sectors"
    : "Balanced — Mixed signals across global news landscape";

  // ─── Headline ──────────────────────
  const topDigest = digests[0];
  const headline = topDigest
    ? `${greeting} Briefing: ${topDigest.articleCount} stories in ${CATEGORY_CONFIG[topDigest.category].label}, ${breakingTopics[0] || "global updates"} trending`
    : `${greeting} Briefing: ${totalArticles} stories across ${selectedCategories.length} categories`;

  return {
    generatedAt: now.toISOString(),
    headline,
    kpis,
    digests,
    globalSentiment: { positive: positiveCount, negative: negativeCount, neutral: neutralCount },
    breakingTopics,
    marketMood,
  };
}
