"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CATEGORY_CONFIG, CATEGORIES } from "@/types";
import type { TrendData, Category } from "@/types";

interface TrendLinesProps {
  data: TrendData[];
}

export function TrendLines({ data }: TrendLinesProps) {
  const [hiddenLines, setHiddenLines] = useState<Set<Category>>(new Set());

  function toggleLine(cat: Category) {
    setHiddenLines((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat);
      else next.add(cat);
      return next;
    });
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.1, type: "spring" }}
    >
      <Card className="card-interactive">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Category Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis
                  dataKey="date"
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
                  cursor={{ stroke: "rgba(129,140,248,0.2)", strokeWidth: 1 }}
                />
                {CATEGORIES.map((cat) => (
                  <Line
                    key={cat}
                    type="monotone"
                    dataKey={cat}
                    stroke={CATEGORY_CONFIG[cat].color}
                    strokeWidth={hiddenLines.has(cat) ? 0 : 2.5}
                    dot={{ r: 3, fill: CATEGORY_CONFIG[cat].color, strokeWidth: 0 }}
                    activeDot={{
                      r: 6,
                      fill: CATEGORY_CONFIG[cat].color,
                      stroke: CATEGORY_CONFIG[cat].color,
                      strokeWidth: 3,
                      strokeOpacity: 0.3,
                    }}
                    opacity={hiddenLines.has(cat) ? 0 : 1}
                    animationDuration={1200}
                    animationEasing="ease-out"
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap justify-center gap-3 mt-3">
            {CATEGORIES.map((cat) => (
              <motion.button
                key={cat}
                className="flex items-center gap-1.5 text-xs cursor-pointer select-none"
                onClick={() => toggleLine(cat)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.div
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ background: CATEGORY_CONFIG[cat].color }}
                  animate={{
                    opacity: hiddenLines.has(cat) ? 0.2 : 1,
                    scale: hiddenLines.has(cat) ? 0.7 : 1,
                  }}
                />
                <span
                  className="transition-colors"
                  style={{
                    color: hiddenLines.has(cat) ? "#4a4e5c" : "#8b92a5",
                    textDecoration: hiddenLines.has(cat) ? "line-through" : "none",
                  }}
                >
                  {CATEGORY_CONFIG[cat].label}
                </span>
              </motion.button>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
