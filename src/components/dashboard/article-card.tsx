"use client";

import { motion } from "framer-motion";
import { ExternalLink, Clock } from "lucide-react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useDashboardStore } from "@/store/dashboard";
import { formatDate, truncate, sentimentColor } from "@/lib/utils";
import { CATEGORY_CONFIG } from "@/types";
import type { Article, AISummary } from "@/types";

interface ArticleCardProps {
  article: Article;
  summary?: AISummary;
  index: number;
}

export function ArticleCard({ article, summary, index }: ArticleCardProps) {
  const setSelectedArticle = useDashboardStore((s) => s.setSelectedArticle);
  const config = CATEGORY_CONFIG[article.category];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      whileHover={{ y: -2 }}
      className="cursor-pointer"
      onClick={() => setSelectedArticle(article)}
    >
      <Card className="group relative overflow-hidden hover:neon-border transition-all duration-300 h-full">
        {/* Category accent line */}
        <div
          className="absolute top-0 left-0 right-0 h-[2px]"
          style={{ background: config.color }}
        />

        {article.image_url && (
          <div className="relative h-36 overflow-hidden">
            <Image
              src={article.image_url}
              alt={article.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
          </div>
        )}

        <CardContent className={article.image_url ? "pt-3" : "pt-5"}>
          <div className="flex items-center gap-2 mb-2">
            <Badge
              variant="outline"
              className="text-[10px] px-1.5"
              style={{ borderColor: config.color, color: config.color }}
            >
              {config.label}
            </Badge>
            {summary && (
              <div
                className="h-2 w-2 rounded-full"
                style={{ background: sentimentColor(summary.sentiment_score) }}
                title={`Sentiment: ${summary.sentiment}`}
              />
            )}
            <span className="flex items-center gap-1 text-[10px] text-muted-foreground ml-auto">
              <Clock className="h-2.5 w-2.5" />
              {formatDate(article.published_at)}
            </span>
          </div>

          <h3 className="font-semibold text-sm leading-snug mb-2 line-clamp-2 group-hover:text-primary transition-colors">
            {article.title}
          </h3>

          {summary ? (
            <ul className="space-y-1 mb-3">
              {summary.bullets.slice(0, 3).map((bullet, i) => (
                <li key={i} className="text-xs text-muted-foreground flex gap-1.5">
                  <span className="text-primary mt-0.5 shrink-0">•</span>
                  <span className="line-clamp-2">{bullet}</span>
                </li>
              ))}
            </ul>
          ) : (
            article.description && (
              <p className="text-xs text-muted-foreground line-clamp-3 mb-3">
                {truncate(article.description, 150)}
              </p>
            )
          )}

          <div className="flex items-center justify-between">
            <span className="text-[10px] text-muted-foreground">
              {article.source_name}
            </span>
            {article.source_url && (
              <a
                href={article.source_url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <ExternalLink className="h-3 w-3" />
              </a>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
