"use client";

import { useEffect, useCallback, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Sidebar } from "@/components/dashboard/sidebar";
import { DashboardHeader } from "@/components/dashboard/header";
import { NewsTicker } from "@/components/dashboard/news-ticker";
import { ExecutiveBriefing } from "@/components/dashboard/briefing/executive-briefing";
import { ArticleGrid } from "@/components/dashboard/article-grid";
import { RightPanel } from "@/components/dashboard/right-panel";
import { AnalyticsSection } from "@/components/charts/analytics-section";
import { WorldHeatmap } from "@/components/map/world-heatmap";
import { AmbientParticles } from "@/components/dashboard/ambient-particles";
import { PersonalizationPanel } from "@/components/dashboard/briefing/personalization-panel";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ToastContainer, showToast } from "@/components/ui/toast";
import { useDashboardStore } from "@/store/dashboard";
import { SEED_ARTICLES, generateSeedSummaries, generateSeedAnalytics } from "@/config/seed-data";

export default function DashboardPage() {
  const {
    setArticles, setSummaries, setAnalytics, setLastUpdated, setIsUpdating,
    activeView,
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
        showToast({
          type: "update",
          title: `${data.articles.length} live articles loaded`,
          message: "Dashboard updated with latest global news",
        });
      }
    } catch (err) {
      console.error("Auto-fetch error:", err);
      showToast({ type: "info", title: "Using sample data", message: "Live feeds unavailable" });
    } finally {
      setIsUpdating(false);
    }
  }, [setArticles, setSummaries, setAnalytics, setLastUpdated, setIsUpdating]);

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

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
          const age = Date.now() - new Date(data.lastUpdated || 0).getTime();
          if (age > 60 * 60 * 1000) fetchNews();
          return;
        }
      }
    } catch { /* ignore */ }

    if (!hasCache) {
      setArticles(SEED_ARTICLES);
      setSummaries(generateSeedSummaries());
      setAnalytics(generateSeedAnalytics());
      setLastUpdated(new Date().toISOString());
      fetchNews();
    }
  }, [setArticles, setSummaries, setAnalytics, setLastUpdated, fetchNews]);

  useEffect(() => {
    const unsub = useDashboardStore.subscribe((state) => {
      if (state.articles.length > 0) {
        localStorage.setItem("newsboard-cache", JSON.stringify({
          articles: state.articles,
          summaries: state.summaries,
          analytics: state.analytics,
          lastUpdated: state.lastUpdated,
        }));
      }
    });
    return unsub;
  }, []);

  return (
    <div className="flex h-screen overflow-hidden bg-background relative">
      <AmbientParticles />
      <ToastContainer />
      <PersonalizationPanel />

      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden relative z-10">
        <DashboardHeader />
        <NewsTicker />

        <ScrollArea className="flex-1">
          <div className="min-h-full">
            <AnimatePresence mode="wait">
              {activeView === "briefing" && (
                <motion.div
                  key="briefing"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.25 }}
                >
                  <ExecutiveBriefing />
                </motion.div>
              )}

              {activeView === "explore" && (
                <motion.div
                  key="explore"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.25 }}
                >
                  <ArticleGrid />
                </motion.div>
              )}

              {activeView === "analytics" && (
                <motion.div
                  key="analytics"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.25 }}
                >
                  <AnalyticsSection />
                  <WorldHeatmap />
                </motion.div>
              )}
            </AnimatePresence>

            <div className="h-8" />
          </div>
        </ScrollArea>
      </div>

      <RightPanel />
    </div>
  );
}
