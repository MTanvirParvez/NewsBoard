export type Category = "politics" | "economy" | "tech_ai" | "industry" | "environment";

export interface Article {
  id: string;
  external_id: string;
  title: string;
  description: string | null;
  content: string | null;
  source_name: string;
  source_url: string | null;
  image_url: string | null;
  published_at: string;
  category: Category;
  country: string | null;
  language: string;
  keywords: string[];
  sentiment_score: number | null; // -1 to 1
  created_at: string;
}

export interface AISummary {
  id: string;
  article_id: string;
  bullets: string[]; // 3-bullet summary
  sentiment: "positive" | "negative" | "neutral";
  sentiment_score: number;
  topics: string[];
  region: string | null;
  created_at: string;
}

export interface UserPreferences {
  id: string;
  user_id: string;
  categories: Category[];
  preferred_countries: string[];
  ai_provider: "openai" | "anthropic" | "xai";
  auto_refresh: boolean;
  created_at: string;
  updated_at: string;
}

export interface TrendData {
  date: string;
  politics: number;
  economy: number;
  tech_ai: number;
  industry: number;
  environment: number;
}

export interface SentimentData {
  category: Category;
  positive: number;
  negative: number;
  neutral: number;
}

export interface TopicHeat {
  topic: string;
  heat: number;
  category: Category;
}

export interface CountryNewsVolume {
  country: string;
  country_code: string;
  lat: number;
  lng: number;
  volume: number;
  dominant_sentiment: "positive" | "negative" | "neutral";
}

export interface AggregateAnalytics {
  trends: TrendData[];
  sentiment: SentimentData[];
  topicHeat: TopicHeat[];
  countryVolume: CountryNewsVolume[];
  totalArticles: number;
  lastUpdated: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

export const CATEGORY_CONFIG: Record<Category, { label: string; icon: string; color: string; gradient: string }> = {
  politics: {
    label: "Politics",
    icon: "Landmark",
    color: "#f97316",
    gradient: "from-orange-500/20 to-orange-600/5",
  },
  economy: {
    label: "Economy",
    icon: "TrendingUp",
    color: "#22c55e",
    gradient: "from-emerald-500/20 to-emerald-600/5",
  },
  tech_ai: {
    label: "Tech & AI",
    icon: "Cpu",
    color: "#6366f1",
    gradient: "from-indigo-500/20 to-indigo-600/5",
  },
  industry: {
    label: "Industry",
    icon: "Factory",
    color: "#eab308",
    gradient: "from-yellow-500/20 to-yellow-600/5",
  },
  environment: {
    label: "Environment",
    icon: "Leaf",
    color: "#10b981",
    gradient: "from-teal-500/20 to-teal-600/5",
  },
};

export const CATEGORIES: Category[] = ["politics", "economy", "tech_ai", "industry", "environment"];
