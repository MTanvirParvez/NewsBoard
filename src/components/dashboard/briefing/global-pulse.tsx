"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Activity, Flame } from "lucide-react";
import type { ExecutiveBriefing } from "@/types";

export function GlobalPulse({ briefing }: { briefing: ExecutiveBriefing }) {
  const { globalSentiment, breakingTopics, marketMood } = briefing;
  const total = globalSentiment.positive + globalSentiment.negative + globalSentiment.neutral;
  const positivePct = total > 0 ? Math.round((globalSentiment.positive / total) * 100) : 33;
  const neutralPct = total > 0 ? Math.round((globalSentiment.neutral / total) * 100) : 34;
  const negativePct = 100 - positivePct - neutralPct;

  const isPositive = positivePct > negativePct;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="glass-card rounded-xl p-5"
    >
      <div className="flex flex-col lg:flex-row gap-5">
        {/* Market Mood */}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-3">
            <Activity className="h-4 w-4 text-primary animate-glow-pulse" />
            <span className="text-sm font-semibold">Market Mood</span>
            {isPositive ? (
              <TrendingUp className="h-3.5 w-3.5 text-emerald-400" />
            ) : (
              <TrendingDown className="h-3.5 w-3.5 text-red-400" />
            )}
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed mb-4">{marketMood}</p>

          {/* Sentiment Bar */}
          <div className="space-y-1.5">
            <div className="flex h-3 rounded-full overflow-hidden">
              <motion.div
                className="bg-emerald-500"
                initial={{ width: 0 }}
                animate={{ width: `${positivePct}%` }}
                transition={{ duration: 0.8, delay: 0.2 }}
              />
              <motion.div
                className="bg-yellow-500"
                initial={{ width: 0 }}
                animate={{ width: `${neutralPct}%` }}
                transition={{ duration: 0.8, delay: 0.3 }}
              />
              <motion.div
                className="bg-red-500"
                initial={{ width: 0 }}
                animate={{ width: `${negativePct}%` }}
                transition={{ duration: 0.8, delay: 0.4 }}
              />
            </div>
            <div className="flex justify-between text-[10px]">
              <span className="text-emerald-400">Positive {positivePct}%</span>
              <span className="text-yellow-400">Neutral {neutralPct}%</span>
              <span className="text-red-400">Negative {negativePct}%</span>
            </div>
          </div>
        </div>

        {/* Separator */}
        <div className="hidden lg:block w-px bg-border/50" />

        {/* Trending Topics */}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-3">
            <Flame className="h-4 w-4 text-orange-400" />
            <span className="text-sm font-semibold">Trending Topics</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {breakingTopics.map((topic, i) => (
              <motion.div
                key={topic}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + i * 0.05, type: "spring" }}
              >
                <Badge
                  variant={i < 3 ? "neon" : "secondary"}
                  className="text-[10px] cursor-default"
                >
                  {i < 3 && <Flame className="h-2.5 w-2.5 mr-0.5 text-orange-400" />}
                  {topic}
                </Badge>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
