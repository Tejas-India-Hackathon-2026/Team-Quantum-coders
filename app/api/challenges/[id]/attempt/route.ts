import { NextRequest } from "next/server";
import { requireAuthUser } from "@/lib/permissions";
import { ChallengeService } from "@/services/challenge/challenge.service";
import { challengeAttemptSchema } from "@/lib/validators";
import { successResponse, validationErrorResponse, unauthorizedResponse, errorResponse } from "@/lib/api-response";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await requireAuthUser();
    const body = await req.json();

    const validation = challengeAttemptSchema.safeParse(body);
    if (!validation.success) {
      return validationErrorResponse(validation.error.format());
    }

    const result = await ChallengeService.submitAttempt(
      user.id,
      params.id,
      validation.data.codeSubmitted
    );

    return successResponse(
      result,
      `Challenge passed! You earned +${result.xpEarned} XP and minted verification proof ${result.proofHash}.`,
      201
    );
  } catch (error: any) {
    if (error.message === "UNAUTHORIZED") {
      return unauthorizedResponse("You must be logged in to submit challenge assessments");
    }
    return errorResponse(error.message || "Failed to submit challenge attempt", 400);
  }
}
