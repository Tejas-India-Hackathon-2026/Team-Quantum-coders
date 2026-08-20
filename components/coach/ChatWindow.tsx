"use client";

import * as React from "react";
import Link from "next/link";
import { Bot, User, Send, Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ChatMessage } from "@/types";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";

interface ChatWindowProps {
  externalPrompt?: string;
  onClearExternalPrompt?: () => void;
}

export function ChatWindow({ externalPrompt, onClearExternalPrompt }: ChatWindowProps) {
  const { user } = useAuth();
  const userName = user?.fullName?.split(" ")[0] || "Engineer";

  const INITIAL_MESSAGES: ChatMessage[] = [
    {
      id: "msg-1",
      sender: "coach",
      text: `Hello ${userName}! 👋 I am your autonomous AI Architecture & Skill Mentor. I can evaluate your system design trade-offs, explain distributed patterns, or suggest personalized challenges to boost your verified Skill DNA. How can I assist your engineering practice today?`,
      timestamp: "Just now",
      suggestedAction: {
        label: "Explore Recommended Challenges",
        href: "/challenges",
      },
    },
  ];

  const [messages, setMessages] = React.useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [inputValue, setInputValue] = React.useState("");
  const [isTyping, setIsTyping] = React.useState(false);
  const scrollRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (externalPrompt) {
      sendQuery(externalPrompt);
      onClearExternalPrompt?.();
    }
  }, [externalPrompt]);

  React.useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const sendQuery = async (queryText: string) => {
    if (!queryText.trim()) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: "user",
      text: queryText.trim(),
      timestamp: "Just now",
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");
    setIsTyping(true);

    try {
      const res = await fetch("/api/coach/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: queryText,
          userName,
        }),
      });

      if (res.ok) {
        const json = await res.json();
        if (json.data) {
          setIsTyping(false);
          const coachMsg: ChatMessage = {
            id: `coach-${Date.now()}`,
            sender: "coach",
            text: json.data.text,
            timestamp: "Just now",
            suggestedAction: json.data.suggestedAction,
          };
          setMessages((prev) => [...prev, coachMsg]);
          return;
        }
      }
    } catch {
      // Fallback
    }

    // Dynamic client-side response fallback if offline
    setTimeout(() => {
      setIsTyping(false);
      const q = queryText.toLowerCase();
      let replyText = `I've analyzed your query on "${queryText}". Let's dive deeper into implementation details or test your architecture in the sandbox.`;
      let action = { label: "Launch Code Sandbox", href: "/challenges" };

      if (q.includes("hello") || q.includes("hi") || q.includes("hey")) {
        replyText = `Hello ${userName}! What would you like to explore today? We can practice distributed locks, Next.js caching, or vector search pipelines.`;
        action = { label: "Browse Challenges", href: "/challenges" };
      } else if (q.includes("redis") || q.includes("lock") || q.includes("concurrency")) {
        replyText = `To guarantee atomic distributed locking with Redis:\n1. Use \`SET lock_key uuid NX PX 30000\`.\n2. Release via Lua script comparing the uuid token.\n3. Add heartbeat TTL renewal before expiration.`;
        action = { label: "Solve Redis Lock Challenge", href: "/challenges" };
      } else if (q.includes("next") || q.includes("action") || q.includes("cache")) {
        replyText = `In Next.js 14 App Router, invoke \`revalidateTag('tag-name')\` inside Server Actions for targeted, on-demand cache invalidation across distributed edge nodes.`;
        action = { label: "Next.js Cache Invalidation Drill", href: "/challenges" };
      } else if (q.includes("skill") || q.includes("dna") || q.includes("gap") || q.includes("radar")) {
        replyText = `Your Skill DNA shows strong Frontend competencies. Completing 1 high-concurrency Backend challenge will raise your overall rank!`;
        action = { label: "View Profile & Skill Radar", href: "/profile" };
      }

      setMessages((prev) => [
        ...prev,
        {
          id: `coach-${Date.now()}`,
          sender: "coach",
          text: replyText,
          timestamp: "Just now",
          suggestedAction: action,
        },
      ]);
    }, 600);
  };

  const handleSendMessage = (e?: React.FormEvent) => {
    e?.preventDefault();
    sendQuery(inputValue);
  };

  return (
    <div className="flex flex-col h-[650px] rounded-3xl border border-slate-200/90 dark:border-white/10 bg-white dark:bg-slate-950/60 backdrop-blur-xl overflow-hidden shadow-sm">
      {/* Chat Header */}
      <div className="p-4 border-b border-slate-200/80 dark:border-white/10 flex items-center justify-between bg-slate-50/80 dark:bg-white/[0.02]">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-primary to-secondary p-0.5 shadow-xs">
              <div className="w-full h-full bg-white dark:bg-slate-950 rounded-[14px] flex items-center justify-center">
                <Bot className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
              </div>
            </div>
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-950 animate-pulse" />
          </div>
          <div className="text-left">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              LifeProof AI Mentor
              <span className="text-[10px] px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-primary/20 text-indigo-700 dark:text-primary font-mono font-bold">
                Interactive Architecture Engine
              </span>
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-muted-foreground font-medium">
              Real-time conversational mentor · Personalizing code drills & system design
            </p>
          </div>
        </div>
      </div>

      {/* Quick Prompt Chips */}
      <div className="px-4 py-2.5 bg-slate-50/50 dark:bg-white/[0.02] border-b border-slate-200/60 dark:border-white/5 flex items-center gap-2 overflow-x-auto text-xs no-scrollbar">
        <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-muted-foreground shrink-0 font-mono">Quick prompts:</span>
        <button
          onClick={() => sendQuery("How do I implement a zero-downtime distributed lock with Redis?")}
          className="px-3 py-1 rounded-xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-muted-foreground hover:text-indigo-600 dark:hover:text-white hover:border-indigo-300 dark:hover:bg-white/10 shrink-0 transition-colors shadow-xs font-medium"
        >
          Redis Distributed Lock
        </button>
        <button
          onClick={() => sendQuery("Explain Next.js 14 Server Action cache tag invalidation")}
          className="px-3 py-1 rounded-xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-muted-foreground hover:text-indigo-600 dark:hover:text-white hover:border-indigo-300 dark:hover:bg-white/10 shrink-0 transition-colors shadow-xs font-medium"
        >
          Next.js Server Actions
        </button>
        <button
          onClick={() => sendQuery("Analyze my Skill DNA and highlight my architectural gaps")}
          className="px-3 py-1 rounded-xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-muted-foreground hover:text-indigo-600 dark:hover:text-white hover:border-indigo-300 dark:hover:bg-white/10 shrink-0 transition-colors shadow-xs font-medium"
        >
          Analyze My Skill DNA
        </button>
        <button
          onClick={() => sendQuery("What are best practices for hybrid RAG vector search pipelines?")}
          className="px-3 py-1 rounded-xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-muted-foreground hover:text-indigo-600 dark:hover:text-white hover:border-indigo-300 dark:hover:bg-white/10 shrink-0 transition-colors shadow-xs font-medium"
        >
          Hybrid RAG Pipeline
        </button>
      </div>

      {/* Messages Feed */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 text-left">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={cn(
              "flex gap-3 max-w-[85%]",
              msg.sender === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
            )}
          >
            {/* Avatar */}
            <div
              className={cn(
                "w-8 h-8 rounded-xl shrink-0 flex items-center justify-center text-xs font-semibold shadow-xs",
                msg.sender === "user"
                  ? "bg-indigo-600 text-white"
                  : "bg-indigo-50 dark:bg-secondary/20 border border-indigo-200 dark:border-secondary/40 text-indigo-600 dark:text-secondary"
              )}
            >
              {msg.sender === "user" ? (
                <User className="h-4 w-4" />
              ) : (
                <Bot className="h-4 w-4 text-indigo-600 dark:text-purple-300" />
              )}
            </div>

            {/* Bubble */}
            <div className="space-y-2">
              <div
                className={cn(
                  "p-4 rounded-2xl text-sm leading-relaxed whitespace-pre-line shadow-xs font-normal",
                  msg.sender === "user"
                    ? "bg-indigo-600 text-white rounded-tr-none"
                    : "bg-slate-50 dark:bg-white/5 border border-slate-200/90 dark:border-white/10 text-slate-800 dark:text-slate-200 rounded-tl-none"
                )}
              >
                {msg.text}
              </div>

              {/* Optional inline CTA */}
              {msg.suggestedAction && (
                <div className="pt-1">
                  <Link href={msg.suggestedAction.href}>
                    <Button
                      variant="glow"
                      size="sm"
                      className="text-xs h-8 gap-1.5 shadow-xs font-bold cursor-pointer"
                    >
                      <Sparkles className="h-3.5 w-3.5" />
                      {msg.suggestedAction.label}
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Button>
                  </Link>
                </div>
              )}
              <div className="text-[10px] text-slate-400 dark:text-muted-foreground font-mono">
                {msg.timestamp}
              </div>
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {isTyping && (
          <div className="flex gap-3 max-w-[80%] items-center text-slate-400 dark:text-muted-foreground text-xs font-mono">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-secondary/20 border border-indigo-200 dark:border-secondary/40 flex items-center justify-center">
              <Bot className="h-4 w-4 text-indigo-600 dark:text-purple-300" />
            </div>
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-bounce" />
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-bounce [animation-delay:0.2s]" />
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-bounce [animation-delay:0.4s]" />
            </div>
          </div>
        )}
        <div ref={scrollRef} />
      </div>

      {/* Input Box */}
      <form
        onSubmit={handleSendMessage}
        className="p-3 sm:p-4 border-t border-slate-200/80 dark:border-white/10 bg-white dark:bg-slate-950/90 backdrop-blur-md"
      >
        <div className="relative flex items-center">
          <input
            type="text"
            placeholder="Ask AI Coach about architecture, review code, or request challenge recommendations..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl px-4 py-3 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent pr-12 transition-all shadow-xs"
          />
          <Button
            type="submit"
            variant="ghost"
            size="icon"
            disabled={!inputValue.trim()}
            className="absolute right-1.5 text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 dark:text-primary dark:hover:text-white dark:hover:bg-primary/20 disabled:opacity-30 cursor-pointer"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </div>
  );
}
