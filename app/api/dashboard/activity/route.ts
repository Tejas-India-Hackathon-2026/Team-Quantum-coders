import { NextRequest } from "next/server";
import { getCurrentUser } from "@/lib/permissions";
import { ActivityService } from "@/services/activity/activity.service";
import { successResponse, errorResponse } from "@/lib/api-response";

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return successResponse([
        {
          id: "act-1",
          type: "LOGIN",
          title: "Session Initialized",
          description: "Logged into LifeProof Dashboard.",
          createdAt: new Date().toISOString(),
        },
      ]);
    }

    const activities = await ActivityService.getUserActivities(user.id, 8);
    return successResponse(activities);
  } catch (error: any) {
    return errorResponse(error.message);
  }
}
