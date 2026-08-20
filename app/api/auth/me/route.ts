import { NextRequest } from "next/server";
import { getCurrentUser } from "@/lib/permissions";
import { successResponse, unauthorizedResponse } from "@/lib/api-response";

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return unauthorizedResponse("No active session found");
    }

    return successResponse(
      {
        id: user.id,
        email: user.email,
        name: user.name,
        username: user.username,
        role: user.role,
        totalXp: user.totalXp,
        rank: user.rank,
        image: user.image,
        profile: user.profile,
        settings: user.settings,
        skills: user.skills,
      },
      "Current user session retrieved"
    );
  } catch (error: any) {
    return unauthorizedResponse(error.message);
  }
}
