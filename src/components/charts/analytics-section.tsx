"use client";

import { useDashboardStore } from "@/store/dashboard";
import { SentimentDonut } from "./sentiment-donut";
import { TrendLines } from "./trend-lines";
import { TopicRadar } from "./topic-radar";
import { CategoryBars } from "./category-bars";
import { ChartSkeleton } from "@/components/dashboard/loading-states";

export function AnalyticsSection() {
  const analytics = useDashboardStore((s) => s.analytics);
  const isUpdating = useDashboardStore((s) => s.isUpdating);

  if (!analytics && isUpdating) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <ChartSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (!analytics) return null;

  return (
    <div className="p-6 pt-0">
      <h2 className="text-base font-semibold mb-4 flex items-center gap-2">
        <div className="h-1 w-6 rounded-full bg-primary" />
        Analytics
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <SentimentDonut data={analytics.sentiment} />
        <TrendLines data={analytics.trends} />
        <TopicRadar data={analytics.topicHeat} />
        <CategoryBars data={analytics.sentiment} />
      </div>
    </div>
  );
}
