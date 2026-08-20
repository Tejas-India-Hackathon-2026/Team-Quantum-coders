import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { RegisterInput } from "@/lib/validators";
import { STARTER_SKILLS } from "@/data/mockSkills";

export class AuthService {
  static async registerUser(input: RegisterInput) {
    const existingEmail = await db.user.findUnique({
      where: { email: input.email.toLowerCase().trim() },
    });

    if (existingEmail) {
      throw new Error("An account with this email address already exists.");
    }

    const username =
      input.username?.toLowerCase().trim() ||
      input.email.split("@")[0].toLowerCase().replace(/[^a-z0-9_-]/g, "_") + "_" + Math.floor(100 + Math.random() * 900);

    const existingUsername = await db.user.findUnique({
      where: { username },
    });

    if (existingUsername) {
      throw new Error("This username is already taken. Please choose another.");
    }

    const passwordHash = await bcrypt.hash(input.password, 12);

    // Create User transactionally with Profile, Settings, and Starter Skills
    const newUser = await db.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          name: input.fullName.trim(),
          email: input.email.toLowerCase().trim(),
          username,
          passwordHash,
          role: "USER",
          rank: "Challenger I",
          totalXp: 0,
          profileCompleteness: 50,
          image: `https://api.dicebear.com/7.x/bottts/svg?seed=${username}`,
        },
      });

      await tx.profile.create({
        data: {
          userId: user.id,
          fullName: input.fullName.trim(),
          avatarUrl: user.image,
          headline: "Aspiring Verified Engineer",
          bio: "Starting my journey on LifeProof. Ready to take engineering assessments and prove my skills on-chain.",
          proofBadgeId: `LP-PROOF-${Math.floor(1000 + Math.random() * 9000)}-GENESIS`,
          verifiedSince: new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" }),
          publicProfileEnabled: true,
          showSkillDNA: true,
          showAchievements: true,
          showCompletedChallenges: true,
          recruiterVisible: true,
        },
      });

      await tx.userSettings.create({
        data: {
          userId: user.id,
          theme: "dark",
          accentColor: "indigo",
          layoutDensity: "comfortable",
        },
      });

      await tx.notificationPreference.create({
        data: {
          userId: user.id,
        },
      });

      // Initialize 6 baseline technical categories
      for (const s of STARTER_SKILLS) {
        await tx.userSkill.create({
          data: {
            userId: user.id,
            categoryName: s.category,
            score: 0,
            level: 0,
            percentage: 0.0,
            strengthLabel: "Novice",
            verified: false,
          },
        });
      }

      // Initial activity log
      await tx.activityLog.create({
        data: {
          userId: user.id,
          type: "LOGIN",
          title: "Genesis Profile Created",
          description: "Welcome to LifeProof! Your cryptographic skill ledger has been initialized.",
        },
      });

      // Initial AI Coach onboarding insight
      await tx.aiInsight.create({
        data: {
          userId: user.id,
          title: "Welcome to Your Skill DNA Matrix",
          message: "Select your first technical challenge from the Marketplace to begin establishing your verified proof-of-competence score.",
          severity: "RECOMMENDATION",
          recommendedAction: "Browse Challenges",
        },
      });

      return user;
    });

    return {
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
      username: newUser.username,
    };
  }
}
