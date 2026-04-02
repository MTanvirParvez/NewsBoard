"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Landmark, TrendingUp, Cpu, Factory, Leaf, Globe,
  FlaskConical, HeartPulse, Trophy, Film, Zap, Shield,
  GraduationCap, Rocket, Bitcoin,
  LayoutDashboard, Compass, BarChart3, Settings2, LogOut,
  ChevronLeft, Newspaper,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useDashboardStore } from "@/store/dashboard";
import type { Category } from "@/types";
import { CATEGORY_CONFIG } from "@/types";

const categoryIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  Landmark, TrendingUp, Cpu, Factory, Leaf, Globe,
  FlaskConical, HeartPulse, Trophy, Film, Zap, Shield,
  GraduationCap, Rocket, Bitcoin,
};

const viewItems = [
  { key: "briefing" as const, label: "Briefing", icon: Newspaper, desc: "Executive summary" },
  { key: "explore" as const, label: "Explore", icon: Compass, desc: "Browse all articles" },
  { key: "analytics" as const, label: "Analytics", icon: BarChart3, desc: "Charts & data" },
];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const {
    activeView, setActiveView,
    selectedCategory, setSelectedCategory,
    selectedCategories, articles,
    setShowPersonalization,
  } = useDashboardStore();

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: articles.length };
    for (const a of articles) {
      counts[a.category] = (counts[a.category] || 0) + 1;
    }
    return counts;
  }, [articles]);

  return (
    <motion.aside
      className={cn(
        "flex flex-col h-full glass border-r border-border/50 transition-all duration-300",
        collapsed ? "w-14" : "w-56"
      )}
      layout
    >
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-3 h-14 border-b border-border/50">
        <motion.div
          className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-indigo-600 flex items-center justify-center shrink-0"
          whileHover={{ rotate: [0, -5, 5, 0] }}
        >
          <span className="text-white font-bold text-sm">N</span>
        </motion.div>
        <AnimatePresence>
          {!collapsed && (
            <motion.span
              className="font-semibold text-base tracking-tight"
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
            >
              News<span className="text-primary">Board</span>
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* View Switcher */}
      <div className="px-2 pt-3 pb-1">
        {!collapsed && (
          <span className="text-[9px] text-muted-foreground uppercase tracking-widest px-2 mb-1 block">
            Views
          </span>
        )}
        {viewItems.map((item) => {
          const isActive = activeView === item.key;
          const btn = (
            <motion.button
              key={item.key}
              onClick={() => setActiveView(item.key)}
              whileTap={{ scale: 0.97 }}
              className={cn(
                "w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer relative",
                isActive ? "text-primary" : "text-muted-foreground hover:bg-white/[0.04] hover:text-foreground"
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="activeView"
                  className="absolute inset-0 rounded-lg bg-primary/10 neon-border"
                  transition={{ type: "spring", damping: 25, stiffness: 300 }}
                />
              )}
              <item.icon className="h-4 w-4 shrink-0 relative z-10" />
              <AnimatePresence>
                {!collapsed && (
                  <motion.span
                    className="relative z-10 text-xs"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          );
          if (collapsed) {
            return (
              <Tooltip key={item.key}>
                <TooltipTrigger asChild>{btn}</TooltipTrigger>
                <TooltipContent side="right">{item.label}</TooltipContent>
              </Tooltip>
            );
          }
          return btn;
        })}
      </div>

      <Separator className="mx-3" />

      {/* Category Filter (shown in Explore view) */}
      <nav className="flex-1 overflow-y-auto px-2 py-2 space-y-0.5">
        {!collapsed && (
          <span className="text-[9px] text-muted-foreground uppercase tracking-widest px-2 mb-1 block">
            Categories
          </span>
        )}

        {/* All */}
        {(() => {
          const isActive = activeView === "explore" && selectedCategory === "all";
          const btn = (
            <button
              onClick={() => { setSelectedCategory("all"); setActiveView("explore"); }}
              className={cn(
                "w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-md text-xs transition-all cursor-pointer",
                isActive ? "text-primary bg-primary/10" : "text-muted-foreground hover:bg-white/[0.03]"
              )}
            >
              <LayoutDashboard className="h-3.5 w-3.5 shrink-0" />
              {!collapsed && <span className="flex-1 text-left">All</span>}
              {!collapsed && categoryCounts.all > 0 && (
                <span className="text-[9px] tabular-nums opacity-60">{categoryCounts.all}</span>
              )}
            </button>
          );
          if (collapsed) return <Tooltip key="all"><TooltipTrigger asChild>{btn}</TooltipTrigger><TooltipContent side="right">All ({categoryCounts.all})</TooltipContent></Tooltip>;
          return btn;
        })()}

        {selectedCategories.map((cat) => {
          const config = CATEGORY_CONFIG[cat];
          const Icon = categoryIcons[config.icon] || Globe;
          const isActive = activeView === "explore" && selectedCategory === cat;
          const count = categoryCounts[cat] || 0;

          const btn = (
            <button
              key={cat}
              onClick={() => { setSelectedCategory(cat); setActiveView("explore"); }}
              className={cn(
                "w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-md text-xs transition-all cursor-pointer",
                isActive ? "bg-white/[0.04]" : "text-muted-foreground hover:bg-white/[0.03]"
              )}
              style={isActive ? { color: config.color } : undefined}
            >
              <div style={isActive ? { color: config.color } : undefined}><Icon className="h-3.5 w-3.5 shrink-0" /></div>
              {!collapsed && <span className="flex-1 text-left">{config.label}</span>}
              {!collapsed && count > 0 && (
                <span className="text-[9px] tabular-nums opacity-50">{count}</span>
              )}
              {collapsed && count > 0 && (
                <div className="absolute top-0.5 right-0.5 h-1.5 w-1.5 rounded-full" style={{ background: config.color }} />
              )}
            </button>
          );

          if (collapsed) return <Tooltip key={cat}><TooltipTrigger asChild>{btn}</TooltipTrigger><TooltipContent side="right">{config.label} ({count})</TooltipContent></Tooltip>;
          return <div key={cat}>{btn}</div>;
        })}
      </nav>

      <Separator className="mx-3" />

      {/* Bottom */}
      <div className="px-2 py-2 space-y-0.5">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowPersonalization(true)}
              className={cn("w-full justify-start text-xs", collapsed && "justify-center px-0")}
            >
              <Settings2 className="h-3.5 w-3.5" />
              {!collapsed && <span className="ml-2">Personalize</span>}
            </Button>
          </TooltipTrigger>
          {collapsed && <TooltipContent side="right">Personalize</TooltipContent>}
        </Tooltip>
      </div>

      <button
        onClick={() => setCollapsed(!collapsed)}
        className="flex items-center justify-center h-9 border-t border-border/50 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
      >
        <motion.div animate={{ rotate: collapsed ? 180 : 0 }}>
          <ChevronLeft className="h-3.5 w-3.5" />
        </motion.div>
      </button>
    </motion.aside>
  );
}
