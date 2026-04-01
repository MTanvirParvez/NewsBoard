"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  ExternalLink,
  Bot,
  User,
  Sparkles,
  ArrowLeft,
  MessageSquare,
  ThumbsUp,
  Copy,
  Check,
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
import { showToast } from "@/components/ui/toast";

const quickPrompts = [
  "What are today's top trends?",
  "Analyze sentiment patterns",
  "How does the dashboard work?",
  "Summarize this article",
];

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
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  function handleCopy(text: string, id: string) {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  }

  async function handleSendChat(text?: string) {
    const msg = text || chatInput.trim();
    if (!msg || isLoadingChat) return;

    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: msg,
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
      addChatMessage({
        id: crypto.randomUUID(),
        role: "assistant",
        content: data.response || "Sorry, I couldn't process that.",
        timestamp: new Date().toISOString(),
      });
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
            <TabsTrigger value="deepdive" className="flex-1 text-xs gap-1.5">
              <Sparkles className="h-3 w-3" />
              Deep Dive
            </TabsTrigger>
            <TabsTrigger value="chat" className="flex-1 text-xs gap-1.5">
              <MessageSquare className="h-3 w-3" />
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
                  transition={{ type: "spring", damping: 25 }}
                  className="p-4 space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <Button variant="ghost" size="sm" onClick={() => setSelectedArticle(null)}>
                      <ArrowLeft className="h-3 w-3 mr-1" />
                      Back
                    </Button>
                    {selectedArticle.source_url && (
                      <a href={selectedArticle.source_url} target="_blank" rel="noopener noreferrer">
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
                      <span>·</span>
                      <span>{formatDate(selectedArticle.published_at)}</span>
                    </div>
                  </div>

                  {summary && (
                    <>
                      <Separator />
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <Sparkles className="h-3.5 w-3.5 text-primary animate-glow-pulse" />
                          <span className="text-xs font-medium text-primary">AI Summary</span>
                          <div
                            className="ml-auto h-2.5 w-2.5 rounded-full animate-glow-pulse"
                            style={{ background: sentimentColor(summary.sentiment_score), color: sentimentColor(summary.sentiment_score) }}
                          />
                          <span className="text-[10px] text-muted-foreground capitalize">
                            {summary.sentiment}
                          </span>
                        </div>
                        <ul className="space-y-2.5">
                          {summary.bullets.map((bullet, i) => (
                            <motion.li
                              key={i}
                              className="text-sm text-muted-foreground flex gap-2"
                              initial={{ opacity: 0, x: -12 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: i * 0.15 }}
                            >
                              <span className="text-primary mt-0.5 shrink-0 font-semibold">{i + 1}.</span>
                              {bullet}
                            </motion.li>
                          ))}
                        </ul>
                      </div>

                      {summary.topics.length > 0 && (
                        <motion.div
                          className="flex flex-wrap gap-1.5"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.4 }}
                        >
                          {summary.topics.map((topic, i) => (
                            <motion.div
                              key={topic}
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ delay: 0.4 + i * 0.05, type: "spring" }}
                            >
                              <Badge variant="secondary" className="text-[10px]">{topic}</Badge>
                            </motion.div>
                          ))}
                        </motion.div>
                      )}
                    </>
                  )}

                  <Separator />
                  {selectedArticle.description && (
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {selectedArticle.description}
                    </p>
                  )}

                  {/* Quick action to ask AI about this article */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      handleSendChat(`Tell me more about: ${selectedArticle.title}`);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg glass-strong text-xs text-primary cursor-pointer hover:bg-primary/5 transition-colors"
                  >
                    <Bot className="h-3.5 w-3.5" />
                    Ask AI about this article
                  </motion.button>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center h-full py-20 px-4 text-center"
                >
                  <motion.div
                    className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4"
                    animate={{ y: [0, -6, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <Sparkles className="h-7 w-7 text-primary" />
                  </motion.div>
                  <h3 className="text-sm font-medium mb-1">Select an article</h3>
                  <p className="text-xs text-muted-foreground">
                    Click any article card for AI deep-dive analysis
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
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-6"
                >
                  <motion.div
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    <Bot className="h-10 w-10 text-primary mx-auto mb-3" />
                  </motion.div>
                  <p className="text-sm font-medium mb-1">NewsBoard AI</p>
                  <p className="text-xs text-muted-foreground mb-4">
                    Ask me anything about the news
                  </p>

                  {/* Quick prompts */}
                  <div className="space-y-1.5">
                    {quickPrompts.map((prompt, i) => (
                      <motion.button
                        key={prompt}
                        initial={{ opacity: 0, x: -12 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 + i * 0.1 }}
                        whileHover={{ scale: 1.02, x: 4 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleSendChat(prompt)}
                        className="w-full text-left text-xs px-3 py-2 rounded-lg glass-strong text-muted-foreground hover:text-foreground hover:bg-primary/5 transition-all cursor-pointer flex items-center gap-2"
                      >
                        <MessageSquare className="h-3 w-3 text-primary/50" />
                        {prompt}
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}

              {chatMessages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 12, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ type: "spring", damping: 20 }}
                  className={`flex gap-2 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {msg.role === "assistant" && (
                    <motion.div
                      className="h-6 w-6 rounded-md bg-primary/15 flex items-center justify-center shrink-0 mt-0.5"
                      initial={{ rotate: -30, scale: 0.5 }}
                      animate={{ rotate: 0, scale: 1 }}
                    >
                      <Bot className="h-3 w-3 text-primary" />
                    </motion.div>
                  )}
                  <div className="max-w-[85%] group relative">
                    <div
                      className={`rounded-xl px-3 py-2 text-xs leading-relaxed whitespace-pre-wrap ${
                        msg.role === "user"
                          ? "bg-primary/15 text-foreground rounded-tr-sm"
                          : "glass-card text-foreground rounded-tl-sm"
                      }`}
                    >
                      {msg.content}
                    </div>
                    {/* Message actions — show on hover */}
                    {msg.role === "assistant" && (
                      <div className="absolute -bottom-5 left-0 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          className="text-muted-foreground hover:text-foreground p-0.5"
                          onClick={() => handleCopy(msg.content, msg.id)}
                        >
                          {copiedId === msg.id ? (
                            <Check className="h-3 w-3 text-emerald-400" />
                          ) : (
                            <Copy className="h-3 w-3" />
                          )}
                        </button>
                        <button className="text-muted-foreground hover:text-primary p-0.5">
                          <ThumbsUp className="h-3 w-3" />
                        </button>
                      </div>
                    )}
                  </div>
                  {msg.role === "user" && (
                    <div className="h-6 w-6 rounded-md bg-white/10 flex items-center justify-center shrink-0 mt-0.5">
                      <User className="h-3 w-3" />
                    </div>
                  )}
                </motion.div>
              ))}

              {isLoadingChat && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2"
                >
                  <div className="h-6 w-6 rounded-md bg-primary/15 flex items-center justify-center">
                    <Bot className="h-3 w-3 text-primary" />
                  </div>
                  <div className="glass-card rounded-xl rounded-tl-sm px-3 py-2.5 flex items-center gap-1">
                    {[0, 1, 2].map((i) => (
                      <motion.div
                        key={i}
                        className="h-1.5 w-1.5 rounded-full bg-primary"
                        animate={{
                          y: [0, -6, 0],
                          opacity: [0.4, 1, 0.4],
                        }}
                        transition={{
                          duration: 0.8,
                          repeat: Infinity,
                          delay: i * 0.15,
                          ease: "easeInOut",
                        }}
                      />
                    ))}
                  </div>
                </motion.div>
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
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.9 }}>
                <Button
                  type="submit"
                  size="icon"
                  className="h-9 w-9 shrink-0"
                  disabled={!chatInput.trim() || isLoadingChat}
                >
                  <Send className="h-3.5 w-3.5" />
                </Button>
              </motion.div>
            </form>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
