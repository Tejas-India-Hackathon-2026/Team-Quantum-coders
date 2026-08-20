import { NextRequest } from "next/server";
import { requireAuthUser } from "@/lib/permissions";
import { ChallengeService } from "@/services/challenge/challenge.service";
import { successResponse, unauthorizedResponse, errorResponse } from "@/lib/api-response";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await requireAuthUser();
    await ChallengeService.saveChallenge(user.id, params.id);
    return successResponse({ saved: true }, "Challenge saved to bookmarks");
  } catch (error: any) {
    if (error.message === "UNAUTHORIZED") {
      return unauthorizedResponse();
    }
    return errorResponse(error.message);
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await requireAuthUser();
    await ChallengeService.unsaveChallenge(user.id, params.id);
    return successResponse({ saved: false }, "Challenge removed from bookmarks");
  } catch (error: any) {
    if (error.message === "UNAUTHORIZED") {
      return unauthorizedResponse();
    }
    return errorResponse(error.message);
  }
}
