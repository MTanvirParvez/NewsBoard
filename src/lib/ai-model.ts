import { createOpenAI } from "@ai-sdk/openai";
import { anthropic } from "@ai-sdk/anthropic";

export function getAIModel() {
  if (process.env.XAI_API_KEY) {
    const xai = createOpenAI({
      baseURL: "https://api.x.ai/v1",
      apiKey: process.env.XAI_API_KEY,
    });
    return xai("grok-3-mini");
  }
  if (process.env.OPENAI_API_KEY) {
    const openaiProvider = createOpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
    return openaiProvider("gpt-4o-mini");
  }
  if (process.env.ANTHROPIC_API_KEY) {
    return anthropic("claude-haiku-4-5-20251001");
  }
  return null;
}
