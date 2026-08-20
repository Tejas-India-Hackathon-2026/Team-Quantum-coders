import { NextRequest } from "next/server";
import { getCurrentUser, requireAuthUser } from "@/lib/permissions";
import { UserService } from "@/services/user/user.service";
import { profileUpdateSchema } from "@/lib/validators";
import { successResponse, unauthorizedResponse, validationErrorResponse, errorResponse } from "@/lib/api-response";
import { STARTER_USER } from "@/data/mockAchievements";

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return successResponse(STARTER_USER);
    }
    return successResponse(user);
  } catch (error: any) {
    return errorResponse(error.message);
  }
}

export async function PUT(req: NextRequest) {
  try {
    const user = await requireAuthUser();
    const body = await req.json();

    const validation = profileUpdateSchema.safeParse(body);
    if (!validation.success) {
      return validationErrorResponse(validation.error.format());
    }

    const updatedProfile = await UserService.updateProfile(user.id, validation.data);
    return successResponse(updatedProfile, "Profile updated successfully");
  } catch (error: any) {
    if (error.message === "UNAUTHORIZED") {
      return unauthorizedResponse();
    }
    return errorResponse(error.message || "Failed to update profile", 400);
  }
}
