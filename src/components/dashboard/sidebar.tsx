"use client";

import { motion } from "framer-motion";
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
import { useState } from "react";
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
  const { selectedCategory, setSelectedCategory } = useDashboardStore();

  const navItems: { key: Category | "all"; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { key: "all", label: "All News", icon: LayoutDashboard },
    ...Object.entries(CATEGORY_CONFIG).map(([key, config]) => ({
      key: key as Category,
      label: config.label,
      icon: categoryIcons[key as Category],
    })),
  ];

  return (
    <motion.aside
      className={cn(
        "flex flex-col h-full glass border-r border-border/50 transition-all duration-300",
        collapsed ? "w-16" : "w-60"
      )}
      layout
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 h-16 border-b border-border/50">
        <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-indigo-600 flex items-center justify-center shrink-0">
          <span className="text-white font-bold text-sm">L</span>
        </div>
        {!collapsed && (
          <motion.span
            className="font-semibold text-lg tracking-tight"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            Lumina<span className="text-primary">Board</span>
          </motion.span>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 py-4 space-y-1">
        {navItems.map((item) => {
          const isActive = selectedCategory === item.key;
          const btn = (
            <button
              key={item.key}
              onClick={() => setSelectedCategory(item.key)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer",
                isActive
                  ? "bg-primary/15 text-primary neon-border"
                  : "text-muted-foreground hover:bg-white/[0.04] hover:text-foreground"
              )}
            >
              <item.icon className={cn("h-4.5 w-4.5 shrink-0", isActive && "text-primary")} />
              {!collapsed && <span>{item.label}</span>}
            </button>
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
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="flex items-center justify-center h-10 border-t border-border/50 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
      >
        {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
      </button>
    </motion.aside>
  );
}
