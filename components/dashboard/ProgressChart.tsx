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
    <Card className="border-slate-200/90 dark:border-white/10 bg-white dark:bg-slate-950/40 shadow-sm text-left">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              Weekly Verification Velocity
            </CardTitle>
            <p className="text-xs text-slate-500 dark:text-muted-foreground font-normal">
              3,650 XP earned across 24 verified challenge runs this week
            </p>
          </div>
          <div className="flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20">
            +32% vs last week
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6 pt-4">
        {/* Weekly Bar Graph Representation */}
        <div className="flex items-end justify-between h-40 gap-2 pt-6 px-2">
          {WEEKLY_DATA.map((item, idx) => (
            <div key={idx} className="flex flex-col items-center gap-2 flex-1 group">
              <div className="text-[10px] text-slate-500 dark:text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity font-bold">
                {item.xp} XP
              </div>
              <div className="w-full bg-slate-100 dark:bg-white/5 rounded-t-lg h-32 flex items-end p-1">
                <div
                  className="w-full bg-gradient-to-t from-indigo-500 via-indigo-600 to-sky-400 rounded-t-md transition-all duration-500 group-hover:brightness-110 shadow-xs"
                  style={{ height: item.height }}
                />
              </div>
              <span className="text-xs text-slate-500 dark:text-muted-foreground font-semibold group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                {item.day}
              </span>
            </div>
          ))}
        </div>

        {/* Quick summary strip */}
        <div className="grid grid-cols-3 gap-3 pt-2 border-t border-slate-100 dark:border-white/10 text-center">
          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200/60 dark:border-transparent">
            <div className="flex items-center justify-center gap-1.5 text-xs text-slate-500 dark:text-muted-foreground mb-0.5 font-medium">
              <Flame className="h-3.5 w-3.5 text-amber-500" />
              Streak
            </div>
            <div className="text-sm font-bold text-slate-900 dark:text-white">14 Days Active</div>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200/60 dark:border-transparent">
            <div className="flex items-center justify-center gap-1.5 text-xs text-slate-500 dark:text-muted-foreground mb-0.5 font-medium">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
              Success Rate
            </div>
            <div className="text-sm font-bold text-slate-900 dark:text-white">94.2% Pass</div>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200/60 dark:border-transparent">
            <div className="flex items-center justify-center gap-1.5 text-xs text-slate-500 dark:text-muted-foreground mb-0.5 font-medium">
              <Award className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400" />
              Global Rank
            </div>
            <div className="text-sm font-bold text-slate-900 dark:text-white">#142</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
