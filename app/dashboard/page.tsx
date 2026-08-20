"use client";

import * as React from "react";
import Link from "next/link";
import { Sidebar } from "@/components/layout/Sidebar";
import { SkillCard } from "@/components/dashboard/SkillCard";
import { ProgressChart } from "@/components/dashboard/ProgressChart";
import { RecentChallengeCard } from "@/components/dashboard/RecentChallengeCard";
import { AchievementCard } from "@/components/dashboard/AchievementCard";
import { MOCK_CHALLENGES } from "@/data/mockChallenges";
import { STARTER_USER } from "@/data/mockAchievements";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Sparkles, Code2, ArrowRight, ShieldCheck, Flame, Trophy, UserCheck, RefreshCw } from "lucide-react";

export default function DashboardPage() {
  const { user, loadDemoGrandmasterProfile, signup } = useAuth();
  const currentUser = user || STARTER_USER;
  const isNewUser = (currentUser.totalXp ?? 0) === 0;

  return (
    <div className="flex-1 flex min-h-[calc(100vh-4rem)]">
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8 overflow-y-auto text-left">
        {/* Welcome Banner */}
        <div className="relative rounded-3xl border border-white/10 bg-gradient-to-r from-indigo-950/60 via-slate-900/80 to-purple-950/60 p-6 sm:p-8 backdrop-blur-xl shadow-xl overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/15 rounded-full blur-3xl pointer-events-none -z-10" />

          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge variant={isNewUser ? "cyan" : "purple"} className="gap-1 text-xs font-mono">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  {currentUser.rank}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  Earned XP: <span className="text-amber-400 font-bold font-mono">+{currentUser.totalXp} XP</span>
                </span>
              </div>

              <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                Welcome, {currentUser.fullName} 👋
              </h1>

              <p className="text-sm text-muted-foreground max-w-xl leading-relaxed">
                {isNewUser ? (
                  <>
                    You are starting your verified skill journey on LifeProof. Complete your first engineering challenge to mint your immutable proof badge!
                  </>
                ) : (
                  <>
                    You are in the <span className="text-cyan-400 font-semibold">top {currentUser.globalPercentile}%</span> of global engineers. Keep up the streak to level up your Skill DNA!
                  </>
                )}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
              {isNewUser && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={loadDemoGrandmasterProfile}
                  className="w-full sm:w-auto text-xs gap-1.5 border-indigo-500/30 text-indigo-300 hover:bg-indigo-500/10"
                >
                  <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
                  Preview Grandmaster Profile
                </Button>
              )}
              <Link href="/challenges" className="w-full sm:w-auto">
                <Button variant="glow" size="lg" className="w-full gap-2 font-bold shadow-glow">
                  <Sparkles className="h-4 w-4" />
                  {isNewUser ? "Start 1st Challenge" : "Take Assessment"}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Progress Metrics & Weekly Chart */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Flame className="h-5 w-5 text-amber-400" />
              Activity & Verification Velocity
            </h2>
          </div>
          <ProgressChart />
        </div>

        {/* Skills Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-indigo-400" />
                Claimed & Verified Skills
              </h2>
              <p className="text-xs text-muted-foreground">
                6 core engineering vectors tracked by AI assessment engine
              </p>
            </div>
            <Link href="/challenges">
              <Button variant="ghost" size="sm" className="text-xs text-primary gap-1">
                Explore Challenges <ArrowRight className="h-3 w-3" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {currentUser.skills.map((skill) => (
              <SkillCard key={skill.id} skill={skill} />
            ))}
          </div>
        </div>

        {/* Recent Challenges & Achievements Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Challenges column */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Code2 className="h-5 w-5 text-cyan-400" />
                Active Challenges
              </h2>
              <Link href="/challenges" className="text-xs text-primary hover:underline">
                View all ({MOCK_CHALLENGES.length})
              </Link>
            </div>

            <div className="space-y-3">
              {MOCK_CHALLENGES.slice(0, 3).map((challenge) => (
                <RecentChallengeCard key={challenge.id} challenge={challenge} />
              ))}
            </div>
          </div>

          {/* Achievements column */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Trophy className="h-5 w-5 text-amber-400" />
                Unlocked Proof Trophies
              </h2>
              <Link href="/profile" className="text-xs text-primary hover:underline">
                View Proofs
              </Link>
            </div>

            <div className="space-y-3">
              {currentUser.achievements.length === 0 ? (
                <div className="p-8 rounded-2xl border border-white/10 bg-slate-950/40 text-center space-y-2">
                  <Trophy className="h-8 w-8 text-muted-foreground mx-auto opacity-40" />
                  <h4 className="text-sm font-semibold text-white">No Trophies Unlocked Yet</h4>
                  <p className="text-xs text-muted-foreground max-w-xs mx-auto">
                    Pass any challenge in the sandbox to earn your first cryptographic proof badge.
                  </p>
                </div>
              ) : (
                currentUser.achievements.slice(0, 3).map((achievement) => (
                  <AchievementCard key={achievement.id} achievement={achievement} />
                ))
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
