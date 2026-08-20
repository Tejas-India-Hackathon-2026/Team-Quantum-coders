import { db } from "@/lib/db";
import { ProfileUpdateInput, SettingsUpdateInput } from "@/lib/validators";

export class UserService {
  static async getUserProfile(userId: string) {
    const user = await db.user.findUnique({
      where: { id: userId },
      include: {
        profile: true,
        settings: true,
        notificationPrefs: true,
        skills: true,
        achievements: {
          include: { achievement: true },
        },
      },
    });

    if (!user) {
      throw new Error("User not found");
    }

    return user;
  }

  static async getPublicProfile(username: string) {
    const user = await db.user.findUnique({
      where: { username: username.toLowerCase().trim() },
      include: {
        profile: true,
        skills: true,
        achievements: {
          include: { achievement: true },
        },
        attempts: {
          where: { status: "PASSED" },
          include: { challenge: true },
          take: 6,
        },
      },
    });

    if (!user || !user.profile?.publicProfileEnabled) {
      return null;
    }

    // Record Profile View analytics asynchronously
    db.profileView
      .create({
        data: {
          profileId: user.id,
        },
      })
      .catch(() => {});

    return {
      username: user.username,
      fullName: user.profile.fullName,
      headline: user.profile.headline,
      bio: user.profile.bio,
      avatarUrl: user.profile.avatarUrl,
      location: user.profile.location,
      website: user.profile.website,
      socialLinks: user.profile.socialLinks,
      rank: user.rank,
      totalXp: user.totalXp,
      verifiedSince: user.profile.verifiedSince,
      proofBadgeId: user.profile.proofBadgeId,
      globalPercentile: user.profile.globalPercentile,
      skills: user.profile.showSkillDNA ? user.skills : [],
      achievements: user.profile.showAchievements ? user.achievements : [],
      completedChallenges: user.profile.showCompletedChallenges ? user.attempts : [],
      recruiterVisible: user.profile.recruiterVisible,
    };
  }

  static async updateProfile(userId: string, input: ProfileUpdateInput) {
    const updated = await db.profile.update({
      where: { userId },
      data: {
        fullName: input.fullName,
        headline: input.headline,
        bio: input.bio,
        location: input.location,
        website: input.website,
        socialLinks: input.socialLinks ? (input.socialLinks as any) : undefined,
        publicProfileEnabled: input.publicProfileEnabled,
        showSkillDNA: input.showSkillDNA,
        showAchievements: input.showAchievements,
        showCompletedChallenges: input.showCompletedChallenges,
        recruiterVisible: input.recruiterVisible,
      },
    });

    // Also update User name if provided
    if (input.fullName) {
      await db.user.update({
        where: { id: userId },
        data: { name: input.fullName },
      });
    }

    await db.activityLog.create({
      data: {
        userId,
        type: "PROFILE_UPDATED",
        title: "Profile Updated",
        description: "Your verified public profile attributes were updated.",
      },
    });

    return updated;
  }

  static async updateAvatar(userId: string, avatarUrl: string) {
    const updatedProfile = await db.profile.update({
      where: { userId },
      data: { avatarUrl },
    });

    await db.user.update({
      where: { id: userId },
      data: { image: avatarUrl },
    });

    return updatedProfile;
  }

  static async getUserSettings(userId: string) {
    let settings = await db.userSettings.findUnique({
      where: { userId },
    });

    if (!settings) {
      settings = await db.userSettings.create({
        data: { userId },
      });
    }

    return settings;
  }

  static async updateUserSettings(userId: string, input: SettingsUpdateInput) {
    const updated = await db.userSettings.update({
      where: { userId },
      data: {
        theme: input.theme,
        accentColor: input.accentColor,
        layoutDensity: input.layoutDensity,
        emailNotifications: input.emailNotifications,
        challengeNotifications: input.challengeNotifications,
        coachNotifications: input.coachNotifications,
        badgeNotifications: input.badgeNotifications,
        securityAlerts: input.securityAlerts,
        weeklySummary: input.weeklySummary,
        twoFactorEnabled: input.twoFactorEnabled,
        loginAlertsEnabled: input.loginAlertsEnabled,
        profileVisibility: input.profileVisibility,
        searchEngineIndexing: input.searchEngineIndexing,
      },
    });

    await db.activityLog.create({
      data: {
        userId,
        type: "SETTINGS_CHANGED",
        title: "Settings Updated",
        description: "Notification and workspace preferences were updated.",
      },
    });

    return updated;
  }
}
