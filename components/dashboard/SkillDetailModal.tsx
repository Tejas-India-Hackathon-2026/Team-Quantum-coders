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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl rounded-3xl border border-white/20 bg-slate-950 p-6 sm:p-8 shadow-2xl space-y-6 text-left overflow-hidden">
        {/* Background glow */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/20 rounded-full blur-3xl pointer-events-none -z-10" />

        {/* Header */}
        <div className="flex items-start justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-3.5">
            <div className="p-3 rounded-2xl bg-primary/10 border border-primary/20 text-primary">
              <IconComponent className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold text-white">{skill.name}</h3>
                {skill.verified ? (
                  <Badge variant="cyan" className="gap-1 text-[10px]">
                    <ShieldCheck className="h-3 w-3 text-cyan-400" />
                    Verified
                  </Badge>
                ) : (
                  <Badge variant="outline" className="text-[10px] text-muted-foreground">
                    Unverified
                  </Badge>
                )}
              </div>
              <p className="text-xs text-muted-foreground">{skill.category} · LifeProof Skill Vector</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-muted-foreground hover:text-white hover:bg-white/10"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Proficiency Matrix Breakdown */}
        <div className="grid grid-cols-3 gap-3">
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
            <span className="text-[10px] uppercase font-bold text-muted-foreground">Competency Score</span>
            <div className="text-2xl font-black text-white">{skill.level} / 100</div>
            <span className="text-[10px] text-cyan-400 font-mono">Top {skill.topPercentile}% Globally</span>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
            <span className="text-[10px] uppercase font-bold text-muted-foreground">Assessments Solved</span>
            <div className="text-2xl font-black text-white">
              {skill.challengesCompleted} / {skill.totalChallenges}
            </div>
            <span className="text-[10px] text-muted-foreground">AST verified benchmarks</span>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
            <span className="text-[10px] uppercase font-bold text-muted-foreground">Verification Tier</span>
            <div className="text-2xl font-black text-amber-400">
              {skill.level >= 80 ? "Mastery" : skill.level >= 50 ? "Proficient" : "Novice"}
            </div>
            <span className="text-[10px] text-amber-300/80 font-mono">Proof Hash Ready</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Skill DNA Vector Level</span>
            <span className="text-white font-mono font-semibold">{skill.level}% Completed</span>
          </div>
          <div className="w-full bg-white/5 rounded-full h-2.5 overflow-hidden">
            <div
              className="bg-gradient-to-r from-primary via-indigo-500 to-cyan-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${skill.level}%` }}
            />
          </div>
        </div>

        {/* Available Specific Challenges for this skill */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-1.5">
              <Zap className="h-3.5 w-3.5 text-cyan-400" />
              Direct Practice Challenges for {skill.name}
            </h4>
            <Link
              href={`/challenges?category=${encodeURIComponent(skill.category)}`}
              onClick={onClose}
              className="text-xs text-primary hover:underline"
            >
              Browse all {relatedChallenges.length}
            </Link>
          </div>

          <div className="space-y-2.5">
            {relatedChallenges.slice(0, 2).map((ch) => (
              <div
                key={ch.id}
                className="p-3.5 rounded-2xl bg-slate-900/80 border border-white/10 flex items-center justify-between gap-3 hover:border-primary/40 transition-all"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h5 className="text-xs font-bold text-white">{ch.title}</h5>
                    <Badge variant="cyan" className="text-[9px]">
                      {ch.difficulty}
                    </Badge>
                  </div>
                  <p className="text-[11px] text-muted-foreground line-clamp-1">{ch.description}</p>
                </div>

                <Button
                  variant="glow"
                  size="sm"
                  onClick={() => {
                    onClose();
                    onLaunchChallenge(ch);
                  }}
                  className="h-8 px-3 text-xs gap-1 font-bold shrink-0 shadow-sm"
                >
                  <Play className="h-3 w-3 fill-current" />
                  Solve Now
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs text-muted-foreground">
          <span>Protected by LifeProof Cryptographic Proof Engine</span>
          <Button variant="outline" size="sm" onClick={onClose} className="text-xs">
            Close Overview
          </Button>
        </div>
      </div>
    </div>
  );
}
