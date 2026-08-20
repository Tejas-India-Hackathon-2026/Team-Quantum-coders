import { db } from "@/lib/db";

export class SkillService {
  static async getUserSkills(userId: string) {
    return db.userSkill.findMany({
      where: { userId },
      orderBy: { level: "desc" },
    });
  }

  static async getSkillRadarOverview(userId: string) {
    const skills = await db.userSkill.findMany({
      where: { userId },
    });

    if (skills.length === 0) {
      return {
        skills: [],
        averageScore: 0,
        strongestArea: "None yet",
        topPercentile: 0,
      };
    }

    const totalScore = skills.reduce((acc, s) => acc + s.score, 0);
    const averageScore = Math.round(totalScore / skills.length);
    const strongestSkill = [...skills].sort((a, b) => b.level - a.level)[0];

    return {
      skills,
      averageScore,
      strongestArea: strongestSkill?.categoryName || "Frontend Architecture",
      topLevel: strongestSkill?.level || 0,
      totalVerifiedSkills: skills.filter((s) => s.verified).length,
    };
  }
}
