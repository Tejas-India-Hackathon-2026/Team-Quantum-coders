import { NextRequest } from "next/server";
import { getCurrentUser, requireAdminUser } from "@/lib/permissions";
import { ChallengeService } from "@/services/challenge/challenge.service";
import { challengeFilterSchema, challengeCreateSchema } from "@/lib/validators";
import { successResponse, validationErrorResponse, unauthorizedResponse, errorResponse } from "@/lib/api-response";

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    const url = new URL(req.url);

    const queryParams = {
      search: url.searchParams.get("search") || undefined,
      category: url.searchParams.get("category") || undefined,
      difficulty: url.searchParams.get("difficulty") || undefined,
      status: url.searchParams.get("status") || undefined,
      company: url.searchParams.get("company") || undefined,
      featured: url.searchParams.get("featured") || undefined,
      page: url.searchParams.get("page") || undefined,
      limit: url.searchParams.get("limit") || undefined,
    };

    const validation = challengeFilterSchema.safeParse(queryParams);
    if (!validation.success) {
      return validationErrorResponse(validation.error.format());
    }

    const result = await ChallengeService.getChallenges({
      ...validation.data,
      userId: user?.id,
    });

    return successResponse(result);
  } catch (error: any) {
    return errorResponse(error.message);
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireAdminUser();
    const body = await req.json();

    const validation = challengeCreateSchema.safeParse(body);
    if (!validation.success) {
      return validationErrorResponse(validation.error.format());
    }

    const challenge = await ChallengeService.createChallenge(validation.data);
    return successResponse(challenge, "Challenge created successfully", 201);
  } catch (error: any) {
    if (error.message === "UNAUTHORIZED" || error.message === "FORBIDDEN") {
      return unauthorizedResponse("Admin authorization required to create challenges");
    }
    return errorResponse(error.message || "Failed to create challenge", 400);
  }
}
