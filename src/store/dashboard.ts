import { create } from "zustand";
import type {
  Article, AISummary, AggregateAnalytics, Category,
  ChatMessage, ExecutiveBriefing, CategoryDigest,
} from "@/types";
import { DEFAULT_CATEGORIES } from "@/types";

interface DashboardState {
  // Data
  articles: Article[];
  summaries: Record<string, AISummary>;
  analytics: AggregateAnalytics | null;
  briefing: ExecutiveBriefing | null;

  // Personalization
  selectedCategories: Category[];
  selectedCategory: Category | "all";
  selectedArticle: Article | null;

  // Chat
  chatMessages: ChatMessage[];
  isLoadingChat: boolean;

  // UI
  isUpdating: boolean;
  lastUpdated: string | null;
  showPersonalization: boolean;
  activeView: "briefing" | "explore" | "analytics";

  // Actions
  setArticles: (articles: Article[]) => void;
  setSummaries: (summaries: Record<string, AISummary>) => void;
  setAnalytics: (analytics: AggregateAnalytics) => void;
  setBriefing: (briefing: ExecutiveBriefing) => void;
  setSelectedCategories: (categories: Category[]) => void;
  setSelectedCategory: (category: Category | "all") => void;
  setSelectedArticle: (article: Article | null) => void;
  addChatMessage: (message: ChatMessage) => void;
  setChatMessages: (messages: ChatMessage[]) => void;
  setIsUpdating: (updating: boolean) => void;
  setIsLoadingChat: (loading: boolean) => void;
  setLastUpdated: (date: string) => void;
  setShowPersonalization: (show: boolean) => void;
  setActiveView: (view: "briefing" | "explore" | "analytics") => void;
  toggleCategory: (category: Category) => void;
}

export const useDashboardStore = create<DashboardState>((set) => ({
  articles: [],
  summaries: {},
  analytics: null,
  briefing: null,
  selectedCategories: DEFAULT_CATEGORIES,
  selectedCategory: "all",
  selectedArticle: null,
  chatMessages: [],
  isLoadingChat: false,
  isUpdating: false,
  lastUpdated: null,
  showPersonalization: false,
  activeView: "briefing",

  setArticles: (articles) => set({ articles }),
  setSummaries: (summaries) => set({ summaries }),
  setAnalytics: (analytics) => set({ analytics }),
  setBriefing: (briefing) => set({ briefing }),
  setSelectedCategories: (selectedCategories) => set({ selectedCategories }),
  setSelectedCategory: (selectedCategory) => set({ selectedCategory }),
  setSelectedArticle: (selectedArticle) => set({ selectedArticle }),
  addChatMessage: (message) =>
    set((state) => ({ chatMessages: [...state.chatMessages, message] })),
  setChatMessages: (chatMessages) => set({ chatMessages }),
  setIsUpdating: (isUpdating) => set({ isUpdating }),
  setIsLoadingChat: (isLoadingChat) => set({ isLoadingChat }),
  setLastUpdated: (lastUpdated) => set({ lastUpdated }),
  setShowPersonalization: (showPersonalization) => set({ showPersonalization }),
  setActiveView: (activeView) => set({ activeView }),
  toggleCategory: (category) =>
    set((state) => {
      const has = state.selectedCategories.includes(category);
      return {
        selectedCategories: has
          ? state.selectedCategories.filter((c) => c !== category)
          : [...state.selectedCategories, category],
      };
    }),
}));
