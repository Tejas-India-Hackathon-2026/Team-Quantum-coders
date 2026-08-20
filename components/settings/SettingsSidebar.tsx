"use client";

import * as React from "react";
import {
  User,
  ShieldCheck,
  Bell,
  Lock,
  Link2,
  Palette,
  AlertTriangle,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

export type SettingsTabId =
  | "account"
  | "security"
  | "notifications"
  | "privacy"
  | "connected"
  | "appearance"
  | "danger";

interface SettingsSidebarProps {
  activeTab: SettingsTabId;
  onTabChange: (tab: SettingsTabId) => void;
}

const SETTINGS_NAV_ITEMS: { id: SettingsTabId; label: string; icon: React.ElementType }[] = [
  { id: "account", label: "Account", icon: User },
  { id: "security", label: "Security", icon: ShieldCheck },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "privacy", label: "Privacy", icon: Lock },
  { id: "connected", label: "Connected Accounts", icon: Link2 },
  { id: "appearance", label: "Appearance", icon: Palette },
  { id: "danger", label: "Danger Zone", icon: AlertTriangle },
];

export function SettingsSidebar({ activeTab, onTabChange }: SettingsSidebarProps) {
  return (
    <nav className="w-full lg:w-64 shrink-0 space-y-1 text-left">
      <div className="p-1 rounded-3xl bg-white dark:bg-slate-950/60 border border-slate-200/90 dark:border-white/10 space-y-1 shadow-xs">
        {SETTINGS_NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          const isDanger = item.id === "danger";

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onTabChange(item.id)}
              className={cn(
                "w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs sm:text-sm font-medium transition-all group cursor-pointer",
                isActive
                  ? isDanger
                    ? "bg-red-50 dark:bg-red-500/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-500/30 font-bold"
                    : "bg-indigo-50 dark:bg-primary/20 text-indigo-700 dark:text-white border border-indigo-200 dark:border-primary/40 font-bold shadow-xs"
                  : isDanger
                  ? "text-red-600/80 dark:text-red-400/80 hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-700 dark:hover:text-red-300"
                  : "text-slate-600 dark:text-muted-foreground hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-white/5"
              )}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={cn(
                    "h-4 w-4 transition-colors",
                    isActive
                      ? isDanger
                        ? "text-red-600 dark:text-red-400"
                        : "text-indigo-600 dark:text-indigo-400"
                      : isDanger
                      ? "text-red-600/70 dark:text-red-400/70"
                      : "text-slate-400 dark:text-muted-foreground group-hover:text-slate-900 dark:group-hover:text-white"
                  )}
                />
                <span>{item.label}</span>
              </div>
              <ChevronRight
                className={cn(
                  "h-3.5 w-3.5 transition-opacity",
                  isActive ? "opacity-100" : "opacity-0 group-hover:opacity-40"
                )}
              />
            </button>
          );
        })}
      </div>
    </nav>
  );
}
