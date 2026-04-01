"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Landmark,
  TrendingUp,
  Cpu,
  Factory,
  Leaf,
  LayoutDashboard,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useDashboardStore } from "@/store/dashboard";
import type { Category } from "@/types";
import { CATEGORY_CONFIG } from "@/types";

const categoryIcons: Record<Category, React.ComponentType<{ className?: string }>> = {
  politics: Landmark,
  economy: TrendingUp,
  tech_ai: Cpu,
  industry: Factory,
  environment: Leaf,
};

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const { selectedCategory, setSelectedCategory, articles } = useDashboardStore();

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: articles.length };
    for (const a of articles) {
      counts[a.category] = (counts[a.category] || 0) + 1;
    }
    return counts;
  }, [articles]);

  const navItems: { key: Category | "all"; label: string; icon: React.ComponentType<{ className?: string }>; color?: string }[] = [
    { key: "all", label: "All News", icon: LayoutDashboard },
    ...Object.entries(CATEGORY_CONFIG).map(([key, config]) => ({
      key: key as Category,
      label: config.label,
      icon: categoryIcons[key as Category],
      color: config.color,
    })),
  ];

  return (
    <motion.aside
      className={cn(
        "flex flex-col h-full glass border-r border-border/50 transition-all duration-300 relative",
        collapsed ? "w-16" : "w-60"
      )}
      layout
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 h-14 border-b border-border/50">
        <motion.div
          className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-indigo-600 flex items-center justify-center shrink-0 animate-gradient-shift"
          style={{
            background: "linear-gradient(135deg, #818cf8, #6366f1, #4f46e5, #818cf8)",
            backgroundSize: "200% 200%",
          }}
          whileHover={{ rotate: [0, -5, 5, 0], scale: 1.1 }}
          transition={{ duration: 0.4 }}
        >
          <span className="text-white font-bold text-sm">N</span>
        </motion.div>
        <AnimatePresence>
          {!collapsed && (
            <motion.span
              className="font-semibold text-lg tracking-tight"
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.2 }}
            >
              News<span className="text-primary">Board</span>
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 py-4 space-y-1">
        {navItems.map((item) => {
          const isActive = selectedCategory === item.key;
          const count = categoryCounts[item.key] || 0;

          const btn = (
            <motion.button
              key={item.key}
              onClick={() => setSelectedCategory(item.key)}
              whileTap={{ scale: 0.97 }}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer relative overflow-hidden",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:bg-white/[0.04] hover:text-foreground"
              )}
            >
              {/* Active background glow */}
              {isActive && (
                <motion.div
                  layoutId="activeNav"
                  className="absolute inset-0 rounded-lg bg-primary/10 neon-border"
                  transition={{ type: "spring", damping: 25, stiffness: 300 }}
                />
              )}

              <motion.div
                className="relative z-10"
                animate={isActive ? { scale: [1, 1.2, 1] } : {}}
                transition={{ duration: 0.3 }}
              >
                <item.icon
                  className={cn(
                    "h-4.5 w-4.5 shrink-0 transition-colors",
                    isActive && "text-primary"
                  )}
                />
              </motion.div>

              <AnimatePresence>
                {!collapsed && (
                  <motion.span
                    className="relative z-10 flex-1 text-left"
                    initial={{ opacity: 0, x: -4 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -4 }}
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>

              {/* Article count badge */}
              {!collapsed && count > 0 && (
                <motion.span
                  className={cn(
                    "relative z-10 text-[10px] tabular-nums px-1.5 py-0.5 rounded-md",
                    isActive
                      ? "bg-primary/20 text-primary"
                      : "bg-white/[0.04] text-muted-foreground"
                  )}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", damping: 15 }}
                  key={count}
                >
                  {count}
                </motion.span>
              )}

              {/* Collapsed count dot */}
              {collapsed && count > 0 && (
                <motion.div
                  className="absolute top-1 right-1 h-1.5 w-1.5 rounded-full z-10"
                  style={{ background: item.color || "#818cf8" }}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  layoutId={`dot-${item.key}`}
                />
              )}
            </motion.button>
          );

          if (collapsed) {
            return (
              <Tooltip key={item.key}>
                <TooltipTrigger asChild>{btn}</TooltipTrigger>
                <TooltipContent side="right" className="flex items-center gap-2">
                  {item.label}
                  {count > 0 && (
                    <span className="text-[10px] text-muted-foreground">({count})</span>
                  )}
                </TooltipContent>
              </Tooltip>
            );
          }
          return btn;
        })}
      </nav>

      <Separator />

      {/* Bottom actions */}
      <div className="px-2 py-3 space-y-1">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              className={cn("w-full justify-start", collapsed && "justify-center px-0")}
              size="sm"
            >
              <Settings className="h-4 w-4" />
              {!collapsed && <span className="ml-2">Settings</span>}
            </Button>
          </TooltipTrigger>
          {collapsed && <TooltipContent side="right">Settings</TooltipContent>}
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              className={cn("w-full justify-start text-muted-foreground", collapsed && "justify-center px-0")}
              size="sm"
            >
              <LogOut className="h-4 w-4" />
              {!collapsed && <span className="ml-2">Sign Out</span>}
            </Button>
          </TooltipTrigger>
          {collapsed && <TooltipContent side="right">Sign Out</TooltipContent>}
        </Tooltip>
      </div>

      {/* Collapse toggle */}
      <motion.button
        onClick={() => setCollapsed(!collapsed)}
        whileHover={{ backgroundColor: "rgba(255,255,255,0.04)" }}
        whileTap={{ scale: 0.95 }}
        className="flex items-center justify-center h-10 border-t border-border/50 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
      >
        <motion.div animate={{ rotate: collapsed ? 0 : 180 }} transition={{ duration: 0.2 }}>
          <ChevronLeft className="h-4 w-4" />
        </motion.div>
      </motion.button>
    </motion.aside>
  );
}
