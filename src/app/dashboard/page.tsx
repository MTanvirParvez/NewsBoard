"use client";

import { useEffect } from "react";
import { Sidebar } from "@/components/dashboard/sidebar";
import { DashboardHeader } from "@/components/dashboard/header";
import { ArticleGrid } from "@/components/dashboard/article-grid";
import { RightPanel } from "@/components/dashboard/right-panel";
import { AnalyticsSection } from "@/components/charts/analytics-section";
import { WorldHeatmap } from "@/components/map/world-heatmap";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useDashboardStore } from "@/store/dashboard";

export default function DashboardPage() {
  const { setArticles, setSummaries, setAnalytics, setLastUpdated } = useDashboardStore();

  // Load cached data on mount (if any stored in localStorage)
  useEffect(() => {
    try {
      const cached = localStorage.getItem("luminaboard-cache");
      if (cached) {
        const data = JSON.parse(cached);
        if (data.articles) setArticles(data.articles);
        if (data.summaries) setSummaries(data.summaries);
        if (data.analytics) setAnalytics(data.analytics);
        if (data.lastUpdated) setLastUpdated(data.lastUpdated);
      }
    } catch {
      // ignore parse errors
    }
  }, [setArticles, setSummaries, setAnalytics, setLastUpdated]);

  // Persist to localStorage when data changes
  useEffect(() => {
    const unsub = useDashboardStore.subscribe((state) => {
      if (state.articles.length > 0) {
        localStorage.setItem(
          "luminaboard-cache",
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
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader />

        <ScrollArea className="flex-1">
          <div className="min-h-full">
            {/* Articles Grid */}
            <ArticleGrid />

            {/* Analytics Charts */}
            <AnalyticsSection />

            {/* World Map */}
            <WorldHeatmap />

            {/* Footer spacer */}
            <div className="h-8" />
          </div>
        </ScrollArea>
      </div>

      {/* Right Panel */}
      <RightPanel />
    </div>
  );
}
