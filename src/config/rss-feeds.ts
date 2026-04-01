import type { Category } from "@/types";

export interface RSSFeedConfig {
  url: string;
  name: string;
  category: Category;
}

/**
 * Free RSS feeds — no API key required.
 * These are publicly available from major news outlets.
 */
export const RSS_FEEDS: RSSFeedConfig[] = [
  // ─── Politics ──────────────────────────────
  {
    url: "https://rss.nytimes.com/services/xml/rss/nyt/Politics.xml",
    name: "NY Times Politics",
    category: "politics",
  },
  {
    url: "https://feeds.bbci.co.uk/news/politics/rss.xml",
    name: "BBC Politics",
    category: "politics",
  },
  {
    url: "https://www.aljazeera.com/xml/rss/all.xml",
    name: "Al Jazeera",
    category: "politics",
  },
  {
    url: "https://feeds.reuters.com/Reuters/worldNews",
    name: "Reuters World",
    category: "politics",
  },

  // ─── Economy ───────────────────────────────
  {
    url: "https://rss.nytimes.com/services/xml/rss/nyt/Business.xml",
    name: "NY Times Business",
    category: "economy",
  },
  {
    url: "https://feeds.bbci.co.uk/news/business/rss.xml",
    name: "BBC Business",
    category: "economy",
  },
  {
    url: "https://search.cnbc.com/rs/search/combinedcms/view.xml?partnerId=wrss01&id=10001147",
    name: "CNBC Economy",
    category: "economy",
  },
  {
    url: "https://feeds.marketwatch.com/marketwatch/topstories/",
    name: "MarketWatch",
    category: "economy",
  },

  // ─── Tech & AI ─────────────────────────────
  {
    url: "https://rss.nytimes.com/services/xml/rss/nyt/Technology.xml",
    name: "NY Times Tech",
    category: "tech_ai",
  },
  {
    url: "https://feeds.bbci.co.uk/news/technology/rss.xml",
    name: "BBC Technology",
    category: "tech_ai",
  },
  {
    url: "https://www.theverge.com/rss/index.xml",
    name: "The Verge",
    category: "tech_ai",
  },
  {
    url: "https://techcrunch.com/feed/",
    name: "TechCrunch",
    category: "tech_ai",
  },
  {
    url: "https://feeds.arstechnica.com/arstechnica/technology-lab",
    name: "Ars Technica",
    category: "tech_ai",
  },

  // ─── Industry ──────────────────────────────
  {
    url: "https://search.cnbc.com/rs/search/combinedcms/view.xml?partnerId=wrss01&id=10000108",
    name: "CNBC Industries",
    category: "industry",
  },
  {
    url: "https://rss.nytimes.com/services/xml/rss/nyt/EnergyEnvironment.xml",
    name: "NY Times Energy",
    category: "industry",
  },
  {
    url: "https://feeds.reuters.com/reuters/businessNews",
    name: "Reuters Business",
    category: "industry",
  },

  // ─── Environment ───────────────────────────
  {
    url: "https://feeds.bbci.co.uk/news/science_and_environment/rss.xml",
    name: "BBC Science & Environment",
    category: "environment",
  },
  {
    url: "https://rss.nytimes.com/services/xml/rss/nyt/Climate.xml",
    name: "NY Times Climate",
    category: "environment",
  },
  {
    url: "https://www.theguardian.com/environment/rss",
    name: "The Guardian Environment",
    category: "environment",
  },
];
