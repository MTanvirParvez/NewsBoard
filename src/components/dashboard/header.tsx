"use client";

import { motion, AnimatePresence } from "framer-motion";
import { RefreshCw, Clock, Sparkles, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useDashboardStore } from "@/store/dashboard";
import { formatDate } from "@/lib/utils";

export function DashboardHeader() {
  const { isUpdating, lastUpdated, articles, setIsUpdating } = useDashboardStore();

  async function handleUpdate() {
    setIsUpdating(true);
    try {
      const res = await fetch("/api/update", { method: "POST" });
      if (!res.ok) throw new Error("Update failed");
      const data = await res.json();

      // Store will be updated via realtime or we reload
      if (data.articles) {
        useDashboardStore.getState().setArticles(data.articles);
      }
      if (data.analytics) {
        useDashboardStore.getState().setAnalytics(data.analytics);
      }
      if (data.summaries) {
        useDashboardStore.getState().setSummaries(data.summaries);
      }
      useDashboardStore.getState().setLastUpdated(new Date().toISOString());
    } catch (err) {
      console.error("Update error:", err);
    } finally {
      setIsUpdating(false);
    }
  }

  return (
    <header className="flex items-center justify-between px-6 h-16 border-b border-border/50 glass">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-semibold tracking-tight">
          Dashboard
        </h1>
        <Badge variant="neon" className="text-xs">
          <Sparkles className="h-3 w-3 mr-1" />
          AI-Powered
        </Badge>
        {articles.length > 0 && (
          <Badge variant="secondary" className="text-xs">
            {articles.length} articles
          </Badge>
        )}
      </div>

      <div className="flex items-center gap-3">
        {lastUpdated && (
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            Updated {formatDate(lastUpdated)}
          </span>
        )}

        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-4 w-4" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-primary animate-pulse" />
        </Button>

        {/* THE BIG UPDATE BUTTON */}
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button
            onClick={handleUpdate}
            disabled={isUpdating}
            variant="neon"
            size="lg"
            className="relative overflow-hidden"
          >
            <AnimatePresence mode="wait">
              {isUpdating ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0, rotate: 0 }}
                  animate={{ opacity: 1, rotate: 360 }}
                  exit={{ opacity: 0 }}
                  transition={{ rotate: { duration: 1, repeat: Infinity, ease: "linear" } }}
                  className="flex items-center gap-2"
                >
                  <RefreshCw className="h-4 w-4" />
                  <span>Updating…</span>
                </motion.div>
              ) : (
                <motion.div
                  key="idle"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-2"
                >
                  <RefreshCw className="h-4 w-4" />
                  <span>Update Now</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Animated border pulse when updating */}
            {isUpdating && (
              <motion.div
                className="absolute inset-0 rounded-xl border-2 border-primary/50"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            )}
          </Button>
        </motion.div>
      </div>
    </header>
  );
}
