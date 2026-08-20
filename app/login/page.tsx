"use client";

import * as React from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Loader2,
  Sparkles,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { AuthMarketingPanel } from "@/components/auth/AuthMarketingPanel";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [rememberMe, setRememberMe] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState("");
  const [redirectingToSignup, setRedirectingToSignup] = React.useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!email || !password) {
      setErrorMsg("Please enter both email and password.");
      return;
    }

    setIsLoading(true);

    try {
      const result = await login(email, password);
      
      if (result.success) {
        window.location.replace("/dashboard");
      } else if (result.isNewUser) {
        // New user detected -> redirect to signup page to create account first
        setErrorMsg("New user detected! Redirecting to Signup to create your profile first...");
        setRedirectingToSignup(true);
        setTimeout(() => {
          window.location.replace(`/signup?email=${encodeURIComponent(email)}`);
        }, 1200);
      } else {
        setErrorMsg(result.error || "Invalid credentials. Please try again or create an account.");
        setIsLoading(false);
      }
    } catch (err: any) {
      setErrorMsg(err.message || "An error occurred during sign in.");
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8 sm:py-16 min-h-[calc(100vh-8rem)] flex items-center justify-center">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 w-full max-w-5xl items-stretch">
        {/* Left Side: Marketing Value Proposition Panel */}
        <AuthMarketingPanel />

        {/* Right Side: Login Form Card */}
        <Card className="w-full border-white/15 bg-slate-950/80 shadow-2xl backdrop-blur-2xl p-6 sm:p-10 flex flex-col justify-between text-left">
          <div>
            <CardHeader className="p-0 text-left space-y-2 mb-6">
              <div className="flex items-center justify-between">
                <div className="lg:hidden flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-primary to-secondary p-0.5 shadow-glow">
                    <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                      <ShieldCheck className="h-4 w-4 text-indigo-400" />
                    </div>
                  </div>
                  <span className="font-bold text-white text-base">LifeProof</span>
                </div>

                <Badge variant="cyan" className="text-[10px] font-mono gap-1">
                  <ShieldCheck className="h-3 w-3 text-cyan-400" />
                  Secure Protocol 2.0
                </Badge>
              </div>

              <CardTitle className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Welcome Back
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm text-muted-foreground">
                Sign in to access your verified skill profile and live challenges.
              </CardDescription>
            </CardHeader>

            {/* New User Notice Banner */}
            <div className="mb-5 p-3 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 text-indigo-300">
                <Sparkles className="h-4 w-4 text-cyan-400 shrink-0" />
                <span>New to LifeProof? Please create your account first.</span>
              </div>
              <Link href="/signup">
                <Button variant="outline" size="sm" className="text-[11px] h-7 px-2.5 font-bold border-indigo-500/40 hover:bg-indigo-500/20 text-white shrink-0">
                  Sign Up
                </Button>
              </Link>
            </div>

            {/* Error / Redirect Message */}
            {errorMsg && (
              <div
                className={`mb-4 p-3 rounded-xl border text-xs flex items-center gap-2 animate-in fade-in duration-200 ${
                  redirectingToSignup
                    ? "bg-amber-500/10 border-amber-500/30 text-amber-300"
                    : "bg-red-500/10 border-red-500/30 text-red-400"
                }`}
              >
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Direct Email/Password Login Form */}
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-1.5 text-left">
                <label className="text-xs font-semibold text-muted-foreground">
                  Email Address
                </label>
                <Input
                  type="email"
                  placeholder="alex.rivera@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  icon={<Mail className="h-4 w-4" />}
                  required
                />
              </div>

              <div className="space-y-1.5 text-left">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-muted-foreground">
                    Password
                  </label>
                  <Link
                    href="/login"
                    className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  icon={<Lock className="h-4 w-4" />}
                  rightElement={
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="p-1 text-muted-foreground hover:text-white transition-colors"
                      aria-label="Toggle password visibility"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  }
                  required
                />
              </div>

              {/* Remember Me Checkbox */}
              <div className="flex items-center gap-2 pt-1 text-left">
                <input
                  type="checkbox"
                  id="remember"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-white/20 bg-slate-900 text-primary focus:ring-primary focus:ring-offset-0 cursor-pointer"
                />
                <label
                  htmlFor="remember"
                  className="text-xs text-muted-foreground cursor-pointer select-none"
                >
                  Remember this device for 30 days
                </label>
              </div>

              {/* Submit Button with interactive state */}
              <div className="pt-2">
                <Button
                  type="submit"
                  variant="glow"
                  size="lg"
                  disabled={isLoading}
                  className="w-full gap-2 font-bold text-sm h-12 shadow-glow active:scale-[0.99] transition-all cursor-pointer"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      {redirectingToSignup ? "Redirecting to Signup..." : "Verifying Account..."}
                    </>
                  ) : (
                    <>
                      Sign In to LifeProof
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>

          {/* Footer & Verification Note */}
          <div className="mt-8 pt-6 border-t border-white/10 text-center space-y-3">
            <p className="text-xs text-muted-foreground">
              Don&apos;t have an account yet?{" "}
              <Link
                href="/signup"
                className="text-primary font-bold hover:underline ml-1"
              >
                Create new account & claim profile
              </Link>
            </p>

            <div className="flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground/80">
              <ShieldCheck className="h-3.5 w-3.5 text-cyan-400" />
              <span>Protected by end-to-end cryptographic hashing</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
