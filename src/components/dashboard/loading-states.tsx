"use client";

import { Skeleton } from "@/components/ui/skeleton";

export function ArticleCardSkeleton() {
  return (
    <div className="glass-card rounded-xl overflow-hidden">
      <Skeleton className="h-36 w-full rounded-none" />
      <div className="p-5 space-y-3">
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-12 ml-auto" />
        </div>
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <div className="space-y-2">
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-5/6" />
          <Skeleton className="h-3 w-4/6" />
        </div>
        <div className="flex justify-between">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-3 w-3" />
        </div>
      </div>
    </div>
  );
}

export function ChartSkeleton() {
  return (
    <div className="glass-card rounded-xl p-5">
      <Skeleton className="h-4 w-32 mb-4" />
      <Skeleton className="h-48 w-full rounded-lg" />
    </div>
  );
}

export function MapSkeleton() {
  return (
    <div className="glass-card rounded-xl p-5">
      <Skeleton className="h-4 w-40 mb-4" />
      <Skeleton className="h-64 w-full rounded-lg" />
    </div>
  );
}
