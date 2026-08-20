import Link from "next/link";
import { ShieldCheck, Github, Twitter, Linkedin, Sparkles, MessageSquare } from "lucide-react";
import { APP_CONFIG } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="border-t border-slate-200/80 dark:border-white/10 bg-slate-50/90 dark:bg-slate-950/80 backdrop-blur-xl text-left">
      <div className="container mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-12">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-primary to-secondary p-0.5 shadow-sm">
                <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-white dark:bg-slate-950">
                  <ShieldCheck className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                </div>
              </div>
              <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                {APP_CONFIG.name}
              </span>
            </Link>
            <p className="text-sm text-slate-600 dark:text-muted-foreground leading-relaxed max-w-sm">
              The next-generation skill verification protocol. Solve real engineering challenges, receive AI-driven feedback, and build a tamper-proof proof-of-work portfolio trusted by top engineering teams.
            </p>
            <div className="flex items-center gap-2.5 pt-2">
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub"
                className="p-2.5 rounded-xl bg-white dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 text-slate-600 hover:text-slate-900 dark:text-muted-foreground dark:hover:text-white transition-colors border border-slate-200 dark:border-white/5 shadow-xs"
              >
                <Github className="h-4 w-4" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Twitter / X"
                className="p-2.5 rounded-xl bg-white dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 text-slate-600 hover:text-slate-900 dark:text-muted-foreground dark:hover:text-white transition-colors border border-slate-200 dark:border-white/5 shadow-xs"
              >
                <Twitter className="h-4 w-4" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
                className="p-2.5 rounded-xl bg-white dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 text-slate-600 hover:text-slate-900 dark:text-muted-foreground dark:hover:text-white transition-colors border border-slate-200 dark:border-white/5 shadow-xs"
              >
                <Linkedin className="h-4 w-4" />
              </a>
              <a
                href="https://discord.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Discord"
                className="p-2.5 rounded-xl bg-white dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 text-slate-600 hover:text-slate-900 dark:text-muted-foreground dark:hover:text-white transition-colors border border-slate-200 dark:border-white/5 shadow-xs"
              >
                <MessageSquare className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white tracking-widest uppercase mb-4">
              Product
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-600 dark:text-muted-foreground font-medium">
              <li>
                <Link href="/challenges" className="hover:text-indigo-600 dark:hover:text-white transition-colors">
                  Challenge Sandboxes
                </Link>
              </li>
              <li>
                <Link href="/coach" className="hover:text-indigo-600 dark:hover:text-white transition-colors">
                  AI Skill Coach
                </Link>
              </li>
              <li>
                <Link href="/profile" className="hover:text-indigo-600 dark:hover:text-white transition-colors">
                  Verified Proof Badges
                </Link>
              </li>
              <li>
                <Link href="/recruiter" className="hover:text-indigo-600 dark:hover:text-white transition-colors">
                  Recruiter Portal
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-indigo-600 dark:hover:text-white transition-colors">
                  Developer Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white tracking-widest uppercase mb-4">
              Resources
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-600 dark:text-muted-foreground font-medium">
              <li>
                <Link href="/#how-it-works" className="hover:text-indigo-600 dark:hover:text-white transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="/#pricing" className="hover:text-indigo-600 dark:hover:text-white transition-colors">
                  Pricing Plans
                </Link>
              </li>
              <li>
                <Link href="/challenges" className="hover:text-indigo-600 dark:hover:text-white transition-colors">
                  Assessment Catalog
                </Link>
              </li>
              <li>
                <Link href="/settings" className="hover:text-indigo-600 dark:hover:text-white transition-colors">
                  Security & Settings
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Links & System Status */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white tracking-widest uppercase mb-4">
              Trust & Legal
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-600 dark:text-muted-foreground font-medium">
              <li>
                <Link href="/settings" className="hover:text-indigo-600 dark:hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/settings" className="hover:text-indigo-600 dark:hover:text-white transition-colors">
                  Terms of Protocol
                </Link>
              </li>
              <li>
                <Link href="/settings" className="hover:text-indigo-600 dark:hover:text-white transition-colors">
                  Security & Consensus
                </Link>
              </li>
            </ul>

            <div className="p-3.5 rounded-2xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 space-y-1.5 shadow-xs">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
                <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400">
                  Verification Engine 2.0
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-muted-foreground font-medium">
                Zero false positives · 99.8% consensus
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="mt-14 pt-8 border-t border-slate-200 dark:border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-muted-foreground font-medium">
          <p>© {new Date().getFullYear()} LifeProof Inc. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span>Built for High-Caliber Engineers</span>
            <span className="flex items-center gap-1 text-indigo-600 dark:text-primary font-bold">
              <Sparkles className="h-3 w-3" /> v2.0 Production Ready
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
