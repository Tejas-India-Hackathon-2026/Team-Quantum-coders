import { NextRequest } from "next/server";
import { getCurrentUser } from "@/lib/permissions";
import { AchievementService } from "@/services/achievement/achievement.service";
import { successResponse, errorResponse } from "@/lib/api-response";
import { MOCK_ACHIEVEMENTS } from "@/data/mockAchievements";

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return successResponse(MOCK_ACHIEVEMENTS);
    }

    const achievements = await AchievementService.getUserAchievements(user.id);
    return successResponse(achievements.length > 0 ? achievements : MOCK_ACHIEVEMENTS.slice(0, 2));
  } catch (error: any) {
    return errorResponse(error.message);
  }
}
