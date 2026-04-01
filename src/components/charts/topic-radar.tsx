"use client";

import { motion } from "framer-motion";
import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CATEGORY_CONFIG } from "@/types";
import type { TopicHeat } from "@/types";

interface TopicRadarProps {
  data: TopicHeat[];
}

export function TopicRadar({ data }: TopicRadarProps) {
  const radarData = data.slice(0, 8).map((d) => ({
    topic: d.topic.length > 12 ? d.topic.slice(0, 12) + "…" : d.topic,
    heat: d.heat,
    fullTopic: d.topic,
  }));

  const topTopic = data[0];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.2, type: "spring" }}
    >
      <Card className="card-interactive">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center justify-between">
            Topic Heatmap
            {topTopic && (
              <Badge
                variant="outline"
                className="text-[9px] animate-glow-pulse"
                style={{
                  borderColor: CATEGORY_CONFIG[topTopic.category]?.color,
                  color: CATEGORY_CONFIG[topTopic.category]?.color,
                }}
              >
                Hottest: {topTopic.topic}
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="70%">
                <PolarGrid stroke="rgba(255,255,255,0.06)" />
                <PolarAngleAxis
                  dataKey="topic"
                  tick={{ fontSize: 9, fill: "#8b92a5" }}
                />
                <PolarRadiusAxis
                  angle={30}
                  domain={[0, 100]}
                  tick={{ fontSize: 8, fill: "#8b92a5" }}
                />
                <Radar
                  name="Heat"
                  dataKey="heat"
                  stroke="#818cf8"
                  fill="#818cf8"
                  fillOpacity={0.15}
                  strokeWidth={2}
                  animationDuration={1000}
                  animationEasing="ease-out"
                  dot={{
                    r: 3,
                    fill: "#818cf8",
                    strokeWidth: 0,
                  }}
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
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          {/* Topic chips */}
          <div className="flex flex-wrap gap-1 mt-2 justify-center">
            {data.slice(0, 6).map((d, i) => (
              <motion.div
                key={d.topic}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + i * 0.05 }}
              >
                <Badge variant="secondary" className="text-[9px] cursor-default">
                  {d.topic}
                  <span className="ml-1 text-primary tabular-nums">{d.heat}</span>
                </Badge>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
