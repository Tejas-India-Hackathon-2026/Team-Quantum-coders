# LifeProof — Cryptographically Verified Skill Platform

LifeProof is a modern, dark-mode first skill verification platform built with Next.js 14+ (App Router), TypeScript, and Tailwind CSS. It allows software engineers to claim skills, solve real-world challenges, receive AI-powered architectural audits, and generate verifiable proof badges.

---

## ⚡ Tech Stack

- **Framework**: [Next.js 14+ (App Router)](https://nextjs.org/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) with custom design system and neon glow tokens
- **Theme**: [next-themes](https://github.com/pacocoursey/next-themes) (Dark mode first with light mode support)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Auth & Database Client**: [Supabase JS](https://supabase.com/docs/reference/javascript/introduction)
- **Form Validation**: React Hook Form + Zod

---

## 📂 Project Structure

```
Life Proof/
├── app/
│   ├── layout.tsx              # Root layout with ThemeProvider, fonts, metadata
│   ├── page.tsx                # Landing page (Hero, Features, Stats, CTA)
│   ├── globals.css             # Tailwind CSS tokens, gradients, animations, glassmorphism
│   ├── login/page.tsx          # Login authentication view
│   ├── signup/page.tsx         # Signup authentication view
│   ├── dashboard/page.tsx      # User skill & progress dashboard
│   ├── challenges/page.tsx     # Challenges catalog & filter view
│   ├── profile/page.tsx        # Verified developer profile view
│   ├── coach/page.tsx          # AI Skill Coach chat interface
│   └── settings/page.tsx       # Account & application settings
├── components/
│   ├── layout/
│   │   ├── Header.tsx          # Top navigation bar with active route & theme toggle
│   │   ├── Footer.tsx          # Comprehensive footer with links & branding
│   │   └── Sidebar.tsx         # Dashboard / App sidebar navigation
│   ├── ui/
│   │   ├── Button.tsx          # Reusable CVA/Tailwind button component
│   │   ├── Card.tsx            # Glassmorphic container cards with headers & content
│   │   ├── Input.tsx           # Form text inputs & search bars
│   │   ├── Badge.tsx           # Status, skill, difficulty badges
│   │   └── Tabs.tsx            # Animated tab switcher
│   ├── landing/
│   │   ├── HeroSection.tsx     # Hero with headline, badges, primary CTA & preview
│   │   ├── FeaturesSection.tsx # Key feature grid (AI proof, challenge runner, verified badge)
│   │   ├── StatsSection.tsx    # Live ecosystem metrics & proof points
│   │   └── CTASection.tsx      # High-conversion closing CTA banner
│   ├── dashboard/
│   │   ├── SkillCard.tsx       # Skill mastery & level card
│   │   ├── ProgressChart.tsx   # Visual progress indicator & activity streak
│   │   ├── RecentChallengeCard.tsx # Completed / ongoing challenge cards
│   │   └── AchievementCard.tsx # Unlocked proof badges & trophies
│   ├── challenges/
│   │   ├── ChallengeCard.tsx   # Interactive challenge listing item
│   │   └── FilterSidebar.tsx   # Category, difficulty & tech stack filters
│   ├── profile/
│   │   ├── ProfileHeader.tsx   # Avatar, verified badge, stats summary
│   │   ├── VerifiedBadge.tsx   # Cryptographic / AI verified seal component
│   │   └── SkillRadar.tsx      # Skill breakdown & proficiency visualizer
│   └── coach/
│       ├── ChatWindow.tsx      # AI coach message feed & prompt box
│       └── SuggestedActions.tsx# Recommended next challenge & review prompts
├── lib/
│   ├── supabase.ts             # Supabase client & server-side initialization
│   ├── utils.ts                # cn() helper, date formatters, string helpers
│   └── constants.ts            # Navigation items, categories, app config
├── hooks/
│   ├── useTheme.ts             # Theme hook wrapper
│   └── useMobile.ts            # Screen size & responsive detection hook
├── types/
│   └── index.ts                # Skill, Challenge, User, Achievement TypeScript interfaces
├── data/
│   ├── mockSkills.ts           # Realistic dummy skills data
│   ├── mockChallenges.ts       # Realistic dummy challenges data
│   └── mockAchievements.ts     # Realistic dummy badges & achievements data
├── public/
│   ├── images/
│   └── icons/
├── .env.example                # Environment variables template for Supabase
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Run the Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### 3. Build for Production
```bash
npm run build
npm run start
```

---

## 🔑 Supabase Setup (For Future Auth & Database)

1. Create a project at [supabase.com](https://supabase.com).
2. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
3. Update `.env.local` with your credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key-here
   ```
4. The client is already configured in [`lib/supabase.ts`](lib/supabase.ts). When ready, you can start querying Supabase tables directly in Server Actions or Route Handlers.

---

## 🔮 How to Extend in Future Stages

1. **Authentication & Session Persistence**:
   - Replace the mock state in [`app/login/page.tsx`](app/login/page.tsx) and [`app/signup/page.tsx`](app/signup/page.tsx) with `supabase.auth.signInWithPassword` and `supabase.auth.signUp`.
   - Add Next.js middleware in `middleware.ts` to protect `/dashboard`, `/profile`, `/coach`, and `/settings`.

2. **Real-Time Code Execution Sandboxes**:
   - Connect the challenge runner to an isolated code evaluation backend (e.g. Docker / WebAssembly / Pyodide / E2B sandbox).
   - Stream test results and AI architectural critique directly into [`components/coach/ChatWindow.tsx`](components/coach/ChatWindow.tsx).

3. **Database Schema & Migrations**:
   - Create Supabase tables for `users`, `skills`, `challenges`, `submissions`, and `verifications`.
   - Replace mock data imports in [`data/`](data/) with server-side data fetching via Next.js React Server Components.

4. **Cryptographic Proofs & Verifiable Credentials**:
   - Generate SHA-256 or ED25519 signatures on completed challenges.
   - Issue W3C Verifiable Credentials or on-chain Soulbound Tokens (SBTs) corresponding to verified badge IDs.
