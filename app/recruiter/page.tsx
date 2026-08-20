"use client";

import * as React from "react";
import Link from "next/link";
import {
  Briefcase,
  PlusCircle,
  Users,
  Sparkles,
  ShieldCheck,
  Building2,
  CheckCircle2,
  DollarSign,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { MOCK_CHALLENGES } from "@/data/mockChallenges";
import { Challenge } from "@/types";

export default function RecruiterPortalPage() {
  const [activeTab, setActiveTab] = React.useState<"dashboard" | "create" | "candidates">("dashboard");
  const [challenges, setChallenges] = React.useState<Challenge[]>(MOCK_CHALLENGES);

  // Form State for creating a new challenge
  const [newTitle, setNewTitle] = React.useState("");
  const [newCompany, setNewCompany] = React.useState("Quantum Labs");
  const [newCategory, setNewCategory] = React.useState("Backend & Distributed Systems");
  const [newDifficulty, setNewDifficulty] = React.useState<"Beginner" | "Intermediate" | "Advanced" | "Mastery">("Advanced");
  const [newPrize, setNewPrize] = React.useState("$2,000 Bounty");
  const [newTime, setNewTime] = React.useState(45);
  const [newXp, setNewXp] = React.useState(400);
  const [newTags, setNewTags] = React.useState("PostgreSQL, Concurrency, Microservices");
  const [newDesc, setNewDesc] = React.useState("");
  const [isPublishing, setIsPublishing] = React.useState(false);
  const [publishSuccess, setPublishSuccess] = React.useState(false);

  // Load custom created challenges from localStorage on mount
  React.useEffect(() => {
    try {
      const saved = localStorage.getItem("lifeproof_custom_challenges");
      if (saved) {
        const custom = JSON.parse(saved);
        setChallenges([...custom, ...MOCK_CHALLENGES]);
      }
    } catch {}
  }, []);

  const handleCreateChallenge = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDesc.trim()) return;

    setIsPublishing(true);

    const createdChallenge: Challenge = {
      id: `chal-custom-${Date.now().toString(36)}`,
      title: newTitle.trim(),
      description: newDesc.trim(),
      category: newCategory,
      difficulty: newDifficulty,
      estimatedMinutes: Number(newTime) || 45,
      xpReward: Number(newXp) || 350,
      completionsCount: 0,
      participantsCount: 1,
      tags: newTags.split(",").map((t) => t.trim()).filter(Boolean),
      progressPercent: 0,
      company: newCompany.trim() || "Verified Partner",
      companyLogo: `https://avatar.vercel.sh/${encodeURIComponent(newCompany)}`,
      prize: newPrize.trim() || "$1,000 Grant",
      status: "New",
      deadline: "14 days left",
      isFeatured: true,
    };

    setTimeout(() => {
      const updated = [createdChallenge, ...challenges];
      setChallenges(updated);

      try {
        const existingCustom = JSON.parse(localStorage.getItem("lifeproof_custom_challenges") || "[]");
        localStorage.setItem("lifeproof_custom_challenges", JSON.stringify([createdChallenge, ...existingCustom]));
      } catch {}

      // Also submit to backend API
      fetch("/api/challenges", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: createdChallenge.title,
          slug: createdChallenge.id,
          companyName: createdChallenge.company,
          description: createdChallenge.description,
          difficulty: createdChallenge.difficulty,
          prizeAmount: createdChallenge.prize,
          estimatedTime: createdChallenge.estimatedMinutes,
          category: createdChallenge.category,
          tags: createdChallenge.tags,
          xpReward: createdChallenge.xpReward,
          featured: true,
        }),
      }).catch(() => {});

      setIsPublishing(false);
      setPublishSuccess(true);
      setTimeout(() => {
        setPublishSuccess(false);
        setActiveTab("dashboard");
      }, 1500);
    }, 600);
  };

  const VERIFIED_CANDIDATES = [
    {
      name: "Alex Rivera",
      role: "Principal Distributed Systems Engineer",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
      rank: "Grandmaster IV",
      score: "98.4th Percentile",
      proofsCompleted: 14,
      skills: ["Next.js", "Redis Concurrency", "System Design"],
      badge: "LP-PROOF-8849",
    },
    {
      name: "Sarah Chen",
      role: "Senior AI & RAG Engineer",
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&auto=format&fit=crop&q=80",
      rank: "Master II",
      score: "95.1th Percentile",
      proofsCompleted: 9,
      skills: ["pgvector", "LangChain", "Python"],
      badge: "LP-PROOF-4190",
    },
    {
      name: "Marcus Vance",
      role: "Cloud Infrastructure Architect",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
      rank: "Master I",
      score: "92.8th Percentile",
      proofsCompleted: 8,
      skills: ["Kubernetes", "KEDA", "Prometheus"],
      badge: "LP-PROOF-2911",
    },
  ];

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8 sm:py-12 space-y-8 min-h-[calc(100vh-8rem)] text-left">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl border border-indigo-200/80 dark:border-white/10 bg-gradient-to-r from-indigo-50/90 via-white to-purple-50/90 dark:from-slate-950 dark:via-indigo-950/40 dark:to-slate-950 backdrop-blur-xl text-left shadow-sm">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Badge variant="cyan" className="gap-1 text-xs font-bold">
              <Building2 className="h-3.5 w-3.5" />
              Recruiter & Employer Suite
            </Badge>
            <Badge variant="purple" className="text-xs font-bold">
              Proof-of-Competence Sourcing
            </Badge>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            Recruiter & Sponsoring Portal
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-muted-foreground max-w-2xl leading-relaxed font-normal">
            Post verified skill bounties, evaluate cryptographic applicant submissions, and hire pre-vetted top 5% engineering talent.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant={activeTab === "create" ? "glow" : "outline"}
            onClick={() => setActiveTab("create")}
            className="gap-2 text-xs sm:text-sm font-bold h-11 shadow-xs cursor-pointer"
          >
            <PlusCircle className="h-4 w-4" />
            Post New Challenge Bounty
          </Button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200/80 dark:border-white/10 pb-4">
        <button
          onClick={() => setActiveTab("dashboard")}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            activeTab === "dashboard"
              ? "bg-indigo-600 text-white shadow-xs"
              : "text-slate-600 dark:text-muted-foreground hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5"
          }`}
        >
          Active Bounties ({challenges.length})
        </button>
        <button
          onClick={() => setActiveTab("candidates")}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            activeTab === "candidates"
              ? "bg-indigo-600 text-white shadow-xs"
              : "text-slate-600 dark:text-muted-foreground hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5"
          }`}
        >
          Verified Candidate Pipeline (3)
        </button>
        <button
          onClick={() => setActiveTab("create")}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            activeTab === "create"
              ? "bg-indigo-600 text-white shadow-xs"
              : "text-slate-600 dark:text-muted-foreground hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5"
          }`}
        >
          + Create Challenge
        </button>
      </div>

      {/* TAB 1: ACTIVE BOUNTIES */}
      {activeTab === "dashboard" && (
        <div className="space-y-6 text-left">
          {/* Quick Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card className="p-5 border-slate-200/90 dark:border-white/10 bg-white dark:bg-slate-950/60 shadow-xs">
              <div className="flex items-center justify-between text-slate-500 dark:text-muted-foreground text-xs font-semibold mb-1">
                <span>Active Bounties</span>
                <Briefcase className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div className="text-2xl font-black text-slate-900 dark:text-white">{challenges.length} Live</div>
              <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-mono font-medium">Distributed across 6 technical categories</span>
            </Card>

            <Card className="p-5 border-slate-200/90 dark:border-white/10 bg-white dark:bg-slate-950/60 shadow-xs">
              <div className="flex items-center justify-between text-slate-500 dark:text-muted-foreground text-xs font-semibold mb-1">
                <span>Total Applicants Tested</span>
                <Users className="h-4 w-4 text-sky-600 dark:text-cyan-400" />
              </div>
              <div className="text-2xl font-black text-slate-900 dark:text-white">12,480+</div>
              <span className="text-[11px] text-slate-500 dark:text-muted-foreground font-medium">Passed AST & concurrency benchmarks</span>
            </Card>

            <Card className="p-5 border-slate-200/90 dark:border-white/10 bg-white dark:bg-slate-950/60 shadow-xs">
              <div className="flex items-center justify-between text-slate-500 dark:text-muted-foreground text-xs font-semibold mb-1">
                <span>Total Grants Disbursed</span>
                <DollarSign className="h-4 w-4 text-amber-500" />
              </div>
              <div className="text-2xl font-black text-slate-900 dark:text-white">$18,500</div>
              <span className="text-[11px] text-amber-600 dark:text-amber-400 font-mono font-medium">Direct verified bounty rewards</span>
            </Card>
          </div>

          {/* Challenges List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {challenges.map((c) => (
              <Card
                key={c.id}
                className="p-5 border-slate-200/90 dark:border-white/10 bg-white dark:bg-slate-950/70 hover:border-indigo-300 dark:hover:border-primary/40 transition-all flex flex-col justify-between shadow-xs hover:shadow-md"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-indigo-700 dark:text-indigo-300 font-mono flex items-center gap-1.5">
                      <Building2 className="h-3.5 w-3.5" />
                      {c.company}
                    </span>
                    <Badge variant="cyan" className="text-[10px]">
                      {c.difficulty}
                    </Badge>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-snug line-clamp-2">
                    {c.title}
                  </h3>

                  <p className="text-xs text-slate-600 dark:text-muted-foreground line-clamp-2 leading-relaxed font-normal">
                    {c.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {c.tags.slice(0, 3).map((t, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 font-mono"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100 dark:border-white/10 flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-900 dark:text-white text-sm">{c.prize}</span>
                  <Link href="/challenges">
                    <Button variant="outline" size="sm" className="h-7 text-xs gap-1 border-slate-200 dark:border-white/10 hover:text-indigo-600 font-semibold">
                      View on Marketplace <ArrowRight className="h-3 w-3" />
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: VERIFIED TALENT PIPELINE */}
      {activeTab === "candidates" && (
        <div className="space-y-4 text-left">
          <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-500/20 text-xs text-indigo-950 dark:text-slate-300 leading-relaxed font-medium">
            💡 Candidates listed below have scored in the <strong>top 10%</strong> across real-world sandbox challenges and hold verified cryptographic skill proof hashes.
          </div>

          <div className="space-y-3">
            {VERIFIED_CANDIDATES.map((cand, idx) => (
              <Card key={idx} className="p-5 border-slate-200/90 dark:border-white/10 bg-white dark:bg-slate-950/70 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs">
                <div className="flex items-center gap-4">
                  <img
                    src={cand.avatar}
                    alt={cand.name}
                    className="w-12 h-12 rounded-2xl object-cover ring-1 ring-slate-200 dark:ring-white/20 shrink-0"
                  />
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">{cand.name}</h4>
                      <Badge variant="purple" className="text-[10px]">
                        {cand.rank}
                      </Badge>
                      <Badge variant="cyan" className="text-[10px] font-mono">
                        {cand.score}
                      </Badge>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-muted-foreground">{cand.role}</p>
                    <div className="flex items-center gap-1.5 pt-1">
                      {cand.skills.map((s, i) => (
                        <span key={i} className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 font-mono">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right hidden sm:block">
                    <span className="text-[10px] text-slate-400 dark:text-muted-foreground block font-mono">Proof Hash ID</span>
                    <span className="text-xs font-mono font-bold text-indigo-700 dark:text-indigo-300">{cand.badge}</span>
                  </div>
                  <Link href="/profile">
                    <Button variant="glow" size="sm" className="text-xs font-bold gap-1 shadow-xs cursor-pointer">
                      View Verified Portfolio <ArrowRight className="h-3 w-3" />
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: CREATE & POST CHALLENGE */}
      {activeTab === "create" && (
        <Card className="p-6 sm:p-10 border-slate-200/90 dark:border-white/15 bg-white dark:bg-slate-950/90 shadow-md backdrop-blur-2xl text-left max-w-4xl mx-auto space-y-6">
          <div className="space-y-1 border-b border-slate-100 dark:border-white/10 pb-4">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
              Publish a Technical Bounty Challenge
            </h3>
            <p className="text-xs text-slate-500 dark:text-muted-foreground">
              Define the problem statement, sandbox constraints, and bounty prize. Once published, it appears immediately on the LifeProof Marketplace.
            </p>
          </div>

          {publishSuccess && (
            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 text-emerald-700 dark:text-emerald-400 text-xs flex items-center gap-2 animate-in fade-in font-bold">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              <span>Challenge successfully published to the live Marketplace!</span>
            </div>
          )}

          <form onSubmit={handleCreateChallenge} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-muted-foreground">Challenge Title</label>
                <Input
                  type="text"
                  placeholder="e.g. Zero-Downtime Migration with Kafka & Redis"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-muted-foreground">Sponsoring Company / Team</label>
                <Input
                  type="text"
                  placeholder="e.g. Quantum Labs"
                  value={newCompany}
                  onChange={(e) => setNewCompany(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-muted-foreground">Skill Category</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full h-11 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 px-3 text-xs text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-xs"
                >
                  <option value="Frontend Architecture">Frontend Architecture</option>
                  <option value="Backend & Distributed Systems">Backend & Distributed Systems</option>
                  <option value="AI & Machine Learning">AI & Machine Learning</option>
                  <option value="Smart Contracts & Web3">Smart Contracts & Web3</option>
                  <option value="Cloud & DevOps">Cloud & DevOps</option>
                  <option value="System Design">System Design</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-muted-foreground">Difficulty Level</label>
                <select
                  value={newDifficulty}
                  onChange={(e) => setNewDifficulty(e.target.value as any)}
                  className="w-full h-11 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 px-3 text-xs text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-xs"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                  <option value="Mastery">Mastery</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-muted-foreground">Bounty Prize Amount</label>
                <Input
                  type="text"
                  placeholder="e.g. $2,000 Bounty"
                  value={newPrize}
                  onChange={(e) => setNewPrize(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-muted-foreground">Estimated Time (Minutes)</label>
                <Input
                  type="number"
                  placeholder="45"
                  value={newTime}
                  onChange={(e) => setNewTime(Number(e.target.value))}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-muted-foreground">Tags (Comma Separated)</label>
                <Input
                  type="text"
                  placeholder="e.g. Redis, Kafka, Concurrency"
                  value={newTags}
                  onChange={(e) => setNewTags(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-muted-foreground">Task Specification & Requirements</label>
              <textarea
                rows={4}
                placeholder="Explain the architectural challenge, constraints, and success evaluation criteria..."
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                className="w-full rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 p-3 text-xs text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 leading-relaxed shadow-xs"
                required
              />
            </div>

            <div className="pt-3">
              <Button
                type="submit"
                variant="glow"
                size="lg"
                disabled={isPublishing}
                className="w-full gap-2 font-bold text-sm h-12 shadow-xs cursor-pointer"
              >
                {isPublishing ? "Minting & Publishing to Marketplace..." : "Publish Challenge & Fund Bounty Pool"}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </form>
        </Card>
      )}
    </div>
  );
}
