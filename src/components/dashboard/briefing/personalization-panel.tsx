"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  X, Landmark, TrendingUp, Cpu, Factory, Leaf, Globe,
  FlaskConical, HeartPulse, Trophy, Film, Zap, Shield,
  GraduationCap, Rocket, Bitcoin, Settings2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDashboardStore } from "@/store/dashboard";
import { CATEGORY_CONFIG, CATEGORIES } from "@/types";
import type { Category } from "@/types";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Landmark, TrendingUp, Cpu, Factory, Leaf, Globe,
  FlaskConical, HeartPulse, Trophy, Film, Zap, Shield,
  GraduationCap, Rocket, Bitcoin,
};

export function PersonalizationPanel() {
  const { showPersonalization, setShowPersonalization, selectedCategories, toggleCategory } =
    useDashboardStore();

  return (
    <AnimatePresence>
      {showPersonalization && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowPersonalization(false)}
          />

          {/* Panel */}
          <motion.div
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            transition={{ type: "spring", damping: 25 }}
            className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md glass-strong border-l border-border/50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 h-14 border-b border-border/50">
              <div className="flex items-center gap-2">
                <Settings2 className="h-4 w-4 text-primary" />
                <h2 className="font-semibold">Personalize Your Feed</h2>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowPersonalization(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Categories */}
            <div className="flex-1 overflow-y-auto px-5 py-4">
              <p className="text-xs text-muted-foreground mb-4">
                Select the categories you want in your executive briefing.
                Your choices also customize the newsletter.
              </p>

              <div className="space-y-2">
                {CATEGORIES.map((cat) => {
                  const config = CATEGORY_CONFIG[cat];
                  const Icon = iconMap[config.icon] || Globe;
                  const isSelected = selectedCategories.includes(cat);

                  return (
                    <motion.button
                      key={cat}
                      onClick={() => toggleCategory(cat)}
                      whileTap={{ scale: 0.98 }}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border transition-all cursor-pointer ${
                        isSelected
                          ? "border-primary/30 bg-primary/5"
                          : "border-border/50 bg-white/[0.01] hover:bg-white/[0.03]"
                      }`}
                    >
                      <div
                        className="h-9 w-9 rounded-lg flex items-center justify-center shrink-0"
                        style={{ background: `${config.color}${isSelected ? "20" : "08"}` }}
                      >
                        <div style={{ color: isSelected ? config.color : "#8b92a5" }}>
                          <Icon className="h-4.5 w-4.5" />
                        </div>
                      </div>
                      <div className="flex-1 text-left">
                        <p
                          className="text-sm font-medium"
                          style={{ color: isSelected ? config.color : "#e8eaed" }}
                        >
                          {config.label}
                        </p>
                      </div>
                      <div
                        className={`h-5 w-5 rounded-full border-2 flex items-center justify-center transition-all ${
                          isSelected ? "border-primary bg-primary" : "border-border"
                        }`}
                      >
                        {isSelected && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="h-2 w-2 rounded-full bg-white"
                          />
                        )}
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Footer */}
            <div className="px-5 py-4 border-t border-border/50">
              <p className="text-[10px] text-muted-foreground mb-3">
                {selectedCategories.length} of {CATEGORIES.length} categories selected
              </p>
              <Button
                onClick={() => setShowPersonalization(false)}
                className="w-full"
              >
                Save Preferences
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
