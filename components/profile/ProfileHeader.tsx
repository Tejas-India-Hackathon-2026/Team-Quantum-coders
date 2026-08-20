import { ShieldCheck, Share2, Download, Award, Flame, CheckCircle2, Globe } from "lucide-react";
import { UserProfile } from "@/types";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { truncateHash } from "@/lib/utils";

export function ProfileHeader({ user }: { user: UserProfile }) {
  return (
    <div className="relative rounded-3xl border border-slate-200/90 dark:border-white/10 bg-white dark:bg-slate-950/60 backdrop-blur-xl p-6 sm:p-8 overflow-hidden space-y-6 shadow-sm text-left">
      {/* Background ambient accent */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-100/60 dark:bg-primary/10 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Profile info top row */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
          {/* Avatar with verified ring */}
          <div className="relative">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl overflow-hidden ring-2 ring-indigo-200 dark:ring-primary/40 shadow-xs">
              <img
                src={user.avatarUrl}
                alt={user.fullName}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-1 -right-1 p-1.5 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/20 shadow-xs">
              <ShieldCheck className="h-4 w-4 text-indigo-600 dark:text-cyan-400" />
            </div>
          </div>

          {/* Name, Handle, Title */}
          <div className="space-y-1 text-left">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                {user.fullName}
              </h1>
              <Badge variant="cyan" className="gap-1 font-mono text-[11px]">
                <ShieldCheck className="h-3 w-3" />
                Verified Dev
              </Badge>
              <Badge variant="purple" className="text-[11px]">
                {user.rank}
              </Badge>
            </div>
            <p className="text-sm text-indigo-700 dark:text-indigo-400 font-bold">@{user.username} · {user.title}</p>
            <p className="text-xs text-slate-600 dark:text-muted-foreground max-w-xl leading-relaxed pt-1 font-normal">
              {user.bio}
            </p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2.5 w-full md:w-auto">
          <Button variant="outline" size="sm" className="gap-1.5 text-xs flex-1 md:flex-none font-semibold border-slate-200 dark:border-white/10 hover:bg-slate-50">
            <Share2 className="h-3.5 w-3.5" />
            Share Proof URL
          </Button>
          <Button variant="glow" size="sm" className="gap-1.5 text-xs flex-1 md:flex-none font-bold shadow-xs">
            <Download className="h-3.5 w-3.5" />
            Export Certificate
          </Button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-100 dark:border-white/10">
        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/80 dark:border-white/5 space-y-1">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-muted-foreground font-medium">
            <Award className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400" />
            Global Standing
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            Top {100 - user.globalPercentile}%
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/80 dark:border-white/5 space-y-1">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-muted-foreground font-medium">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
            Verified Challenges
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {user.completedChallengesCount} Solved
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/80 dark:border-white/5 space-y-1">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-muted-foreground font-medium">
            <Flame className="h-3.5 w-3.5 text-amber-500" />
            Total Earned XP
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {user.totalXp.toLocaleString()} XP
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/80 dark:border-white/5 space-y-1">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-muted-foreground font-medium">
            <Globe className="h-3.5 w-3.5 text-indigo-600 dark:text-cyan-400" />
            Proof Badge Hash
          </div>
          <div className="text-xs font-mono font-bold text-indigo-700 dark:text-cyan-400 truncate">
            {truncateHash(user.proofBadgeId, 4)}
          </div>
        </div>
      </div>
    </div>
  );
}
