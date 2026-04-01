"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { useDashboardStore } from "@/store/dashboard";
import { CATEGORY_CONFIG, CATEGORIES } from "@/types";

export function NewsTicker() {
  const articles = useDashboardStore((s) => s.articles);
  const summaries = useDashboardStore((s) => s.summaries);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Cycle through headlines
  useEffect(() => {
    if (articles.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % Math.min(articles.length, 20));
    }, 4000);
    return () => clearInterval(interval);
  }, [articles.length]);

  if (articles.length === 0) return null;

  const article = articles[currentIndex];
  const summary = summaries[article?.id];
  const config = article ? CATEGORY_CONFIG[article.category] : null;

  // Calculate category stats
  const stats = CATEGORIES.map((cat) => {
    const count = articles.filter((a) => a.category === cat).length;
    return { cat, count, config: CATEGORY_CONFIG[cat] };
  });

  return (
    <div className="flex items-center gap-3 px-4 h-8 border-b border-border/30 bg-white/[0.01] overflow-hidden text-xs">
      {/* Live indicator */}
      <div className="flex items-center gap-1.5 shrink-0">
        <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 live-dot" />
        <span className="text-emerald-400 font-medium text-[10px] uppercase tracking-wider">
          Live
        </span>
      </div>

      <div className="h-3 w-px bg-border/50" />

      {/* Scrolling headline */}
      <div className="flex-1 overflow-hidden relative">
        <AnimatePresence mode="wait">
          {article && config && (
            <motion.div
              key={currentIndex}
              initial={{ y: 14, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -14, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="flex items-center gap-2 whitespace-nowrap"
            >
              <span
                className="font-medium px-1.5 py-0.5 rounded text-[9px] uppercase"
                style={{
                  color: config.color,
                  background: `${config.color}15`,
                }}
              >
                {config.label}
              </span>
              <span className="text-muted-foreground truncate max-w-md">
                {article.title}
              </span>
              {summary && (
                <span className="shrink-0">
                  {summary.sentiment === "positive" ? (
                    <TrendingUp className="h-3 w-3 text-emerald-400" />
                  ) : summary.sentiment === "negative" ? (
                    <TrendingDown className="h-3 w-3 text-red-400" />
                  ) : (
                    <Minus className="h-3 w-3 text-yellow-400" />
                  )}
                </span>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="h-3 w-px bg-border/50" />

      {/* Category mini-stats */}
      <div className="flex items-center gap-2 shrink-0">
        {stats.map(({ cat, count, config: c }) => (
          <div key={cat} className="flex items-center gap-1">
            <div
              className="h-1.5 w-1.5 rounded-full"
              style={{ background: c.color }}
            />
            <span className="text-muted-foreground text-[10px] tabular-nums">
              {count}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
