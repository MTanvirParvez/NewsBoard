"use client";

import { useEffect, useCallback, useRef } from "react";
import { Sidebar } from "@/components/dashboard/sidebar";
import { DashboardHeader } from "@/components/dashboard/header";
import { ArticleGrid } from "@/components/dashboard/article-grid";
import { RightPanel } from "@/components/dashboard/right-panel";
import { AnalyticsSection } from "@/components/charts/analytics-section";
import { WorldHeatmap } from "@/components/map/world-heatmap";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useDashboardStore } from "@/store/dashboard";
import {
  SEED_ARTICLES,
  generateSeedSummaries,
  generateSeedAnalytics,
} from "@/config/seed-data";

export default function DashboardPage() {
  const {
    setArticles,
    setSummaries,
    setAnalytics,
    setLastUpdated,
    setIsUpdating,
  } = useDashboardStore();
  const hasFetched = useRef(false);

  const fetchNews = useCallback(async () => {
    setIsUpdating(true);
    try {
      const res = await fetch("/api/update", { method: "POST" });
      if (!res.ok) throw new Error("Update failed");
      const data = await res.json();

      if (data.articles?.length) {
        setArticles(data.articles);
        if (data.summaries) setSummaries(data.summaries);
        if (data.analytics) setAnalytics(data.analytics);
        setLastUpdated(new Date().toISOString());
      }
    } catch (err) {
      console.error("Auto-fetch error:", err);
    } finally {
      setIsUpdating(false);
    }
  }, [setArticles, setSummaries, setAnalytics, setLastUpdated, setIsUpdating]);

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    // 1. Try to load from localStorage cache
    let hasCache = false;
    try {
      const cached = localStorage.getItem("newsboard-cache");
      if (cached) {
        const data = JSON.parse(cached);
        if (data.articles?.length) {
          setArticles(data.articles);
          if (data.summaries) setSummaries(data.summaries);
          if (data.analytics) setAnalytics(data.analytics);
          if (data.lastUpdated) setLastUpdated(data.lastUpdated);
          hasCache = true;

          // Refresh in background if cache > 1 hour old
          const age = Date.now() - new Date(data.lastUpdated || 0).getTime();
          if (age > 60 * 60 * 1000) {
            fetchNews();
          }
          return;
        }
      }
    } catch {
      // ignore
    }

    // 2. No cache — show seed data immediately so dashboard isn't empty
    if (!hasCache) {
      setArticles(SEED_ARTICLES);
      setSummaries(generateSeedSummaries());
      setAnalytics(generateSeedAnalytics());
      setLastUpdated(new Date().toISOString());

      // Then fetch real news in background (replaces seed data)
      fetchNews();
    }
  }, [setArticles, setSummaries, setAnalytics, setLastUpdated, fetchNews]);

  // Persist to localStorage when data changes
  useEffect(() => {
    const unsub = useDashboardStore.subscribe((state) => {
      if (state.articles.length > 0) {
        localStorage.setItem(
          "newsboard-cache",
          JSON.stringify({
            articles: state.articles,
            summaries: state.summaries,
            analytics: state.analytics,
            lastUpdated: state.lastUpdated,
          })
        );
      }
    });
    return unsub;
  }, []);

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader />

        <ScrollArea className="flex-1">
          <div className="min-h-full">
            <ArticleGrid />
            <AnalyticsSection />
            <WorldHeatmap />
            <div className="h-8" />
          </div>
        </ScrollArea>
      </div>

      <RightPanel />
    </div>
  );
}
