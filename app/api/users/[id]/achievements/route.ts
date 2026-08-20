import { NextRequest } from "next/server";
import { AchievementService } from "@/services/achievement/achievement.service";
import { successResponse, errorResponse } from "@/lib/api-response";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const achievements = await AchievementService.getUserAchievements(params.id);
    return successResponse(achievements);
  } catch (error: any) {
    return errorResponse(error.message);
  }
}
