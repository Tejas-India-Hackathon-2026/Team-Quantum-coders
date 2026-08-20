"use client";

import * as React from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { SettingsSidebar, SettingsTabId } from "@/components/settings/SettingsSidebar";
import { SettingsSection } from "@/components/settings/SettingsSection";
import { Switch } from "@/components/settings/Switch";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/hooks/useTheme";
import { STARTER_USER } from "@/data/mockAchievements";
import {
  ShieldCheck,
  Smartphone,
  Laptop,
  Github,
  Globe,
  Download,
  LogOut,
  Trash2,
  Camera,
  Save,
  Check,
} from "lucide-react";

export default function SettingsPage() {
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const currentUser = user || STARTER_USER;

  const [activeTab, setActiveTab] = React.useState<SettingsTabId>("account");
  const [saveToast, setSaveToast] = React.useState(false);

  // Form State: Account
  const [fullName, setFullName] = React.useState(currentUser.fullName);
  const [email, setEmail] = React.useState(currentUser.username ? `${currentUser.username}@example.com` : "alex.rivera@example.com");
  const [username, setUsername] = React.useState(currentUser.username);
  const [location, setLocation] = React.useState("San Francisco, CA");
  const [bio, setBio] = React.useState(currentUser.bio || "Full-stack engineer passionate about distributed systems and AI.");
  const [publicProfile, setPublicProfile] = React.useState(true);

  // Form State: Security
  const [currentPassword, setCurrentPassword] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");
  const [confirmNewPassword, setConfirmNewPassword] = React.useState("");
  const [twoFactorAuth, setTwoFactorAuth] = React.useState(true);
  const [loginAlerts, setLoginAlerts] = React.useState(true);

  // Form State: Notifications
  const [notifChallenges, setNotifChallenges] = React.useState(true);
  const [notifCoach, setNotifCoach] = React.useState(true);
  const [notifAchievements, setNotifAchievements] = React.useState(true);
  const [notifSecurity, setNotifSecurity] = React.useState(true);
  const [notifWeeklySummary, setNotifWeeklySummary] = React.useState(true);

  // Form State: Privacy
  const [showSkillDnaPublicly, setShowSkillDnaPublicly] = React.useState(true);
  const [showCompletedChallenges, setShowCompletedChallenges] = React.useState(true);
  const [allowRecruiters, setAllowRecruiters] = React.useState(true);
  const [searchEngineIndexing, setSearchEngineIndexing] = React.useState(false);

  // Form State: Connected Accounts
  const [googleConnected, setGoogleConnected] = React.useState(true);
  const [githubConnected, setGithubConnected] = React.useState(true);
  const [linkedinConnected, setLinkedinConnected] = React.useState(false);

  // Form State: Appearance
  const [accentColor, setAccentColor] = React.useState("indigo");
  const [density, setDensity] = React.useState<"comfortable" | "compact">("comfortable");

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveToast(true);
    setTimeout(() => {
      setSaveToast(false);
    }, 2500);
  };

  return (
    <div className="flex-1 flex min-h-[calc(100vh-4rem)]">
      {/* App Navigation Sidebar */}
      <Sidebar />

      {/* Main Settings Content */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8 overflow-y-auto">
        {/* Main Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200/80 dark:border-white/10 pb-6 text-left">
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              Settings
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-muted-foreground font-normal">
              Manage your account, privacy, security credentials, and platform preferences.
            </p>
          </div>

          {/* Toast / Save indicator */}
          {saveToast ? (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 text-emerald-700 dark:text-emerald-400 text-xs font-bold animate-in fade-in duration-200">
              <Check className="h-4 w-4" />
              Settings updated successfully!
            </div>
          ) : (
            <span className="text-[11px] text-slate-400 dark:text-muted-foreground/80 font-mono">
              Auto-sync active · Protocol 2.0
            </span>
          )}
        </div>

        {/* Layout Grid: Left Settings Nav + Right Content Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Settings Sidebar Tabs */}
          <div className="lg:col-span-3">
            <SettingsSidebar activeTab={activeTab} onTabChange={setActiveTab} />
          </div>

          {/* Settings Forms Content */}
          <div className="lg:col-span-9 space-y-6 text-left">
            {/* 1. ACCOUNT TAB */}
            {activeTab === "account" && (
              <form onSubmit={handleSave} className="space-y-6">
                <SettingsSection
                  title="Profile Information"
                  description="Update your personal details, public bio, and avatar."
                  badge={<Badge variant="purple">Public Info</Badge>}
                >
                  {/* Avatar Upload Preview */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 pb-4 border-b border-slate-100 dark:border-white/10">
                    <div className="relative group">
                      <div className="w-20 h-20 rounded-3xl overflow-hidden ring-2 ring-indigo-200 dark:ring-primary/40 bg-slate-100 dark:bg-slate-900 shadow-xs">
                        <img
                          src={currentUser.avatarUrl}
                          alt={currentUser.fullName}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <button
                        type="button"
                        className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl flex flex-col items-center justify-center text-white text-[10px] gap-1 cursor-pointer"
                        aria-label="Upload photo"
                      >
                        <Camera className="h-4 w-4" />
                        Change
                      </button>
                    </div>

                    <div className="space-y-1">
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">Profile Photo</h4>
                      <p className="text-xs text-slate-500 dark:text-muted-foreground font-normal">
                        PNG, JPG, or SVG up to 5MB. Visible on public certificates.
                      </p>
                      <div className="flex items-center gap-2 pt-1">
                        <Button type="button" variant="outline" size="sm" className="text-xs h-8 font-semibold">
                          Change Photo
                        </Button>
                        <Button type="button" variant="ghost" size="sm" className="text-xs h-8 text-slate-500 hover:text-red-600 font-semibold">
                          Remove
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Form fields */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 dark:text-muted-foreground">Full Name</label>
                      <Input
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Alex Rivera"
                        required
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 dark:text-muted-foreground">Username / Handle</label>
                      <Input
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="alexrivera"
                        required
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 dark:text-muted-foreground">Primary Email Address</label>
                      <Input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="alex@example.com"
                        required
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 dark:text-muted-foreground">Location</label>
                      <Input
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="San Francisco, CA"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 dark:text-muted-foreground">Bio / Headline</label>
                    <textarea
                      rows={3}
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      placeholder="Specializing in resilient distributed systems, Next.js architecture..."
                      className="w-full rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-950 px-3.5 py-2.5 text-xs text-slate-800 dark:text-white placeholder:text-slate-400 dark:placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500 leading-relaxed shadow-xs"
                    />
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-white/10">
                    <div className="space-y-0.5">
                      <span className="text-xs font-bold text-slate-900 dark:text-white">Public Profile Visibility</span>
                      <p className="text-[11px] text-slate-500 dark:text-muted-foreground font-normal">
                        Allow your verified Skill DNA profile to be viewed by recruiters.
                      </p>
                    </div>
                    <Switch checked={publicProfile} onCheckedChange={setPublicProfile} />
                  </div>

                  {/* Submit actions */}
                  <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-white/10">
                    <Button type="button" variant="outline" size="sm" className="font-semibold">
                      Cancel
                    </Button>
                    <Button type="submit" variant="glow" size="sm" className="gap-1.5 font-bold shadow-xs">
                      <Save className="h-3.5 w-3.5" />
                      Save Changes
                    </Button>
                  </div>
                </SettingsSection>
              </form>
            )}

            {/* 2. SECURITY TAB */}
            {activeTab === "security" && (
              <div className="space-y-6">
                <SettingsSection
                  title="Password & Authentication"
                  description="Use a strong password and enable 2FA to safeguard your verified certificates."
                  badge={<Badge variant="success">High Security</Badge>}
                >
                  <form onSubmit={handleSave} className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 dark:text-muted-foreground">Current Password</label>
                      <Input
                        type="password"
                        placeholder="••••••••••••"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-700 dark:text-muted-foreground">New Password</label>
                        <Input
                          type="password"
                          placeholder="••••••••••••"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-700 dark:text-muted-foreground">Confirm New Password</label>
                        <Input
                          type="password"
                          placeholder="••••••••••••"
                          value={confirmNewPassword}
                          onChange={(e) => setConfirmNewPassword(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="flex justify-end pt-2">
                      <Button type="submit" variant="outline" size="sm" className="text-xs font-semibold">
                        Update Password
                      </Button>
                    </div>
                  </form>

                  <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-white/10">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <Smartphone className="h-4 w-4 text-indigo-600 dark:text-cyan-400" />
                          <span className="text-xs font-bold text-slate-900 dark:text-white">Two-Factor Authentication (2FA)</span>
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-muted-foreground font-normal">
                          Protect your cryptographic credentials with Google Authenticator or 1Password.
                        </p>
                      </div>
                      <Switch checked={twoFactorAuth} onCheckedChange={setTwoFactorAuth} />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <ShieldCheck className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                          <span className="text-xs font-bold text-slate-900 dark:text-white">Instant Login Alerts</span>
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-muted-foreground font-normal">
                          Receive notifications when an unrecognized device logs in.
                        </p>
                      </div>
                      <Switch checked={loginAlerts} onCheckedChange={setLoginAlerts} />
                    </div>
                  </div>
                </SettingsSection>

                {/* Active Sessions */}
                <SettingsSection
                  title="Active Sessions"
                  description="Devices currently logged into your LifeProof account."
                >
                  <div className="space-y-3">
                    <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-3">
                        <Laptop className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                        <div>
                          <span className="font-bold text-slate-900 dark:text-white block">Windows 11 · Chrome 128</span>
                          <span className="text-[10px] text-slate-500 dark:text-muted-foreground">San Francisco, USA · Current Active Session</span>
                        </div>
                      </div>
                      <Badge variant="success" className="text-[10px]">Active Now</Badge>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-3">
                        <Smartphone className="h-4 w-4 text-slate-400 dark:text-muted-foreground" />
                        <div>
                          <span className="font-bold text-slate-900 dark:text-white block">iOS 18 · Mobile Safari</span>
                          <span className="text-[10px] text-slate-500 dark:text-muted-foreground">San Francisco, USA · Last active 3 hours ago</span>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" className="text-xs text-slate-500 hover:text-red-600 font-semibold">
                        Revoke
                      </Button>
                    </div>
                  </div>
                </SettingsSection>
              </div>
            )}

            {/* 3. NOTIFICATIONS TAB */}
            {activeTab === "notifications" && (
              <SettingsSection
                title="Notification Preferences"
                description="Choose how and when LifeProof sends you updates and challenge alerts."
              >
                <div className="space-y-6">
                  {/* Category: Performance & Challenges */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-300">
                      Performance & Challenges
                    </h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <span className="text-xs font-bold text-slate-900 dark:text-white">Challenge Bounties & Invites</span>
                          <p className="text-[11px] text-slate-500 dark:text-muted-foreground font-normal">
                            Get alerted when high-reward challenges matching your skill set launch.
                          </p>
                        </div>
                        <Switch checked={notifChallenges} onCheckedChange={setNotifChallenges} />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <span className="text-xs font-bold text-slate-900 dark:text-white">AI Coach Insights</span>
                          <p className="text-[11px] text-slate-500 dark:text-muted-foreground font-normal">
                            Personalized architectural feedback and recommendations from your AI mentor.
                          </p>
                        </div>
                        <Switch checked={notifCoach} onCheckedChange={setNotifCoach} />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <span className="text-xs font-bold text-slate-900 dark:text-white">Weekly Skill DNA Digest</span>
                          <p className="text-[11px] text-slate-500 dark:text-muted-foreground font-normal">
                            Summary of XP earned, global percentile progress, and rank updates.
                          </p>
                        </div>
                        <Switch checked={notifWeeklySummary} onCheckedChange={setNotifWeeklySummary} />
                      </div>
                    </div>
                  </div>

                  {/* Category: Account & Security */}
                  <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-white/10">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-sky-700 dark:text-cyan-300">
                      Account & Security Alerts
                    </h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <span className="text-xs font-bold text-slate-900 dark:text-white">Proof Badge Minting Alerts</span>
                          <p className="text-[11px] text-slate-500 dark:text-muted-foreground font-normal">
                            Confirmations whenever a verified proof hash is generated.
                          </p>
                        </div>
                        <Switch checked={notifAchievements} onCheckedChange={setNotifAchievements} />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <span className="text-xs font-bold text-slate-900 dark:text-white">Critical Security Notifications</span>
                          <p className="text-[11px] text-slate-500 dark:text-muted-foreground font-normal">
                            Important alerts regarding password changes or new device authorizations.
                          </p>
                        </div>
                        <Switch checked={notifSecurity} onCheckedChange={setNotifSecurity} />
                      </div>
                    </div>
                  </div>
                </div>
              </SettingsSection>
            )}

            {/* 4. PRIVACY TAB */}
            {activeTab === "privacy" && (
              <SettingsSection
                title="Privacy & Proof Exposure"
                description="Control what aspects of your verified skills and credentials are visible to the public."
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <span className="text-xs font-bold text-slate-900 dark:text-white">Show Skill DNA Radar Publicly</span>
                      <p className="text-[11px] text-slate-500 dark:text-muted-foreground font-normal">
                        Displays your multi-vector technical radar graph on your public link.
                      </p>
                    </div>
                    <Switch checked={showSkillDnaPublicly} onCheckedChange={setShowSkillDnaPublicly} />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <span className="text-xs font-bold text-slate-900 dark:text-white">Show Completed Challenge Certificates</span>
                      <p className="text-[11px] text-slate-500 dark:text-muted-foreground font-normal">
                        Allows third parties to verify on-chain hashes of passed test suites.
                      </p>
                    </div>
                    <Switch checked={showCompletedChallenges} onCheckedChange={setShowCompletedChallenges} />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <span className="text-xs font-bold text-slate-900 dark:text-white">Verified Recruiter Fast-Tracks</span>
                      <p className="text-[11px] text-slate-500 dark:text-muted-foreground font-normal">
                        Allow hiring partners (Vercel, Scale AI, Stripe) to view your verified competencies.
                      </p>
                    </div>
                    <Switch checked={allowRecruiters} onCheckedChange={setAllowRecruiters} />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <span className="text-xs font-bold text-slate-900 dark:text-white">Search Engine Indexing</span>
                      <p className="text-[11px] text-slate-500 dark:text-muted-foreground font-normal">
                        Allow Google and search engines to index your public portfolio URL.
                      </p>
                    </div>
                    <Switch checked={searchEngineIndexing} onCheckedChange={setSearchEngineIndexing} />
                  </div>
                </div>
              </SettingsSection>
            )}

            {/* 5. CONNECTED ACCOUNTS TAB */}
            {activeTab === "connected" && (
              <SettingsSection
                title="Connected Accounts & Integrations"
                description="Link external provider accounts for 1-click authentication and automated commit verification."
              >
                <div className="space-y-4">
                  {/* GitHub */}
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-white dark:bg-white/10 text-slate-900 dark:text-white border border-slate-200 dark:border-transparent shadow-xs">
                        <Github className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-slate-900 dark:text-white">GitHub</h4>
                          {githubConnected && <Badge variant="success" className="text-[10px]">Connected</Badge>}
                        </div>
                        <p className="text-xs text-slate-500 dark:text-muted-foreground font-normal">
                          {githubConnected ? "Linked as @alexrivera · Repository AST verification enabled" : "Connect to import project proofs"}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant={githubConnected ? "outline" : "glow"}
                      size="sm"
                      onClick={() => setGithubConnected(!githubConnected)}
                      className="text-xs h-8 font-semibold"
                    >
                      {githubConnected ? "Disconnect" : "Connect GitHub"}
                    </Button>
                  </div>

                  {/* Google */}
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-white dark:bg-white/10 text-slate-900 dark:text-white border border-slate-200 dark:border-transparent shadow-xs">
                        <svg className="h-5 w-5" viewBox="0 0 24 24">
                          <path
                            fill="currentColor"
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                          />
                          <path
                            fill="currentColor"
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                          />
                          <path
                            fill="currentColor"
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                          />
                          <path
                            fill="currentColor"
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                          />
                        </svg>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-slate-900 dark:text-white">Google Workspace</h4>
                          {googleConnected && <Badge variant="success" className="text-[10px]">Connected</Badge>}
                        </div>
                        <p className="text-xs text-slate-500 dark:text-muted-foreground font-normal">
                          {googleConnected ? "Linked as alex.rivera@gmail.com" : "Sign in quickly using your Google account"}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant={googleConnected ? "outline" : "glow"}
                      size="sm"
                      onClick={() => setGoogleConnected(!googleConnected)}
                      className="text-xs h-8 font-semibold"
                    >
                      {googleConnected ? "Disconnect" : "Connect Google"}
                    </Button>
                  </div>

                  {/* LinkedIn */}
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-white dark:bg-white/10 text-slate-900 dark:text-white border border-slate-200 dark:border-transparent shadow-xs">
                        <Globe className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-slate-900 dark:text-white">LinkedIn</h4>
                          {linkedinConnected && <Badge variant="success" className="text-[10px]">Connected</Badge>}
                        </div>
                        <p className="text-xs text-slate-500 dark:text-muted-foreground font-normal">
                          {linkedinConnected ? "Linked to LinkedIn Profile" : "Export your verified certificates directly to LinkedIn"}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant={linkedinConnected ? "outline" : "glow"}
                      size="sm"
                      onClick={() => setLinkedinConnected(!linkedinConnected)}
                      className="text-xs h-8 font-semibold"
                    >
                      {linkedinConnected ? "Disconnect" : "Connect LinkedIn"}
                    </Button>
                  </div>
                </div>
              </SettingsSection>
            )}

            {/* 6. APPEARANCE TAB */}
            {activeTab === "appearance" && (
              <SettingsSection
                title="Appearance & Interface"
                description="Personalize your theme, color accents, and workspace density."
              >
                <div className="space-y-6">
                  {/* Theme Mode */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-muted-foreground">
                      Theme Mode
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {["light", "dark", "system"].map((mode) => (
                        <button
                          key={mode}
                          type="button"
                          onClick={() => setTheme(mode)}
                          className={`p-4 rounded-2xl border text-center transition-all cursor-pointer ${
                            theme === mode
                              ? "border-indigo-400 bg-indigo-50 dark:bg-primary/20 text-indigo-700 dark:text-white font-bold shadow-xs"
                              : "border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-slate-600 dark:text-muted-foreground hover:text-slate-900 dark:hover:text-white"
                          }`}
                        >
                          <span className="capitalize text-xs block">{mode} Mode</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Accent Color Palette */}
                  <div className="space-y-2 pt-4 border-t border-slate-100 dark:border-white/10">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-muted-foreground">
                      Accent Color Theme
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { id: "indigo", label: "Electric Indigo", color: "bg-indigo-600" },
                        { id: "violet", label: "Cyber Violet", color: "bg-purple-600" },
                        { id: "emerald", label: "Emerald Glow", color: "bg-emerald-600" },
                      ].map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setAccentColor(item.id)}
                          className={`p-3.5 rounded-2xl border flex items-center gap-2.5 transition-all cursor-pointer ${
                            accentColor === item.id
                              ? "border-indigo-300 bg-indigo-50 dark:bg-white/10 text-indigo-700 dark:text-white font-bold shadow-xs"
                              : "border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-slate-600 dark:text-muted-foreground hover:text-slate-900 dark:hover:text-white"
                          }`}
                        >
                          <span className={`w-3.5 h-3.5 rounded-full ${item.color}`} />
                          <span className="text-xs">{item.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Density */}
                  <div className="space-y-2 pt-4 border-t border-slate-100 dark:border-white/10">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-muted-foreground">
                      Layout Density
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { id: "comfortable", label: "Comfortable (Standard)" },
                        { id: "compact", label: "Compact (High Information)" },
                      ].map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setDensity(item.id as "comfortable" | "compact")}
                          className={`p-3.5 rounded-2xl border text-center transition-all cursor-pointer ${
                            density === item.id
                              ? "border-indigo-300 bg-indigo-50 dark:bg-white/10 text-indigo-700 dark:text-white font-bold shadow-xs"
                              : "border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-slate-600 dark:text-muted-foreground hover:text-slate-900 dark:hover:text-white"
                          }`}
                        >
                          <span className="text-xs">{item.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </SettingsSection>
            )}

            {/* 7. DANGER ZONE TAB */}
            {activeTab === "danger" && (
              <div className="space-y-6">
                <SettingsSection
                  title="Data Export & Portability"
                  description="Download a full cryptographic archive of all your solved challenges, AST audit reports, and signatures."
                >
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <span className="text-xs font-bold text-slate-900 dark:text-white">Export Skill DNA Archive (JSON + Signatures)</span>
                      <p className="text-[11px] text-slate-500 dark:text-muted-foreground font-normal">
                        Includes all AST reviews, challenge code solutions, and verified certificates.
                      </p>
                    </div>
                    <Button variant="outline" size="sm" className="gap-1.5 text-xs font-semibold">
                      <Download className="h-3.5 w-3.5" />
                      Export Data
                    </Button>
                  </div>
                </SettingsSection>

                <SettingsSection
                  title="Danger Zone"
                  description="Irreversible account actions. Please proceed with caution."
                  className="border-red-200 dark:border-red-500/30 bg-red-50/50 dark:bg-red-950/10"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between pb-4 border-b border-red-200 dark:border-red-500/20">
                      <div className="space-y-0.5">
                        <span className="text-xs font-bold text-slate-900 dark:text-white">Sign Out of Current Session</span>
                        <p className="text-[11px] text-slate-500 dark:text-muted-foreground font-normal">
                          End your session on this browser.
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={logout}
                        className="text-xs border-red-300 text-red-600 hover:bg-red-100 dark:border-red-500/30 dark:text-red-400 dark:hover:bg-red-500/10 font-semibold cursor-pointer"
                      >
                        <LogOut className="h-3.5 w-3.5 mr-1" />
                        Log Out
                      </Button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <span className="text-xs font-bold text-red-600 dark:text-red-400">Delete LifeProof Account</span>
                        <p className="text-[11px] text-slate-500 dark:text-muted-foreground font-normal">
                          Permanently delete your profile and revoke on-chain skill verification records.
                        </p>
                      </div>
                      <Button
                        variant="destructive"
                        size="sm"
                        className="text-xs gap-1.5 font-bold cursor-pointer"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        Delete Account
                      </Button>
                    </div>
                  </div>
                </SettingsSection>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
