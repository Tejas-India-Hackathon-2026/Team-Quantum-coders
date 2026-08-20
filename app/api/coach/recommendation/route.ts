import { NextRequest } from "next/server";
import { getCurrentUser, requireAuthUser } from "@/lib/permissions";
import { CoachService } from "@/services/coach/coach.service";
import { coachRecommendationSchema } from "@/lib/validators";
import { successResponse, unauthorizedResponse, errorResponse } from "@/lib/api-response";

export async function POST(req: NextRequest) {
  try {
    const user = await requireAuthUser();
    let body = {};
    try {
      body = await req.json();
    } catch {
      // Optional body
    }

    const validation = coachRecommendationSchema.safeParse(body);
    const result = await CoachService.generateRecommendation(
      user.id,
      validation.success ? validation.data : undefined
    );

    return successResponse(result, "Recommendation generated successfully");
  } catch (error: any) {
    if (error.message === "UNAUTHORIZED") {
      return unauthorizedResponse();
    }
    return errorResponse(error.message || "Failed to generate recommendation");
  }
}
