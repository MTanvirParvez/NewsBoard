"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { Sparkles, Clock } from "lucide-react";
import { useDashboardStore } from "@/store/dashboard";
import { generateBriefing } from "@/lib/briefing-engine";
import { KPICards } from "./kpi-cards";
import { GlobalPulse } from "./global-pulse";
import { CategoryDigestCard } from "./category-digest";
import { SubscribeBanner } from "./subscribe-banner";
import { formatDate } from "@/lib/utils";

export function ExecutiveBriefing() {
  const { articles, summaries, selectedCategories, isUpdating, lastUpdated } =
    useDashboardStore();

  const briefing = useMemo(() => {
    if (articles.length === 0) return null;
    return generateBriefing(articles, summaries, selectedCategories);
  }, [articles, summaries, selectedCategories]);

  if (!briefing && isUpdating) {
    return (
      <div className="p-6 space-y-4">
        {/* Skeleton KPIs */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="glass-card rounded-xl p-4 h-24 animate-shimmer" />
          ))}
        </div>
        {/* Skeleton pulse */}
        <div className="glass-card rounded-xl p-5 h-36 animate-shimmer" />
        {/* Skeleton digests */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="glass-card rounded-xl h-64 animate-shimmer" />
          ))}
        </div>
      </div>
    );
  }

  if (!briefing) return null;

  return (
    <div className="p-6 space-y-5">
      {/* Briefing Header */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="h-4 w-4 text-primary" />
            <h2 className="text-lg font-bold">Executive Briefing</h2>
          </div>
          <p className="text-xs text-muted-foreground">{briefing.headline}</p>
        </div>
        {lastUpdated && (
          <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
            <Clock className="h-3 w-3" />
            {formatDate(lastUpdated)}
          </div>
        )}
      </motion.div>

      {/* KPI Cards */}
      <KPICards kpis={briefing.kpis} />

      {/* Global Pulse — Sentiment + Trending */}
      <GlobalPulse briefing={briefing} />

      {/* Newsletter Subscribe */}
      <SubscribeBanner />

      {/* Category Digests */}
      <div>
        <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
          <div className="h-1 w-5 rounded-full bg-primary" />
          Category Briefings
          <span className="text-[10px] text-muted-foreground font-normal">
            ({briefing.digests.length} active)
          </span>
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {briefing.digests.map((digest, i) => (
            <CategoryDigestCard key={digest.category} digest={digest} index={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
