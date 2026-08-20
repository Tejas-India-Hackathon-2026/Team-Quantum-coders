import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { STARTER_SKILLS } from "@/data/mockSkills";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db),
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "google-client-id-placeholder",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "google-client-secret-placeholder",
      allowDangerousEmailAccountLinking: true,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID || "github-client-id-placeholder",
      clientSecret: process.env.GITHUB_CLIENT_SECRET || "github-client-secret-placeholder",
      allowDangerousEmailAccountLinking: true,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Please provide both email and password");
        }

        const user = await db.user.findUnique({
          where: { email: credentials.email.toLowerCase().trim() },
          include: { profile: true },
        });

        if (!user || !user.passwordHash) {
          throw new Error("Invalid email or password");
        }

        const isPasswordValid = await bcrypt.compare(credentials.password, user.passwordHash);

        if (!isPasswordValid) {
          throw new Error("Invalid email or password");
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name || user.profile?.fullName,
          image: user.image || user.profile?.avatarUrl,
          role: user.role,
          username: user.username,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role || "USER";
        token.username = (user as any).username;
      }

      if (trigger === "update" && session) {
        token.name = session.name || token.name;
        token.picture = session.image || token.picture;
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id as string;
        (session.user as any).role = token.role as string;
        (session.user as any).username = token.username as string;
      }
      return session;
    },
    async signIn({ user, account }) {
      // Auto-initialize profile & preferences if OAuth user is logging in for first time
      if (account?.provider !== "credentials" && user.id) {
        try {
          const existingProfile = await db.profile.findUnique({
            where: { userId: user.id },
          });

          if (!existingProfile) {
            const username = (user.email ? user.email.split("@")[0] : `dev_${Date.now().toString(36)}`);
            await db.profile.create({
              data: {
                userId: user.id,
                fullName: user.name || "Verified Engineer",
                avatarUrl: user.image || `https://api.dicebear.com/7.x/bottts/svg?seed=${username}`,
                headline: "LifeProof Verified Developer",
                bio: "Taking interactive engineering assessments to build my cryptographic Skill DNA.",
                proofBadgeId: `LP-PROOF-${Math.floor(1000 + Math.random() * 9000)}-VERIFIED`,
                verifiedSince: new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" }),
              },
            });

            await db.userSettings.create({
              data: { userId: user.id },
            });

            await db.notificationPreference.create({
              data: { userId: user.id },
            });

            // Initialize starter skills
            for (const s of STARTER_SKILLS) {
              await db.userSkill.create({
                data: {
                  userId: user.id,
                  categoryName: s.category,
                  score: 0,
                  level: 0,
                  percentage: 0,
                  strengthLabel: "Novice",
                  verified: false,
                },
              });
            }
          }
        } catch (err) {
          console.error("Error auto-initializing OAuth user profile:", err);
        }
      }
      return true;
    },
  },
  secret: process.env.NEXTAUTH_SECRET || "lifeproof-super-secret-key-32-chars-long-secure",
};
