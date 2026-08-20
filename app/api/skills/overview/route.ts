import { NextRequest } from "next/server";
import { getCurrentUser } from "@/lib/permissions";
import { SkillService } from "@/services/skill/skill.service";
import { successResponse, errorResponse } from "@/lib/api-response";

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return successResponse({
        skills: [],
        averageScore: 0,
        strongestArea: "Frontend Architecture",
        totalVerifiedSkills: 0,
      });
    }

    const overview = await SkillService.getSkillRadarOverview(user.id);
    return successResponse(overview);
  } catch (error: any) {
    return errorResponse(error.message);
  }
}
