"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { Newspaper } from "lucide-react";
import { useDashboardStore } from "@/store/dashboard";
import { ArticleCard } from "./article-card";
import { ArticleCardSkeleton } from "./loading-states";
import { CATEGORY_CONFIG, CATEGORIES } from "@/types";
import type { Category } from "@/types";

export function ArticleGrid() {
  const { articles, summaries, selectedCategory, isUpdating } = useDashboardStore();

  const filteredArticles = useMemo(() => {
    if (selectedCategory === "all") return articles;
    return articles.filter((a) => a.category === selectedCategory);
  }, [articles, selectedCategory]);

  const groupedArticles = useMemo(() => {
    if (selectedCategory !== "all") return null;
    const groups: Partial<Record<Category, typeof articles>> = {};
    for (const cat of CATEGORIES) {
      const catArticles = articles.filter((a) => a.category === cat);
      if (catArticles.length > 0) groups[cat] = catArticles;
    }
    return groups;
  }, [articles, selectedCategory]);

  if (isUpdating && articles.length === 0) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 p-6">
        {Array.from({ length: 9 }).map((_, i) => (
          <ArticleCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (articles.length === 0) {
    return (
      <motion.div
        className="flex flex-col items-center justify-center py-20 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
          <Newspaper className="h-8 w-8 text-primary" />
        </div>
        <h3 className="text-lg font-semibold mb-2">No articles yet</h3>
        <p className="text-sm text-muted-foreground max-w-sm mb-1">
          Hit the <strong className="text-primary">Update Now</strong> button above to fetch the latest global news from 20+ RSS feeds (BBC, Reuters, NYT, TechCrunch…)
        </p>
        <p className="text-xs text-muted-foreground max-w-sm">
          No API keys required — everything works out of the box.
        </p>
      </motion.div>
    );
  }

  // Grouped view for "all"
  if (groupedArticles) {
    return (
      <div className="p-6 space-y-8">
        {Object.entries(groupedArticles).map(([cat, catArticles]) => {
          const config = CATEGORY_CONFIG[cat as Category];
          return (
            <section key={cat}>
              <div className="flex items-center gap-2 mb-4">
                <div
                  className="h-1 w-6 rounded-full"
                  style={{ background: config.color }}
                />
                <h2 className="text-base font-semibold" style={{ color: config.color }}>
                  {config.label}
                </h2>
                <span className="text-xs text-muted-foreground">
                  {catArticles!.length} articles
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {catArticles!.slice(0, 6).map((article, i) => (
                  <ArticleCard
                    key={article.id}
                    article={article}
                    summary={summaries[article.id]}
                    index={i}
                  />
                ))}
              </div>
            </section>
          );
        })}
      </div>
    );
  }

  // Single category view
  return (
    <div className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredArticles.map((article, i) => (
          <ArticleCard
            key={article.id}
            article={article}
            summary={summaries[article.id]}
            index={i}
          />
        ))}
      </div>
    </div>
  );
}
