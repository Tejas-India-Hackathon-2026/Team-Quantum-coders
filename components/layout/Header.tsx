"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ShieldCheck,
  Moon,
  Sun,
  Menu,
  X,
  Sparkles,
  ChevronRight,
  ArrowRight,
  LogOut,
  LayoutDashboard,
} from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import { useAuth } from "@/context/AuthContext";
import { LANDING_NAV_LINKS, APP_CONFIG } from "@/lib/constants";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

export function Header() {
  const pathname = usePathname();
  const { resolvedTheme, toggleTheme, mounted } = useTheme();
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300 border-b",
        scrolled
          ? "border-white/15 bg-background/85 backdrop-blur-2xl shadow-lg shadow-black/20"
          : "border-white/10 bg-background/60 backdrop-blur-xl"
      )}
    >
      <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-primary via-indigo-500 to-secondary p-0.5 shadow-glow transition-transform group-hover:scale-105">
            <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-slate-950/90 backdrop-blur-sm">
              <ShieldCheck className="h-5 w-5 text-indigo-400 group-hover:text-white transition-colors" />
            </div>
          </div>
          <div className="flex flex-col text-left">
            <span className="text-lg font-bold tracking-tight text-white flex items-center gap-1">
              {APP_CONFIG.name}
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse" />
            </span>
            <span className="text-[10px] uppercase font-semibold tracking-wider text-muted-foreground">
              Proof of Skill
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1">
          {LANDING_NAV_LINKS.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.label}
                href={link.href}
                className={cn(
                  "px-3.5 py-1.5 text-sm font-medium rounded-lg transition-all",
                  isActive
                    ? "text-white bg-white/10 shadow-sm border border-white/5 font-semibold"
                    : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right Actions: Theme Toggle + Auth State */}
        <div className="hidden md:flex items-center gap-3">
          {/* Theme Toggle Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="text-muted-foreground hover:text-foreground rounded-xl"
          >
            {mounted && resolvedTheme === "dark" ? (
              <Sun className="h-4 w-4 text-amber-400 transition-transform rotate-0" />
            ) : (
              <Moon className="h-4 w-4 text-indigo-400 transition-transform rotate-0" />
            )}
          </Button>

          {isAuthenticated && user ? (
            <div className="flex items-center gap-3">
              <Link href="/dashboard">
                <Button variant="outline" size="sm" className="gap-1.5 text-xs font-semibold">
                  <LayoutDashboard className="h-3.5 w-3.5" />
                  Dashboard
                </Button>
              </Link>

              <Link href="/profile" className="flex items-center gap-2 pl-1 group">
                <div className="w-8 h-8 rounded-full overflow-hidden ring-1 ring-primary/40">
                  <img
                    src={user.avatarUrl}
                    alt={user.fullName}
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="text-xs font-bold text-white group-hover:text-primary transition-colors">
                  {user.fullName.split(" ")[0]}
                </span>
              </Link>

              <Button
                variant="ghost"
                size="icon"
                onClick={logout}
                title="Sign Out"
                className="text-muted-foreground hover:text-red-400"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <>
              {/* Login Link */}
              <Link href="/login">
                <Button variant="ghost" size="sm" className="font-medium text-sm hover:text-white">
                  Login
                </Button>
              </Link>

              {/* Primary CTA button: Get Started */}
              <Link href="/signup">
                <Button variant="glow" size="sm" className="font-semibold gap-1.5 shadow-glow">
                  <Sparkles className="h-3.5 w-3.5" />
                  Get Started
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu button & theme */}
        <div className="flex md:hidden items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            aria-label="Toggle theme"
          >
            {mounted && resolvedTheme === "dark" ? (
              <Sun className="h-4 w-4 text-amber-400" />
            ) : (
              <Moon className="h-4 w-4 text-indigo-400" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Open menu"
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-white/10 bg-slate-950/95 backdrop-blur-2xl px-4 pt-3 pb-6 space-y-4 animate-in slide-in-from-top-4 duration-200 text-left">
          <div className="flex flex-col space-y-1">
            {LANDING_NAV_LINKS.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors",
                    isActive
                      ? "text-white bg-primary/20 border border-primary/30 font-semibold"
                      : "text-muted-foreground hover:text-white hover:bg-white/5"
                  )}
                >
                  {link.label}
                  <ChevronRight className="h-4 w-4 opacity-50" />
                </Link>
              );
            })}
          </div>

          <div className="pt-4 border-t border-white/10 flex flex-col gap-2.5">
            {isAuthenticated ? (
              <>
                <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" className="w-full justify-center text-sm gap-2">
                    <LayoutDashboard className="h-4 w-4" />
                    Open Dashboard
                  </Button>
                </Link>
                <Button
                  variant="destructive"
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full justify-center text-sm gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" className="w-full justify-center text-sm">
                    Login
                  </Button>
                </Link>
                <Link href="/signup" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="glow" className="w-full justify-center gap-2 font-semibold">
                    <Sparkles className="h-4 w-4" />
                    Get Started
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
