import { db } from "@/lib/db";
import crypto from "crypto";

export class AchievementService {
  static async getAllAchievements() {
    return db.achievement.findMany({
      orderBy: { createdAt: "desc" },
    });
  }

  static async getUserAchievements(userId: string) {
    const userAchievements = await db.userAchievement.findMany({
      where: { userId },
      include: {
        achievement: true,
      },
      orderBy: { earnedAt: "desc" },
    });

    return userAchievements.map((ua) => ({
      id: ua.achievement.id,
      title: ua.achievement.title,
      description: ua.achievement.description,
      icon: ua.achievement.icon,
      unlockedAt: ua.earnedAt.toISOString().split("T")[0],
      rarity: ua.achievement.rarity,
      proofHash: ua.proofHash || ua.achievement.proofHash,
      category: ua.achievement.category,
    }));
  }

  static async awardAchievement(userId: string, achievementTitle: string) {
    const achievement = await db.achievement.findUnique({
      where: { title: achievementTitle },
    });

    if (!achievement) return null;

    const proofHash = "0x" + crypto.createHash("sha256").update(`${userId}:${achievement.id}:${Date.now()}`).digest("hex").slice(0, 24);

    const userAchievement = await db.userAchievement.upsert({
      where: {
        userId_achievementId: {
          userId,
          achievementId: achievement.id,
        },
      },
      create: {
        userId,
        achievementId: achievement.id,
        proofHash,
      },
      update: {},
    });

    await db.activityLog.create({
      data: {
        userId,
        type: "ACHIEVEMENT_UNLOCKED",
        title: `Earned "${achievement.title}" Trophy`,
        description: achievement.description,
        metadata: { achievementId: achievement.id, proofHash },
      },
    });

    return userAchievement;
  }
}
