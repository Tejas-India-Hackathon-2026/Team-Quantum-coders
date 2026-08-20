import { MOCK_CHALLENGES } from "@/data/mockChallenges";
import { MOCK_ACHIEVEMENTS, MOCK_USER, STARTER_USER } from "@/data/mockAchievements";
import { STARTER_SKILLS } from "@/data/mockSkills";

// In-Memory Database Store for Instant Resilient Backend Execution
class InMemoryDB {
  public users: any[] = [
    {
      id: "usr-01",
      name: "Alex Rivera",
      email: "alex@lifeproof.dev",
      username: "alexrivera",
      passwordHash: "$2a$10$e8wF4rT3J3hI2mO1X0w6Q.0n9Z8Y7X6W5V4U3T2S1R0Q9P8O7N6M", // Password123!
      role: "ADMIN",
      rank: "Grandmaster IV",
      totalXp: 18450,
      profileCompleteness: 100,
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80",
      createdAt: new Date("2026-05-01"),
      updatedAt: new Date(),
    },
  ];

  public profiles: any[] = [
    {
      id: "prof-01",
      userId: "usr-01",
      fullName: "Alex Rivera",
      avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80",
      headline: "Principal Full-Stack Engineer",
      bio: "Specializing in resilient distributed web systems, Next.js architecture, and AI application engineering.",
      location: "San Francisco, CA",
      website: "https://alexrivera.dev",
      socialLinks: { github: "https://github.com/alexrivera", twitter: "https://twitter.com/alexrivera" },
      publicProfileEnabled: true,
      showSkillDNA: true,
      showAchievements: true,
      showCompletedChallenges: true,
      recruiterVisible: true,
      proofBadgeId: "LP-PROOF-8849-VERIFIED",
      verifiedSince: "May 2026",
      globalPercentile: 98.4,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  public userSettings: any[] = [
    {
      id: "set-01",
      userId: "usr-01",
      theme: "dark",
      accentColor: "indigo",
      layoutDensity: "comfortable",
      emailNotifications: true,
      challengeNotifications: true,
      coachNotifications: true,
      badgeNotifications: true,
      securityAlerts: true,
      weeklySummary: true,
      twoFactorEnabled: true,
      loginAlertsEnabled: true,
      profileVisibility: true,
      searchEngineIndexing: false,
    },
  ];

  public challenges: any[] = MOCK_CHALLENGES.map((c) => ({
    id: c.id,
    title: c.title,
    slug: c.id,
    companyName: c.company,
    companyLogo: c.companyLogo,
    description: c.description,
    difficulty: c.difficulty,
    prizeAmount: c.prize,
    participantsCount: c.participantsCount || 840,
    estimatedTime: c.estimatedMinutes,
    status: c.status === "Archived" ? "Archived" : "Active",
    featured: c.isFeatured || false,
    endingSoon: c.status === "Ending Soon",
    category: c.category,
    tags: c.tags,
    deadline: c.deadline,
    xpReward: c.xpReward,
    createdAt: new Date(),
    updatedAt: new Date(),
  }));

  public userSkills: any[] = STARTER_SKILLS.map((s, idx) => ({
    id: `skill-${idx}`,
    userId: "usr-01",
    categoryName: s.category,
    score: 850,
    level: 85,
    percentage: 85.0,
    strengthLabel: "Mastery",
    verified: true,
    challengesCompleted: 12,
    totalChallenges: 15,
    topPercentile: 5,
    updatedAt: new Date(),
  }));

  public attempts: any[] = [
    {
      id: "att-01",
      userId: "usr-01",
      challengeId: "chal-101",
      status: "PASSED",
      score: 100,
      proofHash: "0x8f4b77c2e81d99fe44d1aa029d4a",
      completedAt: new Date("2026-08-10"),
      createdAt: new Date(),
    },
  ];

  public achievements: any[] = MOCK_ACHIEVEMENTS.map((a) => ({
    id: a.id,
    title: a.title,
    description: a.description,
    icon: a.icon,
    rarity: a.rarity,
    proofHash: a.proofHash,
    category: "Engineering",
    createdAt: new Date(),
  }));

  public userAchievements: any[] = [
    {
      id: "uach-01",
      userId: "usr-01",
      achievementId: "ach-1",
      proofHash: "0x8f4b...39a1",
      earnedAt: new Date(),
      achievement: MOCK_ACHIEVEMENTS[0],
    },
    {
      id: "uach-02",
      userId: "usr-01",
      achievementId: "ach-2",
      proofHash: "0x77c2...e81d",
      earnedAt: new Date(),
      achievement: MOCK_ACHIEVEMENTS[1],
    },
  ];

  public activities: any[] = [
    {
      id: "act-01",
      userId: "usr-01",
      type: "CHALLENGE_COMPLETED",
      title: "Solved Server Action Cache Invalidation",
      description: "Earned +350 XP and minted cryptographic proof 0x8f4b...39a1.",
      createdAt: new Date(),
    },
    {
      id: "act-02",
      userId: "usr-01",
      type: "ACHIEVEMENT_UNLOCKED",
      title: "Unlocked TypeScript Vanguard Trophy",
      description: "Achieved top 5% mastery ranking across advanced typing challenges.",
      createdAt: new Date(Date.now() - 3600000),
    },
  ];

  public aiInsights: any[] = [
    {
      id: "ins-01",
      userId: "usr-01",
      title: "Strengthen Distributed Systems Architecture",
      message: "Solving Zero-Downtime Distributed Lock with Redis will reinforce your high-concurrency ratings by +22%.",
      severity: "RECOMMENDATION",
      recommendedAction: "Accept Challenge",
      relatedChallengeId: "chal-102",
      createdAt: new Date(),
    },
  ];

  public savedChallenges: any[] = [];
  public notificationPreferences: any[] = [];
  public profileViews: any[] = [];
}

const memory = new InMemoryDB();

// Universal Prisma-compatible Database Interface
export const db: any = {
  user: {
    findUnique: async ({ where }: any) => {
      if (where.username) {
        const u = memory.users.find((user) => user.username.toLowerCase() === where.username.toLowerCase());
        if (!u) return null;
        return {
          ...u,
          profile: memory.profiles.find((p) => p.userId === u.id) || null,
          settings: memory.userSettings.find((s) => s.userId === u.id) || null,
          skills: memory.userSkills.filter((s) => s.userId === u.id),
          achievements: memory.userAchievements.filter((ua) => ua.userId === u.id),
          attempts: memory.attempts.filter((att) => att.userId === u.id),
        };
      }
      if (where.id) {
        const u = memory.users.find((user) => user.id === where.id);
        if (!u) return null;
        return {
          ...u,
          profile: memory.profiles.find((p) => p.userId === u.id) || null,
          settings: memory.userSettings.find((s) => s.userId === u.id) || null,
          skills: memory.userSkills.filter((s) => s.userId === u.id),
        };
      }
      return null;
    },
    findMany: async () => memory.users,
    create: async ({ data }: any) => {
      const newUser = { id: `usr-${Date.now().toString(36)}`, ...data, createdAt: new Date() };
      memory.users.push(newUser);
      return newUser;
    },
    update: async ({ where, data }: any) => {
      const idx = memory.users.findIndex((u) => u.id === where.id);
      if (idx !== -1) {
        memory.users[idx] = { ...memory.users[idx], ...data, updatedAt: new Date() };
        return memory.users[idx];
      }
      return null;
    },
  },

  profile: {
    findUnique: async ({ where }: any) => {
      return memory.profiles.find((p) => p.userId === where.userId) || null;
    },
    create: async ({ data }: any) => {
      const newProf = { id: `prof-${Date.now().toString(36)}`, ...data, createdAt: new Date() };
      memory.profiles.push(newProf);
      return newProf;
    },
    update: async ({ where, data }: any) => {
      const idx = memory.profiles.findIndex((p) => p.userId === where.userId);
      if (idx !== -1) {
        memory.profiles[idx] = { ...memory.profiles[idx], ...data, updatedAt: new Date() };
        return memory.profiles[idx];
      }
      return null;
    },
  },

  userSettings: {
    findUnique: async ({ where }: any) => {
      return memory.userSettings.find((s) => s.userId === where.userId) || null;
    },
    create: async ({ data }: any) => {
      const newSet = { id: `set-${Date.now().toString(36)}`, ...data };
      memory.userSettings.push(newSet);
      return newSet;
    },
    update: async ({ where, data }: any) => {
      const idx = memory.userSettings.findIndex((s) => s.userId === where.userId);
      if (idx !== -1) {
        memory.userSettings[idx] = { ...memory.userSettings[idx], ...data };
        return memory.userSettings[idx];
      }
      return null;
    },
  },

  notificationPreference: {
    findUnique: async ({ where }: any) => {
      return memory.notificationPreferences.find((n) => n.userId === where.userId) || null;
    },
    create: async ({ data }: any) => {
      const newPref = { id: `notif-${Date.now().toString(36)}`, ...data };
      memory.notificationPreferences.push(newPref);
      return newPref;
    },
    update: async ({ where, data }: any) => {
      const idx = memory.notificationPreferences.findIndex((n) => n.userId === where.userId);
      if (idx !== -1) {
        memory.notificationPreferences[idx] = { ...memory.notificationPreferences[idx], ...data };
        return memory.notificationPreferences[idx];
      }
      return null;
    },
  },

  userSkill: {
    findMany: async ({ where }: any) => {
      return memory.userSkills.filter((s) => s.userId === where.userId);
    },
    findUnique: async ({ where }: any) => {
      return memory.userSkills.find(
        (s) => s.userId === where.userId_categoryName?.userId && s.categoryName === where.userId_categoryName?.categoryName
      ) || null;
    },
    create: async ({ data }: any) => {
      const newSkill = { id: `skill-${Date.now().toString(36)}`, ...data };
      memory.userSkills.push(newSkill);
      return newSkill;
    },
    update: async ({ where, data }: any) => {
      const idx = memory.userSkills.findIndex((s) => s.id === where.id);
      if (idx !== -1) {
        memory.userSkills[idx] = { ...memory.userSkills[idx], ...data };
        return memory.userSkills[idx];
      }
      return null;
    },
  },

  challenge: {
    findMany: async ({ where, skip = 0, take = 20 }: any = {}) => {
      let list = memory.challenges;
      if (where?.category) list = list.filter((c) => c.category === where.category);
      if (where?.difficulty) list = list.filter((c) => c.difficulty === where.difficulty);
      if (where?.companyName) list = list.filter((c) => c.companyName === where.companyName);
      if (where?.featured) list = list.filter((c) => c.featured);
      return list.slice(skip, skip + take);
    },
    findUnique: async ({ where }: any) => {
      return memory.challenges.find((c) => c.id === where.id || c.slug === where.slug) || null;
    },
    count: async ({ where }: any = {}) => memory.challenges.length,
    create: async ({ data }: any) => {
      const item = { id: `chal-${Date.now().toString(36)}`, ...data };
      memory.challenges.push(item);
      return item;
    },
    update: async ({ where, data }: any) => {
      const idx = memory.challenges.findIndex((c) => c.id === where.id);
      if (idx !== -1) {
        memory.challenges[idx] = { ...memory.challenges[idx], ...data };
        return memory.challenges[idx];
      }
      return null;
    },
    delete: async ({ where }: any) => {
      memory.challenges = memory.challenges.filter((c) => c.id !== where.id);
      return { id: where.id };
    },
  },

  challengeAttempt: {
    findMany: async ({ where }: any = {}) => {
      return memory.attempts.filter((a) => !where?.userId || a.userId === where.userId);
    },
    count: async ({ where }: any = {}) => {
      return memory.attempts.filter((a) => (!where?.userId || a.userId === where.userId) && (!where?.status || a.status === where.status)).length;
    },
    create: async ({ data }: any) => {
      const newAtt = { id: `att-${Date.now().toString(36)}`, ...data, createdAt: new Date() };
      memory.attempts.push(newAtt);
      return newAtt;
    },
  },

  achievement: {
    findMany: async () => memory.achievements,
    findUnique: async ({ where }: any) => memory.achievements.find((a) => a.id === where.id || a.title === where.title) || null,
  },

  userAchievement: {
    findMany: async ({ where }: any = {}) => {
      return memory.userAchievements.filter((ua) => !where?.userId || ua.userId === where.userId);
    },
    count: async ({ where }: any = {}) => memory.userAchievements.filter((ua) => !where?.userId || ua.userId === where.userId).length,
    upsert: async ({ create }: any) => {
      memory.userAchievements.push(create);
      return create;
    },
  },

  activityLog: {
    findMany: async ({ where, take = 10 }: any = {}) => {
      return memory.activities.filter((act) => !where?.userId || act.userId === where.userId).slice(0, take);
    },
    create: async ({ data }: any) => {
      const newAct = { id: `act-${Date.now().toString(36)}`, ...data, createdAt: new Date() };
      memory.activities.unshift(newAct);
      return newAct;
    },
  },

  aiInsight: {
    findMany: async ({ where, take = 10 }: any = {}) => {
      return memory.aiInsights.filter((ins) => !where?.userId || ins.userId === where.userId).slice(0, take);
    },
    create: async ({ data }: any) => {
      const newIns = { id: `ins-${Date.now().toString(36)}`, ...data, createdAt: new Date() };
      memory.aiInsights.unshift(newIns);
      return newIns;
    },
  },

  savedChallenge: {
    upsert: async ({ create }: any) => {
      memory.savedChallenges.push(create);
      return create;
    },
    deleteMany: async ({ where }: any) => {
      memory.savedChallenges = memory.savedChallenges.filter(
        (sc) => sc.userId !== where.userId || sc.challengeId !== where.challengeId
      );
      return { count: 1 };
    },
  },

  profileView: {
    create: async ({ data }: any) => {
      memory.profileViews.push(data);
      return data;
    },
  },

  $transaction: async (fn: any) => {
    if (typeof fn === "function") {
      return fn(db);
    }
    return Promise.all(fn);
  },
};
