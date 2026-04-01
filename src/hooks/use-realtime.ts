"use client";

import { useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useDashboardStore } from "@/store/dashboard";

export function useRealtime() {
  useEffect(() => {
    const supabase = createClient();

    // Subscribe to articles table changes
    const articlesChannel = supabase
      .channel("articles-changes")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "articles" },
        (payload) => {
          const store = useDashboardStore.getState();
          const existing = store.articles.find((a) => a.id === payload.new.id);
          if (!existing) {
            store.setArticles([payload.new as never, ...store.articles]);
          }
        }
      )
      .subscribe();

    // Subscribe to analytics cache changes
    const analyticsChannel = supabase
      .channel("analytics-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "analytics_cache" },
        (payload) => {
          if (payload.new && "data" in payload.new) {
            useDashboardStore.getState().setAnalytics(payload.new.data as never);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(articlesChannel);
      supabase.removeChannel(analyticsChannel);
    };
  }, []);
}
