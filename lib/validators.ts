import { z } from "zod";

// ----------------------------------------------------
// Authentication Schemas
// ----------------------------------------------------

export const registerSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters").max(60),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(30)
    .regex(/^[a-zA-Z0-9_-]+$/, "Username can only contain alphanumeric characters, underscores, and hyphens")
    .optional(),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

// ----------------------------------------------------
// Profile Schemas
// ----------------------------------------------------

export const profileUpdateSchema = z.object({
  fullName: z.string().min(2).max(60).optional(),
  headline: z.string().max(120).optional(),
  bio: z.string().max(1000).optional(),
  location: z.string().max(100).optional(),
  website: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  socialLinks: z
    .object({
      github: z.string().optional(),
      twitter: z.string().optional(),
      linkedin: z.string().optional(),
    })
    .optional(),
  publicProfileEnabled: z.boolean().optional(),
  showSkillDNA: z.boolean().optional(),
  showAchievements: z.boolean().optional(),
  showCompletedChallenges: z.boolean().optional(),
  recruiterVisible: z.boolean().optional(),
});

// ----------------------------------------------------
// Settings Schemas
// ----------------------------------------------------

export const settingsUpdateSchema = z.object({
  theme: z.enum(["dark", "light", "system"]).optional(),
  accentColor: z.string().optional(),
  layoutDensity: z.enum(["comfortable", "compact"]).optional(),
  emailNotifications: z.boolean().optional(),
  challengeNotifications: z.boolean().optional(),
  coachNotifications: z.boolean().optional(),
  badgeNotifications: z.boolean().optional(),
  securityAlerts: z.boolean().optional(),
  weeklySummary: z.boolean().optional(),
  twoFactorEnabled: z.boolean().optional(),
  loginAlertsEnabled: z.boolean().optional(),
  profileVisibility: z.boolean().optional(),
  searchEngineIndexing: z.boolean().optional(),
});

// ----------------------------------------------------
// Challenge Schemas
// ----------------------------------------------------

export const challengeCreateSchema = z.object({
  title: z.string().min(5).max(120),
  slug: z.string().min(3).max(120),
  companyName: z.string().min(2).max(80),
  companyLogo: z.string().url().optional(),
  description: z.string().min(20),
  difficulty: z.enum(["Beginner", "Intermediate", "Advanced", "Mastery"]),
  prizeAmount: z.string().optional(),
  estimatedTime: z.number().int().positive().default(45),
  category: z.string().min(2),
  tags: z.array(z.string()).min(1),
  deadline: z.string().optional(),
  starterCode: z.string().optional(),
  testSuiteCode: z.string().optional(),
  xpReward: z.number().int().positive().default(300),
  featured: z.boolean().default(false),
  endingSoon: z.boolean().default(false),
});

export const challengeFilterSchema = z.object({
  search: z.string().optional(),
  category: z.string().optional(),
  difficulty: z.string().optional(),
  status: z.string().optional(),
  company: z.string().optional(),
  featured: z.string().optional(),
  page: z.string().transform((v) => parseInt(v, 10)).optional(),
  limit: z.string().transform((v) => parseInt(v, 10)).optional(),
});

export const challengeAttemptSchema = z.object({
  codeSubmitted: z.string().min(10, "Submitted code cannot be empty"),
  timeSpentSeconds: z.number().int().nonnegative().optional(),
});

// ----------------------------------------------------
// AI Coach Schemas
// ----------------------------------------------------

export const coachRecommendationSchema = z.object({
  skillCategory: z.string().optional(),
  currentScore: z.number().optional(),
  targetRole: z.string().optional(),
});

export const coachPromptSchema = z.object({
  message: z.string().min(1, "Message cannot be empty").max(2000),
  context: z.string().optional(),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type ProfileUpdateInput = z.infer<typeof profileUpdateSchema>;
export type SettingsUpdateInput = z.infer<typeof settingsUpdateSchema>;
export type ChallengeCreateInput = z.infer<typeof challengeCreateSchema>;
export type ChallengeAttemptInput = z.infer<typeof challengeAttemptSchema>;
