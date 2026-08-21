"use client";

import * as React from "react";
import Link from "next/link";
import { Sidebar } from "@/components/layout/Sidebar";
import { SkillCard } from "@/components/dashboard/SkillCard";
import { ProgressChart } from "@/components/dashboard/ProgressChart";
import { RecentChallengeCard } from "@/components/dashboard/RecentChallengeCard";
import { AchievementCard } from "@/components/dashboard/AchievementCard";
import { SkillDetailModal } from "@/components/dashboard/SkillDetailModal";
import { AddSkillModal } from "@/components/dashboard/AddSkillModal";
import { SkillCheckModal } from "@/components/dashboard/SkillCheckModal";
import { ChallengeSandboxModal } from "@/components/challenges/ChallengeSandboxModal";
import { MOCK_CHALLENGES } from "@/data/mockChallenges";
import { STARTER_USER } from "@/data/mockAchievements";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Sparkles, Code2, ArrowRight, ShieldCheck, Flame, Trophy, Plus } from "lucide-react";
import { Skill, Challenge } from "@/types";

export default function DashboardPage() {
  const { user, loadDemoGrandmasterProfile } = useAuth();
  const currentUser = user || STARTER_USER;
  const isNewUser = (currentUser.totalXp ?? 0) === 0;

  // Modals state
  const [selectedSkill, setSelectedSkill] = React.useState<Skill | null>(null);
  const [sandboxChallenge, setSandboxChallenge] = React.useState<Challenge | null>(null);
  const [showAddSkillModal, setShowAddSkillModal] = React.useState(false);
  const [checkingSkill, setCheckingSkill] = React.useState<Skill | null>(null);

  return (
    <div className="flex-1 flex min-h-[calc(100vh-4rem)]">
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8 overflow-y-auto text-left">
        {/* Welcome Banner */}
        <div className="relative rounded-3xl border border-slate-200/90 dark:border-white/10 bg-gradient-to-r from-indigo-50/90 via-white to-purple-50/90 dark:from-indigo-950/60 dark:via-slate-900/80 dark:to-purple-950/60 p-6 sm:p-8 backdrop-blur-xl shadow-sm overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-200/40 dark:bg-primary/15 rounded-full blur-3xl pointer-events-none -z-10" />

          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge variant={isNewUser ? "cyan" : "purple"} className="gap-1 text-xs font-mono">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  {currentUser.rank}
                </Badge>
                <span className="text-xs text-slate-500 dark:text-muted-foreground font-medium">
                  Earned XP: <span className="text-amber-600 dark:text-amber-400 font-bold font-mono">+{currentUser.totalXp} XP</span>
                </span>
              </div>

              <h1 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                Welcome, {currentUser.fullName} 👋
              </h1>

              <p className="text-sm text-slate-600 dark:text-muted-foreground max-w-xl leading-relaxed font-normal">
                {isNewUser ? (
                  <>
                    You are starting your verified skill journey on LifeProof. Add custom skills to your DNA, inspect competencies, or take an automated verification drill to mint your immutable proof badge!
                  </>
                ) : (
                  <>
                    You are in the <span className="text-indigo-600 dark:text-cyan-400 font-bold">top {currentUser.globalPercentile}%</span> of global engineers. Keep up the streak to level up your Skill DNA!
                  </>
                )}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAddSkillModal(true)}
                className="w-full sm:w-auto text-xs gap-1.5 border-slate-200 dark:border-indigo-500/30 text-slate-700 dark:text-indigo-300 hover:bg-slate-100 dark:hover:bg-indigo-500/10 cursor-pointer font-semibold"
              >
                <Plus className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
                Add Custom Skill
              </Button>
              {isNewUser && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={loadDemoGrandmasterProfile}
                  className="w-full sm:w-auto text-xs gap-1.5 border-slate-200 dark:border-indigo-500/30 text-slate-700 dark:text-indigo-300 hover:bg-slate-100 dark:hover:bg-indigo-500/10 cursor-pointer font-semibold"
                >
                  <Sparkles className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
                  Demo Grandmaster
                </Button>
              )}
              <Button
                variant="glow"
                size="lg"
                onClick={() => setSandboxChallenge(MOCK_CHALLENGES[0])}
                className="w-full sm:w-auto gap-2 font-bold shadow-sm cursor-pointer"
              >
                <Sparkles className="h-4 w-4" />
                {isNewUser ? "Start 1st Challenge Sandbox" : "Quick Concurrency Drill"}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Progress Metrics & Weekly Chart */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Flame className="h-5 w-5 text-amber-500" />
              Activity & Verification Velocity
            </h2>
          </div>
          <ProgressChart />
        </div>

        {/* Skills Grid */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                Claimed & Verified Skills ({currentUser.skills.length})
              </h2>
              <p className="text-xs text-slate-500 dark:text-muted-foreground">
                Add custom competencies or click &quot;Check&quot; to run an automated AST verification audit
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="glow"
                size="sm"
                onClick={() => setShowAddSkillModal(true)}
                className="text-xs gap-1.5 font-bold shadow-xs cursor-pointer"
              >
                <Plus className="h-3.5 w-3.5" />
                Add Skill
              </Button>
              <Link href="/challenges">
                <Button variant="outline" size="sm" className="text-xs text-indigo-600 dark:text-primary gap-1 font-bold">
                  Explore Marketplace <ArrowRight className="h-3 w-3" />
                </Button>
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {currentUser.skills.map((skill) => (
              <SkillCard
                key={skill.id}
                skill={skill}
                onClick={() => setSelectedSkill(skill)}
                onVerifyCheck={(sk) => setCheckingSkill(sk)}
              />
            ))}
          </div>
        </div>

        {/* Recent Challenges & Achievements Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Challenges column */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Code2 className="h-5 w-5 text-indigo-600 dark:text-cyan-400" />
                Active Challenges
              </h2>
              <Link href="/challenges" className="text-xs text-indigo-600 dark:text-primary hover:underline font-bold">
                View all ({MOCK_CHALLENGES.length})
              </Link>
            </div>

            <div className="space-y-3">
              {MOCK_CHALLENGES.slice(0, 3).map((challenge) => (
                <div
                  key={challenge.id}
                  onClick={() => setSandboxChallenge(challenge)}
                  className="cursor-pointer"
                >
                  <RecentChallengeCard challenge={challenge} />
                </div>
              ))}
            </div>
          </div>

          {/* Achievements column */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Trophy className="h-5 w-5 text-amber-500" />
                Unlocked Proof Trophies
              </h2>
              <Link href="/profile" className="text-xs text-indigo-600 dark:text-primary hover:underline font-bold">
                View Proofs
              </Link>
            </div>

            <div className="space-y-3">
              {currentUser.achievements.length === 0 ? (
                <div className="p-8 rounded-3xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-950/40 text-center space-y-2 shadow-xs">
                  <Trophy className="h-8 w-8 text-slate-400 dark:text-muted-foreground mx-auto opacity-60" />
                  <h4 className="text-sm font-bold text-slate-800 dark:text-white">No Trophies Unlocked Yet</h4>
                  <p className="text-xs text-slate-500 dark:text-muted-foreground max-w-xs mx-auto font-normal">
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

      {/* Add Custom Skill Modal */}
      <AddSkillModal
        isOpen={showAddSkillModal}
        onClose={() => setShowAddSkillModal(false)}
        onTakeVerificationDrill={(newSkill) => {
          setCheckingSkill(newSkill);
        }}
      />

      {/* Instant Skill Check & AST Evaluation Modal */}
      <SkillCheckModal
        skill={checkingSkill}
        isOpen={!!checkingSkill}
        onClose={() => setCheckingSkill(null)}
        onLaunchFullSandbox={() => {
          setCheckingSkill(null);
          setSandboxChallenge(MOCK_CHALLENGES[0]);
        }}
      />

      {/* Skill Detail Deep Dive Modal */}
      <SkillDetailModal
        skill={selectedSkill}
        isOpen={!!selectedSkill}
        onClose={() => setSelectedSkill(null)}
        onLaunchChallenge={(ch) => {
          setSelectedSkill(null);
          setSandboxChallenge(ch);
        }}
        onVerifyCheck={(sk) => {
          setSelectedSkill(null);
          setCheckingSkill(sk);
        }}
      />

      {/* Challenge Sandbox Modal */}
      {sandboxChallenge && (
        <ChallengeSandboxModal
          challenge={sandboxChallenge}
          isOpen={!!sandboxChallenge}
          onClose={() => setSandboxChallenge(null)}
        />
      )}
    </div>
  );
}
