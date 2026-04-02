import type { Category } from "@/types";

/** Mapping from our categories to NewsData.io category slugs */
export const NEWSDATA_CATEGORIES: Partial<Record<Category, string>> = {
  politics: "politics",
  economy: "business",
  tech_ai: "technology",
  industry: "business",
  environment: "environment",
  world: "world",
  science: "science",
  health: "health",
  sports: "sports",
  entertainment: "entertainment",
  education: "education",
  energy: "environment",
  crypto: "business",
  startups: "business",
  defense: "politics",
};

/** Keywords for filtering / AI classification */
export const CATEGORY_KEYWORDS: Record<Category, string[]> = {
  politics: [
    "election", "government", "parliament", "senate", "congress",
    "president", "prime minister", "diplomacy", "sanctions", "geopolitics",
    "legislation", "policy", "referendum", "coalition",
  ],
  economy: [
    "economy", "gdp", "inflation", "interest rate", "stock market",
    "federal reserve", "trade", "fiscal", "recession", "banking",
    "forex", "commodity", "unemployment",
  ],
  tech_ai: [
    "artificial intelligence", "machine learning", "AI", "startup",
    "cybersecurity", "quantum computing", "robotics",
    "software", "cloud computing", "semiconductor",
    "neural network", "LLM", "GPT", "deep learning",
  ],
  industry: [
    "manufacturing", "supply chain", "automotive", "aerospace",
    "pharmaceutical", "mining", "construction",
    "logistics", "industrial", "factory", "production",
  ],
  environment: [
    "climate change", "global warming", "renewable energy", "carbon",
    "sustainability", "biodiversity", "pollution", "deforestation",
    "wildfire", "emissions", "green energy",
  ],
  world: [
    "united nations", "international", "foreign affairs", "treaty",
    "conflict", "peacekeeping", "refugee", "humanitarian", "war",
    "alliance", "NATO", "BRICS", "G7", "G20",
  ],
  science: [
    "research", "discovery", "experiment", "physics", "biology",
    "chemistry", "astronomy", "space", "NASA", "CERN",
    "genome", "evolution", "climate science",
  ],
  health: [
    "healthcare", "vaccine", "disease", "pandemic", "WHO",
    "hospital", "mental health", "pharmaceutical", "clinical trial",
    "cancer", "nutrition", "public health",
  ],
  sports: [
    "championship", "tournament", "olympics", "world cup",
    "football", "basketball", "tennis", "cricket",
    "athlete", "league", "match", "stadium",
  ],
  entertainment: [
    "movie", "film", "music", "celebrity", "streaming",
    "album", "concert", "awards", "box office",
    "television", "series", "gaming",
  ],
  crypto: [
    "bitcoin", "ethereum", "blockchain", "cryptocurrency",
    "defi", "NFT", "web3", "token", "mining",
    "exchange", "wallet", "CBDC", "stablecoin",
  ],
  startups: [
    "startup", "venture capital", "series A", "series B",
    "unicorn", "funding", "founder", "incubator",
    "accelerator", "seed round", "IPO",
  ],
  energy: [
    "oil", "gas", "solar", "wind power", "nuclear",
    "energy transition", "fossil fuel", "pipeline",
    "OPEC", "electricity", "grid", "battery",
  ],
  defense: [
    "military", "defense", "army", "navy", "air force",
    "missile", "weapons", "pentagon", "intelligence",
    "national security", "warfare", "drone",
  ],
  education: [
    "university", "school", "education", "student",
    "curriculum", "scholarship", "tuition", "teacher",
    "academic", "research", "campus",
  ],
};

/** NewsAPI.org category mapping */
export const NEWSAPI_CATEGORIES: Partial<Record<Category, string>> = {
  politics: "general",
  economy: "business",
  tech_ai: "technology",
  industry: "business",
  environment: "science",
  science: "science",
  health: "health",
  sports: "sports",
  entertainment: "entertainment",
};
