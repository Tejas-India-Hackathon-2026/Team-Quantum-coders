import { NextRequest } from "next/server";
import { UserService } from "@/services/user/user.service";
import { successResponse, notFoundResponse, errorResponse } from "@/lib/api-response";

export async function GET(
  req: NextRequest,
  { params }: { params: { username: string } }
) {
  try {
    const profile = await UserService.getPublicProfile(params.username);

    if (!profile) {
      return notFoundResponse("Public verified profile not found");
    }

    return successResponse(profile);
  } catch (error: any) {
    return errorResponse(error.message);
  }
}
