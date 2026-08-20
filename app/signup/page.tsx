"use client";

import * as React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  ShieldCheck,
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  ArrowRight,
  Loader2,
  Sparkles,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { AuthMarketingPanel } from "@/components/auth/AuthMarketingPanel";
import { useAuth } from "@/context/AuthContext";

export default function SignupPage() {
  const searchParams = useSearchParams();
  const initialEmail = searchParams.get("email") || "";

  const { signup } = useAuth();
  const [fullName, setFullName] = React.useState("");
  const [email, setEmail] = React.useState(initialEmail);
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const [agreeTerms, setAgreeTerms] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState("");

  React.useEffect(() => {
    if (initialEmail && !email) {
      setEmail(initialEmail);
    }
  }, [initialEmail]);

  const passwordStrength = React.useMemo(() => {
    if (!password) return { score: 0, label: "None", color: "bg-slate-700" };
    let score = 0;
    if (password.length >= 8) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;

    if (score <= 1) return { score: 25, label: "Weak", color: "bg-red-500" };
    if (score === 2 || score === 3)
      return { score: 65, label: "Medium", color: "bg-amber-500" };
    return { score: 100, label: "Strong", color: "bg-emerald-500" };
  }, [password]);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!fullName || !email || !password || !confirmPassword) {
      setErrorMsg("Please fill in all required fields.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg("Passwords do not match.");
      return;
    }

    if (password.length < 8) {
      setErrorMsg("Password must be at least 8 characters long.");
      return;
    }

    if (!agreeTerms) {
      setErrorMsg("You must agree to the Terms of Service.");
      return;
    }

    setIsLoading(true);

    try {
      await signup(fullName, email, password);
      // Instant redirect to dashboard
      window.location.replace("/dashboard");
    } catch (err: any) {
      setErrorMsg(err.message || "An error occurred during account creation.");
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8 sm:py-16 min-h-[calc(100vh-8rem)] flex items-center justify-center">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 w-full max-w-5xl items-stretch">
        {/* Left Side: Marketing Value Proposition Panel */}
        <AuthMarketingPanel />

        {/* Right Side: Signup Form Card */}
        <Card className="w-full border-white/15 bg-slate-950/80 shadow-2xl backdrop-blur-2xl p-6 sm:p-10 flex flex-col justify-between text-left">
          <div>
            <CardHeader className="p-0 text-left space-y-2 mb-6">
              <div className="flex items-center justify-between">
                <div className="lg:hidden flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-primary to-secondary p-0.5 shadow-glow">
                    <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                      <Sparkles className="h-4 w-4 text-cyan-400" />
                    </div>
                  </div>
                  <span className="font-bold text-white text-base">LifeProof</span>
                </div>

                <Badge variant="purple" className="text-[10px] font-mono gap-1">
                  <Sparkles className="h-3 w-3 text-purple-300" />
                  Free Starter Tier
                </Badge>
              </div>

              <CardTitle className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Claim Your Skill Profile
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm text-muted-foreground">
                Join the verified developer network & generate your immutable proof of work.
              </CardDescription>
            </CardHeader>

            {/* Error Message if present */}
            {errorMsg && (
              <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-400 animate-in fade-in duration-200">
                {errorMsg}
              </div>
            )}

            {/* Signup Form */}
            <form onSubmit={handleSignup} className="space-y-4">
              <div className="space-y-1.5 text-left">
                <label className="text-xs font-semibold text-muted-foreground">
                  Full Name
                </label>
                <Input
                  type="text"
                  placeholder="Alex Rivera"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  icon={<User className="h-4 w-4" />}
                  required
                />
              </div>

              <div className="space-y-1.5 text-left">
                <label className="text-xs font-semibold text-muted-foreground">
                  Work / Personal Email
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
                <label className="text-xs font-semibold text-muted-foreground">
                  Password
                </label>
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="At least 8 characters"
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

                {/* Password Strength Meter */}
                {password.length > 0 && (
                  <div className="pt-1.5 space-y-1">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-muted-foreground">Password strength:</span>
                      <span className="font-semibold text-white font-mono">
                        {passwordStrength.label}
                      </span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                      <div
                        className={`h-full transition-all duration-300 ${passwordStrength.color}`}
                        style={{ width: `${passwordStrength.score}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-1.5 text-left">
                <label className="text-xs font-semibold text-muted-foreground">
                  Confirm Password
                </label>
                <Input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Re-enter your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  icon={<Lock className="h-4 w-4" />}
                  rightElement={
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="p-1 text-muted-foreground hover:text-white transition-colors"
                      aria-label="Toggle confirm password visibility"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  }
                  required
                />
              </div>

              {/* Terms Checkbox */}
              <div className="flex items-start gap-2.5 pt-1 text-left">
                <input
                  type="checkbox"
                  id="terms"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="w-4 h-4 rounded border-white/20 bg-slate-900 text-primary focus:ring-primary focus:ring-offset-0 cursor-pointer mt-0.5"
                  required
                />
                <label
                  htmlFor="terms"
                  className="text-xs text-muted-foreground leading-snug cursor-pointer select-none"
                >
                  I agree to the{" "}
                  <Link href="/settings" className="text-indigo-400 hover:underline">
                    Terms of Protocol
                  </Link>{" "}
                  and acknowledge the{" "}
                  <Link href="/settings" className="text-indigo-400 hover:underline">
                    Privacy Policy
                  </Link>
                  .
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
                      Creating Account...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4" />
                      Create Account & Start Verification
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
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-primary font-bold hover:underline ml-1"
              >
                Sign in here
              </Link>
            </p>

            <div className="flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground/80">
              <Check className="h-3.5 w-3.5 text-emerald-400" />
              <span>Your Skill DNA & cryptographic badges will be linked automatically</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
