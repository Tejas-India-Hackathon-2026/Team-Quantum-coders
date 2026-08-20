"use client";

import * as React from "react";
import Link from "next/link";
import {
  Sparkles,
  Zap,
  Clock,
  Users,
  ArrowRight,
  ShieldCheck,
  Bookmark,
  BookmarkCheck,
  Calendar,
  Play,
} from "lucide-react";
import { Challenge } from "@/types";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";
import { ChallengeSandboxModal } from "./ChallengeSandboxModal";

export function FeaturedChallengeCard({ challenge }: { challenge: Challenge }) {
  const [saved, setSaved] = React.useState(false);
  const [isSandboxOpen, setIsSandboxOpen] = React.useState(false);
  const { requireAuth } = useAuth();

  const handleAcceptChallenge = () => {
    requireAuth(() => {
      setIsSandboxOpen(true);
    });
  };

  return (
    <>
      <div className="relative rounded-3xl border border-indigo-500/30 bg-gradient-to-r from-indigo-950/80 via-slate-950/90 to-purple-950/80 p-6 sm:p-8 md:p-10 shadow-2xl backdrop-blur-2xl overflow-hidden group">
        {/* Background ambient lighting */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-3xl pointer-events-none -z-10 animate-pulseGlow" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-secondary/15 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 relative z-10">
          {/* Left Info Column */}
          <div className="space-y-4 max-w-2xl text-left">
            {/* Top badges */}
            <div className="flex flex-wrap items-center gap-2.5">
              <Badge variant="purple" className="gap-1.5 px-3 py-1 text-xs font-bold shadow-glow-purple/30 uppercase tracking-wider">
                <Sparkles className="h-3.5 w-3.5" />
                Featured Challenge of the Week
              </Badge>
              <Badge variant="warning" className="text-xs font-semibold">
                {challenge.difficulty}
              </Badge>
              <span className="text-xs text-muted-foreground font-medium flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5 text-amber-400" />
                {challenge.deadline}
              </span>
            </div>

            {/* Company identity + Title */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-indigo-300">
                <div className="w-5 h-5 rounded-md overflow-hidden bg-white/10 flex items-center justify-center">
                  <img
                    src={challenge.companyLogo || "https://avatar.vercel.sh/company"}
                    alt={challenge.company}
                    className="w-full h-full object-cover"
                  />
                </div>
                <span>Sponsored by {challenge.company}</span>
              </div>

              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-tight group-hover:text-primary transition-colors">
                {challenge.title}
              </h2>

              <p className="text-sm text-muted-foreground leading-relaxed">
                {challenge.description}
              </p>
            </div>

            {/* Tech Tags */}
            <div className="flex flex-wrap gap-2 pt-1">
              {challenge.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-2.5 py-1 rounded-lg bg-white/5 text-slate-300 border border-white/10 font-mono"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Right Action & Reward Card */}
          <div className="w-full lg:w-80 shrink-0 p-6 rounded-2xl bg-slate-900/90 border border-white/15 shadow-xl space-y-5 text-left">
            <div className="space-y-1 border-b border-white/10 pb-4">
              <span className="text-[11px] uppercase tracking-wider font-semibold text-muted-foreground">
                Grand Bounty & Grant
              </span>
              <div className="text-3xl font-black text-white flex items-baseline gap-1">
                <span className="text-gradient-cyan">{challenge.prize}</span>
              </div>
              <p className="text-[11px] text-emerald-400 font-medium flex items-center gap-1">
                <ShieldCheck className="h-3.5 w-3.5" />
                Includes Fast-Track Recruiter Referral
              </p>
            </div>

            {/* Metrics summary */}
            <div className="grid grid-cols-2 gap-3 text-xs text-muted-foreground">
              <div className="space-y-0.5">
                <span>Time Limit:</span>
                <div className="font-semibold text-white flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5 text-indigo-400" />
                  {challenge.estimatedMinutes} Mins
                </div>
              </div>

              <div className="space-y-0.5">
                <span>Participants:</span>
                <div className="font-semibold text-white flex items-center gap-1">
                  <Users className="h-3.5 w-3.5 text-cyan-400" />
                  {challenge.participantsCount} Active
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex items-center gap-2.5 pt-2">
              <Button
                variant="glow"
                size="lg"
                onClick={handleAcceptChallenge}
                className="flex-1 gap-2 text-sm font-bold h-11 shadow-glow"
              >
                <Play className="h-4 w-4 fill-current" />
                Accept Challenge
                <ArrowRight className="h-4 w-4" />
              </Button>

              <Button
                variant="outline"
                size="icon"
                onClick={() => setSaved(!saved)}
                className="h-11 w-11 shrink-0 border-white/10 hover:bg-white/10"
                aria-label="Save challenge"
              >
                {saved ? (
                  <BookmarkCheck className="h-5 w-5 text-cyan-400" />
                ) : (
                  <Bookmark className="h-5 w-5 text-muted-foreground" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Live Interactive Code Sandbox & Verification Runner */}
      <ChallengeSandboxModal
        challenge={challenge}
        isOpen={isSandboxOpen}
        onClose={() => setIsSandboxOpen(false)}
      />
    </>
  );
}
