"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CATEGORY_CONFIG } from "@/types";
import type { SentimentData } from "@/types";

interface CategoryBarsProps {
  data: SentimentData[];
}

export function CategoryBars({ data }: CategoryBarsProps) {
  const [activeBar, setActiveBar] = useState<number | null>(null);

  const chartData = data.map((d) => ({
    name: CATEGORY_CONFIG[d.category].label,
    total: d.positive + d.negative + d.neutral,
    positive: d.positive,
    negative: d.negative,
    neutral: d.neutral,
    color: CATEGORY_CONFIG[d.category].color,
  }));

  const maxTotal = Math.max(...chartData.map((d) => d.total), 1);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.3, type: "spring" }}
    >
      <Card className="card-interactive">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Articles by Category</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                barCategoryGap="20%"
                onMouseLeave={() => setActiveBar(null)}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 10, fill: "#8b92a5" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 10, fill: "#8b92a5" }}
                  axisLine={false}
                  tickLine={false}
                  width={30}
                />
                <Tooltip
                  contentStyle={{
                    background: "rgba(0,0,0,0.85)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "10px",
                    fontSize: "12px",
                    color: "#e8eaed",
                    boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
                  }}
                  cursor={{ fill: "rgba(129,140,248,0.05)" }}
                  content={({ active, payload }) => {
                    if (!active || !payload?.[0]) return null;
                    const d = payload[0].payload;
                    return (
                      <div className="glass-strong rounded-lg px-3 py-2 text-xs border border-border/50">
                        <p className="font-medium mb-1" style={{ color: d.color }}>{d.name}</p>
                        <p className="text-muted-foreground">Total: {d.total}</p>
                        <div className="flex gap-2 mt-1">
                          <span className="text-emerald-400">+{d.positive}</span>
                          <span className="text-yellow-400">~{d.neutral}</span>
                          <span className="text-red-400">-{d.negative}</span>
                        </div>
                      </div>
                    );
                  }}
                />
                <Bar
                  dataKey="total"
                  radius={[6, 6, 0, 0]}
                  animationDuration={1000}
                  animationEasing="ease-out"
                  onMouseEnter={(_, index) => setActiveBar(index)}
                >
                  {chartData.map((entry, i) => (
                    <Cell
                      key={i}
                      fill={entry.color}
                      opacity={activeBar !== null && activeBar !== i ? 0.3 : 0.8}
                      style={{ transition: "opacity 0.2s", cursor: "pointer" }}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          {/* Mini bar indicators */}
          <div className="flex justify-center gap-4 mt-2">
            {chartData.map((d) => (
              <div key={d.name} className="flex items-center gap-1.5">
                <div className="h-4 w-1 rounded-full" style={{
                  background: d.color,
                  opacity: 0.7,
                  height: `${Math.max(8, (d.total / maxTotal) * 16)}px`,
                }} />
                <span className="text-[10px] text-muted-foreground tabular-nums">{d.total}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
