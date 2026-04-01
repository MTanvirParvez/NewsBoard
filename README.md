# LuminaBoard

**AI-Powered Global News Dashboard** — A Bloomberg-grade personal news intelligence platform.

Real-time global coverage across **Politics**, **Economy**, **Tech & AI**, **Industry**, and **Environment** — powered by AI analysis, beautiful glassmorphism UI, and interactive analytics.

## Features

- **5 Global Categories** — Politics, Economy, Tech & AI, Industry, Environment
- **AI Summaries** — 3-bullet intelligence per article with sentiment analysis
- **Interactive Charts** — Sentiment donut, trend lines, topic radar, category bars (Recharts)
- **World Heatmap** — React Leaflet map colored by news volume/sentiment per country
- **AI Chat** — Deep-dive analysis assistant embedded in the dashboard
- **One-Click Update** — "Update Now" button triggers the full news+AI pipeline
- **Glassmorphism UI** — Frosted glass cards, neon accents, fluid Framer Motion animations
- **Auth & Preferences** — Supabase auth with per-user settings and data isolation
- **Realtime** — Supabase Realtime subscriptions for live dashboard updates
- **100% Free Stack** — All APIs and tools use free tiers

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) + TypeScript |
| Styling | Tailwind CSS v4 + custom glassmorphism |
| UI Components | shadcn/ui (Radix) + Framer Motion |
| Backend | Supabase (Auth, Postgres, Realtime) |
| News Data | RSS feeds (20+ sources, free) + optional NewsData.io/NewsAPI.org |
| AI | Local engine (default, free) + optional Vercel AI SDK (Grok/OpenAI/Claude) |
| Charts | Recharts |
| Map | React Leaflet + CartoDB dark tiles |
| State | Zustand |

## Quick Start (Zero API Keys!)

```bash
# 1. Install dependencies
npm install

# 2. Start development — that's it!
npm run dev
```

Open http://localhost:3000, click **Update Now**, and watch it populate with real global news from 20+ RSS feeds.

### Optional Enhancements

All of these are **optional** — the app is fully functional without any keys:

```env
# Copy .env.local.example to .env.local and uncomment what you want:

# Supabase — adds auth & cloud data persistence (free tier)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# News APIs — adds more sources beyond RSS
NEWSDATA_API_KEY=your-key      # newsdata.io (200 credits/day free)
NEWSAPI_API_KEY=your-key       # newsapi.org (100 req/day free)

# AI APIs — upgrades from local AI to LLM-powered summaries & chat
OPENAI_API_KEY=your-key        # GPT-4o-mini (cheapest option)
XAI_API_KEY=your-key           # Grok via xAI
ANTHROPIC_API_KEY=your-key     # Claude Haiku
```

## Project Structure

```
src/
  app/
    page.tsx                 # Landing page
    layout.tsx               # Root layout
    dashboard/page.tsx       # Main dashboard
    auth/login/page.tsx      # Login
    auth/signup/page.tsx     # Signup
    auth/callback/route.ts   # OAuth callback
    api/
      news/route.ts          # Fetch news from APIs
      update/route.ts        # Full pipeline orchestrator
      ai/
        summarize/route.ts   # AI bullet summaries
        analyze/route.ts     # Aggregate analytics
        chat/route.ts        # AI chat assistant
  components/
    ui/                      # shadcn/ui components
    landing/hero.tsx         # Landing page hero
    dashboard/
      sidebar.tsx            # Category navigation
      header.tsx             # Update Now button + status
      article-card.tsx       # News article card
      article-grid.tsx       # Category-grouped grid
      right-panel.tsx        # Deep dive + AI chat
      loading-states.tsx     # Skeleton loaders
    charts/
      sentiment-donut.tsx    # Sentiment pie chart
      trend-lines.tsx        # Category trend lines
      topic-radar.tsx        # Topic heat radar
      category-bars.tsx      # Articles per category
      analytics-section.tsx  # Charts container
    map/
      world-heatmap.tsx      # Leaflet world map
  lib/
    utils.ts                 # Utility functions
    ai-model.ts              # AI provider selection
    supabase/                # Supabase clients
  store/dashboard.ts         # Zustand state
  types/index.ts             # TypeScript types
  config/
    categories.ts            # Category mappings
    ai-prompts.ts            # AI system prompts
supabase/
  schema.sql                 # Full database schema with RLS
```

## How It Works

1. **Update Now** calls `/api/update` which orchestrates the pipeline
2. **News Fetch** pulls from 20+ RSS feeds (BBC, Reuters, NYT, TechCrunch, etc.) — zero keys needed
3. **AI Summaries** local engine extracts key sentences + analyzes sentiment (or optional LLM for richer output)
4. **Analytics** produces aggregate trends, sentiment, topic heat, country volume
5. **Dashboard** Zustand store updates, React re-renders cards, charts, map
6. **Realtime** Supabase pushes changes to connected clients

## What's Free vs Optional

| Feature | Default (Free) | With API Key |
|---------|----------------|-------------|
| News Sources | 20+ RSS feeds (BBC, Reuters, NYT…) | + NewsData.io, NewsAPI.org |
| AI Summaries | Local extractive engine | LLM-powered (GPT/Claude/Grok) |
| Sentiment | Keyword-based analysis | LLM context-aware analysis |
| AI Chat | Smart local responses | Full conversational AI |
| Auth/DB | localStorage (works offline!) | Supabase (cloud persistence) |
| Charts & Map | Full functionality | Full functionality |

## License

MIT
