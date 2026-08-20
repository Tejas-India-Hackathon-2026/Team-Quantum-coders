import Link from "next/link";
import { ShieldCheck, Github, Twitter, Linkedin, Sparkles, MessageSquare } from "lucide-react";
import { APP_CONFIG } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-slate-950/80 backdrop-blur-xl">
      <div className="container mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-12">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-primary to-secondary p-0.5 shadow-glow">
                <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-slate-950/80">
                  <ShieldCheck className="h-5 w-5 text-indigo-400" />
                </div>
              </div>
              <span className="text-xl font-bold tracking-tight text-white">
                {APP_CONFIG.name}
              </span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-sm">
              The next-generation skill verification protocol. Solve real engineering challenges, receive AI-driven feedback, and build a tamper-proof proof-of-work portfolio trusted by top engineering teams.
            </p>
            <div className="flex items-center gap-2.5 pt-2">
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub"
                className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-muted-foreground hover:text-white transition-colors border border-white/5"
              >
                <Github className="h-4 w-4" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Twitter / X"
                className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-muted-foreground hover:text-white transition-colors border border-white/5"
              >
                <Twitter className="h-4 w-4" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
                className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-muted-foreground hover:text-white transition-colors border border-white/5"
              >
                <Linkedin className="h-4 w-4" />
              </a>
              <a
                href="https://discord.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Discord"
                className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-muted-foreground hover:text-white transition-colors border border-white/5"
              >
                <MessageSquare className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h4 className="text-xs font-bold text-white tracking-widest uppercase mb-4">
              Product
            </h4>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              <li>
                <Link href="/challenges" className="hover:text-white transition-colors">
                  Challenge Sandboxes
                </Link>
              </li>
              <li>
                <Link href="/coach" className="hover:text-white transition-colors">
                  AI Skill Coach
                </Link>
              </li>
              <li>
                <Link href="/profile" className="hover:text-white transition-colors">
                  Verified Proof Badges
                </Link>
              </li>
              <li>
                <Link href="/#features" className="hover:text-white transition-colors">
                  Dynamic Skill DNA
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-white transition-colors">
                  Developer Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <h4 className="text-xs font-bold text-white tracking-widest uppercase mb-4">
              Resources
            </h4>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              <li>
                <Link href="/#how-it-works" className="hover:text-white transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="/#pricing" className="hover:text-white transition-colors">
                  Pricing Plans
                </Link>
              </li>
              <li>
                <Link href="/challenges" className="hover:text-white transition-colors">
                  Assessment Catalog
                </Link>
              </li>
              <li>
                <Link href="/settings" className="hover:text-white transition-colors">
                  Hiring Partner API
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Links & System Status */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-white tracking-widest uppercase mb-4">
              Trust & Legal
            </h4>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              <li>
                <Link href="/settings" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/settings" className="hover:text-white transition-colors">
                  Terms of Protocol
                </Link>
              </li>
              <li>
                <Link href="/settings" className="hover:text-white transition-colors">
                  Security & Anti-Cheat
                </Link>
              </li>
            </ul>

            <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-xs font-semibold text-emerald-400">
                  Verification Engine 2.0
                </span>
              </div>
              <p className="text-[11px] text-muted-foreground">
                Zero false positives · 99.8% consensus
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="mt-14 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} LifeProof Inc. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span>Built for High-Caliber Engineers</span>
            <span className="flex items-center gap-1 text-primary font-semibold">
              <Sparkles className="h-3 w-3" /> v2.0 Production Ready
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
