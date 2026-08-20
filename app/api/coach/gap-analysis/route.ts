import { NextRequest } from "next/server";
import { getCurrentUser } from "@/lib/permissions";
import { CoachService } from "@/services/coach/coach.service";
import { successResponse, errorResponse } from "@/lib/api-response";

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return successResponse({
        userId: "guest",
        totalGapsIdentified: 0,
        readinessScore: 0,
        gaps: [],
      });
    }

    const analysis = await CoachService.performGapAnalysis(user.id);
    return successResponse(analysis);
  } catch (error: any) {
    return errorResponse(error.message);
  }
}
