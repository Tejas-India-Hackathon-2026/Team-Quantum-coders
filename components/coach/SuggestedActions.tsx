"use client";

import * as React from "react";
import { Sparkles, Code, Cpu, Target, ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/Card";

interface SuggestedActionsProps {
  onSelectPrompt?: (prompt: string) => void;
}

export function SuggestedActions({ onSelectPrompt }: SuggestedActionsProps) {
  const PROMPTS = [
    {
      icon: Code,
      title: "Evaluate System Design Architecture",
      desc: "Simulate a load test with 50k QPS and inspect bottlenecks.",
      prompt: "How do I optimize system architecture for 50k QPS with Redis and PostgreSQL?",
    },
    {
      icon: Cpu,
      title: "RAG & Embedding Pipeline Advice",
      desc: "How to tune chunk overlap and hybrid BM25 + dense search.",
      prompt: "What are best practices for hybrid RAG vector search pipelines?",
    },
    {
      icon: Target,
      title: "Targeted Next.js Caching Drill",
      desc: "Practice cache tag invalidation under high concurrent loads.",
      prompt: "Explain Next.js 14 Server Action cache tag invalidation",
    },
    {
      icon: Sparkles,
      title: "Analyze My Skill DNA & Gaps",
      desc: "Review my current verified rankings and next best moves.",
      prompt: "Analyze my Skill DNA and highlight my architectural gaps",
    },
  ];

  return (
    <div className="space-y-4 text-left">
      <div className="flex items-center gap-2">
        <Sparkles className="h-4 w-4 text-primary" />
        <h3 className="text-sm font-bold text-white uppercase tracking-wider">
          Suggested Mentorship Prompts
        </h3>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {PROMPTS.map((prompt, idx) => {
          const Icon = prompt.icon;
          return (
            <Card
              key={idx}
              onClick={() => onSelectPrompt?.(prompt.prompt)}
              className="p-4 bg-slate-950/40 border-white/10 hover:border-primary/40 transition-all cursor-pointer group active:scale-[0.99]"
            >
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-primary/10 text-primary border border-primary/20 shrink-0 group-hover:bg-primary/20 transition-colors">
                  <Icon className="h-4 w-4" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-white group-hover:text-primary transition-colors flex items-center justify-between">
                    <span>{prompt.title}</span>
                    <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all text-primary" />
                  </h4>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">
                    {prompt.desc}
                  </p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
