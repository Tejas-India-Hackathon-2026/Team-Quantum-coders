import Link from "next/link";
import { ShieldCheck, Sparkles, CheckCircle2, Award, Dna } from "lucide-react";
import { APP_CONFIG } from "@/lib/constants";
import { Badge } from "@/components/ui/Badge";

export function AuthMarketingPanel() {
  const VALUE_POINTS = [
    {
      icon: ShieldCheck,
      title: "Verify your skills with real-world challenges",
      desc: "No multiple choice quizzes. Debug distributed locks, Next.js cache invalidation, and RAG pipelines.",
    },
    {
      icon: Award,
      title: "Build a trusted profile recruiters can believe in",
      desc: "Tamper-proof cryptographic hashes that prove your true ranking across global benchmarks.",
    },
    {
      icon: Dna,
      title: "Track your Skill DNA and career growth",
      desc: "Autonomous AI mentor feedback tailored to your individual knowledge gaps and dream engineering roles.",
    },
  ];

  return (
    <div className="hidden lg:flex flex-col justify-between p-10 lg:p-12 rounded-3xl border border-slate-200/90 dark:border-white/10 bg-gradient-to-br from-indigo-50/90 via-white to-purple-50/90 dark:from-slate-900/90 dark:via-indigo-950/40 dark:to-slate-950/90 shadow-sm relative overflow-hidden text-left">
      {/* Background Glow Blobs */}
      <div className="absolute -top-24 -left-24 w-80 h-80 bg-indigo-200/40 dark:bg-primary/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-purple-200/30 dark:bg-secondary/20 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header */}
      <div className="space-y-6 relative z-10">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-primary to-secondary p-0.5 shadow-xs">
            <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-white dark:bg-slate-950">
              <ShieldCheck className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-1">
              {APP_CONFIG.name}
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-indigo-500 animate-pulse" />
            </span>
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 dark:text-muted-foreground">
              Proof of Skill Protocol
            </span>
          </div>
        </Link>

        <div className="space-y-2">
          <Badge variant="cyan" className="gap-1 text-xs font-mono">
            <Sparkles className="h-3 w-3" />
            1M+ Engineers Verified
          </Badge>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
            Where Skills Meet Proof, and Talent Meets Opportunity.
          </h2>
          <p className="text-sm text-slate-600 dark:text-muted-foreground leading-relaxed font-normal">
            Turn your technical expertise into cryptographically verified credentials recognized by premier engineering teams worldwide.
          </p>
        </div>
      </div>

      {/* 3 Core Value Propositions */}
      <div className="space-y-5 my-8 relative z-10">
        {VALUE_POINTS.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div key={idx} className="flex items-start gap-4 p-3.5 rounded-2xl bg-white/80 dark:bg-white/5 border border-slate-200/80 dark:border-white/5 shadow-xs">
              <div className="p-2 rounded-xl bg-indigo-50 dark:bg-primary/10 border border-indigo-100 dark:border-primary/20 text-indigo-600 dark:text-primary shrink-0 mt-0.5 shadow-xs">
                <Icon className="h-5 w-5" />
              </div>
              <div className="space-y-0.5 text-left">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">{item.title}</h4>
                <p className="text-[11px] text-slate-500 dark:text-muted-foreground leading-relaxed font-normal">
                  {item.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Proof Card Mini Simulation */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-950/80 border border-slate-200/90 dark:border-white/10 relative z-10 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3 text-left">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-cyan-500 p-0.5">
            <div className="w-full h-full bg-white dark:bg-slate-950 rounded-[10px] flex items-center justify-center">
              <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            </div>
          </div>
          <div>
            <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              Verified Credential Seal
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono font-bold">100% Audit</span>
            </div>
            <div className="text-[10px] text-slate-400 dark:text-muted-foreground font-mono">
              Proof Hash: 0x9d4a...77f1
            </div>
          </div>
        </div>
        <Badge variant="purple" className="text-[10px]">
          Grandmaster IV
        </Badge>
      </div>
    </div>
  );
}
