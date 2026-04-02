"use client";

import { motion } from "framer-motion";
import {
  Landmark, TrendingUp, Cpu, Factory, Leaf, Globe,
  FlaskConical, HeartPulse, Trophy, Film, Zap, Shield,
  GraduationCap, Rocket, ExternalLink, ChevronRight, Bitcoin,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useDashboardStore } from "@/store/dashboard";
import { formatDate, sentimentColor } from "@/lib/utils";
import { CATEGORY_CONFIG } from "@/types";
import type { CategoryDigest as DigestType, Category } from "@/types";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Landmark, TrendingUp, Cpu, Factory, Leaf, Globe,
  FlaskConical, HeartPulse, Trophy, Film, Zap, Shield,
  GraduationCap, Rocket, Bitcoin,
};

function SentimentBar({ value }: { value: number }) {
  const pct = Math.round((value + 1) * 50); // -1..1 → 0..100
  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 flex-1 rounded-full bg-white/[0.06] overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ background: sentimentColor(value) }}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </div>
      <span className="text-[9px] tabular-nums" style={{ color: sentimentColor(value) }}>
        {value > 0 ? "+" : ""}{value.toFixed(2)}
      </span>
    </div>
  );
}

export function CategoryDigestCard({ digest, index }: { digest: DigestType; index: number }) {
  const config = CATEGORY_CONFIG[digest.category];
  const Icon = iconMap[config.icon] || Globe;
  const setSelectedArticle = useDashboardStore((s) => s.setSelectedArticle);
  const setActiveView = useDashboardStore((s) => s.setActiveView);
  const setSelectedCategory = useDashboardStore((s) => s.setSelectedCategory);

  function handleExplore() {
    setSelectedCategory(digest.category);
    setActiveView("explore");
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, type: "spring", damping: 20 }}
      className="glass-card rounded-xl overflow-hidden card-interactive group"
    >
      {/* Header */}
      <div
        className="px-4 py-3 flex items-center justify-between border-b border-border/30"
        style={{ background: `linear-gradient(135deg, ${config.color}08, transparent)` }}
      >
        <div className="flex items-center gap-2.5">
          <div
            className="h-8 w-8 rounded-lg flex items-center justify-center"
            style={{ background: `${config.color}18` }}
          >
            <div style={{ color: config.color }}><Icon className="h-4 w-4" /></div>
          </div>
          <div>
            <h3 className="text-sm font-semibold" style={{ color: config.color }}>
              {config.label}
            </h3>
            <span className="text-[10px] text-muted-foreground">
              {digest.articleCount} stories
            </span>
          </div>
        </div>
        <SentimentBar value={digest.sentimentAvg} />
      </div>

      {/* Key Insight */}
      <div className="px-4 py-3 border-b border-border/20">
        <p className="text-xs text-muted-foreground leading-relaxed">
          <span className="text-foreground font-medium">Key Insight:</span>{" "}
          {digest.keyInsight}
        </p>
      </div>

      {/* Story List */}
      <div className="divide-y divide-border/20">
        {digest.stories.slice(0, 3).map((story, i) => (
          <motion.button
            key={story.id}
            onClick={() => setSelectedArticle(story)}
            className="w-full px-4 py-2.5 flex items-start gap-2.5 hover:bg-white/[0.02] transition-colors text-left cursor-pointer"
            whileTap={{ scale: 0.99 }}
          >
            <span
              className="text-[10px] font-bold tabular-nums mt-0.5 shrink-0"
              style={{ color: config.color }}
            >
              {String(i + 1).padStart(2, "0")}
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium leading-snug line-clamp-2 group-hover:text-foreground">
                {story.title}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[9px] text-muted-foreground">{story.source_name}</span>
                <span className="text-[9px] text-muted-foreground">{formatDate(story.published_at)}</span>
              </div>
            </div>
            {story.source_url && (
              <a
                href={story.source_url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="text-muted-foreground hover:text-primary mt-0.5 shrink-0"
              >
                <ExternalLink className="h-3 w-3" />
              </a>
            )}
          </motion.button>
        ))}
      </div>

      {/* Topic Tags + Explore */}
      <div className="px-4 py-3 flex items-center justify-between border-t border-border/20">
        <div className="flex flex-wrap gap-1">
          {digest.topTopics.slice(0, 3).map((topic) => (
            <Badge key={topic} variant="secondary" className="text-[9px]">
              {topic}
            </Badge>
          ))}
        </div>
        <motion.button
          onClick={handleExplore}
          whileHover={{ x: 3 }}
          className="flex items-center gap-1 text-[10px] font-medium cursor-pointer"
          style={{ color: config.color }}
        >
          Explore
          <ChevronRight className="h-3 w-3" />
        </motion.button>
      </div>
    </motion.div>
  );
}
