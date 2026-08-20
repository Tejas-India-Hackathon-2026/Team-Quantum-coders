"use client";

import * as React from "react";
import { UserProfile } from "@/types";
import { STARTER_USER, MOCK_USER } from "@/data/mockAchievements";

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  login: (email?: string, password?: string) => Promise<{ success: boolean; isNewUser?: boolean; error?: string }>;
  signup: (fullName: string, email: string, password?: string) => Promise<boolean>;
  logout: () => void;
  requireAuth: (onSuccess?: () => void) => void;
  completeChallenge: (challengeId: string, xp: number) => Promise<void>;
  loadDemoGrandmasterProfile: () => void;
  showAuthModal: boolean;
  setShowAuthModal: (open: boolean) => void;
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<UserProfile | null>(null);
  const [showAuthModal, setShowAuthModal] = React.useState(false);
  const [pendingAction, setPendingAction] = React.useState<(() => void) | null>(null);

  // Load session from localStorage on client mount
  React.useEffect(() => {
    try {
      const savedUser = localStorage.getItem("lifeproof_user");
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
    } catch {
      // Ignored
    }
  }, []);

  const signup = async (fullName: string, email: string, password?: string): Promise<boolean> => {
    const formattedName = fullName?.trim() || "New Engineer";
    const username = email ? email.split("@")[0].toLowerCase().replace(/[^a-z0-9_-]/g, "_") : `dev_${Date.now().toString(36)}`;

    const newUser: UserProfile = {
      ...STARTER_USER,
      id: `usr-${Date.now().toString(36)}`,
      fullName: formattedName,
      username: username,
      avatarUrl: `https://api.dicebear.com/7.x/bottts/svg?seed=${username}`,
      totalXp: 0,
      completedChallengesCount: 0,
      rank: "Challenger I",
      verifiedSince: new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" }),
      skills: STARTER_USER.skills.map((s) => ({ ...s, level: 0, score: 0, challengesCompleted: 0, verified: false })),
      achievements: [],
    };

    setUser(newUser);
    try {
      localStorage.setItem("lifeproof_user", JSON.stringify(newUser));
      // Save to registered users registry
      const registered = JSON.parse(localStorage.getItem("lifeproof_registered_users") || "[]");
      if (!registered.includes(email.toLowerCase().trim())) {
        registered.push(email.toLowerCase().trim());
        localStorage.setItem("lifeproof_registered_users", JSON.stringify(registered));
      }
      document.cookie = "lifeproof_session=1; path=/; max-age=2592000";
    } catch {}

    setShowAuthModal(false);

    if (pendingAction) {
      pendingAction();
      setPendingAction(null);
    }
    return true;
  };

  const login = async (email?: string, password?: string): Promise<{ success: boolean; isNewUser?: boolean; error?: string }> => {
    const userEmail = email?.trim().toLowerCase() || "";

    if (!userEmail) {
      return { success: false, error: "Please provide an email address." };
    }

    try {
      // Check if user is registered in localStorage registry
      const registered = JSON.parse(localStorage.getItem("lifeproof_registered_users") || "[]");
      const savedUserStr = localStorage.getItem("lifeproof_user");
      const savedUser = savedUserStr ? JSON.parse(savedUserStr) : null;

      const isRegistered =
        registered.includes(userEmail) ||
        userEmail === "alex@lifeproof.dev" ||
        userEmail === "alex.rivera@example.com" ||
        (savedUser && savedUser.username === userEmail.split("@")[0]);

      if (!isRegistered) {
        // User has not created an account yet -> redirect to signup
        return {
          success: false,
          isNewUser: true,
          error: "No account found with this email. Please sign up to create your profile first.",
        };
      }

      // Existing user login
      const username = userEmail.split("@")[0];
      const name = savedUser?.fullName || username.charAt(0).toUpperCase() + username.slice(1);

      const loggedUser: UserProfile = savedUser || {
        ...STARTER_USER,
        id: `usr-${Date.now().toString(36)}`,
        fullName: name,
        username: username,
        avatarUrl: `https://api.dicebear.com/7.x/bottts/svg?seed=${username}`,
        totalXp: 0,
        completedChallengesCount: 0,
        rank: "Challenger I",
        verifiedSince: new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" }),
        skills: STARTER_USER.skills.map((s) => ({ ...s, level: 0, score: 0, challengesCompleted: 0, verified: false })),
        achievements: [],
      };

      setUser(loggedUser);
      localStorage.setItem("lifeproof_user", JSON.stringify(loggedUser));
      document.cookie = "lifeproof_session=1; path=/; max-age=2592000";

      setShowAuthModal(false);

      if (pendingAction) {
        pendingAction();
        setPendingAction(null);
      }
      return { success: true };
    } catch {
      return { success: false, error: "Authentication failed. Please try signing up." };
    }
  };

  const logout = () => {
    setUser(null);
    try {
      localStorage.removeItem("lifeproof_user");
      document.cookie = "lifeproof_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    } catch {}
    window.location.replace("/login");
  };

  const loadDemoGrandmasterProfile = () => {
    setUser(MOCK_USER);
    try {
      localStorage.setItem("lifeproof_user", JSON.stringify(MOCK_USER));
      document.cookie = "lifeproof_session=1; path=/; max-age=2592000";
    } catch {}
  };

  const completeChallenge = async (challengeId: string, xp: number) => {
    if (!user) return;

    const updatedXp = (user.totalXp || 0) + xp;
    const updatedCount = (user.completedChallengesCount || 0) + 1;

    const updatedUser: UserProfile = {
      ...user,
      totalXp: updatedXp,
      completedChallengesCount: updatedCount,
      rank: updatedCount >= 5 ? "Senior Specialist" : updatedCount >= 1 ? "Verified Explorer" : "Challenger I",
    };

    setUser(updatedUser);
    try {
      localStorage.setItem("lifeproof_user", JSON.stringify(updatedUser));
    } catch {}
  };

  const requireAuth = (onSuccess?: () => void) => {
    if (user) {
      if (onSuccess) onSuccess();
    } else {
      if (onSuccess) {
        setPendingAction(() => onSuccess);
      }
      // Redirect new / unauthenticated user to signup page to create account first
      window.location.replace("/signup");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        signup,
        logout,
        requireAuth,
        completeChallenge,
        loadDemoGrandmasterProfile,
        showAuthModal,
        setShowAuthModal,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
