"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Newspaper, LayoutGrid, Heart, Globe, Hash, Rss,
  TrendingUp, TrendingDown, Minus,
} from "lucide-react";
import type { KPIStat } from "@/types";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Newspaper, LayoutGrid, Heart, Globe, Hash, Rss,
};

function AnimatedNumber({ value, suffix }: { value: number; suffix?: string }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    let frame: number;
    const duration = 800;
    const start = performance.now();
    const animate = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(eased * value));
      if (progress < 1) frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [value]);
  return <>{display}{suffix || ""}</>;
}

export function KPICards({ kpis }: { kpis: KPIStat[] }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
      {kpis.map((kpi, i) => {
        const Icon = iconMap[kpi.icon] || Hash;
        const TrendIcon = kpi.trend === "up" ? TrendingUp : kpi.trend === "down" ? TrendingDown : Minus;
        const trendColor = kpi.trend === "up" ? "text-emerald-400" : kpi.trend === "down" ? "text-red-400" : "text-muted-foreground";

        return (
          <motion.div
            key={kpi.label}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: i * 0.06, type: "spring", damping: 20 }}
            className="glass-card rounded-xl p-4 card-interactive group"
          >
            <div className="flex items-center justify-between mb-3">
              <div
                className="h-8 w-8 rounded-lg flex items-center justify-center"
                style={{ background: `${kpi.color}15` }}
              >
                <div style={{ color: kpi.color }}><Icon className="h-4 w-4" /></div>
              </div>
              <div className={`flex items-center gap-0.5 text-[10px] ${trendColor}`}>
                <TrendIcon className="h-3 w-3" />
                {kpi.change !== 0 && (
                  <span>{kpi.change > 0 ? "+" : ""}{kpi.change}%</span>
                )}
              </div>
            </div>
            <div className="text-2xl font-bold tabular-nums" style={{ color: kpi.color }}>
              <AnimatedNumber value={kpi.value} suffix={kpi.label === "Sentiment" ? "%" : ""} />
            </div>
            <div className="text-[11px] text-muted-foreground mt-0.5">{kpi.label}</div>
          </motion.div>
        );
      })}
    </div>
  );
}
