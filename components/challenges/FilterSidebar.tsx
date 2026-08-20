"use client";

import * as React from "react";
import { Search, Filter, RotateCcw, Building2, Trophy, Tag, Sparkles, Check } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { SKILL_CATEGORIES, DIFFICULTY_LEVELS } from "@/lib/constants";
import { cn } from "@/lib/utils";

const STATUS_FILTERS = ["All Statuses", "Featured", "New", "Ending Soon", "Popular", "Verified"];

const COMPANIES = [
  "All Companies",
  "Vercel Partner Labs",
  "CloudScale Systems",
  "Scale AI Ecosystem",
  "TypeScript Foundation",
  "Supabase Community",
  "FinTech Quant Labs",
  "DesignOps Studio",
];

interface FilterSidebarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedCategory: string;
  onCategoryChange: (c: string) => void;
  selectedDifficulty: string;
  onDifficultyChange: (d: string) => void;
  selectedStatus?: string;
  onStatusChange?: (s: string) => void;
  selectedCompany?: string;
  onCompanyChange?: (c: string) => void;
  onReset: () => void;
}

export function FilterSidebar({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  selectedDifficulty,
  onDifficultyChange,
  selectedStatus = "All Statuses",
  onStatusChange,
  selectedCompany = "All Companies",
  onCompanyChange,
  onReset,
}: FilterSidebarProps) {
  const hasActiveFilters =
    searchQuery !== "" ||
    selectedCategory !== "All Categories" ||
    selectedDifficulty !== "All Difficulties" ||
    selectedStatus !== "All Statuses" ||
    selectedCompany !== "All Companies";

  return (
    <aside className="w-full lg:w-72 shrink-0 space-y-6 text-left">
      {/* Search Bar Input */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          Search Tasks & Skills
        </label>
        <Input
          placeholder="Title, skill, or tech..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          icon={<Search className="h-4 w-4" />}
        />
      </div>

      {/* Category Filter */}
      <div className="space-y-2 p-4 rounded-2xl bg-slate-950/60 border border-white/10">
        <div className="flex items-center gap-1.5 mb-2">
          <Tag className="h-3.5 w-3.5 text-primary" />
          <label className="text-xs font-bold uppercase tracking-wider text-white">
            Category
          </label>
        </div>
        <div className="space-y-1">
          {SKILL_CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => onCategoryChange(cat)}
                className={cn(
                  "w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center justify-between",
                  isSelected
                    ? "bg-primary/20 text-white font-semibold border border-primary/30"
                    : "text-muted-foreground hover:bg-white/5 hover:text-white"
                )}
              >
                <span className="truncate">{cat}</span>
                {isSelected && <Check className="h-3.5 w-3.5 text-primary shrink-0" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Difficulty Level */}
      <div className="space-y-2 p-4 rounded-2xl bg-slate-950/60 border border-white/10">
        <div className="flex items-center gap-1.5 mb-2">
          <Sparkles className="h-3.5 w-3.5 text-amber-400" />
          <label className="text-xs font-bold uppercase tracking-wider text-white">
            Difficulty Tier
          </label>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {DIFFICULTY_LEVELS.map((diff) => {
            const isSelected = selectedDifficulty === diff;
            return (
              <button
                key={diff}
                type="button"
                onClick={() => onDifficultyChange(diff)}
                className={cn(
                  "px-2.5 py-1 rounded-lg text-xs font-medium transition-all",
                  isSelected
                    ? "bg-secondary/30 text-white border border-secondary/50 font-semibold shadow-glow-purple/20"
                    : "bg-white/5 text-muted-foreground hover:text-white border border-white/5"
                )}
              >
                {diff}
              </button>
            );
          })}
        </div>
      </div>

      {/* Status Filter */}
      {onStatusChange && (
        <div className="space-y-2 p-4 rounded-2xl bg-slate-950/60 border border-white/10">
          <div className="flex items-center gap-1.5 mb-2">
            <Trophy className="h-3.5 w-3.5 text-cyan-400" />
            <label className="text-xs font-bold uppercase tracking-wider text-white">
              Status & Badges
            </label>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {STATUS_FILTERS.map((st) => {
              const isSelected = selectedStatus === st;
              return (
                <button
                  key={st}
                  type="button"
                  onClick={() => onStatusChange(st)}
                  className={cn(
                    "px-2.5 py-1 rounded-lg text-xs font-medium transition-all",
                    isSelected
                      ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-semibold"
                      : "bg-white/5 text-muted-foreground hover:text-white border border-white/5"
                  )}
                >
                  {st}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Company Filter */}
      {onCompanyChange && (
        <div className="space-y-2 p-4 rounded-2xl bg-slate-950/60 border border-white/10">
          <div className="flex items-center gap-1.5 mb-2">
            <Building2 className="h-3.5 w-3.5 text-indigo-400" />
            <label className="text-xs font-bold uppercase tracking-wider text-white">
              Sponsoring Company
            </label>
          </div>
          <div className="space-y-1">
            {COMPANIES.map((comp) => {
              const isSelected = selectedCompany === comp;
              return (
                <button
                  key={comp}
                  type="button"
                  onClick={() => onCompanyChange(comp)}
                  className={cn(
                    "w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center justify-between",
                    isSelected
                      ? "bg-white/10 text-white font-semibold border border-white/20"
                      : "text-muted-foreground hover:bg-white/5 hover:text-white"
                  )}
                >
                  <span className="truncate">{comp}</span>
                  {isSelected && <Check className="h-3.5 w-3.5 text-cyan-400 shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Reset Filter Button */}
      {hasActiveFilters && (
        <Button
          variant="outline"
          size="sm"
          onClick={onReset}
          className="w-full gap-2 text-xs text-muted-foreground hover:text-white border-white/15"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Reset All Filters
        </Button>
      )}
    </aside>
  );
}
