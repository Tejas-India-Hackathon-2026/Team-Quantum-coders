import { NextRequest } from "next/server";
import { requireAuthUser, getCurrentUser } from "@/lib/permissions";
import { UserService } from "@/services/user/user.service";
import { settingsUpdateSchema } from "@/lib/validators";
import { successResponse, unauthorizedResponse, validationErrorResponse, errorResponse } from "@/lib/api-response";

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return unauthorizedResponse();
    }

    const settings = await UserService.getUserSettings(user.id);
    return successResponse(settings);
  } catch (error: any) {
    return errorResponse(error.message);
  }
}

export async function PUT(req: NextRequest) {
  try {
    const user = await requireAuthUser();
    const body = await req.json();

    const validation = settingsUpdateSchema.safeParse(body);
    if (!validation.success) {
      return validationErrorResponse(validation.error.format());
    }

    const updated = await UserService.updateUserSettings(user.id, validation.data);
    return successResponse(updated, "Settings updated successfully");
  } catch (error: any) {
    if (error.message === "UNAUTHORIZED") {
      return unauthorizedResponse();
    }
    return errorResponse(error.message || "Failed to update settings");
  }
}
