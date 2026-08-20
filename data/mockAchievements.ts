import { Achievement, UserProfile } from "@/types";
import { MOCK_SKILLS, STARTER_SKILLS } from "./mockSkills";

export const MOCK_ACHIEVEMENTS: Achievement[] = [
  {
    id: "ach-1",
    title: "TypeScript Vanguard",
    description: "Achieved top 5% mastery ranking across 10+ advanced typing challenges.",
    icon: "ShieldCheck",
    unlockedAt: "2026-07-15",
    rarity: "Epic",
    proofHash: "0x8f4b...39a1",
  },
  {
    id: "ach-2",
    title: "Distributed Architect",
    description: "Solved high-throughput consensus and replication challenges with 0 defects.",
    icon: "Zap",
    unlockedAt: "2026-08-01",
    rarity: "Legendary",
    proofHash: "0x77c2...e81d",
  },
  {
    id: "ach-3",
    title: "Fast Learner",
    description: "Completed 5 complex challenges within the first 7 days of onboarding.",
    icon: "Flame",
    unlockedAt: "2026-06-20",
    rarity: "Rare",
    proofHash: "0x12a9...99fe",
  },
  {
    id: "ach-4",
    title: "Clean Coder",
    description: "Received an AI Coach code review rating of 95%+ for 8 consecutive submissions.",
    icon: "Award",
    unlockedAt: "2026-08-12",
    rarity: "Epic",
    proofHash: "0x44d1...aa02",
  },
];

// Clean new user template
export const STARTER_USER: UserProfile = {
  id: "usr-new",
  username: "newbie_dev",
  fullName: "New Developer",
  avatarUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=300&auto=format&fit=crop&q=80",
  title: "Full-Stack Engineer in Training",
  bio: "Starting my journey on LifeProof. Ready to take engineering assessments and prove my skills on-chain.",
  proofBadgeId: "LP-PROOF-GENESIS-READY",
  verifiedSince: "August 2026",
  rank: "Challenger I",
  globalPercentile: 0,
  totalXp: 0,
  completedChallengesCount: 0,
  skills: STARTER_SKILLS,
  achievements: [],
};

// Grandmaster showcase profile
export const MOCK_USER: UserProfile = {
  id: "usr-01",
  username: "alexrivera",
  fullName: "Alex Rivera",
  avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80",
  title: "Principal Full-Stack Engineer",
  bio: "Specializing in resilient distributed web systems, Next.js architecture, and AI application engineering.",
  proofBadgeId: "LP-PROOF-8849-VERIFIED",
  verifiedSince: "May 2026",
  rank: "Grandmaster IV",
  globalPercentile: 98.4,
  totalXp: 18450,
  completedChallengesCount: 42,
  skills: MOCK_SKILLS,
  achievements: MOCK_ACHIEVEMENTS,
};
