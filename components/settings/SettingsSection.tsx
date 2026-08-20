"use client";

import * as React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { cn } from "@/lib/utils";

interface SettingsSectionProps {
  id?: string;
  title: string;
  description?: string;
  badge?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  headerAction?: React.ReactNode;
}

export function SettingsSection({
  id,
  title,
  description,
  badge,
  children,
  className,
  headerAction,
}: SettingsSectionProps) {
  return (
    <Card id={id} className={cn("border-slate-200/90 dark:border-white/10 bg-white dark:bg-slate-950/60 backdrop-blur-xl shadow-sm overflow-hidden", className)}>
      <CardHeader className="p-6 border-b border-slate-100 dark:border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-left">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <CardTitle className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white tracking-tight">
              {title}
            </CardTitle>
            {badge}
          </div>
          {description && (
            <CardDescription className="text-xs sm:text-sm text-slate-500 dark:text-muted-foreground leading-relaxed font-normal">
              {description}
            </CardDescription>
          )}
        </div>
        {headerAction && <div className="shrink-0">{headerAction}</div>}
      </CardHeader>
      <CardContent className="p-6 space-y-6 text-left">
        {children}
      </CardContent>
    </Card>
  );
}
