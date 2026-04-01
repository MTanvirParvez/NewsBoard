import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard — NewsBoard",
  description: "Your AI-powered global news intelligence dashboard",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* Leaflet CSS for the world heatmap */}
      {/* eslint-disable-next-line @next/next/no-css-tags */}
      <link
        rel="stylesheet"
        href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
        crossOrigin=""
      />
      {children}
    </>
  );
}
