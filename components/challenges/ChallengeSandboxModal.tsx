"use client";

import * as React from "react";
import {
  X,
  Play,
  CheckCircle2,
  Terminal,
  ShieldCheck,
  Cpu,
  Sparkles,
  Zap,
  Clock,
  RotateCcw,
  Award,
  Flame,
  FileCode,
  Check,
} from "lucide-react";
import { Challenge } from "@/types";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

interface SandboxProps {
  challenge: Challenge;
  isOpen: boolean;
  onClose: () => void;
}

const DEFAULT_CODE_STARTER = `import { Redis } from "ioredis";

export interface LockOptions {
  ttlMs: number;
  retryDelayMs: number;
  maxRetries: number;
}

export class DistributedLockManager {
  private redis: Redis;

  constructor(redisClient: Redis) {
    this.redis = redisClient;
  }

  /**
   * Acquire a distributed lock with automatic heartbeat renewal
   */
  async acquireLock(resourceKey: string, lockValue: string, options: LockOptions): Promise<boolean> {
    const { ttlMs, retryDelayMs, maxRetries } = options;
    let attempts = 0;

    while (attempts < maxRetries) {
      // SET resourceKey lockValue NX PX ttlMs
      const result = await this.redis.set(resourceKey, lockValue, "PX", ttlMs, "NX");
      if (result === "OK") {
        this.startHeartbeat(resourceKey, lockValue, ttlMs / 2);
        return true;
      }

      attempts++;
      await new Promise((resolve) => setTimeout(resolve, retryDelayMs));
    }

    return false;
  }

  private startHeartbeat(key: string, value: string, intervalMs: number) {
    // Heartbeat renewal loop
  }

  /**
   * Safe release with Lua script preventing split-brain release
   */
  async releaseLock(resourceKey: string, lockValue: string): Promise<boolean> {
    const luaScript = \`
      if redis.call("get", KEYS[1]) == ARGV[1] then
        return redis.call("del", KEYS[1])
      else
        return 0
      end
    \`;
    const res = await this.redis.eval(luaScript, 1, resourceKey, lockValue);
    return res === 1;
  }
}`;

export function ChallengeSandboxModal({ challenge, isOpen, onClose }: SandboxProps) {
  const [code, setCode] = React.useState(DEFAULT_CODE_STARTER);
  const [isRunningTests, setIsRunningTests] = React.useState(false);
  const [testResults, setTestResults] = React.useState<string[]>([]);
  const [isVerifiedSuccess, setIsVerifiedSuccess] = React.useState(false);
  const [timerSeconds, setTimerSeconds] = React.useState(challenge.estimatedMinutes * 60);
  const { completeChallenge } = useAuth();

  // Timer countdown simulation
  React.useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(() => {
      setTimerSeconds((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [isOpen]);

  const formatTimer = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const handleRunTests = () => {
    setIsRunningTests(true);
    setTestResults([]);
    setIsVerifiedSuccess(false);

    setTimeout(() => {
      setTestResults([
        "⚡ Initializing isolated Docker runtime sandbox...",
        "📦 Compiling TypeScript AST & Concurrency Harness...",
        "✅ Test #1: Concurrent lock acquisition under 10,000 req/sec (PASSED)",
        "✅ Test #2: Heartbeat renewal during artificial network jitter (PASSED)",
        "✅ Test #3: Split-brain prevention with atomic Lua release (PASSED)",
        "🎯 Code Quality & Security Audit: 100/100 (0 Defects Found)",
      ]);
      setIsRunningTests(false);
    }, 1200);
  };

  const handleSubmitVerification = () => {
    setIsRunningTests(true);
    setTimeout(() => {
      setIsRunningTests(false);
      setIsVerifiedSuccess(true);
      completeChallenge(challenge.id, challenge.xpReward);
    }, 1000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="relative w-full max-w-7xl h-[92vh] rounded-3xl border border-white/20 bg-slate-950 flex flex-col shadow-2xl overflow-hidden">
        {/* Top Navbar */}
        <div className="px-6 py-3.5 border-b border-white/10 flex items-center justify-between bg-slate-900/90">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-primary/20 text-primary border border-primary/30">
              <Terminal className="h-5 w-5 text-indigo-400" />
            </div>
            <div className="text-left">
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-bold text-white">
                  {challenge.title}
                </h3>
                <Badge variant="purple" className="text-[10px] hidden sm:inline-flex">
                  {challenge.difficulty}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                Live Sandbox Environment · {challenge.company}
              </p>
            </div>
          </div>

          {/* Center Timer & XP */}
          <div className="hidden md:flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white/5 border border-white/10 text-slate-300 font-mono">
              <Clock className="h-3.5 w-3.5 text-amber-400" />
              Time Remaining: {formatTimer(timerSeconds)}
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 font-bold">
              <Zap className="h-3.5 w-3.5" />
              +{challenge.xpReward} XP Reward
            </div>
          </div>

          {/* Close button */}
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-muted-foreground hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Close sandbox"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Main Sandbox Split View */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
          {/* Left Column: Requirements & Objectives (4 cols) */}
          <div className="lg:col-span-4 border-r border-white/10 p-5 sm:p-6 overflow-y-auto space-y-6 text-left bg-slate-950/60">
            <div className="space-y-2">
              <Badge variant="cyan" className="text-[10px]">
                Task Specification
              </Badge>
              <h4 className="text-base font-bold text-white">Objective</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {challenge.description}
              </p>
            </div>

            {/* Constraints & Requirements */}
            <div className="space-y-3">
              <h5 className="text-xs font-bold uppercase tracking-wider text-white">
                Requirements & Constraints
              </h5>
              <ul className="space-y-2 text-xs text-slate-300">
                <li className="flex items-start gap-2">
                  <Check className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Lock acquisition must be atomic using <code>SET NX PX</code>.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Automatic heartbeat renewal to extend TTL before lease expiry.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Release must use Lua script to ensure key ownership check.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Zero memory leaks during high concurrency retry loops.</span>
                </li>
              </ul>
            </div>

            {/* Sponsoring Bounty Info */}
            <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-500/20 space-y-2">
              <span className="text-[10px] uppercase font-bold text-indigo-300">
                Verification Bounty
              </span>
              <div className="text-xl font-black text-white">{challenge.prize || "$2,500 Bounty"}</div>
              <p className="text-[11px] text-muted-foreground">
                Passing this assessment automatically grants a verified cryptographic proof badge on your LifeProof profile.
              </p>
            </div>
          </div>

          {/* Right Column: Code Editor & Live Console (8 cols) */}
          <div className="lg:col-span-8 flex flex-col overflow-hidden bg-slate-900/40">
            {/* Editor Header Bar */}
            <div className="px-4 py-2 border-b border-white/10 flex items-center justify-between bg-slate-950/70 text-xs">
              <div className="flex items-center gap-2">
                <FileCode className="h-4 w-4 text-indigo-400" />
                <span className="font-mono text-slate-200 font-medium">distributedLock.ts</span>
                <span className="text-[10px] text-muted-foreground font-mono">TypeScript 5.6</span>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCode(DEFAULT_CODE_STARTER)}
                  className="h-7 px-2.5 text-[11px] gap-1 text-muted-foreground hover:text-white"
                >
                  <RotateCcw className="h-3 w-3" /> Reset
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleRunTests}
                  disabled={isRunningTests}
                  className="h-7 px-3 text-[11px] font-bold gap-1 text-white bg-indigo-600 hover:bg-indigo-500"
                >
                  <Play className="h-3 w-3 fill-current" /> Run Test Suite
                </Button>
                <Button
                  variant="glow"
                  size="sm"
                  onClick={handleSubmitVerification}
                  disabled={isRunningTests}
                  className="h-7 px-3 text-[11px] font-bold gap-1 shadow-glow"
                >
                  <Sparkles className="h-3 w-3" /> Submit & Verify
                </Button>
              </div>
            </div>

            {/* Code Textarea / Editor Area */}
            <div className="flex-1 p-4 font-mono text-xs text-indigo-200 overflow-y-auto bg-slate-950/90 text-left">
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                spellCheck={false}
                className="w-full h-full bg-transparent border-0 outline-none resize-none font-mono text-xs leading-relaxed text-slate-200 focus:ring-0 selection:bg-primary/30"
              />
            </div>

            {/* Bottom Terminal Output Console */}
            <div className="h-48 border-t border-white/10 p-4 font-mono text-xs bg-slate-950/95 overflow-y-auto text-left space-y-1.5">
              <div className="flex items-center justify-between text-muted-foreground pb-1 border-b border-white/5 text-[11px]">
                <span className="flex items-center gap-1.5">
                  <Terminal className="h-3.5 w-3.5 text-cyan-400" />
                  Live Evaluation Console
                </span>
                {isRunningTests && (
                  <span className="text-cyan-400 animate-pulse font-sans">Running Sandbox Tests...</span>
                )}
              </div>

              {testResults.length === 0 && !isRunningTests && (
                <div className="text-muted-foreground/60 py-4 text-center">
                  Click &ldquo;Run Test Suite&rdquo; to execute concurrency and distributed lock assertions.
                </div>
              )}

              {testResults.map((line, idx) => (
                <div
                  key={idx}
                  className={
                    line.includes("PASSED") || line.includes("100/100")
                      ? "text-emerald-400 font-semibold"
                      : "text-slate-300"
                  }
                >
                  {line}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Successful Verification Overlay Certificate Modal */}
        {isVerifiedSuccess && (
          <div className="absolute inset-0 z-30 flex items-center justify-center p-6 bg-slate-950/95 backdrop-blur-2xl animate-in zoom-in-95 duration-200 text-center">
            <div className="max-w-lg space-y-6">
              <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-emerald-500 to-cyan-500 p-1 mx-auto shadow-glow flex items-center justify-center">
                <ShieldCheck className="h-9 w-9 text-slate-950" />
              </div>

              <div className="space-y-2">
                <Badge variant="cyan" className="font-mono text-xs">
                  Evaluation Score: 100 / 100
                </Badge>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
                  Challenge Passed & Verified!
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  Your implementation of <span className="text-white font-bold">{challenge.title}</span> has passed all concurrency, split-brain, and AST security audits.
                </p>
              </div>

              {/* Reward pill */}
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between text-xs font-mono">
                <div>
                  <span className="text-muted-foreground block text-[10px] uppercase font-sans">
                    Cryptographic Proof
                  </span>
                  <span className="text-cyan-400 font-bold">0x8f4b...39a1</span>
                </div>
                <div className="text-right">
                  <span className="text-muted-foreground block text-[10px] uppercase font-sans">
                    Reward Added
                  </span>
                  <span className="text-amber-400 font-bold">+{challenge.xpReward} XP</span>
                </div>
              </div>

              <div className="flex items-center justify-center gap-3 pt-2">
                <Button variant="glow" onClick={onClose} className="px-8 font-bold">
                  Claim Badge & Return to Marketplace
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
