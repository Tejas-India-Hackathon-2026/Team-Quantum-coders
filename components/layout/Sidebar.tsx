"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Code2,
  Bot,
  UserCheck,
  Settings,
  Flame,
  ChevronRight,
  UserPlus,
  Briefcase,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { STARTER_USER } from "@/data/mockAchievements";

const SIDEBAR_ITEMS = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Challenges", href: "/challenges", icon: Code2, badge: "6 New" },
  { label: "AI Coach", href: "/coach", icon: Bot, badge: "AI Ready" },
  { label: "Verified Profile", href: "/profile", icon: UserCheck },
  { label: "Recruiter Suite", href: "/recruiter", icon: Briefcase },
  { label: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user, isAuthenticated } = useAuth();
  const currentUser = user || STARTER_USER;
  const isNew = (currentUser.totalXp ?? 0) === 0;

  return (
    <aside className="w-64 shrink-0 hidden lg:flex flex-col border-r border-slate-200/80 dark:border-white/10 bg-white/70 dark:bg-slate-950/60 backdrop-blur-xl h-[calc(100vh-4rem)] sticky top-16 p-4 justify-between">
      {/* Navigation List */}
      <div className="space-y-6">
        {/* User Quick Stats Widget */}
        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 space-y-3 text-left shadow-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
                <Flame className="h-4 w-4" />
              </div>
              <span className="text-xs font-bold text-slate-800 dark:text-white">Daily Streak</span>
            </div>
            <span className="text-xs font-bold text-amber-600 dark:text-amber-400">
              {isNew ? "Day 1" : "14 Days"} 🔥
            </span>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-[11px] text-slate-500 dark:text-muted-foreground">
              <span className="font-medium">{currentUser.rank}</span>
              <span className="font-bold text-slate-900 dark:text-white font-mono">
                {currentUser.totalXp} XP
              </span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-gradient-to-r from-indigo-500 to-indigo-600 h-full rounded-full transition-all duration-500"
                style={{ width: isNew ? "5%" : "88%" }}
              />
            </div>
          </div>
        </div>

        {/* Links */}
        <div className="space-y-1">
          <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-muted-foreground mb-2 text-left">
            Main Navigation
          </p>
          {SIDEBAR_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all group",
                  isActive
                    ? "bg-indigo-50 dark:bg-primary/20 text-indigo-700 dark:text-white border border-indigo-200/80 dark:border-primary/40 shadow-xs"
                    : "text-slate-600 dark:text-muted-foreground hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5"
                )}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={cn(
                      "h-4 w-4 transition-colors",
                      isActive
                        ? "text-indigo-600 dark:text-indigo-400"
                        : "text-slate-400 dark:text-muted-foreground group-hover:text-slate-700 dark:group-hover:text-white"
                    )}
                  />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={cn(
                      "text-[10px] px-2 py-0.5 rounded-full font-bold",
                      isActive
                        ? "bg-indigo-100 dark:bg-primary/40 text-indigo-700 dark:text-white"
                        : "bg-slate-100 dark:bg-white/10 text-slate-500 dark:text-muted-foreground group-hover:text-slate-800 dark:group-hover:text-white"
                    )}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Footer User Profile Card */}
      <div className="p-3 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 flex items-center justify-between shadow-xs">
        {isAuthenticated ? (
          <Link href="/profile" className="flex items-center gap-3 group text-left">
            <div className="relative">
              <div className="w-9 h-9 rounded-full overflow-hidden ring-1 ring-indigo-300 dark:ring-primary/40 bg-slate-100">
                <img
                  src={currentUser.avatarUrl}
                  alt={currentUser.fullName}
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-950" />
            </div>
            <div className="flex flex-col text-left">
              <span className="text-xs font-bold text-slate-800 dark:text-white group-hover:text-indigo-600 transition-colors truncate max-w-[100px]">
                {currentUser.fullName}
              </span>
              <span className="text-[10px] font-medium text-slate-400 dark:text-muted-foreground truncate max-w-[100px]">
                {currentUser.rank}
              </span>
            </div>
          </Link>
        ) : (
          <Link href="/signup" className="flex items-center gap-2 text-xs font-bold text-indigo-600 hover:text-indigo-700 transition-colors">
            <UserPlus className="h-4 w-4" />
            <span>Claim Your Profile</span>
          </Link>
        )}

        <Link
          href="/profile"
          className="p-1.5 rounded-lg hover:bg-slate-200/60 dark:hover:bg-white/10 text-slate-400 hover:text-slate-700 dark:text-muted-foreground dark:hover:text-white transition-colors"
        >
          <ChevronRight className="h-4 w-4" />
        </Link>
      </div>
    </aside>
  );
}
