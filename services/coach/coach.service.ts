import { db } from "@/lib/db";

export class CoachService {
  static async getCoachInsights(userId: string) {
    return db.aiInsight.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 10,
    });
  }

  static async generateRecommendation(userId: string, input?: { skillCategory?: string; targetRole?: string }) {
    const user = await db.user.findUnique({
      where: { id: userId },
      include: { skills: true, attempts: true },
    });

    if (!user) {
      throw new Error("User not found");
    }

    // Find lowest score / unverified skill to recommend challenge
    const weakestSkill = user.skills.find((s) => !s.verified) || user.skills.sort((a, b) => a.level - b.level)[0];
    const categoryToFocus = input?.skillCategory || weakestSkill?.categoryName || "Backend & Distributed Systems";

    const recommendedChallenge = await db.challenge.findFirst({
      where: {
        category: categoryToFocus,
        status: "Active",
      },
      orderBy: { participantsCount: "desc" },
    });

    const insight = await db.aiInsight.create({
      data: {
        userId,
        title: `AI Recommendation: Strengthen ${categoryToFocus}`,
        message: recommendedChallenge
          ? `Based on your current Skill DNA, solving "${recommendedChallenge.title}" will improve your competency rating by ~+18% in ${categoryToFocus}.`
          : `We recommend exploring active assessments in ${categoryToFocus} to mint your next verified proof seal.`,
        severity: "RECOMMENDATION",
        recommendedAction: recommendedChallenge ? "Accept Challenge" : "Browse Marketplace",
        relatedChallengeId: recommendedChallenge?.id,
      },
    });

    return {
      insight,
      recommendedChallenge,
      focusCategory: categoryToFocus,
    };
  }

  static async performGapAnalysis(userId: string) {
    const skills = await db.userSkill.findMany({
      where: { userId },
    });

    const gaps = skills
      .filter((s) => s.level < 70)
      .map((s) => ({
        category: s.categoryName,
        currentScore: s.score,
        currentLevel: s.level,
        targetLevel: 80,
        gapPercentage: 80 - s.level,
        status: s.verified ? "Needs Reinforcement" : "Unverified",
      }));

    return {
      userId,
      totalGapsIdentified: gaps.length,
      readinessScore: Math.round(
        skills.reduce((acc, s) => acc + s.level, 0) / (skills.length || 1)
      ),
      gaps,
    };
  }
}
