"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Send,
  ExternalLink,
  Bot,
  User,
  Sparkles,
  ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useDashboardStore } from "@/store/dashboard";
import { formatDate, sentimentColor } from "@/lib/utils";
import { CATEGORY_CONFIG } from "@/types";
import type { ChatMessage } from "@/types";

export function RightPanel() {
  const {
    selectedArticle,
    setSelectedArticle,
    summaries,
    chatMessages,
    addChatMessage,
    isLoadingChat,
    setIsLoadingChat,
  } = useDashboardStore();

  const [chatInput, setChatInput] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  async function handleSendChat() {
    if (!chatInput.trim() || isLoadingChat) return;

    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: chatInput.trim(),
      timestamp: new Date().toISOString(),
    };
    addChatMessage(userMsg);
    setChatInput("");
    setIsLoadingChat(true);

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMsg.content,
          articleContext: selectedArticle
            ? `Article: ${selectedArticle.title}\n${selectedArticle.description || ""}`
            : undefined,
          history: chatMessages.slice(-10),
        }),
      });

      const data = await res.json();
      const assistantMsg: ChatMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: data.response || "Sorry, I couldn't process that request.",
        timestamp: new Date().toISOString(),
      };
      addChatMessage(assistantMsg);
    } catch {
      addChatMessage({
        id: crypto.randomUUID(),
        role: "assistant",
        content: "Connection error. Please try again.",
        timestamp: new Date().toISOString(),
      });
    } finally {
      setIsLoadingChat(false);
    }
  }

  const summary = selectedArticle ? summaries[selectedArticle.id] : null;

  return (
    <div className="w-80 xl:w-96 h-full border-l border-border/50 glass flex flex-col">
      <Tabs defaultValue="deepdive" className="flex flex-col h-full">
        <div className="px-4 pt-3 pb-0">
          <TabsList className="w-full">
            <TabsTrigger value="deepdive" className="flex-1 text-xs">
              Deep Dive
            </TabsTrigger>
            <TabsTrigger value="chat" className="flex-1 text-xs">
              <Bot className="h-3 w-3 mr-1" />
              AI Chat
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Deep Dive Tab */}
        <TabsContent value="deepdive" className="flex-1 overflow-hidden m-0">
          <ScrollArea className="h-full">
            <AnimatePresence mode="wait">
              {selectedArticle ? (
                <motion.div
                  key={selectedArticle.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="p-4 space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedArticle(null)}
                    >
                      <ArrowLeft className="h-3 w-3 mr-1" />
                      Back
                    </Button>
                    {selectedArticle.source_url && (
                      <a
                        href={selectedArticle.source_url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button variant="ghost" size="sm">
                          <ExternalLink className="h-3 w-3 mr-1" />
                          Source
                        </Button>
                      </a>
                    )}
                  </div>

                  <div>
                    <Badge
                      variant="outline"
                      className="mb-2 text-[10px]"
                      style={{
                        borderColor: CATEGORY_CONFIG[selectedArticle.category].color,
                        color: CATEGORY_CONFIG[selectedArticle.category].color,
                      }}
                    >
                      {CATEGORY_CONFIG[selectedArticle.category].label}
                    </Badge>
                    <h2 className="text-base font-semibold leading-snug mb-2">
                      {selectedArticle.title}
                    </h2>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{selectedArticle.source_name}</span>
                      <span>•</span>
                      <span>{formatDate(selectedArticle.published_at)}</span>
                    </div>
                  </div>

                  {summary && (
                    <>
                      <Separator />
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <Sparkles className="h-3.5 w-3.5 text-primary" />
                          <span className="text-xs font-medium text-primary">
                            AI Summary
                          </span>
                          <div
                            className="ml-auto h-2 w-2 rounded-full"
                            style={{
                              background: sentimentColor(summary.sentiment_score),
                            }}
                          />
                          <span className="text-[10px] text-muted-foreground capitalize">
                            {summary.sentiment}
                          </span>
                        </div>
                        <ul className="space-y-2">
                          {summary.bullets.map((bullet, i) => (
                            <li
                              key={i}
                              className="text-sm text-muted-foreground flex gap-2"
                            >
                              <span className="text-primary mt-0.5 shrink-0">
                                {i + 1}.
                              </span>
                              {bullet}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {summary.topics.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                          {summary.topics.map((topic) => (
                            <Badge key={topic} variant="secondary" className="text-[10px]">
                              {topic}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </>
                  )}

                  <Separator />
                  {selectedArticle.description && (
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {selectedArticle.description}
                    </p>
                  )}
                  {selectedArticle.content && (
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {selectedArticle.content}
                    </p>
                  )}
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center h-full py-20 px-4 text-center"
                >
                  <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-3">
                    <Sparkles className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-sm font-medium mb-1">Select an article</h3>
                  <p className="text-xs text-muted-foreground">
                    Click any article card to see the AI deep-dive analysis
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </ScrollArea>
        </TabsContent>

        {/* Chat Tab */}
        <TabsContent value="chat" className="flex-1 flex flex-col overflow-hidden m-0">
          <ScrollArea className="flex-1 px-4 py-3">
            <div className="space-y-3">
              {chatMessages.length === 0 && (
                <div className="text-center py-8">
                  <Bot className="h-8 w-8 text-primary mx-auto mb-2" />
                  <p className="text-xs text-muted-foreground">
                    Ask me anything about the news. I can analyze trends, explain
                    events, and cross-reference articles.
                  </p>
                </div>
              )}
              {chatMessages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-2 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {msg.role === "assistant" && (
                    <div className="h-6 w-6 rounded-md bg-primary/15 flex items-center justify-center shrink-0 mt-0.5">
                      <Bot className="h-3 w-3 text-primary" />
                    </div>
                  )}
                  <div
                    className={`max-w-[85%] rounded-lg px-3 py-2 text-xs leading-relaxed ${
                      msg.role === "user"
                        ? "bg-primary/15 text-foreground"
                        : "glass-card text-foreground"
                    }`}
                  >
                    {msg.content}
                  </div>
                  {msg.role === "user" && (
                    <div className="h-6 w-6 rounded-md bg-white/10 flex items-center justify-center shrink-0 mt-0.5">
                      <User className="h-3 w-3" />
                    </div>
                  )}
                </motion.div>
              ))}
              {isLoadingChat && (
                <div className="flex items-center gap-2">
                  <div className="h-6 w-6 rounded-md bg-primary/15 flex items-center justify-center">
                    <Bot className="h-3 w-3 text-primary" />
                  </div>
                  <div className="flex gap-1">
                    {[0, 1, 2].map((i) => (
                      <motion.div
                        key={i}
                        className="h-1.5 w-1.5 rounded-full bg-primary/50"
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                      />
                    ))}
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>
          </ScrollArea>

          <div className="p-3 border-t border-border/50">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendChat();
              }}
              className="flex gap-2"
            >
              <Input
                placeholder="Ask about the news..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                className="text-xs h-9"
              />
              <Button
                type="submit"
                size="icon"
                className="h-9 w-9 shrink-0"
                disabled={!chatInput.trim() || isLoadingChat}
              >
                <Send className="h-3.5 w-3.5" />
              </Button>
            </form>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
