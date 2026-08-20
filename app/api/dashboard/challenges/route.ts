import { NextRequest } from "next/server";
import { getCurrentUser } from "@/lib/permissions";
import { ChallengeService } from "@/services/challenge/challenge.service";
import { successResponse, errorResponse } from "@/lib/api-response";

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    const result = await ChallengeService.getChallenges({
      limit: 6,
      userId: user?.id,
    });

    return successResponse(result.challenges);
  } catch (error: any) {
    return errorResponse(error.message);
  }
}
