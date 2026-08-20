import { db } from "@/lib/db";
import { ActivityType } from "@prisma/client";

export class ActivityService {
  static async logActivity(
    userId: string,
    type: ActivityType,
    title: string,
    description?: string,
    metadata?: Record<string, any>
  ) {
    return db.activityLog.create({
      data: {
        userId,
        type,
        title,
        description,
        metadata: metadata ? (metadata as any) : undefined,
      },
    });
  }

  static async getUserActivities(userId: string, limit = 10) {
    return db.activityLog.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: limit,
    });
  }
}
