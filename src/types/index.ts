export type Category =
  | "politics"
  | "economy"
  | "tech_ai"
  | "industry"
  | "environment"
  | "world"
  | "science"
  | "health"
  | "sports"
  | "entertainment"
  | "crypto"
  | "startups"
  | "energy"
  | "defense"
  | "education";

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
  sentiment_score: number | null;
  created_at: string;
}

export interface AISummary {
  id: string;
  article_id: string;
  bullets: string[];
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
  [key: string]: string | number;
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

// ─── Executive Dashboard Types ─────────────────────

export interface KPIStat {
  label: string;
  value: number;
  change: number; // percentage change
  trend: "up" | "down" | "flat";
  icon: string;
  color: string;
}

export interface CategoryDigest {
  category: Category;
  topStory: Article | null;
  articleCount: number;
  sentimentAvg: number;
  keyInsight: string;
  topTopics: string[];
  stories: Article[];
}

export interface ExecutiveBriefing {
  generatedAt: string;
  headline: string;
  kpis: KPIStat[];
  digests: CategoryDigest[];
  globalSentiment: { positive: number; negative: number; neutral: number };
  breakingTopics: string[];
  marketMood: string;
}

export interface Subscriber {
  email: string;
  categories: Category[];
  subscribedAt: string;
}

export const CATEGORY_CONFIG: Record<Category, { label: string; icon: string; color: string; gradient: string }> = {
  politics: { label: "Politics", icon: "Landmark", color: "#f97316", gradient: "from-orange-500/20 to-orange-600/5" },
  economy: { label: "Economy", icon: "TrendingUp", color: "#22c55e", gradient: "from-emerald-500/20 to-emerald-600/5" },
  tech_ai: { label: "Tech & AI", icon: "Cpu", color: "#6366f1", gradient: "from-indigo-500/20 to-indigo-600/5" },
  industry: { label: "Industry", icon: "Factory", color: "#eab308", gradient: "from-yellow-500/20 to-yellow-600/5" },
  environment: { label: "Environment", icon: "Leaf", color: "#10b981", gradient: "from-teal-500/20 to-teal-600/5" },
  world: { label: "World", icon: "Globe", color: "#3b82f6", gradient: "from-blue-500/20 to-blue-600/5" },
  science: { label: "Science", icon: "FlaskConical", color: "#a855f7", gradient: "from-purple-500/20 to-purple-600/5" },
  health: { label: "Health", icon: "HeartPulse", color: "#ec4899", gradient: "from-pink-500/20 to-pink-600/5" },
  sports: { label: "Sports", icon: "Trophy", color: "#f59e0b", gradient: "from-amber-500/20 to-amber-600/5" },
  entertainment: { label: "Entertainment", icon: "Film", color: "#e879f9", gradient: "from-fuchsia-500/20 to-fuchsia-600/5" },
  crypto: { label: "Crypto & Web3", icon: "Bitcoin", color: "#f7931a", gradient: "from-orange-400/20 to-orange-500/5" },
  startups: { label: "Startups", icon: "Rocket", color: "#06b6d4", gradient: "from-cyan-500/20 to-cyan-600/5" },
  energy: { label: "Energy", icon: "Zap", color: "#facc15", gradient: "from-yellow-400/20 to-yellow-500/5" },
  defense: { label: "Defense", icon: "Shield", color: "#64748b", gradient: "from-slate-500/20 to-slate-600/5" },
  education: { label: "Education", icon: "GraduationCap", color: "#2dd4bf", gradient: "from-teal-400/20 to-teal-500/5" },
};

export const CATEGORIES: Category[] = Object.keys(CATEGORY_CONFIG) as Category[];

export const DEFAULT_CATEGORIES: Category[] = [
  "politics", "economy", "tech_ai", "world", "science", "health",
];
