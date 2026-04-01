"use client";

import { useState } from "react";
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
  const [activeIndex, setActiveIndex] = useState(-1);

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
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, type: "spring" }}
    >
      <Card className="card-interactive">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            Sentiment Overview
            <span className="text-[10px] text-muted-foreground font-normal tabular-nums">
              {total} total
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative h-52">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={activeIndex >= 0 ? 85 : 80}
                  paddingAngle={3}
                  dataKey="value"
                  stroke="none"
                  onMouseEnter={(_, index) => setActiveIndex(index)}
                  onMouseLeave={() => setActiveIndex(-1)}
                  animationBegin={0}
                  animationDuration={800}
                  animationEasing="ease-out"
                >
                  {chartData.map((entry, i) => (
                    <Cell
                      key={i}
                      fill={entry.color}
                      opacity={activeIndex >= 0 && activeIndex !== i ? 0.3 : 0.85}
                      style={{ transition: "opacity 0.3s", cursor: "pointer" }}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: "rgba(0,0,0,0.85)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "10px",
                    fontSize: "12px",
                    color: "#e8eaed",
                    boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            {/* Center label */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-center">
                <motion.div
                  className="text-2xl font-bold"
                  key={activeIndex >= 0 ? chartData[activeIndex]?.value : total}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", damping: 15 }}
                >
                  {activeIndex >= 0 ? chartData[activeIndex]?.value : total}
                </motion.div>
                <div className="text-[10px] text-muted-foreground">
                  {activeIndex >= 0 ? chartData[activeIndex]?.name : "articles"}
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-center gap-4 mt-1">
            {chartData.map((d, i) => (
              <motion.button
                key={d.name}
                className="flex items-center gap-1.5 text-xs cursor-pointer"
                onMouseEnter={() => setActiveIndex(i)}
                onMouseLeave={() => setActiveIndex(-1)}
                whileHover={{ scale: 1.05 }}
              >
                <motion.div
                  className="h-2 w-2 rounded-full"
                  style={{ background: d.color }}
                  animate={activeIndex === i ? { scale: [1, 1.4, 1] } : {}}
                  transition={{ duration: 0.3 }}
                />
                <span className="text-muted-foreground">{d.name}</span>
                <span className="font-medium tabular-nums">{d.value}</span>
              </motion.button>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
