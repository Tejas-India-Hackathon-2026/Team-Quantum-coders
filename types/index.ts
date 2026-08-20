export type Difficulty = "Beginner" | "Intermediate" | "Advanced" | "Mastery";

export type ChallengeStatus = "Featured" | "New" | "Ending Soon" | "Popular" | "Verified";

export type SkillCategory =
  | "Frontend Architecture"
  | "Backend & Distributed Systems"
  | "AI & Machine Learning"
  | "Smart Contracts & Web3"
  | "Cloud & DevOps"
  | "System Design";

export interface Skill {
  id: string;
  name: string;
  category: SkillCategory;
  level: number; // 1-100
  score: number;
  verified: boolean;
  verificationDate?: string;
  challengesCompleted: number;
  totalChallenges: number;
  iconName: string;
  topPercentile: number;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  category: SkillCategory;
  difficulty: Difficulty;
  estimatedMinutes: number;
  xpReward: number;
  completionsCount: number;
  participantsCount?: number;
  tags: string[];
  isLocked?: boolean;
  progressPercent?: number;
  company: string;
  companyLogo?: string;
  prize?: string;
  status: ChallengeStatus;
  deadline?: string;
  isFeatured?: boolean;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt: string;
  rarity: "Common" | "Rare" | "Epic" | "Legendary";
  proofHash: string;
}

export interface UserProfile {
  id: string;
  username: string;
  fullName: string;
  avatarUrl: string;
  title: string;
  bio: string;
  proofBadgeId: string;
  verifiedSince: string;
  rank: string;
  globalPercentile: number;
  totalXp: number;
  completedChallengesCount: number;
  skills: Skill[];
  achievements: Achievement[];
}

export interface ChatMessage {
  id: string;
  sender: "user" | "coach";
  text: string;
  timestamp: string;
  suggestedAction?: {
    label: string;
    href: string;
  };
}

export interface FilterState {
  searchQuery: string;
  selectedCategory: string;
  selectedDifficulty: string;
  selectedCompany?: string;
  selectedStatus?: string;
}
