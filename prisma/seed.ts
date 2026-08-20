import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding LifeProof Database...");

  // 1. Skill Categories
  const categories = [
    { name: "Frontend Architecture", iconName: "Layers", description: "Modern component hierarchies, SSR/ISR, and web performance." },
    { name: "Backend & Distributed Systems", iconName: "Database", description: "Fault-tolerant microservices, high-throughput caching, and data pipelines." },
    { name: "AI & Machine Learning", iconName: "Cpu", description: "Vector databases, RAG architectures, and agentic workflows." },
    { name: "Smart Contracts & Web3", iconName: "Shield", description: "EVM protocols, decentralized ledgers, and cryptographic proofs." },
    { name: "Cloud & DevOps", iconName: "Cloud", description: "Kubernetes orchestration, CI/CD automation, and infrastructure as code." },
    { name: "System Design", iconName: "Network", description: "Large-scale multi-tenant architectures, reliability, and real-time streaming." },
  ];

  for (const cat of categories) {
    await prisma.skillCategory.upsert({
      where: { name: cat.name },
      create: cat,
      update: cat,
    });
  }

  // 2. Achievements
  const achievements = [
    {
      title: "TypeScript Vanguard",
      description: "Achieved top 5% mastery ranking across 10+ advanced typing challenges.",
      icon: "ShieldCheck",
      category: "Frontend Architecture",
      rarity: "Epic" as const,
      proofHash: "0x8f4b...39a1",
      verificationTag: "AST-VERIFIED",
    },
    {
      title: "Distributed Architect",
      description: "Solved high-throughput consensus and replication challenges with 0 defects.",
      icon: "Zap",
      category: "Backend & Distributed Systems",
      rarity: "Legendary" as const,
      proofHash: "0x77c2...e81d",
      verificationTag: "CONCURRENCY-PASS",
    },
    {
      title: "Fast Learner",
      description: "Completed 5 complex challenges within the first 7 days of onboarding.",
      icon: "Flame",
      category: "Engineering Velocity",
      rarity: "Rare" as const,
      proofHash: "0x12a9...99fe",
      verificationTag: "VELOCITY-HIGH",
    },
    {
      title: "Clean Coder",
      description: "Received an AI Coach code review rating of 95%+ for 8 consecutive submissions.",
      icon: "Award",
      category: "Code Quality",
      rarity: "Epic" as const,
      proofHash: "0x44d1...aa02",
      verificationTag: "ZERO-LINT",
    },
  ];

  for (const ach of achievements) {
    await prisma.achievement.upsert({
      where: { title: ach.title },
      create: ach,
      update: ach,
    });
  }

  // 3. Challenges
  const challenges = [
    {
      title: "Server Action Cache Invalidation in Next.js 14",
      slug: "nextjs-server-action-cache-invalidation",
      description: "Debug and refactor a multi-tenant dashboard with revalidateTag and on-demand ISR under heavy concurrent read-write loads.",
      companyName: "Vercel Partner Labs",
      companyLogo: "https://avatar.vercel.sh/vercel",
      difficulty: "Advanced" as const,
      prizeAmount: "$1,500 Grant",
      estimatedTime: 45,
      participantsCount: 1250,
      status: "Active" as const,
      category: "Frontend Architecture",
      tags: ["Next.js", "Server Actions", "ISR", "Cache API"],
      deadline: "5 days left",
      xpReward: 350,
      featured: false,
      endingSoon: false,
    },
    {
      title: "Zero-Downtime Distributed Lock with Redis",
      slug: "zero-downtime-distributed-lock-redis",
      description: "Implement a fault-tolerant distributed locking mechanism featuring heartbeat renewal and automatic split-brain resolution.",
      companyName: "CloudScale Systems",
      companyLogo: "https://avatar.vercel.sh/cloudscale",
      difficulty: "Mastery" as const,
      prizeAmount: "$2,500 Bounty",
      estimatedTime: 60,
      participantsCount: 940,
      status: "Active" as const,
      category: "Backend & Distributed Systems",
      tags: ["Redis", "Concurrency", "Distributed Systems", "Node.js"],
      deadline: "2 days left",
      xpReward: 500,
      featured: true,
      endingSoon: true,
    },
    {
      title: "Vector Search & Hybrid RAG Pipeline",
      slug: "vector-search-hybrid-rag-pipeline",
      description: "Construct a low-latency semantic search pipeline using pgvector, BM25 keyword reranking, and chunk optimization.",
      companyName: "Scale AI Ecosystem",
      companyLogo: "https://avatar.vercel.sh/scaleai",
      difficulty: "Intermediate" as const,
      prizeAmount: "$1,000 Grant",
      estimatedTime: 30,
      participantsCount: 2100,
      status: "Active" as const,
      category: "AI & Machine Learning",
      tags: ["pgvector", "RAG", "Embeddings", "LangChain"],
      deadline: "8 days left",
      xpReward: 250,
      featured: false,
      endingSoon: false,
    },
    {
      title: "Type-Safe RPC Router with Zero Run-Time Overhead",
      slug: "typesafe-rpc-router",
      description: "Design a recursive TypeScript type inference engine that validates nested schema payloads at compile time.",
      companyName: "TypeScript Foundation",
      companyLogo: "https://avatar.vercel.sh/ts",
      difficulty: "Intermediate" as const,
      prizeAmount: "$800 Grant",
      estimatedTime: 35,
      participantsCount: 2600,
      status: "Active" as const,
      category: "Frontend Architecture",
      tags: ["TypeScript", "Generics", "Type-Level", "Zod"],
      deadline: "12 days left",
      xpReward: 280,
      featured: false,
      endingSoon: false,
    },
    {
      title: "Build a Responsive Product Landing Page",
      slug: "responsive-product-landing-page",
      description: "Architect a high-conversion, accessible, responsive landing page using Tailwind CSS, fluid typography, and sub-second Core Web Vitals.",
      companyName: "DesignOps Studio",
      companyLogo: "https://avatar.vercel.sh/designops",
      difficulty: "Beginner" as const,
      prizeAmount: "$500 Grant",
      estimatedTime: 25,
      participantsCount: 4500,
      status: "Active" as const,
      category: "Frontend Architecture",
      tags: ["React", "Tailwind CSS", "Responsive", "Accessibility"],
      deadline: "14 days left",
      xpReward: 180,
      featured: false,
      endingSoon: false,
    },
    {
      title: "Optimize API Performance & Edge Caching",
      slug: "optimize-api-performance-edge-caching",
      description: "Analyze network waterfalls, eliminate N+1 SQL queries, and implement stale-while-revalidate edge caching across 5 regional clusters.",
      companyName: "Supabase Community",
      companyLogo: "https://avatar.vercel.sh/supabase",
      difficulty: "Advanced" as const,
      prizeAmount: "$1,800 Grant",
      estimatedTime: 50,
      participantsCount: 1120,
      status: "Active" as const,
      category: "Backend & Distributed Systems",
      tags: ["Edge CDN", "SQL Profiling", "Cache Control", "PostgreSQL"],
      deadline: "6 days left",
      xpReward: 420,
      featured: false,
      endingSoon: false,
    },
    {
      title: "Fix Authentication & Session Token Refresh Flow",
      slug: "fix-auth-session-refresh-flow",
      description: "Patch race conditions in JWT silent refresh loops, CSRF token validation, and multi-tab session synchronization.",
      companyName: "AuthShield Protocol",
      companyLogo: "https://avatar.vercel.sh/authshield",
      difficulty: "Intermediate" as const,
      prizeAmount: "$1,200 Bounty",
      estimatedTime: 40,
      participantsCount: 1890,
      status: "Active" as const,
      category: "Frontend Architecture",
      tags: ["OAuth2", "JWT", "Session Security", "NextAuth"],
      deadline: "9 days left",
      xpReward: 300,
      featured: false,
      endingSoon: false,
    },
    {
      title: "Design a Real-Time Streaming Data Dashboard",
      slug: "realtime-streaming-data-dashboard",
      description: "Construct a live WebSocket-driven analytics chart dashboard handling 50,000 tick updates per second with WebGL canvas rendering.",
      companyName: "FinTech Quant Labs",
      companyLogo: "https://avatar.vercel.sh/finquant",
      difficulty: "Mastery" as const,
      prizeAmount: "$3,000 Grant",
      estimatedTime: 70,
      participantsCount: 650,
      status: "Active" as const,
      category: "System Design",
      tags: ["WebSockets", "Canvas/WebGL", "High Throughput", "State Sync"],
      deadline: "4 days left",
      xpReward: 550,
      featured: true,
      endingSoon: false,
    },
  ];

  for (const c of challenges) {
    await prisma.challenge.upsert({
      where: { slug: c.slug },
      create: c,
      update: c,
    });
  }

  // 4. Seed Demo User
  const passwordHash = await bcrypt.hash("Password123!", 10);
  const demoUser = await prisma.user.upsert({
    where: { email: "alex@lifeproof.dev" },
    update: {},
    create: {
      name: "Alex Rivera",
      email: "alex@lifeproof.dev",
      username: "alexrivera",
      passwordHash,
      role: "ADMIN",
      rank: "Grandmaster IV",
      totalXp: 18450,
      profileCompleteness: 100,
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80",
      profile: {
        create: {
          fullName: "Alex Rivera",
          headline: "Principal Full-Stack Engineer & Distributed Systems Specialist",
          bio: "Specializing in resilient distributed web systems, Next.js architecture, and AI application engineering.",
          proofBadgeId: "LP-PROOF-8849-VERIFIED",
          verifiedSince: "May 2026",
          location: "San Francisco, CA",
          website: "https://alexrivera.dev",
          globalPercentile: 98.4,
          publicProfileEnabled: true,
          showSkillDNA: true,
          showAchievements: true,
          showCompletedChallenges: true,
          recruiterVisible: true,
        },
      },
      settings: {
        create: {
          theme: "dark",
          accentColor: "indigo",
          layoutDensity: "comfortable",
          twoFactorEnabled: true,
        },
      },
      notificationPrefs: {
        create: {
          emailNotifications: true,
          challengeUpdates: true,
          aiCoachInsights: true,
        },
      },
    },
  });

  console.log("✅ Database seeded successfully with demo user: alex@lifeproof.dev (Password: Password123!)");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
