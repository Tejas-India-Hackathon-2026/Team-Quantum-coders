import { NextRequest } from "next/server";
import { getCurrentUser } from "@/lib/permissions";
import { SkillService } from "@/services/skill/skill.service";
import { successResponse, errorResponse } from "@/lib/api-response";
import { STARTER_SKILLS } from "@/data/mockSkills";

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return successResponse(STARTER_SKILLS);
    }

    const skills = await SkillService.getUserSkills(user.id);
    return successResponse(skills);
  } catch (error: any) {
    return errorResponse(error.message);
  }
}
