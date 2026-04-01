import { NextRequest, NextResponse } from "next/server";
import { generateText } from "ai";
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
  if (!model) {
    return NextResponse.json({
      response: "No AI provider configured. Please set an API key in your environment variables (OPENAI_API_KEY, ANTHROPIC_API_KEY, or XAI_API_KEY).",
    });
  }

  try {
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

    return NextResponse.json({ response: text });
  } catch (err) {
    console.error("Chat error:", err);
    return NextResponse.json({
      response: "Sorry, I encountered an error processing your request. Please try again.",
    });
  }
}
