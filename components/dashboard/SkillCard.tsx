"use client";

import * as React from "react";
import { ShieldCheck, ArrowRight, Layers, Code2, Database, Cpu, Cloud, Network, Shield, Zap, Play } from "lucide-react";
import { Skill } from "@/types";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

const ICONS: Record<string, React.ElementType> = {
  Layers,
  Code2,
  Database,
  Cpu,
  Cloud,
  Network,
};

interface SkillCardProps {
  skill: Skill;
  onClick?: () => void;
  onVerifyCheck?: (skill: Skill) => void;
}

export function SkillCard({ skill, onClick, onVerifyCheck }: SkillCardProps) {
  const IconComponent = ICONS[skill.iconName] || Shield;

  return (
    <Card
      onClick={onClick}
      className="hover:border-indigo-300 dark:hover:border-primary/50 transition-all duration-300 group cursor-pointer active:scale-[0.99] text-left bg-white dark:bg-slate-950/60 border-slate-200/90 dark:border-white/10 shadow-xs hover:shadow-md flex flex-col justify-between"
    >
      <CardHeader className="space-y-4 p-5 sm:p-6">
        {/* Header with icon & badge */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-indigo-50 dark:bg-primary/10 border border-indigo-100 dark:border-primary/20 text-indigo-600 dark:text-primary group-hover:scale-105 transition-transform shadow-xs">
              <IconComponent className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-base font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-primary transition-colors">
                {skill.name}
              </CardTitle>
              <p className="text-xs text-slate-500 dark:text-muted-foreground font-medium">{skill.category}</p>
            </div>
          </div>
          {skill.verified ? (
            <Badge variant="cyan" className="gap-1 text-[11px] font-bold">
              <ShieldCheck className="h-3 w-3 text-indigo-600 dark:text-cyan-400" />
              Verified
            </Badge>
          ) : (
            <Badge variant="outline" className="text-[11px] text-slate-500 font-medium">
              Unverified
            </Badge>
          )}
        </div>

        {/* Level & Mastery Bar */}
        <div className="space-y-2 pt-2">
          <div className="flex justify-between text-xs font-medium">
            <span className="text-slate-500 dark:text-muted-foreground">Proficiency Score</span>
            <span className="font-bold text-slate-800 dark:text-white">
              {skill.level} / 100 · <span className="text-indigo-600 dark:text-cyan-400">Top {skill.topPercentile}%</span>
            </span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-white/5 rounded-full h-2 overflow-hidden border border-slate-200/60 dark:border-white/5">
            <div
              className="bg-gradient-to-r from-indigo-500 via-indigo-600 to-sky-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${skill.level}%` }}
            />
          </div>
        </div>

        {/* Challenges count & CTA */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-white/10 text-xs">
          <span className="text-slate-500 dark:text-muted-foreground text-[11px] font-medium">
            {skill.challengesCompleted} of {skill.totalChallenges} challenges passed
          </span>
          <div className="flex items-center gap-1.5">
            {onVerifyCheck && !skill.verified && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onVerifyCheck(skill);
                }}
                className="px-2 py-1 rounded-lg bg-indigo-50 dark:bg-primary/20 text-indigo-700 dark:text-primary text-[10px] font-bold hover:bg-indigo-100 transition-colors flex items-center gap-1 cursor-pointer"
              >
                <Zap className="h-3 w-3 text-amber-500" />
                Check
              </button>
            )}
            <span className="text-xs font-bold text-indigo-600 group-hover:text-indigo-700 dark:text-primary flex items-center gap-1">
              Details <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
            </span>
          </div>
        </div>
      </CardHeader>
    </Card>
  );
}
