"use client";

import { motion } from "framer-motion";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { SentimentData } from "@/types";

const COLORS = {
  positive: "#22c55e",
  negative: "#ef4444",
  neutral: "#eab308",
};

interface SentimentDonutProps {
  data: SentimentData[];
}

export function SentimentDonut({ data }: SentimentDonutProps) {
  const totals = data.reduce(
    (acc, d) => ({
      positive: acc.positive + d.positive,
      negative: acc.negative + d.negative,
      neutral: acc.neutral + d.neutral,
    }),
    { positive: 0, negative: 0, neutral: 0 }
  );

  const chartData = [
    { name: "Positive", value: totals.positive, color: COLORS.positive },
    { name: "Neutral", value: totals.neutral, color: COLORS.neutral },
    { name: "Negative", value: totals.negative, color: COLORS.negative },
  ];

  const total = totals.positive + totals.negative + totals.neutral;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Sentiment Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="value"
                  stroke="none"
                >
                  {chartData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} opacity={0.85} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: "rgba(0,0,0,0.8)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "8px",
                    fontSize: "12px",
                    color: "#e8eaed",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            {/* Center label */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-2xl font-bold">{total}</div>
                <div className="text-[10px] text-muted-foreground">total</div>
              </div>
            </div>
          </div>
          <div className="flex justify-center gap-4 mt-2">
            {chartData.map((d) => (
              <div key={d.name} className="flex items-center gap-1.5 text-xs">
                <div
                  className="h-2 w-2 rounded-full"
                  style={{ background: d.color }}
                />
                <span className="text-muted-foreground">{d.name}</span>
                <span className="font-medium">{d.value}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
