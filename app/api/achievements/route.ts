import { NextRequest } from "next/server";
import { AchievementService } from "@/services/achievement/achievement.service";
import { successResponse, errorResponse } from "@/lib/api-response";

export async function GET(req: NextRequest) {
  try {
    const achievements = await AchievementService.getAllAchievements();
    return successResponse(achievements);
  } catch (error: any) {
    return errorResponse(error.message);
  }
}
