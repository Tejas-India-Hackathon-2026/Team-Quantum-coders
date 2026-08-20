"use client";

import * as React from "react";
import Link from "next/link";
import {
  Clock,
  Zap,
  CheckCircle2,
  PlayCircle,
  ShieldCheck,
  X,
  Award,
  Cpu,
  QrCode,
  Share2,
} from "lucide-react";
import { Challenge } from "@/types";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

export function RecentChallengeCard({ challenge }: { challenge: Challenge }) {
  const [showModal, setShowModal] = React.useState(false);
  const isCompleted = challenge.progressPercent === 100;
  const isInProgress = (challenge.progressPercent ?? 0) > 0 && !isCompleted;

  return (
    <>
      <Card className="hover:border-primary/40 transition-all duration-200">
        <CardHeader className="p-4 sm:p-5 space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Badge
                  variant={
                    challenge.difficulty === "Beginner"
                      ? "success"
                      : challenge.difficulty === "Intermediate"
                      ? "cyan"
                      : challenge.difficulty === "Advanced"
                      ? "purple"
                      : "destructive"
                  }
                  className="text-[10px]"
                >
                  {challenge.difficulty}
                </Badge>
                <span className="text-xs text-muted-foreground">{challenge.category}</span>
              </div>
              <CardTitle className="text-base font-semibold text-white">
                {challenge.title}
              </CardTitle>
            </div>

            {isCompleted ? (
              <Badge variant="success" className="gap-1 shrink-0">
                <CheckCircle2 className="h-3 w-3" />
                Passed
              </Badge>
            ) : isInProgress ? (
              <Badge variant="warning" className="shrink-0">
                In Progress
              </Badge>
            ) : (
              <Badge variant="outline" className="shrink-0">
                Ready
              </Badge>
            )}
          </div>

          <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
            {challenge.description}
          </p>

          <div className="flex items-center justify-between pt-2 border-t border-white/10 text-xs">
            <div className="flex items-center gap-4 text-muted-foreground">
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                {challenge.estimatedMinutes} mins
              </span>
              <span className="flex items-center gap-1 text-primary font-semibold">
                <Zap className="h-3.5 w-3.5 text-amber-400" />
                +{challenge.xpReward} XP
              </span>
            </div>

            {isCompleted ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowModal(true)}
                className="h-8 text-xs gap-1.5 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 hover:text-white"
              >
                <ShieldCheck className="h-3.5 w-3.5" />
                Review Proof
              </Button>
            ) : (
              <Link href="/coach">
                <Button variant="default" size="sm" className="h-8 text-xs gap-1.5">
                  <PlayCircle className="h-3.5 w-3.5" />
                  {isInProgress ? "Resume" : "Start"}
                </Button>
              </Link>
            )}
          </div>
        </CardHeader>
      </Card>

      {/* Proof Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-xl rounded-3xl border border-white/20 bg-slate-950 p-6 sm:p-8 shadow-2xl space-y-6 overflow-hidden">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Verified Submission Proof</h3>
                  <p className="text-xs text-muted-foreground">{challenge.title}</p>
                </div>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-1.5 rounded-xl text-muted-foreground hover:text-white hover:bg-white/10"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div className="p-3.5 rounded-xl bg-white/5 space-y-1">
                <span className="text-[10px] text-muted-foreground uppercase">Consensus Proof Hash</span>
                <div className="text-cyan-300 font-bold">0x8f4b...39a1 · Verified on-chain</div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-white/5">
                  <span className="text-[10px] text-muted-foreground">Score</span>
                  <div className="text-sm font-bold text-emerald-400">98% Perfect Audit</div>
                </div>
                <div className="p-3 rounded-xl bg-white/5">
                  <span className="text-[10px] text-muted-foreground">XP Awarded</span>
                  <div className="text-sm font-bold text-amber-400">+{challenge.xpReward} XP</div>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-white/10">
              <Button variant="glow" size="sm" onClick={() => setShowModal(false)} className="text-xs">
                Done
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
