"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Sparkles,
  Play,
  CheckCircle2,
  ShieldCheck,
  Cpu,
  Award,
  Terminal,
  Zap,
  Flame,
  X,
  Code2,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { APP_CONFIG } from "@/lib/constants";

export function HeroSection() {
  const [showDemoModal, setShowDemoModal] = React.useState(false);

  return (
    <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-32 text-left">
      {/* Dynamic Ambient Background Gradients for Light Theme */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[450px] bg-gradient-to-tr from-indigo-200/40 via-sky-100/40 to-purple-200/40 dark:from-primary/25 dark:via-indigo-600/20 dark:to-secondary/25 rounded-full blur-[140px] pointer-events-none -z-10 animate-pulseGlow" />
      <div className="absolute top-1/3 left-10 w-[350px] h-[350px] bg-sky-200/30 dark:bg-cyan-500/15 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="absolute top-1/2 right-10 w-[400px] h-[400px] bg-purple-200/30 dark:bg-purple-600/15 rounded-full blur-[130px] pointer-events-none -z-10" />

      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center space-y-8 max-w-4xl mx-auto">
          {/* Top Pill Badge */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 dark:bg-white/5 border border-slate-200 dark:border-white/15 backdrop-blur-xl shadow-xs"
          >
            <span className="flex h-2 w-2 rounded-full bg-indigo-600 dark:bg-cyan-400 animate-ping" />
            <span className="text-xs font-bold tracking-wide text-slate-800 dark:text-foreground">
              LifeProof 2.0 Engine Live
            </span>
            <span className="text-xs text-indigo-500 font-bold">·</span>
            <span className="text-xs text-indigo-600 dark:text-indigo-300 font-semibold">
              Autonomous Verification Protocol
            </span>
          </motion.div>

          {/* Large Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.1]"
          >
            Proof of Real-World <br />
            <span className="text-gradient">Skills</span>
          </motion.h1>

          {/* Supporting Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl sm:text-2xl font-bold text-slate-700 dark:text-slate-200 tracking-tight"
          >
            {APP_CONFIG.subtitle}
          </motion.p>

          {/* Short Description */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-base sm:text-lg text-slate-600 dark:text-muted-foreground max-w-2xl leading-relaxed font-normal"
          >
            Verify your genuine coding, architecture, and system design abilities through hands-on challenges, get real-time AI architectural feedback, and build a trusted, tamper-proof career profile.
          </motion.p>

          {/* Action CTAs: Start Free & Watch Demo */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto pt-2"
          >
            <Link href="/signup" className="w-full sm:w-auto">
              <Button variant="glow" size="lg" className="w-full sm:w-auto gap-2 text-base px-8 h-12 shadow-sm font-bold">
                <Sparkles className="h-4 w-4" />
                Start Free
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>

            <Button
              variant="outline"
              size="lg"
              onClick={() => setShowDemoModal(true)}
              className="w-full sm:w-auto gap-2 text-base px-6 h-12 border-slate-200 dark:border-white/15 bg-white/80 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 text-slate-700 dark:text-white font-semibold"
            >
              <div className="w-6 h-6 rounded-full bg-indigo-50 dark:bg-primary/20 flex items-center justify-center text-indigo-600 dark:text-primary">
                <Play className="h-3 w-3 fill-current ml-0.5" />
              </div>
              Watch Demo
            </Button>
          </motion.div>

          {/* Hero Tech Illustration Area with Floating Cards & Verification Badges */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="w-full max-w-4xl pt-10 relative"
          >
            {/* Floating Badge 1: Left */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="hidden lg:flex absolute -left-12 top-16 z-20 items-center gap-3 p-3 rounded-2xl bg-white/95 dark:bg-slate-950/80 border border-slate-200/80 dark:border-white/15 backdrop-blur-xl shadow-lg"
            >
              <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-emerald-600 dark:text-emerald-400">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div className="text-left">
                <div className="text-xs font-bold text-slate-900 dark:text-white">Next.js Architecture</div>
                <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono font-bold">Top 2% Verified</div>
              </div>
            </motion.div>

            {/* Floating Badge 2: Right */}
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="hidden lg:flex absolute -right-12 top-32 z-20 items-center gap-3 p-3 rounded-2xl bg-white/95 dark:bg-slate-950/80 border border-slate-200/80 dark:border-white/15 backdrop-blur-xl shadow-lg"
            >
              <div className="p-2.5 rounded-xl bg-purple-50 dark:bg-purple-500/10 border border-purple-200 dark:border-purple-500/20 text-purple-600 dark:text-purple-400">
                <Award className="h-5 w-5" />
              </div>
              <div className="text-left">
                <div className="text-xs font-bold text-slate-900 dark:text-white">Grandmaster IV</div>
                <div className="text-[10px] text-purple-600 dark:text-purple-300 font-mono font-bold">18,450 XP Earned</div>
              </div>
            </motion.div>

            {/* Floating Badge 3: Bottom Right */}
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              className="hidden sm:flex absolute right-6 -bottom-6 z-20 items-center gap-2 px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-cyan-500/30 backdrop-blur-xl text-xs font-mono text-indigo-600 dark:text-cyan-300 shadow-md font-bold"
            >
              <span className="w-2 h-2 rounded-full bg-indigo-500 animate-ping" />
              Proof Hash: 0x9d4a...77f1
            </motion.div>

            {/* Main Interactive Evaluation Sandbox Mockup */}
            <div className="rounded-3xl p-4 sm:p-7 border border-slate-200/90 dark:border-white/15 shadow-xl relative overflow-hidden text-left bg-white dark:bg-slate-950/90">
              {/* Window Bar */}
              <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-white/10 pb-4 mb-4">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-red-400 inline-block" />
                    <span className="w-3 h-3 rounded-full bg-amber-400 inline-block" />
                    <span className="w-3 h-3 rounded-full bg-emerald-400 inline-block" />
                  </div>
                  <span className="text-xs font-mono text-slate-500 dark:text-muted-foreground ml-2 flex items-center gap-1.5 font-semibold">
                    <Terminal className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
                    lifeproof-verifier::eval_sandbox.ts
                  </span>
                </div>

                <Badge variant="cyan" className="gap-1 font-mono text-[11px]">
                  <Cpu className="h-3 w-3" />
                  AST & Concurrency Audit: 100%
                </Badge>
              </div>

              {/* Terminal Logs & Output */}
              <div className="font-mono text-xs sm:text-sm space-y-2.5 text-slate-700 dark:text-slate-300 font-medium">
                <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="h-4 w-4 shrink-0" />
                  <span>[PASS] Scenario #1: Race condition under 10k parallel req/sec (0 defects)</span>
                </div>
                <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="h-4 w-4 shrink-0" />
                  <span>[PASS] Scenario #2: Memory footprint &lt; 42MB at steady state</span>
                </div>
                <div className="flex items-center gap-2 text-indigo-700 dark:text-indigo-300">
                  <ShieldCheck className="h-4 w-4 shrink-0 text-indigo-600 dark:text-cyan-400" />
                  <span>
                    [VERIFIED] Cryptographic Proof Hash Generated:{" "}
                    <span className="text-indigo-600 dark:text-cyan-400 font-bold">0x9d4a...77f1</span>
                  </span>
                </div>

                {/* Score Summary Box */}
                <div className="mt-4 pt-3.5 border-t border-slate-200/80 dark:border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-3">
                    <div className="px-3 py-1 rounded-lg bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30 text-amber-700 dark:text-amber-300 font-bold flex items-center gap-1.5">
                      <Flame className="h-3.5 w-3.5 text-amber-500" />
                      Score: 98 / 100
                    </div>
                    <span className="text-slate-500 dark:text-muted-foreground font-semibold">
                      Standing: Top 2% Worldwide
                    </span>
                  </div>

                  <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Verification Seal: Immutable & Authenticated
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Interactive Watch Demo Modal */}
      {showDemoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-3xl rounded-3xl border border-slate-200 dark:border-white/15 bg-white dark:bg-slate-950 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-indigo-50 dark:bg-primary/20 text-indigo-600 dark:text-primary">
                  <Play className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">LifeProof Product Demo Walkthrough</h3>
                  <p className="text-xs text-slate-500 dark:text-muted-foreground">Interactive overview of challenges, AI coach, and verified badges</p>
                </div>
              </div>
              <button
                onClick={() => setShowDemoModal(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-900 hover:bg-slate-100 dark:hover:text-white dark:hover:bg-white/10"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="aspect-video w-full rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 flex flex-col items-center justify-center p-8 text-center space-y-4 relative overflow-hidden">
              <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-white shadow-md">
                <Play className="h-7 w-7 ml-1 fill-current" />
              </div>
              <div className="space-y-1">
                <h4 className="text-lg font-bold text-slate-900 dark:text-white">Skill Verification in Under 3 Minutes</h4>
                <p className="text-xs text-slate-500 dark:text-muted-foreground max-w-md">
                  Watch how a developer solves a distributed lock challenge, receives instant AI architecture critique, and generates a tamper-proof certificate.
                </p>
              </div>
              <Link href="/challenges" onClick={() => setShowDemoModal(false)}>
                <Button variant="glow" size="sm" className="gap-2 font-bold shadow-sm">
                  <Code2 className="h-4 w-4" />
                  Try Live Challenge Now
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
