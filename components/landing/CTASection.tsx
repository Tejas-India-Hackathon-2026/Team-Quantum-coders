"use client";

import Link from "next/link";
import { Sparkles, ArrowRight, ShieldCheck, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function CTASection() {
  return (
    <section className="py-24 relative overflow-hidden text-center">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl p-8 sm:p-16 overflow-hidden border border-indigo-200/80 dark:border-white/20 bg-gradient-to-br from-indigo-50/90 via-white to-sky-50/90 dark:from-indigo-950/90 dark:via-slate-900/95 dark:to-slate-950/95 text-center shadow-lg backdrop-blur-2xl">
          {/* Glowing background ambient spheres */}
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-200/40 dark:bg-primary/30 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-sky-200/40 dark:bg-secondary/30 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-100 dark:bg-primary/20 text-indigo-700 dark:text-primary border border-indigo-200 dark:border-primary/30 text-xs font-bold">
              <ShieldCheck className="h-4 w-4" />
              Verified Developer Network
            </div>

            {/* Requested Headline */}
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.15]">
              Ready to Prove Your <br />
              <span className="text-gradient">Skills?</span>
            </h2>

            <p className="text-slate-600 dark:text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto leading-relaxed font-normal">
              Join over 1,000,000 developers building tamper-proof proof of work, receiving instant AI architectural feedback, and unlocking direct hiring fast-tracks.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link href="/signup" className="w-full sm:w-auto">
                <Button variant="glow" size="lg" className="w-full sm:w-auto gap-2 px-8 h-12 text-base font-bold shadow-sm">
                  <Sparkles className="h-4 w-4" />
                  Get Started Free
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/challenges" className="w-full sm:w-auto">
                <Button variant="outline" size="lg" className="w-full sm:w-auto px-8 h-12 text-base border-slate-200 dark:border-white/15 bg-white/80 dark:bg-white/5 hover:bg-slate-50 dark:hover:bg-white/10 text-slate-700 dark:text-white font-semibold">
                  Explore Challenge Catalog
                </Button>
              </Link>
            </div>

            {/* Requested Small Text */}
            <div className="pt-3 flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs text-slate-500 dark:text-muted-foreground font-medium">
              <span className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                No credit card required
              </span>
              <span className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                Instant sandbox setup
              </span>
              <span className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                Free forever starter tier
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
