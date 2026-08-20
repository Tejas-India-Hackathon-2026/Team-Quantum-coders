import Link from "next/link";
import { ShieldCheck, Sparkles, CheckCircle2, Cpu, Award, Dna, ArrowRight } from "lucide-react";
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
    <div className="hidden lg:flex flex-col justify-between p-10 lg:p-12 rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900/90 via-indigo-950/40 to-slate-950/90 shadow-2xl relative overflow-hidden">
      {/* Background Glow Blobs */}
      <div className="absolute -top-24 -left-24 w-80 h-80 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-secondary/20 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header */}
      <div className="space-y-6 relative z-10">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-primary to-secondary p-0.5 shadow-glow">
            <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-slate-950">
              <ShieldCheck className="h-5 w-5 text-indigo-400" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold tracking-tight text-white flex items-center gap-1">
              {APP_CONFIG.name}
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse" />
            </span>
            <span className="text-[10px] uppercase font-semibold tracking-wider text-muted-foreground">
              Proof of Skill Protocol
            </span>
          </div>
        </Link>

        <div className="space-y-2">
          <Badge variant="cyan" className="gap-1 text-xs font-mono">
            <Sparkles className="h-3 w-3" />
            1M+ Engineers Verified
          </Badge>
          <h2 className="text-3xl font-extrabold text-white tracking-tight leading-tight">
            Where Skills Meet Proof, and Talent Meets Opportunity.
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Turn your technical expertise into cryptographically verified credentials recognized by premier engineering teams worldwide.
          </p>
        </div>
      </div>

      {/* 3 Core Value Propositions */}
      <div className="space-y-5 my-8 relative z-10">
        {VALUE_POINTS.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div key={idx} className="flex items-start gap-4 p-3.5 rounded-2xl bg-white/5 border border-white/5 backdrop-blur-md">
              <div className="p-2 rounded-xl bg-primary/10 border border-primary/20 text-primary shrink-0 mt-0.5">
                <Icon className="h-5 w-5" />
              </div>
              <div className="space-y-0.5">
                <h4 className="text-xs font-bold text-white">{item.title}</h4>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Proof Card Mini Simulation */}
      <div className="p-4 rounded-2xl bg-slate-950/80 border border-white/10 relative z-10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-cyan-500 p-0.5">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <CheckCircle2 className="h-5 w-5 text-emerald-400" />
            </div>
          </div>
          <div>
            <div className="text-xs font-bold text-white flex items-center gap-1.5">
              Verified Credential Seal
              <span className="text-[10px] text-emerald-400 font-mono">100% Audit</span>
            </div>
            <div className="text-[10px] text-muted-foreground font-mono">
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
