"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  ExternalLink,
  Clock,
  Bookmark,
  BookmarkCheck,
  Share2,
  Sparkles,
  TrendingUp,
  TrendingDown,
  Minus,
} from "lucide-react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useDashboardStore } from "@/store/dashboard";
import { formatDate, truncate, sentimentColor } from "@/lib/utils";
import { CATEGORY_CONFIG } from "@/types";
import type { Article, AISummary } from "@/types";
import { showToast } from "@/components/ui/toast";

interface ArticleCardProps {
  article: Article;
  summary?: AISummary;
  index: number;
}

const SentimentIcon = ({ sentiment }: { sentiment?: string }) => {
  if (sentiment === "positive") return <TrendingUp className="h-3 w-3 text-emerald-400" />;
  if (sentiment === "negative") return <TrendingDown className="h-3 w-3 text-red-400" />;
  return <Minus className="h-3 w-3 text-yellow-400" />;
};

export function ArticleCard({ article, summary, index }: ArticleCardProps) {
  const setSelectedArticle = useDashboardStore((s) => s.setSelectedArticle);
  const config = CATEGORY_CONFIG[article.category];
  const [bookmarked, setBookmarked] = useState(false);
  const [imageError, setImageError] = useState(false);

  function handleBookmark(e: React.MouseEvent) {
    e.stopPropagation();
    setBookmarked(!bookmarked);
    showToast({
      type: bookmarked ? "info" : "success",
      title: bookmarked ? "Bookmark removed" : "Article bookmarked",
      message: truncate(article.title, 60),
      duration: 2500,
    });
  }

  function handleShare(e: React.MouseEvent) {
    e.stopPropagation();
    if (article.source_url && navigator.clipboard) {
      navigator.clipboard.writeText(article.source_url);
      showToast({
        type: "success",
        title: "Link copied!",
        message: "Article link copied to clipboard",
        duration: 2000,
      });
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        delay: index * 0.06,
        ease: [0.16, 1, 0.3, 1],
      }}
      className="cursor-pointer"
      onClick={() => setSelectedArticle(article)}
    >
      <Card className="group relative overflow-hidden card-interactive gradient-border h-full">
        {/* Category accent line — animated width on hover */}
        <motion.div
          className="absolute top-0 left-0 h-[2px] z-10"
          style={{ background: config.color }}
          initial={{ width: "30%" }}
          whileHover={{ width: "100%" }}
          transition={{ duration: 0.3 }}
        />

        {/* Action buttons — slide in on hover */}
        <div className="absolute top-2 right-2 z-20 flex gap-1 opacity-0 translate-y-[-8px] group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
          <motion.button
            whileTap={{ scale: 0.85 }}
            onClick={handleBookmark}
            className="h-7 w-7 rounded-md glass-strong flex items-center justify-center text-muted-foreground hover:text-primary transition-colors"
          >
            {bookmarked ? (
              <BookmarkCheck className="h-3.5 w-3.5 text-primary" />
            ) : (
              <Bookmark className="h-3.5 w-3.5" />
            )}
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.85 }}
            onClick={handleShare}
            className="h-7 w-7 rounded-md glass-strong flex items-center justify-center text-muted-foreground hover:text-primary transition-colors"
          >
            <Share2 className="h-3.5 w-3.5" />
          </motion.button>
        </div>

        {article.image_url && !imageError && (
          <div className="relative h-36 overflow-hidden">
            <Image
              src={article.image_url}
              alt={article.title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
              sizes="(max-width: 768px) 100vw, 33vw"
              onError={() => setImageError(true)}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
            {/* Sentiment badge overlaid on image */}
            {summary && (
              <div className="absolute bottom-2 right-2 flex items-center gap-1 glass-strong rounded-md px-2 py-0.5">
                <SentimentIcon sentiment={summary.sentiment} />
                <span className="text-[9px] capitalize text-muted-foreground">
                  {summary.sentiment}
                </span>
              </div>
            )}
          </div>
        )}

        <CardContent className={article.image_url && !imageError ? "pt-3" : "pt-5"}>
          <div className="flex items-center gap-2 mb-2">
            <Badge
              variant="outline"
              className="text-[10px] px-1.5 transition-colors duration-300 group-hover:bg-[var(--cat-color)]/10"
              style={{
                borderColor: config.color,
                color: config.color,
                "--cat-color": config.color,
              } as React.CSSProperties}
            >
              {config.label}
            </Badge>
            {summary && !article.image_url && (
              <div className="flex items-center gap-1">
                <div
                  className="h-2 w-2 rounded-full animate-glow-pulse"
                  style={{ background: sentimentColor(summary.sentiment_score), color: sentimentColor(summary.sentiment_score) }}
                />
              </div>
            )}
            <span className="flex items-center gap-1 text-[10px] text-muted-foreground ml-auto">
              <Clock className="h-2.5 w-2.5" />
              {formatDate(article.published_at)}
            </span>
          </div>

          <h3 className="font-semibold text-sm leading-snug mb-2 line-clamp-2 group-hover:text-primary transition-colors duration-300">
            {article.title}
          </h3>

          {summary ? (
            <ul className="space-y-1.5 mb-3">
              {summary.bullets.slice(0, 3).map((bullet, i) => (
                <motion.li
                  key={i}
                  className="text-xs text-muted-foreground flex gap-1.5"
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.06 + i * 0.1 + 0.3 }}
                >
                  <Sparkles className="h-3 w-3 text-primary/50 shrink-0 mt-0.5" />
                  <span className="line-clamp-2">{bullet}</span>
                </motion.li>
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
            <span className="text-[10px] text-muted-foreground font-medium">
              {article.source_name}
            </span>
            {article.source_url && (
              <a
                href={article.source_url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="text-muted-foreground hover:text-primary transition-colors p-1 -m-1 rounded-md hover:bg-primary/5"
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
