"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapSkeleton } from "@/components/dashboard/loading-states";
import { useDashboardStore } from "@/store/dashboard";
import type { CountryNewsVolume } from "@/types";

function getColor(sentiment: string, volume: number): string {
  const base =
    sentiment === "positive" ? [34, 197, 94] :
    sentiment === "negative" ? [239, 68, 68] :
    [234, 179, 8];
  const opacity = Math.min(0.3 + (volume / 50) * 0.7, 1);
  return `rgba(${base.join(",")}, ${opacity})`;
}

function MapInner({ data }: { data: CountryNewsVolume[] }) {
  const [mounted, setMounted] = useState(false);
  const [mapComponents, setMapComponents] = useState<{
    MapContainer: React.ComponentType<Record<string, unknown>>;
    TileLayer: React.ComponentType<Record<string, unknown>>;
    CircleMarker: React.ComponentType<Record<string, unknown>>;
    Tooltip: React.ComponentType<Record<string, unknown>>;
  } | null>(null);

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
    <MapContainer
      center={[20, 0] as [number, number]}
      zoom={2}
      scrollWheelZoom={true}
      style={{ height: "100%", width: "100%", borderRadius: "12px" }}
      className="z-0"
      {...{ attributionControl: false }}
    >
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        {...{ attribution: "" }}
      />
      {data.map((point) => (
        <CircleMarker
          key={point.country_code}
          center={[point.lat, point.lng] as [number, number]}
          radius={Math.max(5, Math.min(point.volume * 2, 25))}
          {...{
            fillColor: getColor(point.dominant_sentiment, point.volume),
            fillOpacity: 0.7,
            stroke: true,
            color: "rgba(255,255,255,0.2)",
            weight: 1,
          }}
        >
          <Tooltip>
            <div className="text-xs">
              <strong>{point.country}</strong>
              <br />
              {point.volume} articles · {point.dominant_sentiment}
            </div>
          </Tooltip>
        </CircleMarker>
      ))}
    </MapContainer>
  );
}

export function WorldHeatmap() {
  const analytics = useDashboardStore((s) => s.analytics);

  if (!analytics?.countryVolume?.length) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="p-6 pt-0"
    >
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">
            Global News Volume
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-72 rounded-xl overflow-hidden">
            <MapInner data={analytics.countryVolume} />
          </div>
          <div className="flex justify-center gap-4 mt-3">
            {["positive", "neutral", "negative"].map((s) => (
              <div key={s} className="flex items-center gap-1.5 text-xs">
                <div
                  className="h-2 w-2 rounded-full"
                  style={{
                    background:
                      s === "positive" ? "#22c55e" :
                      s === "negative" ? "#ef4444" :
                      "#eab308",
                  }}
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
