"use client";

import { motion } from "framer-motion";
import { ArrowRight, Globe, Cpu, TrendingUp, Zap, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const features = [
  { icon: Globe, label: "Global Coverage", desc: "5 critical categories worldwide" },
  { icon: Cpu, label: "AI Summaries", desc: "3-bullet intelligence per article" },
  { icon: TrendingUp, label: "Live Analytics", desc: "Sentiment, trends & heatmaps" },
  { icon: Zap, label: "One-Click Refresh", desc: "Instant news pipeline update" },
  { icon: Shield, label: "100% Free Stack", desc: "No paid APIs required" },
];

const categories = [
  { name: "Politics", color: "from-orange-500 to-orange-600" },
  { name: "Economy", color: "from-emerald-500 to-emerald-600" },
  { name: "Tech & AI", color: "from-indigo-500 to-indigo-600" },
  { name: "Industry", color: "from-yellow-500 to-yellow-600" },
  { name: "Environment", color: "from-teal-500 to-teal-600" },
];

export function Hero() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      {/* Background Effects */}
      <div className="absolute inset-0 gradient-mesh" />
      <div className="absolute inset-0 grid-overlay" />

      {/* Floating orbs */}
      <motion.div
        className="absolute top-20 left-[15%] w-72 h-72 rounded-full bg-indigo-500/10 blur-[100px]"
        animate={{ y: [0, -30, 0], x: [0, 20, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-20 right-[15%] w-96 h-96 rounded-full bg-emerald-500/8 blur-[120px]"
        animate={{ y: [0, 20, 0], x: [0, -25, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-[150px]"
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 text-center">
        {/* Top badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-strong text-sm text-muted-foreground mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            Personal AI News Intelligence
          </div>
        </motion.div>

        {/* Title */}
        <motion.h1
          className="text-5xl sm:text-7xl lg:text-8xl font-bold tracking-tight mb-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
        >
          <span className="bg-gradient-to-r from-white via-white to-white/60 bg-clip-text text-transparent">
            News
          </span>
          <span className="bg-gradient-to-r from-primary via-indigo-400 to-primary bg-clip-text text-transparent neon-text">
            Board
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          className="text-lg sm:text-xl text-muted-foreground max-w-2xl mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Your personal AI-powered global news intelligence dashboard.
          <br />
          Live coverage. Instant summaries. Beautiful analytics. Zero API keys.
        </motion.p>

        {/* Category pills */}
        <motion.div
          className="flex flex-wrap justify-center gap-2 mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          {categories.map((cat) => (
            <span
              key={cat.name}
              className={`px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${cat.color} text-white/90`}
            >
              {cat.name}
            </span>
          ))}
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4 mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <Link href="/dashboard">
            <Button size="xl" className="group">
              Open Dashboard
              <ArrowRight className="ml-1 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
          <Link href="/auth/login">
            <Button variant="glass" size="xl">
              Sign In
            </Button>
          </Link>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 max-w-4xl w-full"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          {features.map((f, i) => (
            <motion.div
              key={f.label}
              className="glass-card rounded-xl p-4 flex flex-col items-center gap-2 hover:neon-border transition-all duration-300"
              whileHover={{ y: -4, scale: 1.02 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 + i * 0.1 }}
            >
              <f.icon className="h-6 w-6 text-primary" />
              <span className="text-sm font-medium">{f.label}</span>
              <span className="text-xs text-muted-foreground text-center">{f.desc}</span>
            </motion.div>
          ))}
        </motion.div>

        {/* Dashboard Preview */}
        <motion.div
          className="mt-16 w-full max-w-5xl"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.8 }}
        >
          <div className="glass-card rounded-2xl p-1 neon-glow">
            <div className="rounded-xl bg-background/80 p-6 min-h-[300px] flex items-center justify-center">
              <div className="grid grid-cols-3 gap-4 w-full">
                {/* Simulated sidebar */}
                <div className="col-span-1 space-y-3">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <div key={n} className="h-8 rounded-lg bg-white/[0.04] animate-shimmer" />
                  ))}
                </div>
                {/* Simulated main */}
                <div className="col-span-2 space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    {[1, 2, 3, 4].map((n) => (
                      <div key={n} className="h-32 rounded-lg bg-white/[0.04] animate-shimmer" />
                    ))}
                  </div>
                  <div className="h-40 rounded-lg bg-white/[0.04] animate-shimmer" />
                </div>
              </div>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-3">
            Real dashboard preview — sign in to start
          </p>
        </motion.div>
      </div>
    </div>
  );
}
