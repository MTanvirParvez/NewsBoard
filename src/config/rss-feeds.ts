import type { Category } from "@/types";

export interface RSSFeedConfig {
  url: string;
  name: string;
  category: Category;
}

export const RSS_FEEDS: RSSFeedConfig[] = [
  // ─── Politics ──────────────────────────────
  { url: "https://rss.nytimes.com/services/xml/rss/nyt/Politics.xml", name: "NY Times Politics", category: "politics" },
  { url: "https://feeds.bbci.co.uk/news/politics/rss.xml", name: "BBC Politics", category: "politics" },
  { url: "https://feeds.reuters.com/Reuters/PoliticsNews", name: "Reuters Politics", category: "politics" },

  // ─── Economy ───────────────────────────────
  { url: "https://rss.nytimes.com/services/xml/rss/nyt/Business.xml", name: "NY Times Business", category: "economy" },
  { url: "https://feeds.bbci.co.uk/news/business/rss.xml", name: "BBC Business", category: "economy" },
  { url: "https://search.cnbc.com/rs/search/combinedcms/view.xml?partnerId=wrss01&id=10001147", name: "CNBC Economy", category: "economy" },
  { url: "https://feeds.marketwatch.com/marketwatch/topstories/", name: "MarketWatch", category: "economy" },

  // ─── Tech & AI ─────────────────────────────
  { url: "https://rss.nytimes.com/services/xml/rss/nyt/Technology.xml", name: "NY Times Tech", category: "tech_ai" },
  { url: "https://feeds.bbci.co.uk/news/technology/rss.xml", name: "BBC Technology", category: "tech_ai" },
  { url: "https://www.theverge.com/rss/index.xml", name: "The Verge", category: "tech_ai" },
  { url: "https://techcrunch.com/feed/", name: "TechCrunch", category: "tech_ai" },
  { url: "https://feeds.arstechnica.com/arstechnica/technology-lab", name: "Ars Technica", category: "tech_ai" },

  // ─── Industry ──────────────────────────────
  { url: "https://search.cnbc.com/rs/search/combinedcms/view.xml?partnerId=wrss01&id=10000108", name: "CNBC Industries", category: "industry" },
  { url: "https://feeds.reuters.com/reuters/businessNews", name: "Reuters Business", category: "industry" },

  // ─── Environment ───────────────────────────
  { url: "https://feeds.bbci.co.uk/news/science_and_environment/rss.xml", name: "BBC Environment", category: "environment" },
  { url: "https://rss.nytimes.com/services/xml/rss/nyt/Climate.xml", name: "NY Times Climate", category: "environment" },
  { url: "https://www.theguardian.com/environment/rss", name: "The Guardian Env", category: "environment" },

  // ─── World ─────────────────────────────────
  { url: "https://feeds.bbci.co.uk/news/world/rss.xml", name: "BBC World", category: "world" },
  { url: "https://rss.nytimes.com/services/xml/rss/nyt/World.xml", name: "NY Times World", category: "world" },
  { url: "https://www.aljazeera.com/xml/rss/all.xml", name: "Al Jazeera", category: "world" },
  { url: "https://feeds.reuters.com/Reuters/worldNews", name: "Reuters World", category: "world" },

  // ─── Science ───────────────────────────────
  { url: "https://rss.nytimes.com/services/xml/rss/nyt/Science.xml", name: "NY Times Science", category: "science" },
  { url: "https://www.newscientist.com/section/news/feed/", name: "New Scientist", category: "science" },
  { url: "https://feeds.nature.com/nature/rss/current", name: "Nature", category: "science" },

  // ─── Health ────────────────────────────────
  { url: "https://rss.nytimes.com/services/xml/rss/nyt/Health.xml", name: "NY Times Health", category: "health" },
  { url: "https://feeds.bbci.co.uk/news/health/rss.xml", name: "BBC Health", category: "health" },
  { url: "https://www.statnews.com/feed/", name: "STAT News", category: "health" },

  // ─── Sports ────────────────────────────────
  { url: "https://feeds.bbci.co.uk/sport/rss.xml", name: "BBC Sport", category: "sports" },
  { url: "https://www.espn.com/espn/rss/news", name: "ESPN", category: "sports" },
  { url: "https://rss.nytimes.com/services/xml/rss/nyt/Sports.xml", name: "NY Times Sports", category: "sports" },

  // ─── Entertainment ─────────────────────────
  { url: "https://rss.nytimes.com/services/xml/rss/nyt/Arts.xml", name: "NY Times Arts", category: "entertainment" },
  { url: "https://feeds.bbci.co.uk/news/entertainment_and_arts/rss.xml", name: "BBC Entertainment", category: "entertainment" },
  { url: "https://www.theguardian.com/culture/rss", name: "Guardian Culture", category: "entertainment" },

  // ─── Crypto & Web3 ─────────────────────────
  { url: "https://cointelegraph.com/rss", name: "CoinTelegraph", category: "crypto" },
  { url: "https://decrypt.co/feed", name: "Decrypt", category: "crypto" },

  // ─── Startups ──────────────────────────────
  { url: "https://techcrunch.com/category/startups/feed/", name: "TechCrunch Startups", category: "startups" },
  { url: "https://feeds.feedburner.com/venturebeat/SZYF", name: "VentureBeat", category: "startups" },

  // ─── Energy ────────────────────────────────
  { url: "https://rss.nytimes.com/services/xml/rss/nyt/EnergyEnvironment.xml", name: "NY Times Energy", category: "energy" },
  { url: "https://oilprice.com/rss/main", name: "OilPrice", category: "energy" },

  // ─── Defense ───────────────────────────────
  { url: "https://www.defensenews.com/arc/outboundfeeds/rss/?outputType=xml", name: "Defense News", category: "defense" },

  // ─── Education ─────────────────────────────
  { url: "https://rss.nytimes.com/services/xml/rss/nyt/Education.xml", name: "NY Times Education", category: "education" },
  { url: "https://www.theguardian.com/education/rss", name: "Guardian Education", category: "education" },
];
