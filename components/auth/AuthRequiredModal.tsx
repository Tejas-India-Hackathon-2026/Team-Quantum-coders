"use client";

import * as React from "react";
import Link from "next/link";
import {
  X,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export function AuthRequiredModal() {
  const { showAuthModal, setShowAuthModal, login, signup } = useAuth();
  const [mode, setMode] = React.useState<"login" | "signup">("signup");
  const [email, setEmail] = React.useState("");
  const [fullName, setFullName] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  if (!showAuthModal) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (mode === "signup") {
      await signup(fullName, email, password);
    } else {
      await login(email, password);
    }

    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-3xl border border-white/20 bg-slate-950 p-6 sm:p-8 shadow-2xl space-y-6 text-left overflow-hidden">
        {/* Background ambient glow */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/20 rounded-full blur-3xl pointer-events-none -z-10" />

        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-primary/20 text-primary border border-primary/30">
              <ShieldCheck className="h-5 w-5 text-indigo-400" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Sign In Required</h3>
              <p className="text-xs text-muted-foreground">To save progress & earn verified badges</p>
            </div>
          </div>
          <button
            onClick={() => setShowAuthModal(false)}
            className="p-1.5 rounded-xl text-muted-foreground hover:text-white hover:bg-white/10"
            aria-label="Close auth dialog"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tab Switcher: Login vs Signup */}
        <div className="grid grid-cols-2 p-1 rounded-xl bg-white/5 border border-white/10 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setMode("signup")}
            className={`py-2 rounded-lg transition-all ${
              mode === "signup"
                ? "bg-primary text-white shadow-sm"
                : "text-muted-foreground hover:text-white"
            }`}
          >
            Claim New Profile
          </button>
          <button
            type="button"
            onClick={() => setMode("login")}
            className={`py-2 rounded-lg transition-all ${
              mode === "login"
                ? "bg-primary text-white shadow-sm"
                : "text-muted-foreground hover:text-white"
            }`}
          >
            Existing Sign In
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          {mode === "signup" && (
            <div className="space-y-1">
              <label className="text-xs font-semibold text-muted-foreground">Full Name</label>
              <Input
                type="text"
                placeholder="Alex Rivera"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>
          )}

          <div className="space-y-1">
            <label className="text-xs font-semibold text-muted-foreground">Email Address</label>
            <Input
              type="email"
              placeholder="alex@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-muted-foreground">Password</label>
            <Input
              type="password"
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="pt-2">
            <Button type="submit" variant="glow" disabled={loading} className="w-full gap-2 font-bold text-sm h-11">
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Authenticating...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  {mode === "signup" ? "Claim Profile & Start Sandbox" : "Sign In & Continue"}
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </form>

        <p className="text-[11px] text-center text-muted-foreground">
          By continuing, you agree to the{" "}
          <Link href="/settings" className="text-indigo-400 hover:underline">
            LifeProof Protocol Terms
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
