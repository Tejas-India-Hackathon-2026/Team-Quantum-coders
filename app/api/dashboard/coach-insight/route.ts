import { NextRequest } from "next/server";
import { getCurrentUser } from "@/lib/permissions";
import { CoachService } from "@/services/coach/coach.service";
import { successResponse, errorResponse } from "@/lib/api-response";

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return successResponse({
        title: "Welcome to LifeProof AI Mentorship",
        message: "Start solving interactive sandbox assessments to map your real-world strengths and architectural gaps.",
        severity: "RECOMMENDATION",
        recommendedAction: "Explore Marketplace",
      });
    }

    const insights = await CoachService.getCoachInsights(user.id);
    const latestInsight = insights[0] || (await CoachService.generateRecommendation(user.id)).insight;

    return successResponse(latestInsight);
  } catch (error: any) {
    return errorResponse(error.message);
  }
}
