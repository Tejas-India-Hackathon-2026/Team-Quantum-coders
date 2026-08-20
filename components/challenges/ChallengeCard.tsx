"use client";

import * as React from "react";
import Link from "next/link";
import {
  Clock,
  Zap,
  Play,
  ShieldCheck,
  X,
  Bookmark,
  BookmarkCheck,
  Calendar,
} from "lucide-react";
import { Challenge } from "@/types";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";
import { ChallengeSandboxModal } from "./ChallengeSandboxModal";

export function ChallengeCard({ challenge }: { challenge: Challenge }) {
  const [showProofModal, setShowProofModal] = React.useState(false);
  const [showPreviewModal, setShowPreviewModal] = React.useState(false);
  const [showSandboxModal, setShowSandboxModal] = React.useState(false);
  const [isSaved, setIsSaved] = React.useState(false);
  const { requireAuth } = useAuth();

  const isCompleted = challenge.status === "Verified" || (challenge.progressPercent ?? 0) === 100;
  const isInProgress = (challenge.progressPercent ?? 0) > 0 && !isCompleted;

  const handleStartChallenge = () => {
    requireAuth(() => {
      setShowSandboxModal(true);
    });
  };

  return (
    <>
      <Card className="hover:border-indigo-300 dark:hover:border-primary/50 transition-all duration-300 group flex flex-col justify-between bg-white dark:bg-slate-950/60 backdrop-blur-xl border-slate-200/90 dark:border-white/10 shadow-sm hover:shadow-md">
        <CardHeader className="p-6 space-y-4">
          {/* Top Row: Company Info & Status Badge & Bookmark */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl overflow-hidden bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center shrink-0">
                <img
                  src={challenge.companyLogo || "https://avatar.vercel.sh/company"}
                  alt={challenge.company}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="space-y-0.5 text-left">
                <span className="text-xs font-bold text-slate-800 dark:text-white line-clamp-1">
                  {challenge.company}
                </span>
                <span className="text-[10px] text-slate-500 dark:text-muted-foreground block font-medium">
                  {challenge.category}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <Badge
                variant={
                  challenge.status === "Featured"
                    ? "purple"
                    : challenge.status === "New"
                    ? "cyan"
                    : challenge.status === "Ending Soon"
                    ? "destructive"
                    : challenge.status === "Verified"
                    ? "success"
                    : "secondary"
                }
                className="text-[10px] font-bold"
              >
                {challenge.status}
              </Badge>

              <button
                type="button"
                onClick={() => setIsSaved(!isSaved)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
                aria-label="Save challenge"
              >
                {isSaved ? (
                  <BookmarkCheck className="h-4 w-4 text-indigo-600 dark:text-cyan-400" />
                ) : (
                  <Bookmark className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          {/* Title & Description */}
          <div className="space-y-2 text-left">
            <CardTitle
              onClick={() => setShowPreviewModal(true)}
              className="text-base sm:text-lg font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-primary transition-colors leading-snug cursor-pointer line-clamp-2"
            >
              {challenge.title}
            </CardTitle>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-muted-foreground leading-relaxed line-clamp-2 font-normal">
              {challenge.description}
            </p>
          </div>

          {/* Tech Stack Tags & Difficulty */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            <Badge
              variant={
                challenge.difficulty === "Beginner"
                  ? "success"
                  : challenge.difficulty === "Intermediate"
                  ? "cyan"
                  : challenge.difficulty === "Advanced"
                  ? "purple"
                  : "warning"
              }
              className="text-[10px]"
            >
              {challenge.difficulty}
            </Badge>

            {challenge.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-white/5 font-mono font-medium"
              >
                {tag}
              </span>
            ))}
          </div>
        </CardHeader>

        {/* Footer Metrics & Actions */}
        <CardContent className="p-6 pt-0 border-t border-slate-100 dark:border-white/10 mt-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-muted-foreground font-medium">
            {challenge.prize && (
              <span className="font-bold text-emerald-600 dark:text-emerald-400 text-xs">
                {challenge.prize}
              </span>
            )}
            <span className="flex items-center gap-1 font-bold text-amber-600 dark:text-amber-400">
              <Zap className="h-3.5 w-3.5 text-amber-500" />
              +{challenge.xpReward} XP
            </span>
            <span className="hidden sm:flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {challenge.estimatedMinutes}m
            </span>
          </div>

          {/* Action Button */}
          {isCompleted ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowProofModal(true)}
              className="gap-1.5 text-xs font-semibold border-emerald-200 dark:border-emerald-500/30 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 h-8"
            >
              <ShieldCheck className="h-3.5 w-3.5" />
              View Verification
            </Button>
          ) : (
            <div className="flex items-center gap-1.5">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowPreviewModal(true)}
                className="h-8 px-2 text-xs text-slate-500 hover:text-slate-900 dark:text-muted-foreground dark:hover:text-white font-semibold"
              >
                Preview
              </Button>
              <Button
                variant={isInProgress ? "secondary" : "glow"}
                size="sm"
                onClick={handleStartChallenge}
                className="gap-1 text-xs font-bold h-8 shadow-xs cursor-pointer"
              >
                <Play className="h-3 w-3 fill-current" />
                {isInProgress ? "Resume" : "Accept"}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Interactive Live Challenge Sandbox Modal */}
      <ChallengeSandboxModal
        challenge={challenge}
        isOpen={showSandboxModal}
        onClose={() => setShowSandboxModal(false)}
      />

      {/* Interactive Verification Proof Modal */}
      {showProofModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl rounded-3xl border border-slate-200 dark:border-white/20 bg-white dark:bg-slate-950 p-6 sm:p-8 shadow-2xl space-y-6 overflow-hidden text-left">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 text-emerald-600 dark:text-emerald-400">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    Cryptographic Proof Certificate
                    <Badge variant="cyan" className="font-mono text-[10px]">
                      100% Audit Score
                    </Badge>
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-muted-foreground">
                    Verified by {challenge.company} on LifeProof Protocol
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowProofModal(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-900 hover:bg-slate-100 dark:hover:text-white dark:hover:bg-white/10"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 space-y-1.5">
                <span className="text-[11px] font-bold uppercase text-slate-400 dark:text-muted-foreground">
                  Task Assessment
                </span>
                <h4 className="text-base font-bold text-slate-900 dark:text-white">{challenge.title}</h4>
                <p className="text-xs text-slate-600 dark:text-muted-foreground">{challenge.description}</p>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 space-y-1">
                  <span className="text-[10px] text-slate-400 dark:text-muted-foreground font-bold uppercase">Score</span>
                  <div className="text-sm font-bold text-emerald-600 dark:text-emerald-400">98 / 100 (Top 2%)</div>
                </div>
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 space-y-1">
                  <span className="text-[10px] text-slate-400 dark:text-muted-foreground font-bold uppercase">Reward XP</span>
                  <div className="text-sm font-bold text-amber-600 dark:text-amber-400">+{challenge.xpReward} XP</div>
                </div>
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 space-y-1">
                  <span className="text-[10px] text-slate-400 dark:text-muted-foreground font-bold uppercase">AST Security</span>
                  <div className="text-sm font-bold text-indigo-600 dark:text-cyan-400">0 Vulnerabilities</div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-white/10 font-mono text-xs text-indigo-700 dark:text-cyan-300 font-bold flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 dark:text-muted-foreground block uppercase font-sans">
                    Verification Seal Hash
                  </span>
                  0x8f4b77c2e81d99fe44d1aa029d4a
                </div>
                <Badge variant="cyan">On-Chain Verified</Badge>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-200 dark:border-white/10">
              <Button variant="outline" size="sm" onClick={() => setShowProofModal(false)}>
                Close
              </Button>
              <Link href="/profile">
                <Button variant="glow" size="sm" className="font-bold">
                  View Full Profile
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Challenge Preview & Details Modal */}
      {showPreviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl rounded-3xl border border-slate-200 dark:border-white/20 bg-white dark:bg-slate-950 p-6 sm:p-8 shadow-2xl space-y-6 overflow-hidden text-left">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl overflow-hidden bg-slate-100 dark:bg-white/10 flex items-center justify-center">
                  <img
                    src={challenge.companyLogo || "https://avatar.vercel.sh/company"}
                    alt={challenge.company}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">{challenge.title}</h3>
                  <p className="text-xs text-slate-500 dark:text-muted-foreground">Sponsored by {challenge.company}</p>
                </div>
              </div>
              <button
                onClick={() => setShowPreviewModal(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-900 hover:bg-slate-100 dark:hover:text-white dark:hover:bg-white/10"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-muted-foreground">
                  Challenge Overview & Objectives
                </span>
                <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed">
                  {challenge.description}
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/80">
                  <span className="text-[10px] text-slate-400 dark:text-muted-foreground uppercase font-bold">Difficulty</span>
                  <div className="text-xs font-bold text-slate-900 dark:text-white">{challenge.difficulty}</div>
                </div>
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/80">
                  <span className="text-[10px] text-slate-400 dark:text-muted-foreground uppercase font-bold">Grant / Prize</span>
                  <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400">{challenge.prize || "Certificate"}</div>
                </div>
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/80">
                  <span className="text-[10px] text-slate-400 dark:text-muted-foreground uppercase font-bold">Estimated Time</span>
                  <div className="text-xs font-bold text-slate-900 dark:text-white">{challenge.estimatedMinutes} Mins</div>
                </div>
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/80">
                  <span className="text-[10px] text-slate-400 dark:text-muted-foreground uppercase font-bold">XP Reward</span>
                  <div className="text-xs font-bold text-amber-600 dark:text-amber-400">+{challenge.xpReward} XP</div>
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-muted-foreground">
                  Required Technologies & Skills
                </span>
                <div className="flex flex-wrap gap-2">
                  {challenge.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-white/5 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-white/10 font-mono font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-white/10">
              <span className="text-xs text-slate-500 dark:text-muted-foreground flex items-center gap-1 font-medium">
                <Calendar className="h-3.5 w-3.5 text-amber-500" />
                {challenge.deadline || "Open Enrollment"}
              </span>

              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => setShowPreviewModal(false)}>
                  Cancel
                </Button>
                <Button
                  variant="glow"
                  size="sm"
                  onClick={() => {
                    setShowPreviewModal(false);
                    handleStartChallenge();
                  }}
                  className="gap-1.5 font-bold shadow-xs cursor-pointer"
                >
                  <Play className="h-3.5 w-3.5 fill-current" />
                  Accept & Open Sandbox
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
