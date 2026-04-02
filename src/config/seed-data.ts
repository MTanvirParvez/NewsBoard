import type { Article, AISummary, AggregateAnalytics } from "@/types";

const now = new Date().toISOString();
const h = (hours: number) => new Date(Date.now() - hours * 3600000).toISOString();

export const SEED_ARTICLES: Article[] = [
  // Politics
  { id: "s-pol-1", external_id: "s-pol-1", title: "Global Leaders Convene for Summit on International Security and Trade", description: "Representatives from over 40 nations gathered to discuss pressing security concerns and new multilateral trade frameworks.", content: null, source_name: "Reuters", source_url: null, image_url: null, published_at: h(1), category: "politics", country: "United States", language: "en", keywords: ["summit", "security", "trade"], sentiment_score: 0.3, created_at: now },
  { id: "s-pol-2", external_id: "s-pol-2", title: "Parliament Passes Landmark Reform Bill After Months of Debate", description: "The reform bill addressing healthcare and education funding passed with a narrow majority.", content: null, source_name: "BBC News", source_url: null, image_url: null, published_at: h(2), category: "politics", country: "United Kingdom", language: "en", keywords: ["parliament", "reform"], sentiment_score: 0.2, created_at: now },

  // Economy
  { id: "s-eco-1", external_id: "s-eco-1", title: "Central Banks Signal Cautious Approach as Inflation Shows Signs of Easing", description: "The Federal Reserve and ECB indicated they may pause rate hikes as recent data suggests inflation is gradually coming under control.", content: null, source_name: "CNBC", source_url: null, image_url: null, published_at: h(1), category: "economy", country: "United States", language: "en", keywords: ["inflation", "federal reserve"], sentiment_score: 0.4, created_at: now },
  { id: "s-eco-2", external_id: "s-eco-2", title: "Emerging Markets See Record Foreign Investment Inflows in Q1", description: "Several emerging economies are experiencing unprecedented FDI driven by favorable demographics.", content: null, source_name: "MarketWatch", source_url: null, image_url: null, published_at: h(3), category: "economy", country: "India", language: "en", keywords: ["investment", "emerging markets"], sentiment_score: 0.6, created_at: now },

  // Tech & AI
  { id: "s-tech-1", external_id: "s-tech-1", title: "Major AI Lab Announces Breakthrough in Multimodal Reasoning", description: "New model demonstrates significant advances in combining text, image, and code understanding.", content: null, source_name: "TechCrunch", source_url: null, image_url: null, published_at: h(1), category: "tech_ai", country: "United States", language: "en", keywords: ["artificial intelligence", "breakthrough"], sentiment_score: 0.7, created_at: now },
  { id: "s-tech-2", external_id: "s-tech-2", title: "Cybersecurity Firms Warn of New Supply Chain Attack Vector", description: "Multiple security companies identified a novel attack method targeting software supply chains.", content: null, source_name: "Ars Technica", source_url: null, image_url: null, published_at: h(2), category: "tech_ai", country: null, language: "en", keywords: ["cybersecurity", "supply chain"], sentiment_score: -0.5, created_at: now },

  // World
  { id: "s-wld-1", external_id: "s-wld-1", title: "UN General Assembly Addresses Rising Humanitarian Crisis in East Africa", description: "Member states pledge additional aid as drought and conflict displace millions across the Horn of Africa.", content: null, source_name: "Al Jazeera", source_url: null, image_url: null, published_at: h(2), category: "world", country: "Kenya", language: "en", keywords: ["UN", "humanitarian"], sentiment_score: -0.3, created_at: now },
  { id: "s-wld-2", external_id: "s-wld-2", title: "Indo-Pacific Nations Strengthen Maritime Cooperation Agreement", description: "New framework aims to bolster regional security and freedom of navigation in contested waters.", content: null, source_name: "Reuters", source_url: null, image_url: null, published_at: h(3), category: "world", country: "Japan", language: "en", keywords: ["Indo-Pacific", "maritime"], sentiment_score: 0.4, created_at: now },

  // Science
  { id: "s-sci-1", external_id: "s-sci-1", title: "CERN Scientists Report Anomalous Particle Behavior in Latest Experiments", description: "New findings could challenge the Standard Model of particle physics.", content: null, source_name: "Nature", source_url: null, image_url: null, published_at: h(3), category: "science", country: "Switzerland", language: "en", keywords: ["CERN", "physics", "particle"], sentiment_score: 0.5, created_at: now },

  // Health
  { id: "s-hlt-1", external_id: "s-hlt-1", title: "WHO Approves New Malaria Vaccine for Widespread Distribution", description: "The vaccine shows 75% efficacy and could save hundreds of thousands of lives annually in sub-Saharan Africa.", content: null, source_name: "BBC Health", source_url: null, image_url: null, published_at: h(1), category: "health", country: "Switzerland", language: "en", keywords: ["WHO", "malaria", "vaccine"], sentiment_score: 0.8, created_at: now },

  // Environment
  { id: "s-env-1", external_id: "s-env-1", title: "Renewable Energy Installations Hit Record Highs Globally", description: "Solar and wind capacity additions surpassed 150 GW globally as costs continue to decline.", content: null, source_name: "The Guardian", source_url: null, image_url: null, published_at: h(1), category: "environment", country: "China", language: "en", keywords: ["renewable energy", "solar"], sentiment_score: 0.7, created_at: now },

  // Industry
  { id: "s-ind-1", external_id: "s-ind-1", title: "Automotive Giants Accelerate Electric Vehicle Production Timelines", description: "Major automakers announced accelerated EV rollout plans citing improving battery economics.", content: null, source_name: "Reuters Business", source_url: null, image_url: null, published_at: h(2), category: "industry", country: "Germany", language: "en", keywords: ["automotive", "EV"], sentiment_score: 0.4, created_at: now },

  // Sports
  { id: "s-spt-1", external_id: "s-spt-1", title: "Historic Upset at Grand Slam as Unseeded Player Reaches Final", description: "The 127th-ranked qualifier defeated three top-10 seeds in consecutive rounds.", content: null, source_name: "ESPN", source_url: null, image_url: null, published_at: h(1), category: "sports", country: "France", language: "en", keywords: ["tennis", "grand slam"], sentiment_score: 0.6, created_at: now },

  // Startups
  { id: "s-str-1", external_id: "s-str-1", title: "AI Healthcare Startup Raises $200M Series C at $2B Valuation", description: "The startup uses foundation models to accelerate drug discovery timelines by 60%.", content: null, source_name: "TechCrunch", source_url: null, image_url: null, published_at: h(2), category: "startups", country: "United States", language: "en", keywords: ["startup", "AI", "healthcare"], sentiment_score: 0.7, created_at: now },

  // Crypto
  { id: "s-cry-1", external_id: "s-cry-1", title: "Major Central Bank Announces Digital Currency Pilot for Cross-Border Payments", description: "The CBDC pilot will test instant settlement between 6 participating nations.", content: null, source_name: "CoinTelegraph", source_url: null, image_url: null, published_at: h(3), category: "crypto", country: "Singapore", language: "en", keywords: ["CBDC", "digital currency"], sentiment_score: 0.4, created_at: now },
];

export function generateSeedSummaries(): Record<string, AISummary> {
  const summaries: Record<string, AISummary> = {};
  const bulletMap: Record<string, string[]> = {
    "s-pol-1": ["40+ nations participated in the security and trade summit", "Key discussions on cyber threats and economic cooperation", "Several bilateral agreements signed"],
    "s-pol-2": ["Reform bill for healthcare and education passed narrowly", "Months of cross-party negotiations led to deal", "Expected to reshape public service funding"],
    "s-eco-1": ["Fed and ECB signal possible pause in rate hikes", "Markets responded positively across major indices", "Economists divided on sustainability of the trend"],
    "s-eco-2": ["Record Q1 foreign direct investment in emerging markets", "India and Southeast Asia leading the investment surge", "Favorable demographics driving investor confidence"],
    "s-tech-1": ["New AI model achieves multimodal reasoning breakthrough", "Combines text, image, and code understanding", "Open-source release planned for research community"],
    "s-tech-2": ["Novel supply chain attack vector identified globally", "Several major organizations already affected", "Security teams urged to audit dependencies"],
    "s-wld-1": ["UN addresses humanitarian crisis in East Africa", "Drought and conflict displacing millions", "Additional aid pledged by member states"],
    "s-wld-2": ["Indo-Pacific nations bolster maritime cooperation", "Framework strengthens freedom of navigation", "Security alliance expanding in contested region"],
    "s-sci-1": ["CERN reports anomalous particle behavior", "Findings could challenge Standard Model physics", "Further experiments planned to confirm results"],
    "s-hlt-1": ["WHO approves malaria vaccine for distribution", "75% efficacy could save hundreds of thousands", "Rollout targeting sub-Saharan Africa first"],
    "s-env-1": ["Record 150+ GW of renewables installed in Q1", "Cost declines driving rapid adoption globally", "Renewables expected to exceed 40% of new capacity"],
    "s-ind-1": ["Major automakers accelerating EV timelines", "Battery cost improvements enhancing economics", "Regulatory pressure intensifying globally"],
    "s-spt-1": ["127th-ranked qualifier reaches Grand Slam final", "Defeated three top-10 seeds consecutively", "Historic upset captivating global tennis fans"],
    "s-str-1": ["AI healthcare startup hits $2B valuation", "Foundation models accelerate drug discovery by 60%", "Series C led by major venture firms"],
    "s-cry-1": ["Central bank CBDC pilot for cross-border payments", "Six nations participating in test program", "Instant settlement technology being trialed"],
  };
  for (const article of SEED_ARTICLES) {
    summaries[article.id] = {
      id: `sum-${article.id}`, article_id: article.id,
      bullets: bulletMap[article.id] || [article.title],
      sentiment: article.sentiment_score! > 0.2 ? "positive" : article.sentiment_score! < -0.2 ? "negative" : "neutral",
      sentiment_score: article.sentiment_score!,
      topics: article.keywords,
      region: article.country,
      created_at: now,
    };
  }
  return summaries;
}

export function generateSeedAnalytics(): AggregateAnalytics {
  const today = new Date().toISOString().slice(5, 10);
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(5, 10);
  return {
    trends: [
      { date: yesterday, politics: 8, economy: 6, tech_ai: 10, world: 7, health: 4, science: 3 },
      { date: today, politics: 2, economy: 2, tech_ai: 2, world: 2, health: 1, science: 1 },
    ],
    sentiment: [
      { category: "politics", positive: 1, negative: 0, neutral: 1 },
      { category: "economy", positive: 2, negative: 0, neutral: 0 },
      { category: "tech_ai", positive: 1, negative: 1, neutral: 0 },
      { category: "world", positive: 1, negative: 1, neutral: 0 },
      { category: "health", positive: 1, negative: 0, neutral: 0 },
      { category: "environment", positive: 1, negative: 0, neutral: 0 },
    ],
    topicHeat: [
      { topic: "Artificial Intelligence", heat: 85, category: "tech_ai" },
      { topic: "Renewable Energy", heat: 70, category: "environment" },
      { topic: "Inflation", heat: 65, category: "economy" },
      { topic: "Cybersecurity", heat: 58, category: "tech_ai" },
      { topic: "Electric Vehicles", heat: 55, category: "industry" },
      { topic: "CBDC", heat: 50, category: "crypto" },
      { topic: "WHO Vaccine", heat: 48, category: "health" },
      { topic: "CERN Physics", heat: 42, category: "science" },
    ],
    countryVolume: [
      { country: "United States", country_code: "US", lat: 39.8, lng: -98.5, volume: 5, dominant_sentiment: "positive" },
      { country: "China", country_code: "CN", lat: 35, lng: 105, volume: 2, dominant_sentiment: "positive" },
      { country: "United Kingdom", country_code: "GB", lat: 54, lng: -2, volume: 1, dominant_sentiment: "positive" },
      { country: "India", country_code: "IN", lat: 22, lng: 78, volume: 1, dominant_sentiment: "positive" },
      { country: "Germany", country_code: "DE", lat: 51, lng: 10, volume: 1, dominant_sentiment: "positive" },
      { country: "Japan", country_code: "JP", lat: 36, lng: 138, volume: 1, dominant_sentiment: "positive" },
      { country: "Switzerland", country_code: "CH", lat: 47, lng: 8, volume: 2, dominant_sentiment: "positive" },
      { country: "Kenya", country_code: "KE", lat: 0, lng: 38, volume: 1, dominant_sentiment: "negative" },
      { country: "France", country_code: "FR", lat: 46, lng: 2, volume: 1, dominant_sentiment: "positive" },
      { country: "Singapore", country_code: "SG", lat: 1.3, lng: 103.8, volume: 1, dominant_sentiment: "positive" },
    ],
    totalArticles: 15,
    lastUpdated: now,
  };
}
