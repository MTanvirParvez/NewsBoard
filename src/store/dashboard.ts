import { create } from "zustand";
import type { Article, AISummary, AggregateAnalytics, Category, ChatMessage } from "@/types";

interface DashboardState {
  articles: Article[];
  summaries: Record<string, AISummary>;
  analytics: AggregateAnalytics | null;
  selectedCategory: Category | "all";
  selectedArticle: Article | null;
  chatMessages: ChatMessage[];
  isUpdating: boolean;
  isLoadingChat: boolean;
  lastUpdated: string | null;

  setArticles: (articles: Article[]) => void;
  setSummaries: (summaries: Record<string, AISummary>) => void;
  setAnalytics: (analytics: AggregateAnalytics) => void;
  setSelectedCategory: (category: Category | "all") => void;
  setSelectedArticle: (article: Article | null) => void;
  addChatMessage: (message: ChatMessage) => void;
  setChatMessages: (messages: ChatMessage[]) => void;
  setIsUpdating: (updating: boolean) => void;
  setIsLoadingChat: (loading: boolean) => void;
  setLastUpdated: (date: string) => void;
}

export const useDashboardStore = create<DashboardState>((set) => ({
  articles: [],
  summaries: {},
  analytics: null,
  selectedCategory: "all",
  selectedArticle: null,
  chatMessages: [],
  isUpdating: false,
  isLoadingChat: false,
  lastUpdated: null,

  setArticles: (articles) => set({ articles }),
  setSummaries: (summaries) => set({ summaries }),
  setAnalytics: (analytics) => set({ analytics }),
  setSelectedCategory: (selectedCategory) => set({ selectedCategory }),
  setSelectedArticle: (selectedArticle) => set({ selectedArticle }),
  addChatMessage: (message) =>
    set((state) => ({ chatMessages: [...state.chatMessages, message] })),
  setChatMessages: (chatMessages) => set({ chatMessages }),
  setIsUpdating: (isUpdating) => set({ isUpdating }),
  setIsLoadingChat: (isLoadingChat) => set({ isLoadingChat }),
  setLastUpdated: (lastUpdated) => set({ lastUpdated }),
}));
