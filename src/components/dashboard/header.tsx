"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RefreshCw, Clock, Sparkles, Rss, Activity, Settings2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useDashboardStore } from "@/store/dashboard";
import { formatDate } from "@/lib/utils";
import { showToast } from "@/components/ui/toast";

function AnimatedCounter({ value }: { value: number }) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (value === 0) { setDisplay(0); return; }
    const duration = 600;
    const steps = 20;
    const increment = value / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setDisplay(value);
        clearInterval(timer);
      } else {
        setDisplay(Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [value]);

  return (
    <motion.span
      key={value}
      initial={{ scale: 1.3, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="tabular-nums"
    >
      {display}
    </motion.span>
  );
}

export function DashboardHeader() {
  const { isUpdating, lastUpdated, articles, setIsUpdating, setShowPersonalization } = useDashboardStore();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!isUpdating) {
      setProgress(0);
      return;
    }
    // Simulate progress — accelerates then slows at end
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) return prev + 0.2;
        if (prev >= 70) return prev + 0.5;
        return prev + 2;
      });
    }, 100);
    return () => clearInterval(timer);
  }, [isUpdating]);

  async function handleUpdate() {
    setIsUpdating(true);
    setProgress(5);

    try {
      const res = await fetch("/api/update", { method: "POST" });
      if (!res.ok) throw new Error("Update failed");
      const data = await res.json();

      setProgress(100);

      if (data.articles?.length) {
        useDashboardStore.getState().setArticles(data.articles);
        showToast({
          type: "update",
          title: `${data.articles.length} articles fetched`,
          message: data.message || "Dashboard updated with latest news",
        });
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
      showToast({
        type: "error",
        title: "Update failed",
        message: "Could not fetch news. Check your connection.",
      });
    } finally {
      setTimeout(() => {
        setIsUpdating(false);
        setProgress(0);
      }, 500);
    }
  }

  return (
    <header className="relative border-b border-border/50 glass">
      <div className="flex items-center justify-between px-6 h-14">
        <div className="flex items-center gap-3">
          <h1 className="text-lg font-semibold tracking-tight flex items-center gap-2">
            Dashboard
            <Activity className="h-4 w-4 text-primary animate-glow-pulse" />
          </h1>
          <Badge variant="neon" className="text-[10px]">
            <Sparkles className="h-3 w-3 mr-1" />
            AI
          </Badge>
          <Badge variant="success" className="text-[10px]">
            <Rss className="h-3 w-3 mr-1" />
            RSS
          </Badge>
          {articles.length > 0 && (
            <Badge variant="secondary" className="text-[10px] tabular-nums">
              <AnimatedCounter value={articles.length} /> articles
            </Badge>
          )}
        </div>

        <div className="flex items-center gap-3">
          {lastUpdated && (
            <span className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
              <Clock className="h-3 w-3" />
              {formatDate(lastUpdated)}
            </span>
          )}

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowPersonalization(true)}
            className="text-xs gap-1.5"
          >
            <Settings2 className="h-3.5 w-3.5" />
            Personalize
          </Button>

          {/* Update Now Button */}
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <Button
              onClick={handleUpdate}
              disabled={isUpdating}
              variant="neon"
              size="default"
              className="relative overflow-hidden gap-2"
            >
              <AnimatePresence mode="wait">
                {isUpdating ? (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-2"
                  >
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                      <RefreshCw className="h-4 w-4" />
                    </motion.div>
                    <span className="text-sm">Updating…</span>
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
                    <span className="text-sm">Update Now</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Animated progress bar */}
      <AnimatePresence>
        {isUpdating && (
          <motion.div
            className="absolute bottom-0 left-0 h-[2px]"
            initial={{ width: "0%", opacity: 0 }}
            animate={{
              width: `${progress}%`,
              opacity: 1,
            }}
            exit={{ width: "100%", opacity: 0 }}
            transition={{ ease: "easeOut", duration: 0.3 }}
            style={{
              background: "linear-gradient(90deg, #818cf8, #22c55e, #818cf8)",
              backgroundSize: "200% 100%",
              animation: "gradient-shift 2s ease infinite",
              boxShadow: "0 0 12px rgba(129, 140, 248, 0.5)",
            }}
          />
        )}
      </AnimatePresence>
    </header>
  );
}
