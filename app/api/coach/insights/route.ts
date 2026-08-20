import { NextRequest } from "next/server";
import { getCurrentUser } from "@/lib/permissions";
import { CoachService } from "@/services/coach/coach.service";
import { successResponse, errorResponse } from "@/lib/api-response";

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return successResponse([]);
    }

    const insights = await CoachService.getCoachInsights(user.id);
    return successResponse(insights);
  } catch (error: any) {
    return errorResponse(error.message);
  }
}
