import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function getSessionUser() {
  const session = await getServerSession(authOptions);
  return session?.user as { id: string; email?: string; name?: string; role?: string; username?: string } | undefined;
}

export async function getCurrentUser() {
  const sessionUser = await getSessionUser();
  if (!sessionUser?.id) return null;

  return db.user.findUnique({
    where: { id: sessionUser.id },
    include: {
      profile: true,
      settings: true,
      notificationPrefs: true,
      skills: true,
    },
  });
}

export async function requireAuthUser() {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("UNAUTHORIZED");
  }
  return user;
}

export async function requireAdminUser() {
  const user = await requireAuthUser();
  if (user.role !== "ADMIN") {
    throw new Error("FORBIDDEN");
  }
  return user;
}
