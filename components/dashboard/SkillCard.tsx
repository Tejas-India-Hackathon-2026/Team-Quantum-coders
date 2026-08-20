"use client";

import * as React from "react";
import { ShieldCheck, ArrowRight, Layers, Code2, Database, Cpu, Cloud, Network, Shield } from "lucide-react";
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
}

export function SkillCard({ skill, onClick }: SkillCardProps) {
  const IconComponent = ICONS[skill.iconName] || Shield;

  return (
    <Card
      onClick={onClick}
      className="hover:border-primary/50 transition-all duration-300 group cursor-pointer active:scale-[0.99] text-left"
    >
      <CardHeader className="space-y-4">
        {/* Header with icon & badge */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-primary/10 border border-primary/20 text-primary group-hover:scale-105 transition-transform">
              <IconComponent className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-base font-bold text-white group-hover:text-primary transition-colors">
                {skill.name}
              </CardTitle>
              <p className="text-xs text-muted-foreground">{skill.category}</p>
            </div>
          </div>
          {skill.verified ? (
            <Badge variant="cyan" className="gap-1 text-[11px]">
              <ShieldCheck className="h-3 w-3 text-cyan-400" />
              Verified
            </Badge>
          ) : (
            <Badge variant="outline" className="text-[11px] text-muted-foreground">
              Unverified
            </Badge>
          )}
        </div>

        {/* Level & Mastery Bar */}
        <div className="space-y-2 pt-2">
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Proficiency Score</span>
            <span className="font-semibold text-white">
              {skill.level} / 100 · <span className="text-cyan-400">Top {skill.topPercentile}%</span>
            </span>
          </div>
          <div className="w-full bg-white/5 rounded-full h-2 overflow-hidden">
            <div
              className="bg-gradient-to-r from-primary to-cyan-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${skill.level}%` }}
            />
          </div>
        </div>

        {/* Challenges count & CTA */}
        <div className="flex items-center justify-between pt-2 border-t border-white/10 text-xs">
          <span className="text-muted-foreground">
            {skill.challengesCompleted} of {skill.totalChallenges} challenges passed
          </span>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 px-2 text-xs gap-1 text-primary group-hover:text-white group-hover:bg-primary/20"
          >
            Train <ArrowRight className="h-3 w-3" />
          </Button>
        </div>
      </CardHeader>
    </Card>
  );
}
