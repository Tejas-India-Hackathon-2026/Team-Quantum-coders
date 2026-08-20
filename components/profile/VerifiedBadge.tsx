import { ShieldCheck, Check, QrCode, Lock } from "lucide-react";
import { Badge } from "@/components/ui/Badge";

interface VerifiedBadgeProps {
  badgeId: string;
  recipientName: string;
  verifiedSince: string;
  rank: string;
}

export function VerifiedBadge({
  badgeId,
  recipientName,
  verifiedSince,
  rank,
}: VerifiedBadgeProps) {
  return (
    <div className="relative rounded-3xl border border-indigo-200/90 dark:border-indigo-500/30 bg-gradient-to-br from-indigo-50/90 via-white to-purple-50/90 dark:from-indigo-950/70 dark:via-slate-950/80 dark:to-purple-950/70 p-6 shadow-sm backdrop-blur-xl overflow-hidden group text-left">
      {/* Hologram Light Reflection Effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 dark:via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out pointer-events-none" />

      <div className="space-y-6">
        {/* Top Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-2xl bg-indigo-100 dark:bg-primary/20 text-indigo-700 dark:text-primary border border-indigo-200 dark:border-primary/30 shadow-xs">
              <ShieldCheck className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
              <span className="text-xs uppercase font-mono tracking-widest text-indigo-700 dark:text-indigo-300 font-bold block">
                LifeProof Protocol
              </span>
              <span className="text-[10px] text-slate-500 dark:text-muted-foreground font-mono">
                Official Skill Proof Certificate
              </span>
            </div>
          </div>
          <Badge variant="cyan" className="gap-1 font-mono text-[10px]">
            <Lock className="h-2.5 w-2.5" /> Immutable
          </Badge>
        </div>

        {/* Certificate Body */}
        <div className="space-y-2 py-2 border-y border-slate-200/80 dark:border-white/10">
          <p className="text-xs text-slate-500 dark:text-muted-foreground font-medium">Certified Engineer</p>
          <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
            {recipientName}
          </h3>
          <p className="text-xs text-indigo-700 dark:text-indigo-300 font-semibold">
            Standing: <span className="text-slate-900 dark:text-white font-bold">{rank}</span> · Verified Since {verifiedSince}
          </p>
        </div>

        {/* Cryptographic Proof Hash & QR */}
        <div className="flex items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[10px] font-mono text-slate-400 dark:text-muted-foreground uppercase font-bold">
              Proof Hash ID
            </span>
            <div className="font-mono text-xs text-indigo-700 dark:text-cyan-400 font-bold truncate max-w-[200px]">
              {badgeId}
            </div>
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-semibold">
              <Check className="h-3 w-3" /> Consensus Verified (100% Audit Score)
            </span>
          </div>

          <div className="p-2 rounded-2xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-muted-foreground flex items-center justify-center shrink-0 shadow-xs">
            <QrCode className="h-8 w-8 text-indigo-600 dark:text-indigo-300" />
          </div>
        </div>
      </div>
    </div>
  );
}
