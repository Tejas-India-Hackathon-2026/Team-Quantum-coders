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
  Sparkles,
  ShieldCheck,
  UserPlus,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { STARTER_USER } from "@/data/mockAchievements";

const SIDEBAR_ITEMS = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Challenges", href: "/challenges", icon: Code2, badge: "6 New" },
  { label: "AI Coach", href: "/coach", icon: Bot, badge: "AI Ready" },
  { label: "Verified Profile", href: "/profile", icon: UserCheck },
  { label: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user, isAuthenticated } = useAuth();
  const currentUser = user || STARTER_USER;
  const isNew = (currentUser.totalXp ?? 0) === 0;

  return (
    <aside className="w-64 shrink-0 hidden lg:flex flex-col border-r border-white/10 bg-slate-950/60 backdrop-blur-xl h-[calc(100vh-4rem)] sticky top-16 p-4 justify-between">
      {/* Navigation List */}
      <div className="space-y-6">
        {/* User Quick Stats Widget */}
        <div className="p-3.5 rounded-xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 space-y-3 text-left">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400">
                <Flame className="h-4 w-4" />
              </div>
              <span className="text-xs font-semibold text-white">Daily Streak</span>
            </div>
            <span className="text-xs font-bold text-amber-400">
              {isNew ? "Day 1" : "14 Days"} 🔥
            </span>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-[11px] text-muted-foreground">
              <span>{currentUser.rank}</span>
              <span className="font-semibold text-white font-mono">
                {currentUser.totalXp} XP
              </span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-gradient-to-r from-primary to-secondary h-full rounded-full transition-all duration-500"
                style={{ width: isNew ? "5%" : "88%" }}
              />
            </div>
          </div>
        </div>

        {/* Links */}
        <div className="space-y-1">
          <p className="px-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-2 text-left">
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
                  "flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all group",
                  isActive
                    ? "bg-primary/20 text-white border border-primary/40 shadow-glow/10 font-semibold"
                    : "text-muted-foreground hover:text-white hover:bg-white/5"
                )}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={cn(
                      "h-4 w-4 transition-colors",
                      isActive
                        ? "text-primary-400 text-indigo-400"
                        : "text-muted-foreground group-hover:text-white"
                    )}
                  />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={cn(
                      "text-[10px] px-2 py-0.5 rounded-full font-semibold",
                      isActive
                        ? "bg-primary/40 text-white"
                        : "bg-white/10 text-muted-foreground group-hover:text-white"
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
      <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
        {isAuthenticated ? (
          <Link href="/profile" className="flex items-center gap-3 group text-left">
            <div className="relative">
              <div className="w-9 h-9 rounded-full overflow-hidden ring-1 ring-primary/40 bg-slate-900">
                <img
                  src={currentUser.avatarUrl}
                  alt={currentUser.fullName}
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-400 ring-2 ring-slate-950" />
            </div>
            <div className="flex flex-col text-left">
              <span className="text-xs font-semibold text-white group-hover:text-primary transition-colors truncate max-w-[100px]">
                {currentUser.fullName}
              </span>
              <span className="text-[10px] text-muted-foreground truncate max-w-[100px]">
                {currentUser.rank}
              </span>
            </div>
          </Link>
        ) : (
          <Link href="/signup" className="flex items-center gap-2 text-xs font-bold text-indigo-400 hover:text-white transition-colors">
            <UserPlus className="h-4 w-4" />
            <span>Claim Your Profile</span>
          </Link>
        )}

        <Link
          href="/profile"
          className="p-1.5 rounded-lg hover:bg-white/10 text-muted-foreground hover:text-white transition-colors"
        >
          <ChevronRight className="h-4 w-4" />
        </Link>
      </div>
    </aside>
  );
}
