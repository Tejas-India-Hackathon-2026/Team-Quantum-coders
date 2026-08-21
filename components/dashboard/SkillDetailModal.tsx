"use client";

import * as React from "react";
import Link from "next/link";
import {
  X,
  ShieldCheck,
  Zap,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Award,
  Layers,
  Code2,
  Database,
  Cpu,
  Cloud,
  Network,
  Shield,
  Play,
} from "lucide-react";
import { Skill, Challenge } from "@/types";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { MOCK_CHALLENGES } from "@/data/mockChallenges";

interface SkillDetailModalProps {
  skill: Skill | null;
  isOpen: boolean;
  onClose: () => void;
  onLaunchChallenge: (challenge: Challenge) => void;
  onVerifyCheck?: (skill: Skill) => void;
}

const ICONS: Record<string, React.ElementType> = {
  Layers,
  Code2,
  Database,
  Cpu,
  Cloud,
  Network,
};

export function SkillDetailModal({
  skill,
  isOpen,
  onClose,
  onLaunchChallenge,
  onVerifyCheck,
}: SkillDetailModalProps) {
  if (!isOpen || !skill) return null;

  const IconComponent = ICONS[skill.iconName] || Shield;

  // Find challenges related to this skill's category
  const relatedChallenges = MOCK_CHALLENGES.filter(
    (c) =>
      c.category === skill.category ||
      c.tags.some((t) => skill.name.toLowerCase().includes(t.toLowerCase()))
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl rounded-3xl border border-slate-200/90 dark:border-white/20 bg-white dark:bg-slate-950 p-6 sm:p-8 shadow-2xl space-y-6 text-left overflow-hidden">
        {/* Background glow */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-indigo-100/60 dark:bg-primary/20 rounded-full blur-3xl pointer-events-none -z-10" />

        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-200/80 dark:border-white/10 pb-4">
          <div className="flex items-center gap-3.5">
            <div className="p-3 rounded-2xl bg-indigo-50 dark:bg-primary/10 border border-indigo-100 dark:border-primary/20 text-indigo-600 dark:text-primary shadow-xs">
              <IconComponent className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">{skill.name}</h3>
                {skill.verified ? (
                  <Badge variant="cyan" className="gap-1 text-[10px]">
                    <ShieldCheck className="h-3 w-3 text-cyan-500" />
                    Verified
                  </Badge>
                ) : (
                  <Badge variant="outline" className="text-[10px] text-slate-500 dark:text-muted-foreground">
                    Unverified
                  </Badge>
                )}
              </div>
              <p className="text-xs text-slate-500 dark:text-muted-foreground">{skill.category} · LifeProof Skill Vector</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-900 hover:bg-slate-100 dark:hover:text-white dark:hover:bg-white/10"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Proficiency Matrix Breakdown */}
        <div className="grid grid-cols-3 gap-3">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-muted-foreground">Competency Score</span>
            <div className="text-2xl font-black text-slate-900 dark:text-white">{skill.level} / 100</div>
            <span className="text-[10px] text-indigo-600 dark:text-cyan-400 font-mono font-bold">Top {skill.topPercentile}% Globally</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-muted-foreground">Assessments Solved</span>
            <div className="text-2xl font-black text-slate-900 dark:text-white">
              {skill.challengesCompleted} / {skill.totalChallenges}
            </div>
            <span className="text-[10px] text-slate-500 dark:text-muted-foreground">AST verified benchmarks</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-muted-foreground">Verification Tier</span>
            <div className="text-2xl font-black text-amber-600 dark:text-amber-400">
              {skill.level >= 80 ? "Mastery" : skill.level >= 50 ? "Proficient" : "Novice"}
            </div>
            <span className="text-[10px] text-amber-600 dark:text-amber-300/80 font-mono font-bold">Proof Hash Ready</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-slate-500 dark:text-muted-foreground font-medium">
            <span>Skill DNA Vector Level</span>
            <span className="text-slate-800 dark:text-white font-mono font-bold">{skill.level}% Completed</span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-white/5 rounded-full h-2.5 overflow-hidden">
            <div
              className="bg-gradient-to-r from-indigo-500 via-indigo-600 to-sky-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${skill.level}%` }}
            />
          </div>
        </div>

        {/* Verification Trigger */}
        <div className="p-4 rounded-2xl bg-indigo-50/80 dark:bg-slate-900 border border-indigo-100 dark:border-white/10 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-900 dark:text-white block">
              {skill.verified ? "Skill Cryptographically Certified" : "Ready for Skill Verification Audit"}
            </span>
            <span className="text-[11px] text-slate-500 dark:text-muted-foreground">
              {skill.verified ? "100% Consensus Proof generated." : "Run automated AST drill to upgrade rank and earn XP."}
            </span>
          </div>
          <Button
            variant="glow"
            size="sm"
            onClick={() => {
              onClose();
              onVerifyCheck?.(skill);
            }}
            className="text-xs gap-1.5 font-bold shadow-xs cursor-pointer"
          >
            <Sparkles className="h-3.5 w-3.5" />
            {skill.verified ? "Re-Check Skill" : "Check & Verify Skill"}
          </Button>
        </div>

        {/* Available Specific Challenges for this skill */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-white flex items-center gap-1.5">
              <Zap className="h-3.5 w-3.5 text-indigo-600 dark:text-cyan-400" />
              Direct Practice Challenges for {skill.name}
            </h4>
            <Link
              href={`/challenges?category=${encodeURIComponent(skill.category)}`}
              onClick={onClose}
              className="text-xs text-indigo-600 dark:text-primary hover:underline font-bold"
            >
              Browse all {relatedChallenges.length}
            </Link>
          </div>

          <div className="space-y-2.5">
            {relatedChallenges.slice(0, 2).map((ch) => (
              <div
                key={ch.id}
                className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200/80 dark:border-white/10 flex items-center justify-between gap-3 hover:border-indigo-300 dark:hover:border-primary/40 transition-all shadow-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h5 className="text-xs font-bold text-slate-900 dark:text-white">{ch.title}</h5>
                    <Badge variant="cyan" className="text-[9px]">
                      {ch.difficulty}
                    </Badge>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-muted-foreground line-clamp-1">{ch.description}</p>
                </div>

                <Button
                  variant="glow"
                  size="sm"
                  onClick={() => {
                    onClose();
                    onLaunchChallenge(ch);
                  }}
                  className="h-8 px-3 text-xs gap-1 font-bold shrink-0 shadow-xs"
                >
                  <Play className="h-3 w-3 fill-current" />
                  Solve Now
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-200/80 dark:border-white/10 flex items-center justify-between text-xs text-slate-500 dark:text-muted-foreground font-medium">
          <span>Protected by LifeProof Cryptographic Proof Engine</span>
          <Button variant="outline" size="sm" onClick={onClose} className="text-xs font-semibold">
            Close Overview
          </Button>
        </div>
      </div>
    </div>
  );
}
