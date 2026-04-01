import type { Metadata } from "next";
import { TooltipProvider } from "@/components/ui/tooltip";
import "./globals.css";

export const metadata: Metadata = {
  title: "NewsBoard — AI-Powered Global News Dashboard",
  description:
    "Your personal Bloomberg-grade news intelligence dashboard. Real-time global coverage across Politics, Economy, Tech & AI, Industry, and Environment — powered by AI analysis.",
  keywords: [
    "news dashboard",
    "AI news",
    "global news",
    "politics",
    "economy",
    "tech",
    "environment",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased dark">
      <body className="min-h-full flex flex-col bg-background text-foreground font-sans">
        <TooltipProvider>{children}</TooltipProvider>
      </body>
    </html>
  );
}
