import { NextRequest } from "next/server";
import { getCurrentUser, requireAdminUser } from "@/lib/permissions";
import { ChallengeService } from "@/services/challenge/challenge.service";
import { db } from "@/lib/db";
import { successResponse, notFoundResponse, unauthorizedResponse, errorResponse } from "@/lib/api-response";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();
    const challenge = await ChallengeService.getChallengeById(params.id, user?.id);

    return successResponse(challenge);
  } catch (error: any) {
    return notFoundResponse("Challenge not found");
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAdminUser();
    const body = await req.json();

    const updated = await db.challenge.update({
      where: { id: params.id },
      data: body,
    });

    return successResponse(updated, "Challenge updated successfully");
  } catch (error: any) {
    if (error.message === "UNAUTHORIZED" || error.message === "FORBIDDEN") {
      return unauthorizedResponse("Admin authorization required");
    }
    return errorResponse(error.message || "Failed to update challenge");
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAdminUser();

    await db.challenge.delete({
      where: { id: params.id },
    });

    return successResponse(null, "Challenge deleted successfully");
  } catch (error: any) {
    if (error.message === "UNAUTHORIZED" || error.message === "FORBIDDEN") {
      return unauthorizedResponse("Admin authorization required");
    }
    return errorResponse(error.message || "Failed to delete challenge");
  }
}
