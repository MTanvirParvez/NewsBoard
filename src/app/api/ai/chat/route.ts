import { NextRequest, NextResponse } from "next/server";
import { getAIModel } from "@/lib/ai-model";
import { CHAT_SYSTEM_PROMPT } from "@/config/ai-prompts";
import type { ChatMessage } from "@/types";

export async function POST(req: NextRequest) {
  const { message, articleContext, history } = (await req.json()) as {
    message: string;
    articleContext?: string;
    history: ChatMessage[];
  };

  const model = getAIModel();

  // If we have an AI API key, use it for rich chat
  if (model) {
    try {
      const { generateText } = await import("ai");

      const contextParts = [CHAT_SYSTEM_PROMPT];
      if (articleContext) {
        contextParts.push(`\nCurrently viewing article:\n${articleContext}`);
      }

      const messages = [
        ...history.slice(-8).map((m) => ({
          role: m.role as "user" | "assistant",
          content: m.content,
        })),
        { role: "user" as const, content: message },
      ];

      const { text } = await generateText({
        model,
        system: contextParts.join("\n"),
        messages,
        maxOutputTokens: 500,
        temperature: 0.7,
      });

      return NextResponse.json({ response: text, engine: "api" });
    } catch (err) {
      console.error("API chat failed, using local fallback:", err);
    }
  }

  // Default: Local smart responses (no API key needed)
  const response = generateLocalResponse(message, articleContext);
  return NextResponse.json({ response, engine: "local" });
}

function generateLocalResponse(message: string, articleContext?: string): string {
  const lower = message.toLowerCase();

  // Context-aware responses
  if (articleContext) {
    if (lower.includes("summarize") || lower.includes("summary")) {
      return `Based on the article you're viewing:\n\nThis piece covers key developments that could have broader implications. The main points are outlined in the AI summary bullets on the left panel.\n\nTo get deeper AI-powered analysis, you can configure an API key (OpenAI, Anthropic, or xAI) in your .env.local file. The local engine provides extractive summaries, but an LLM can offer much richer insights.`;
    }

    if (lower.includes("sentiment") || lower.includes("feel") || lower.includes("tone")) {
      return `The sentiment analysis for this article is shown in the summary panel. Our local engine analyzes the text using keyword-based sentiment scoring — positive words vs negative words.\n\nFor nuanced sentiment analysis with context understanding, configure an AI API key in your environment.`;
    }
  }

  // General knowledge responses
  if (lower.includes("help") || lower.includes("what can you")) {
    return `I'm LuminaBoard's AI assistant! Here's what I can help with:\n\n• **Article Analysis** — Click an article, then ask me about it\n• **Trend Insights** — Ask about patterns in today's news\n• **Category Deep-Dives** — Ask about Politics, Economy, Tech, Industry, or Environment\n• **Dashboard Tips** — How to use LuminaBoard features\n\n💡 **Pro tip:** For much richer AI chat, add an API key (OpenAI/Anthropic/xAI) to your .env.local file. The local engine handles basics, but an LLM unlocks full conversational analysis.`;
  }

  if (lower.includes("trend") || lower.includes("pattern")) {
    return `Check the Analytics section below the article grid for visual trends:\n\n• **Trend Lines** — Category article volume over time\n• **Sentiment Donut** — Positive/negative/neutral split\n• **Topic Radar** — Hottest topics across categories\n• **Category Bars** — Article distribution\n\nThe charts update automatically when you hit "Update Now".`;
  }

  if (lower.includes("how") && (lower.includes("work") || lower.includes("update"))) {
    return `Here's how LuminaBoard works:\n\n1. **Update Now** fetches news from RSS feeds (20+ sources like BBC, Reuters, NYT, TechCrunch)\n2. **Local AI** generates 3-bullet summaries + sentiment for each article\n3. **Analytics** are computed from the processed articles\n4. **Charts & Map** visualize sentiment, trends, and geographic distribution\n\nEverything runs locally — no API keys required! For enhanced AI summaries and this chat, you can optionally add an LLM API key.`;
  }

  if (lower.includes("api") || lower.includes("key") || lower.includes("setup") || lower.includes("configure")) {
    return `LuminaBoard works 100% free out of the box! Here's what each optional API key adds:\n\n• **News APIs** (optional): NewsData.io or NewsAPI.org for additional sources beyond RSS\n• **AI APIs** (optional): OpenAI (GPT-4o-mini), Anthropic (Claude Haiku), or xAI (Grok) for:\n  - Higher quality summaries with context understanding\n  - Rich conversational chat (like this)\n  - Better topic and sentiment analysis\n\nAdd keys to \`.env.local\` — see \`.env.local.example\` for the template.`;
  }

  // Default conversational response
  return `I'm here to help you explore the news! Here are some things you can ask:\n\n• "What are the top trends today?"\n• "Tell me about this article" (select one first)\n• "How does the dashboard work?"\n• "How do I set up API keys?"\n\nClick an article card to select it, then ask me for analysis. The local AI engine handles basics — add an API key for full conversational intelligence.`;
}
