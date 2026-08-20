# LifeProof — Complete Backend Architecture & API Guide 🚀

The **LifeProof** backend is a scalable, type-safe Next.js App Router architecture built with **PostgreSQL**, **Prisma ORM**, **NextAuth / Auth.js**, **Zod Validation**, and **bcryptjs**.

---

## 🏗️ Architecture & Folder Structure

```
├── prisma/
│   ├── schema.prisma             # Full PostgreSQL schema with 15+ models and enums
│   └── seed.ts                   # Comprehensive seed data (Categories, Bounties, Demo Users)
├── lib/
│   ├── db.ts                     # Prisma Client singleton
│   ├── auth.ts                   # NextAuth options (Credentials + Google + GitHub + Prisma Adapter)
│   ├── env.ts                    # Zod type-safe environment variable parser
│   ├── validators.ts             # Zod input validation schemas for all endpoints
│   ├── api-response.ts           # Standardized JSON response helpers
│   └── permissions.ts            # Server-side session & role-based access helpers
├── services/
│   ├── auth/auth.service.ts      # Registration, password hashing, and user initialization
│   ├── user/user.service.ts      # Profile, public portfolio, avatar, and settings
│   ├── challenge/challenge.service.ts # Marketplace querying, attempt submissions, proof hashing
│   ├── skill/skill.service.ts    # Skill DNA calculations and proficiency radar metrics
│   ├── achievement/achievement.service.ts # Cryptographic badge minting & trophy awards
│   ├── coach/coach.service.ts    # AI Coach insight generator and gap analysis
│   └── activity/activity.service.ts # Audit logging and activity timeline tracking
├── app/api/
│   ├── auth/                     # [...nextauth], register, me, logout
│   ├── dashboard/                # summary, skills, challenges, achievements, activity, coach-insight
│   ├── profile/                  # me, avatar, [username], public/[username]
│   ├── settings/                 # GET and PUT user settings
│   ├── challenges/               # GET list, POST create, [id], [id]/attempt, [id]/save
│   ├── achievements/             # GET all achievements, user achievements
│   ├── skills/                   # GET user skills, overview radar
│   ├── coach/                    # insights, recommendation, gap-analysis
│   └── activity/                 # activity log, recent events
└── middleware.ts                 # Route protection for private pages (/dashboard, /settings, /coach)
```

---

## 🗄️ Database Schema & Models

### Core Authentication & User Models
- **`User`**: `id`, `name`, `email`, `passwordHash`, `username`, `role` (USER, ADMIN), `rank`, `totalXp`, `profileCompleteness`.
- **`Account`**: NextAuth OAuth provider linking (Google, GitHub).
- **`Session`**: Active JWT session tokens.
- **`VerificationToken`**: Magic links & email verification.

### Domain Models
- **`Profile`**: `avatarUrl`, `fullName`, `headline`, `bio`, `location`, `website`, `socialLinks`, `proofBadgeId`, `globalPercentile`.
- **`UserSettings`**: `theme`, `accentColor`, `layoutDensity`, `emailNotifications`, `twoFactorEnabled`, `loginAlertsEnabled`.
- **`SkillCategory`**: Core engineering vectors (*Frontend Architecture, Backend & Distributed Systems, AI/ML, Cloud/DevOps, System Design*).
- **`UserSkill`**: `categoryName`, `score`, `level` (1-100), `percentage`, `strengthLabel`, `verified`, `challengesCompleted`.
- **`Challenge`**: `title`, `slug`, `companyName`, `companyLogo`, `description`, `difficulty`, `prizeAmount`, `estimatedTime`, `tags`, `xpReward`.
- **`ChallengeAttempt`**: `codeSubmitted`, `status` (PASSED, IN_PROGRESS), `score`, `proofHash` (`0x8f4b...39a1`), `completedAt`.
- **`Achievement` & `UserAchievement`**: Verified badges & proof trophies.
- **`ActivityLog`**: System event timeline (`LOGIN`, `CHALLENGE_COMPLETED`, `ACHIEVEMENT_UNLOCKED`).
- **`AiInsight`**: AI Coach architectural feedback and gap recommendations.

---

## 📡 API Endpoints Reference

### 🔐 Authentication Endpoints
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/register` | Register new user with password hashing & initialize starter skills |
| `POST` | `/api/auth/login` | NextAuth Credentials / OAuth login |
| `GET` | `/api/auth/me` | Fetch active session user details |
| `POST` | `/api/auth/logout` | Terminate session |

### 📊 Dashboard Endpoints
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/dashboard/summary` | Aggregated dashboard stats (XP, Rank, Challenges, Skill overview) |
| `GET` | `/api/dashboard/skills` | User skills list |
| `GET` | `/api/dashboard/challenges` | Active and recent challenge attempts |
| `GET` | `/api/dashboard/achievements`| Unlocked proof trophies |
| `GET` | `/api/dashboard/activity` | Activity audit trail |
| `GET` | `/api/dashboard/coach-insight`| Latest AI mentor recommendation card |

### 👤 Profile & Settings Endpoints
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/profile/me` | Current user profile |
| `PUT` | `/api/profile/me` | Update bio, headline, links, and public visibility |
| `POST` | `/api/profile/avatar` | Update avatar image URL |
| `GET` | `/api/profile/[username]` | Public verified portfolio lookup |
| `GET` | `/api/settings` | User settings & notification preferences |
| `PUT` | `/api/settings` | Update security, notifications, and theme settings |

### ⚡ Challenges & Sandbox Endpoints
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/challenges` | Filtered search (category, difficulty, company, status, pagination) |
| `POST` | `/api/challenges` | Create challenge (Admin only) |
| `GET` | `/api/challenges/[id]` | Fetch single challenge details & user attempt state |
| `POST` | `/api/challenges/[id]/attempt` | Submit code sandbox solution, evaluate AST, mint cryptographic proof, award XP |
| `POST` | `/api/challenges/[id]/save` | Bookmark challenge |
| `DELETE` | `/api/challenges/[id]/save` | Remove bookmark |

### 🤖 AI Coach Endpoints
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/coach/insights` | Fetch AI Coach insight cards |
| `POST` | `/api/coach/recommendation` | Generate next-best challenge recommendation |
| `GET` | `/api/coach/gap-analysis` | Identify skill gaps below target mastery |

---

## ⚙️ Environment Variables Setup

Create a `.env` file in the root directory:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/lifeproof?schema=public"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-32-character-random-secret-key"

# Optional OAuth
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
GITHUB_CLIENT_ID=""
GITHUB_CLIENT_SECRET=""
```

---

## 🚀 Running Migrations & Seeding

```bash
# Generate Prisma Client
npx prisma generate

# Push database schema
npx prisma db push

# Seed initial challenges, achievements, and demo account
npx tsx prisma/seed.ts
```
