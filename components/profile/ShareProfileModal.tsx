"use client";

import * as React from "react";
import {
  X,
  Copy,
  Check,
  Share2,
  Globe,
  Twitter,
  Linkedin,
  ShieldCheck,
  QrCode,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { UserProfile } from "@/types";

interface ShareProfileModalProps {
  user: UserProfile;
  isOpen: boolean;
  onClose: () => void;
}

export function ShareProfileModal({ user, isOpen, onClose }: ShareProfileModalProps) {
  const [copied, setCopied] = React.useState(false);

  if (!isOpen) return null;

  const profileUrl = typeof window !== "undefined"
    ? `${window.location.origin}/profile?hash=${user.proofBadgeId || "0x9d4a77f1"}`
    : `https://lifeproof.dev/profile?hash=${user.proofBadgeId || "0x9d4a77f1"}`;

  const handleCopyLink = async () => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(profileUrl);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {}
  };

  const handleShareTwitter = () => {
    const text = encodeURIComponent(
      `Check out my verified developer credentials & cryptographic skill proof on @LifeProof: ${user.fullName} (${user.rank})`
    );
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(profileUrl)}`, "_blank");
  };

  const handleShareLinkedIn = () => {
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(profileUrl)}`,
      "_blank"
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-3xl border border-slate-200 dark:border-white/20 bg-white dark:bg-slate-950 p-6 sm:p-8 shadow-2xl space-y-6 text-left overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-indigo-50 dark:bg-primary/10 text-indigo-600 dark:text-primary border border-indigo-100 dark:border-primary/20 shadow-xs">
              <Share2 className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                Share Verifiable Profile
              </h3>
              <p className="text-xs text-slate-500 dark:text-muted-foreground">
                Publicly authenticated on LifeProof Consensus Protocol
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-900 hover:bg-slate-100 dark:hover:text-white dark:hover:bg-white/10"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* URL Box */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700 dark:text-muted-foreground uppercase tracking-wider">
            Public Proof URL
          </label>
          <div className="flex items-center gap-2 p-2 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-white/10">
            <Globe className="h-4 w-4 text-slate-400 shrink-0 ml-2" />
            <input
              type="text"
              readOnly
              value={profileUrl}
              className="w-full bg-transparent text-xs text-slate-800 dark:text-white font-mono focus:outline-none truncate"
            />
            <Button
              variant={copied ? "default" : "glow"}
              size="sm"
              onClick={handleCopyLink}
              className="gap-1.5 text-xs font-bold shrink-0 h-8 px-3 cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-300" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  Copy Link
                </>
              )}
            </Button>
          </div>
          {copied && (
            <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold animate-in fade-in">
              ✓ Link copied to clipboard! Anyone with this link can verify your proof badges.
            </p>
          )}
        </div>

        {/* Social Share buttons */}
        <div className="space-y-3">
          <label className="text-xs font-bold text-slate-700 dark:text-muted-foreground uppercase tracking-wider">
            Direct Social Verification
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handleShareLinkedIn}
              className="p-3.5 rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 hover:bg-indigo-50 dark:hover:bg-white/10 flex items-center justify-center gap-2 text-xs font-bold text-slate-800 dark:text-white transition-all shadow-xs cursor-pointer"
            >
              <Linkedin className="h-4 w-4 text-[#0077B5]" />
              Share on LinkedIn
            </button>
            <button
              onClick={handleShareTwitter}
              className="p-3.5 rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 hover:bg-sky-50 dark:hover:bg-white/10 flex items-center justify-center gap-2 text-xs font-bold text-slate-800 dark:text-white transition-all shadow-xs cursor-pointer"
            >
              <Twitter className="h-4 w-4 text-[#1DA1F2]" />
              Share on X / Twitter
            </button>
          </div>
        </div>

        {/* Protocol Trust Seal Badge */}
        <div className="p-4 rounded-2xl bg-indigo-50/80 dark:bg-slate-900 border border-indigo-100 dark:border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ShieldCheck className="h-5 w-5 text-indigo-600 dark:text-cyan-400 shrink-0" />
            <div>
              <div className="text-xs font-bold text-slate-900 dark:text-white">
                Proof Seal: {user.rank}
              </div>
              <div className="text-[10px] text-slate-500 dark:text-muted-foreground font-mono">
                Hash: {user.proofBadgeId || "0x9d4a77f1"}
              </div>
            </div>
          </div>
          <Badge variant="cyan" className="text-[10px]">
            100% Verified
          </Badge>
        </div>

        {/* Footer */}
        <div className="flex justify-end pt-2 border-t border-slate-100 dark:border-white/10">
          <Button variant="outline" size="sm" onClick={onClose} className="font-semibold">
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}
