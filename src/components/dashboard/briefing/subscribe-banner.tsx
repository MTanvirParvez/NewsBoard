"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Check, ArrowRight, Bell, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { showToast } from "@/components/ui/toast";

export function SubscribeBanner() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  async function handleSubscribe(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim() || loading) return;
    setLoading(true);

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        setSubscribed(true);
        showToast({
          type: "success",
          title: "Subscribed!",
          message: "You'll receive briefings at 9 AM and 6 PM daily",
          duration: 5000,
        });
      } else {
        showToast({
          type: "error",
          title: "Subscription failed",
          message: data.error || "Please try again",
        });
      }
    } catch {
      showToast({
        type: "error",
        title: "Connection error",
        message: "Please check your connection and try again",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="glass-card rounded-xl overflow-hidden"
    >
      <div
        className="px-5 py-4"
        style={{
          background: "linear-gradient(135deg, rgba(129,140,248,0.06), rgba(34,197,94,0.04), rgba(249,115,22,0.03))",
        }}
      >
        <AnimatePresence mode="wait">
          {subscribed ? (
            <motion.div
              key="subscribed"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center justify-center gap-3 py-2"
            >
              <motion.div
                className="h-10 w-10 rounded-full bg-emerald-500/15 flex items-center justify-center"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", damping: 12 }}
              >
                <Check className="h-5 w-5 text-emerald-400" />
              </motion.div>
              <div>
                <p className="text-sm font-semibold text-emerald-400">You&apos;re subscribed!</p>
                <p className="text-xs text-muted-foreground">
                  Daily briefings at 9:00 AM and 6:00 PM
                </p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Mail className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold">Daily Newsletter</h3>
                    <p className="text-[10px] text-muted-foreground">
                      Free AI-powered news briefing
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-[9px]">
                    <Clock className="h-2.5 w-2.5 mr-1" />
                    9 AM
                  </Badge>
                  <Badge variant="secondary" className="text-[9px]">
                    <Bell className="h-2.5 w-2.5 mr-1" />
                    6 PM
                  </Badge>
                </div>
              </div>

              <form onSubmit={handleSubscribe} className="flex gap-2">
                <Input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="text-xs h-9 flex-1"
                  required
                />
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
                  <Button
                    type="submit"
                    size="sm"
                    className="h-9 gap-1.5"
                    disabled={loading || !email.trim()}
                  >
                    {loading ? "Subscribing…" : "Subscribe Free"}
                    <ArrowRight className="h-3 w-3" />
                  </Button>
                </motion.div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
