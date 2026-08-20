import { NextRequest } from "next/server";
import { requireAuthUser } from "@/lib/permissions";
import { UserService } from "@/services/user/user.service";
import { successResponse, unauthorizedResponse, errorResponse } from "@/lib/api-response";

export async function POST(req: NextRequest) {
  try {
    const user = await requireAuthUser();
    const body = await req.json();

    if (!body.avatarUrl) {
      return errorResponse("Avatar URL is required", 400);
    }

    const updated = await UserService.updateAvatar(user.id, body.avatarUrl);
    return successResponse(updated, "Avatar updated successfully");
  } catch (error: any) {
    if (error.message === "UNAUTHORIZED") {
      return unauthorizedResponse();
    }
    return errorResponse(error.message || "Failed to update avatar");
  }
}
