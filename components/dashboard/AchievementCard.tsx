import { Trophy, ShieldCheck, Zap, Flame, Award } from "lucide-react";
import { Achievement } from "@/types";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { formatDate } from "@/lib/utils";

const ICONS: Record<string, React.ElementType> = {
  ShieldCheck,
  Zap,
  Flame,
  Award,
  Trophy,
};

export function AchievementCard({ achievement }: { achievement: Achievement }) {
  const IconComponent = ICONS[achievement.icon] || Trophy;

  return (
    <Card className="hover:border-primary/40 transition-all duration-200 group">
      <CardHeader className="p-4 sm:p-5 space-y-3">
        <div className="flex items-start gap-3">
          <div
            className={`p-3 rounded-xl border flex items-center justify-center ${
              achievement.rarity === "Legendary"
                ? "bg-amber-500/10 border-amber-500/30 text-amber-400 shadow-glow-purple/20"
                : achievement.rarity === "Epic"
                ? "bg-purple-500/10 border-purple-500/30 text-purple-400"
                : "bg-blue-500/10 border-blue-500/30 text-blue-400"
            }`}
          >
            <IconComponent className="h-5 w-5" />
          </div>

          <div className="space-y-1 flex-1">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-bold text-white group-hover:text-primary transition-colors">
                {achievement.title}
              </CardTitle>
              <Badge
                variant={
                  achievement.rarity === "Legendary"
                    ? "warning"
                    : achievement.rarity === "Epic"
                    ? "purple"
                    : "cyan"
                }
                className="text-[10px]"
              >
                {achievement.rarity}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {achievement.description}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-white/10 text-[11px] text-muted-foreground font-mono">
          <span>Unlocked {formatDate(achievement.unlockedAt)}</span>
          <span className="text-indigo-400">Proof: {achievement.proofHash}</span>
        </div>
      </CardHeader>
    </Card>
  );
}
