"use client";

import * as React from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { VerifiedBadge } from "@/components/profile/VerifiedBadge";
import { SkillRadar } from "@/components/profile/SkillRadar";
import { AchievementCard } from "@/components/dashboard/AchievementCard";
import { STARTER_USER } from "@/data/mockAchievements";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/Button";
import { Trophy, ShieldCheck, Sparkles, Award } from "lucide-react";

export default function ProfilePage() {
  const { user, loadDemoGrandmasterProfile } = useAuth();
  const currentUser = user || STARTER_USER;
  const isNew = (currentUser.totalXp ?? 0) === 0;

  return (
    <div className="flex-1 flex min-h-[calc(100vh-4rem)]">
      {/* App Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8 overflow-y-auto text-left">
        {/* Profile Header Widget */}
        <ProfileHeader user={currentUser} />

        {/* Certificate + Skill Radar Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Tamper-Proof Certificate */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-indigo-600 dark:text-cyan-400" />
                <h2 className="text-base font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  Cryptographic Proof-of-Skill Certificate
                </h2>
              </div>
              {isNew && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={loadDemoGrandmasterProfile}
                  className="text-xs border-indigo-200 dark:border-indigo-500/30 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-50 font-semibold"
                >
                  <Sparkles className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
                  Preview Grandmaster
                </Button>
              )}
            </div>
            <VerifiedBadge
              badgeId={currentUser.proofBadgeId}
              recipientName={currentUser.fullName}
              verifiedSince={currentUser.verifiedSince}
              rank={currentUser.rank}
            />
          </div>

          {/* Skill Radar / Breakdown */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
              <h2 className="text-base font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Multi-Vector Proficiency Radar
              </h2>
            </div>
            <SkillRadar skills={currentUser.skills} />
          </div>
        </div>

        {/* All Verified Proof Trophies */}
        <div className="space-y-4 pt-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Trophy className="h-5 w-5 text-amber-500" />
                Immutable Proof Trophies & Badges
              </h2>
              <p className="text-xs text-slate-500 dark:text-muted-foreground font-normal">
                Cryptographically signed proof entries verifiable on the LifeProof protocol
              </p>
            </div>
          </div>

          {currentUser.achievements.length === 0 ? (
            <div className="p-10 rounded-3xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-950/40 text-center space-y-3 shadow-xs">
              <Award className="h-10 w-10 text-slate-400 dark:text-muted-foreground mx-auto opacity-40" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">No Proof Trophies Minted Yet</h3>
              <p className="text-xs text-slate-500 dark:text-muted-foreground max-w-sm mx-auto font-normal">
                Solve challenges in the Marketplace to complete on-chain AST evaluations and unlock your first trophies.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentUser.achievements.map((ach) => (
                <AchievementCard key={ach.id} achievement={ach} />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
