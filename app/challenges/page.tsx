"use client";

import * as React from "react";
import Link from "next/link";
import { Sidebar } from "@/components/layout/Sidebar";
import { ChallengeCard } from "@/components/challenges/ChallengeCard";
import { FeaturedChallengeCard } from "@/components/challenges/FeaturedChallengeCard";
import { FilterSidebar } from "@/components/challenges/FilterSidebar";
import { MOCK_CHALLENGES } from "@/data/mockChallenges";
import {
  Code2,
  Sparkles,
  Building2,
  Trophy,
  Flame,
  Zap,
  TrendingUp,
  Search,
  Filter,
  DollarSign,
  PlusCircle,
  Briefcase,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Challenge } from "@/types";

const TRENDING_SKILLS = [
  "Next.js",
  "Distributed Locks",
  "pgvector & RAG",
  "TypeScript Generics",
  "Tailwind CSS",
  "Kafka & Microservices",
  "Kubernetes KEDA",
  "WebSocket Streaming",
];

export default function ChallengesPage() {
  const [allChallenges, setAllChallenges] = React.useState<Challenge[]>(MOCK_CHALLENGES);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState("All Categories");
  const [selectedDifficulty, setSelectedDifficulty] = React.useState("All Difficulties");
  const [selectedStatus, setSelectedStatus] = React.useState("All Statuses");
  const [selectedCompany, setSelectedCompany] = React.useState("All Companies");
  const [mobileFilterOpen, setMobileFilterOpen] = React.useState(false);

  // Load custom challenges from recruiter posts
  React.useEffect(() => {
    try {
      const saved = localStorage.getItem("lifeproof_custom_challenges");
      if (saved) {
        const custom = JSON.parse(saved);
        setAllChallenges([...custom, ...MOCK_CHALLENGES]);
      }
    } catch {}
  }, []);

  // Filtered dataset
  const filteredChallenges = React.useMemo(() => {
    return allChallenges.filter((item) => {
      const matchesSearch =
        searchQuery === "" ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCategory =
        selectedCategory === "All Categories" || item.category === selectedCategory;

      const matchesDifficulty =
        selectedDifficulty === "All Difficulties" || item.difficulty === selectedDifficulty;

      const matchesStatus =
        selectedStatus === "All Statuses" || item.status === selectedStatus;

      const matchesCompany =
        selectedCompany === "All Companies" || item.company === selectedCompany;

      return matchesSearch && matchesCategory && matchesDifficulty && matchesStatus && matchesCompany;
    });
  }, [allChallenges, searchQuery, selectedCategory, selectedDifficulty, selectedStatus, selectedCompany]);

  const handleReset = () => {
    setSearchQuery("");
    setSelectedCategory("All Categories");
    setSelectedDifficulty("All Difficulties");
    setSelectedStatus("All Statuses");
    setSelectedCompany("All Companies");
  };

  const featuredChallenge = allChallenges.find((c) => c.isFeatured) || allChallenges[1] || MOCK_CHALLENGES[1];

  return (
    <div className="flex-1 flex min-h-[calc(100vh-4rem)]">
      {/* App Navigation Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-10 overflow-y-auto">
        {/* Top Header Section */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1.5 text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold">
                <Sparkles className="h-3.5 w-3.5" />
                Live Engineering Marketplace
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
                Challenge Marketplace
              </h1>
              <p className="text-sm text-muted-foreground max-w-2xl leading-relaxed">
                Solve real-world tasks, prove your abilities, and grow your Skill DNA.
              </p>
            </div>

            {/* Recruiter Suite & Mobile Filter Toggle */}
            <div className="flex items-center gap-2.5 w-full sm:w-auto">
              <Link href="/recruiter">
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2 text-xs h-10 border-indigo-500/40 hover:bg-indigo-500/10 text-indigo-300 font-bold"
                >
                  <Briefcase className="h-4 w-4 text-cyan-400" />
                  Post a Bounty (Recruiter Mode)
                </Button>
              </Link>

              <div className="lg:hidden">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
                  className="gap-2 text-xs border-white/15 h-10"
                >
                  <Filter className="h-4 w-4" />
                  {mobileFilterOpen ? "Hide" : "Filters"}
                </Button>
              </div>
            </div>
          </div>

          {/* Summary Stats Chips */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div className="p-4 rounded-2xl bg-slate-950/60 border border-white/10 space-y-1 text-left">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Code2 className="h-3.5 w-3.5 text-primary" />
                Active Challenges
              </div>
              <div className="text-xl font-bold text-white">{allChallenges.length} Live</div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/60 border border-white/10 space-y-1 text-left">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Building2 className="h-3.5 w-3.5 text-indigo-400" />
                Featured Companies
              </div>
              <div className="text-xl font-bold text-white">58 Tech Labs</div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/60 border border-white/10 space-y-1 text-left">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <DollarSign className="h-3.5 w-3.5 text-emerald-400" />
                Total Prize Pool
              </div>
              <div className="text-xl font-bold text-emerald-400">$125,000+</div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/60 border border-white/10 space-y-1 text-left">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Trophy className="h-3.5 w-3.5 text-amber-400" />
                Difficulty Tiers
              </div>
              <div className="text-xl font-bold text-white">4 Levels</div>
            </div>
          </div>

          {/* Trending Skills Bar */}
          <div className="flex flex-wrap items-center gap-2 pt-1 text-left">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
              <TrendingUp className="h-3.5 w-3.5 text-cyan-400" />
              Trending:
            </span>
            {TRENDING_SKILLS.map((skill) => (
              <button
                key={skill}
                type="button"
                onClick={() => setSearchQuery(skill)}
                className="text-xs px-3 py-1 rounded-full bg-white/5 hover:bg-white/10 text-slate-300 border border-white/5 transition-colors font-medium hover:text-white"
              >
                {skill}
              </button>
            ))}
          </div>
        </div>

        {/* Highlighted Featured Challenge Card */}
        <FeaturedChallengeCard challenge={featuredChallenge} />

        {/* Filter & Main Grid Section */}
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Filter Sidebar (Desktop or toggled on mobile) */}
          <div className={`w-full lg:w-72 shrink-0 ${mobileFilterOpen ? "block" : "hidden lg:block"}`}>
            <FilterSidebar
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              selectedDifficulty={selectedDifficulty}
              onDifficultyChange={setSelectedDifficulty}
              selectedStatus={selectedStatus}
              onStatusChange={setSelectedStatus}
              selectedCompany={selectedCompany}
              onCompanyChange={setSelectedCompany}
              onReset={handleReset}
            />
          </div>

          {/* Challenges Listing Grid */}
          <div className="flex-1 space-y-5 w-full">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                Showing {filteredChallenges.length} of {allChallenges.length} Verified Challenges
              </span>
              <span className="text-xs text-indigo-300 font-medium">
                Live AST Evaluation Active
              </span>
            </div>

            {filteredChallenges.length === 0 ? (
              <div className="rounded-3xl border border-white/10 bg-slate-950/40 p-12 text-center space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-muted-foreground">
                  <Search className="h-6 w-6" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-white">No challenges match your filters</h3>
                  <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                    Try searching for different keywords, selecting another difficulty tier, or resetting your filter criteria.
                  </p>
                </div>
                <Button variant="outline" size="sm" onClick={handleReset} className="text-xs">
                  Reset All Filters
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredChallenges.map((challenge) => (
                  <ChallengeCard key={challenge.id} challenge={challenge} />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
