import { Skill } from "@/types";
import { ShieldCheck, Zap } from "lucide-react";
import { Badge } from "@/components/ui/Badge";

export function SkillRadar({ skills }: { skills: Skill[] }) {
  return (
    <div className="rounded-3xl border border-slate-200/90 dark:border-white/10 bg-white dark:bg-slate-950/60 backdrop-blur-xl p-6 space-y-6 shadow-sm text-left">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Skill Proficiency Matrix
          </h3>
          <p className="text-xs text-slate-500 dark:text-muted-foreground font-normal">
            Multi-vector engineering verification scores
          </p>
        </div>
        <Badge variant="purple" className="gap-1 text-xs font-bold">
          <Zap className="h-3 w-3 text-amber-500" />
          Verified Mastery
        </Badge>
      </div>

      {/* Breakdown list */}
      <div className="space-y-4">
        {skills.map((skill) => (
          <div key={skill.id} className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-800 dark:text-white">{skill.name}</span>
                {skill.verified && (
                  <ShieldCheck className="h-3.5 w-3.5 text-indigo-600 dark:text-cyan-400" />
                )}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-slate-500 dark:text-muted-foreground text-[11px] font-medium">
                  Top {skill.topPercentile}%
                </span>
                <span className="font-bold text-indigo-700 dark:text-indigo-400 font-mono">
                  {skill.level}%
                </span>
              </div>
            </div>

            {/* Custom Meter */}
            <div className="w-full bg-slate-100 dark:bg-white/5 rounded-full h-2 overflow-hidden border border-slate-200/60 dark:border-white/5">
              <div
                className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-indigo-600 to-sky-400 transition-all duration-700"
                style={{ width: `${skill.level}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
