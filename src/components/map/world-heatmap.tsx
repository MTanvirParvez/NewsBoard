"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapSkeleton } from "@/components/dashboard/loading-states";
import { useDashboardStore } from "@/store/dashboard";
import type { CountryNewsVolume } from "@/types";

function getColor(sentiment: string): string {
  if (sentiment === "positive") return "#22c55e";
  if (sentiment === "negative") return "#ef4444";
  return "#eab308";
}

function MapInner({ data }: { data: CountryNewsVolume[] }) {
  const [mounted, setMounted] = useState(false);
  const [mapComponents, setMapComponents] = useState<{
    MapContainer: React.ComponentType<Record<string, unknown>>;
    TileLayer: React.ComponentType<Record<string, unknown>>;
    CircleMarker: React.ComponentType<Record<string, unknown>>;
    Tooltip: React.ComponentType<Record<string, unknown>>;
  } | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    import("react-leaflet").then((mod) => {
      setMapComponents({
        MapContainer: mod.MapContainer as unknown as React.ComponentType<Record<string, unknown>>,
        TileLayer: mod.TileLayer as unknown as React.ComponentType<Record<string, unknown>>,
        CircleMarker: mod.CircleMarker as unknown as React.ComponentType<Record<string, unknown>>,
        Tooltip: mod.Tooltip as unknown as React.ComponentType<Record<string, unknown>>,
      });
    });
  }, []);

  if (!mounted || !mapComponents) return <MapSkeleton />;

  const { MapContainer, TileLayer, CircleMarker, Tooltip } = mapComponents;

  return (
    <div className="relative">
      <MapContainer
        center={[20, 0] as [number, number]}
        zoom={2}
        scrollWheelZoom={true}
        style={{ height: "100%", width: "100%", borderRadius: "12px", minHeight: "300px" }}
        className="z-0"
        {...{ attributionControl: false }}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          {...{ attribution: "" }}
        />
        {data.map((point) => {
          const color = getColor(point.dominant_sentiment);
          const isSelected = selectedCountry === point.country;
          const radius = Math.max(6, Math.min(point.volume * 3, 30));

          return (
            <CircleMarker
              key={point.country_code}
              center={[point.lat, point.lng] as [number, number]}
              radius={isSelected ? radius * 1.3 : radius}
              {...{
                fillColor: color,
                fillOpacity: isSelected ? 0.9 : 0.5,
                stroke: true,
                color: color,
                weight: isSelected ? 2 : 1,
                opacity: isSelected ? 1 : 0.4,
                className: "cursor-pointer transition-all",
                eventHandlers: {
                  click: () => setSelectedCountry(
                    selectedCountry === point.country ? null : point.country
                  ),
                },
              }}
            >
              <Tooltip>
                <div className="text-xs p-1">
                  <p className="font-semibold">{point.country}</p>
                  <p className="text-muted-foreground">
                    {point.volume} article{point.volume !== 1 ? "s" : ""} ·{" "}
                    <span style={{ color }}>{point.dominant_sentiment}</span>
                  </p>
                </div>
              </Tooltip>
            </CircleMarker>
          );
        })}
      </MapContainer>

      {/* Selected country detail overlay */}
      {selectedCountry && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute bottom-3 left-3 z-10 glass-strong rounded-lg px-3 py-2"
        >
          {data
            .filter((d) => d.country === selectedCountry)
            .map((d) => (
              <div key={d.country_code} className="text-xs">
                <p className="font-semibold text-sm">{d.country}</p>
                <p className="text-muted-foreground">
                  {d.volume} articles · Sentiment:{" "}
                  <span style={{ color: getColor(d.dominant_sentiment) }}>
                    {d.dominant_sentiment}
                  </span>
                </p>
              </div>
            ))}
        </motion.div>
      )}
    </div>
  );
}

export function WorldHeatmap() {
  const analytics = useDashboardStore((s) => s.analytics);

  if (!analytics?.countryVolume?.length) return null;

  const topCountry = analytics.countryVolume[0];

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4, type: "spring" }}
      className="p-6 pt-0"
    >
      <Card className="card-interactive">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center justify-between">
            <span className="flex items-center gap-2">
              Global News Volume
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 live-dot" />
            </span>
            {topCountry && (
              <Badge variant="secondary" className="text-[9px]">
                Top: {topCountry.country} ({topCountry.volume})
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-xl overflow-hidden">
            <MapInner data={analytics.countryVolume} />
          </div>
          <div className="flex justify-center gap-5 mt-3">
            {(["positive", "neutral", "negative"] as const).map((s) => (
              <div key={s} className="flex items-center gap-1.5 text-xs">
                <div
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ background: getColor(s) }}
                />
                <span className="text-muted-foreground capitalize">{s}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
