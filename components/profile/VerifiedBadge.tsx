import { ShieldCheck, Sparkles, Check, QrCode, Lock } from "lucide-react";
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
    <div className="relative rounded-2xl border border-indigo-500/30 bg-gradient-to-br from-indigo-950/70 via-slate-950/80 to-purple-950/70 p-6 shadow-2xl backdrop-blur-xl overflow-hidden group">
      {/* Hologram Light Reflection Effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out pointer-events-none" />

      <div className="space-y-6">
        {/* Top Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-primary/20 text-primary border border-primary/30">
              <ShieldCheck className="h-5 w-5 text-indigo-400" />
            </div>
            <div>
              <span className="text-xs uppercase font-mono tracking-widest text-indigo-300 font-bold block">
                LifeProof Protocol
              </span>
              <span className="text-[10px] text-muted-foreground font-mono">
                Official Skill Proof Certificate
              </span>
            </div>
          </div>
          <Badge variant="cyan" className="gap-1 font-mono text-[10px]">
            <Lock className="h-2.5 w-2.5" /> Immutable
          </Badge>
        </div>

        {/* Certificate Body */}
        <div className="space-y-2 py-2 border-y border-white/10">
          <p className="text-xs text-muted-foreground">Certified Engineer</p>
          <h3 className="text-xl font-extrabold text-white tracking-tight">
            {recipientName}
          </h3>
          <p className="text-xs text-indigo-300 font-medium">
            Standing: <span className="text-white font-bold">{rank}</span> · Verified Since {verifiedSince}
          </p>
        </div>

        {/* Cryptographic Proof Hash & QR */}
        <div className="flex items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[10px] font-mono text-muted-foreground uppercase">
              Proof Hash ID
            </span>
            <div className="font-mono text-xs text-cyan-400 font-semibold truncate max-w-[200px]">
              {badgeId}
            </div>
            <span className="text-[10px] text-emerald-400 flex items-center gap-1 font-medium">
              <Check className="h-3 w-3" /> Consensus Verified (100% Audit Score)
            </span>
          </div>

          <div className="p-2 rounded-xl bg-white/5 border border-white/10 text-muted-foreground flex items-center justify-center shrink-0">
            <QrCode className="h-8 w-8 text-indigo-300" />
          </div>
        </div>
      </div>
    </div>
  );
}
