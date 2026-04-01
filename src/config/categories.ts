import type { Category } from "@/types";

/** Mapping from our categories to NewsData.io category slugs */
export const NEWSDATA_CATEGORIES: Record<Category, string> = {
  politics: "politics",
  economy: "business",
  tech_ai: "technology",
  industry: "business",
  environment: "environment",
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
    "cryptocurrency", "forex", "commodity", "unemployment",
  ],
  tech_ai: [
    "artificial intelligence", "machine learning", "AI", "startup",
    "silicon valley", "cybersecurity", "quantum computing", "robotics",
    "blockchain", "software", "cloud computing", "semiconductor",
    "neural network", "LLM", "GPT", "deep learning",
  ],
  industry: [
    "manufacturing", "supply chain", "automotive", "aerospace",
    "pharmaceutical", "energy sector", "mining", "construction",
    "logistics", "industrial", "factory", "production",
  ],
  environment: [
    "climate change", "global warming", "renewable energy", "carbon",
    "sustainability", "biodiversity", "pollution", "deforestation",
    "ocean", "wildfire", "emissions", "green energy", "solar", "wind power",
  ],
};

/** NewsAPI.org category mapping */
export const NEWSAPI_CATEGORIES: Record<Category, string> = {
  politics: "general",
  economy: "business",
  tech_ai: "technology",
  industry: "business",
  environment: "science",
};
