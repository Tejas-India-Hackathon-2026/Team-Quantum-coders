import { TrendingUp, Flame, CheckCircle2, Award } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";

export function ProgressChart() {
  const WEEKLY_DATA = [
    { day: "Mon", challenges: 3, xp: 450, height: "60%" },
    { day: "Tue", challenges: 5, xp: 750, height: "90%" },
    { day: "Wed", challenges: 2, xp: 300, height: "45%" },
    { day: "Thu", challenges: 4, xp: 600, height: "75%" },
    { day: "Fri", challenges: 6, xp: 950, height: "100%" },
    { day: "Sat", challenges: 1, xp: 150, height: "30%" },
    { day: "Sun", challenges: 3, xp: 450, height: "55%" },
  ];

  return (
    <Card className="border-white/10 bg-slate-950/40">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="text-base font-bold text-white flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-emerald-400" />
              Weekly Verification Velocity
            </CardTitle>
            <p className="text-xs text-muted-foreground">
              3,650 XP earned across 24 verified challenge runs this week
            </p>
          </div>
          <div className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            +32% vs last week
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6 pt-4">
        {/* Weekly Bar Graph Representation */}
        <div className="flex items-end justify-between h-40 gap-2 pt-6 px-2">
          {WEEKLY_DATA.map((item, idx) => (
            <div key={idx} className="flex flex-col items-center gap-2 flex-1 group">
              <div className="text-[10px] text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity font-semibold">
                {item.xp} XP
              </div>
              <div className="w-full bg-white/5 rounded-t-lg h-32 flex items-end p-1">
                <div
                  className="w-full bg-gradient-to-t from-primary/60 via-primary to-cyan-400 rounded-t-md transition-all duration-500 group-hover:brightness-125"
                  style={{ height: item.height }}
                />
              </div>
              <span className="text-xs text-muted-foreground font-medium group-hover:text-white transition-colors">
                {item.day}
              </span>
            </div>
          ))}
        </div>

        {/* Quick summary strip */}
        <div className="grid grid-cols-3 gap-3 pt-2 border-t border-white/10 text-center">
          <div className="p-2.5 rounded-lg bg-white/5">
            <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground mb-0.5">
              <Flame className="h-3.5 w-3.5 text-amber-400" />
              Streak
            </div>
            <div className="text-sm font-bold text-white">14 Days Active</div>
          </div>

          <div className="p-2.5 rounded-lg bg-white/5">
            <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground mb-0.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
              Success Rate
            </div>
            <div className="text-sm font-bold text-white">94.2% Pass</div>
          </div>

          <div className="p-2.5 rounded-lg bg-white/5">
            <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground mb-0.5">
              <Award className="h-3.5 w-3.5 text-purple-400" />
              Global Rank
            </div>
            <div className="text-sm font-bold text-white">#142</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
