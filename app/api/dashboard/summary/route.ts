import { NextRequest } from "next/server";
import { getCurrentUser } from "@/lib/permissions";
import { db } from "@/lib/db";
import { successResponse, unauthorizedResponse, errorResponse } from "@/lib/api-response";
import { STARTER_USER } from "@/data/mockAchievements";

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      // Fallback guest preview
      return successResponse({
        user: STARTER_USER,
        stats: {
          totalXp: 0,
          completedChallengesCount: 0,
          rank: "Challenger I",
          globalPercentile: 0,
          skillsCount: STARTER_USER.skills.length,
          achievementsCount: 0,
        },
      });
    }

    const [completedCount, achievementsCount, activeChallenges] = await Promise.all([
      db.challengeAttempt.count({
        where: { userId: user.id, status: "PASSED" },
      }),
      db.userAchievement.count({
        where: { userId: user.id },
      }),
      db.challengeAttempt.findMany({
        where: { userId: user.id },
        include: { challenge: true },
        take: 4,
        orderBy: { createdAt: "desc" },
      }),
    ]);

    return successResponse({
      user: {
        id: user.id,
        fullName: user.profile?.fullName || user.name || "Engineer",
        username: user.username,
        avatarUrl: user.profile?.avatarUrl || user.image,
        rank: user.rank,
        totalXp: user.totalXp,
        proofBadgeId: user.profile?.proofBadgeId,
        verifiedSince: user.profile?.verifiedSince,
      },
      stats: {
        totalXp: user.totalXp,
        completedChallengesCount: completedCount,
        rank: user.rank,
        globalPercentile: user.profile?.globalPercentile || 0,
        skillsCount: user.skills.length,
        achievementsCount,
      },
      skills: user.skills,
      recentAttempts: activeChallenges,
    });
  } catch (error: any) {
    return errorResponse(error.message || "Failed to load dashboard summary");
  }
}
