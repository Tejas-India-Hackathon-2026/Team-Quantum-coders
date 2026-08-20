export const APP_CONFIG = {
  name: "LifeProof",
  tagline: "Proof of Real-World Skills",
  subtitle: "Where Skills Meet Proof, and Talent Meets Opportunity.",
  description:
    "LifeProof is the skill verification platform where developers prove their abilities through challenges, AI-guided feedback, and generate trusted, tamper-proof career profiles.",
  url: "https://lifeproof.dev",
};

export const LANDING_NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Features", href: "#features" },
  { label: "How it Works", href: "#how-it-works" },
  { label: "Pricing", href: "#pricing" },
  { label: "Challenges", href: "/challenges" },
];

export const APP_NAV_LINKS = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Challenges", href: "/challenges" },
  { label: "AI Coach", href: "/coach" },
  { label: "Verified Profile", href: "/profile" },
];

export const STATS_DATA = [
  { value: "1M+", label: "Students & Engineers", subtext: "Verified worldwide" },
  { value: "500+", label: "Hiring Companies", subtext: "Bypassing resume screening" },
  { value: "100+", label: "Top Universities", subtext: "Accredited curriculum labs" },
  { value: "95%", label: "Profile Completion Rate", subtext: "Industry-leading engagement" },
];

export const HOW_IT_WORKS_STEPS = [
  {
    step: "01",
    title: "Claim Your Skill",
    description:
      "Select your technical domains from React, Next.js, Distributed Systems, AI Engineering, and Cloud Native Architectures to initialize your custom skill matrix.",
    tag: "Instant Initialization",
  },
  {
    step: "02",
    title: "Prove It with Challenges",
    description:
      "Solve hands-on coding sandboxes, debug concurrency bottlenecks, and receive real-time AI architectural audits on code quality, time-space complexity, and security.",
    tag: "Real-World Sandboxes",
  },
  {
    step: "03",
    title: "Get Verified & Share Profile",
    description:
      "Earn tamper-proof cryptographic proof badges, export verifiable skill certificates, and get fast-tracked into top engineering hiring pipelines with zero resume fluff.",
    tag: "Immutable Proof",
  },
];

export const TESTIMONIALS_DATA = [
  {
    id: "test-1",
    quote:
      "LifeProof completely changed how I interview. Instead of grinding arbitrary LeetCode, I proved my Next.js and distributed systems expertise. Recruiters reached out directly after seeing my verified proof hash.",
    author: "Elena Rostova",
    role: "Senior Full-Stack Engineer at Vercel ecosystem partner",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80",
    category: "Student / Developer",
    badge: "Grandmaster Verified",
    rating: 5,
  },
  {
    id: "test-2",
    quote:
      "As a hiring manager, traditional resumes tell me nothing about actual engineering judgment. LifeProof allows us to skip 2 initial screening rounds because candidates come with cryptographic proof of system design mastery.",
    author: "Marcus Vance",
    role: "Head of Engineering at CloudScale",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80",
    category: "Recruiter & Tech Lead",
    badge: "50+ Engineers Hired",
    rating: 5,
  },
  {
    id: "test-3",
    quote:
      "We adopted LifeProof in our advanced software architecture curriculum. Students get instant AI feedback on edge cases and graduate with verifiable proof badges that employer partners actively seek out.",
    author: "Dr. Aris Thorne",
    role: "Professor of Computer Science & Systems",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80",
    category: "Educator & Researcher",
    badge: "University Accredited",
    rating: 5,
  },
];

export const PRICING_PLANS = [
  {
    name: "Starter Proof",
    price: "$0",
    period: "forever free",
    description: "Perfect for students & developers starting their skill verification journey.",
    features: [
      "5 Real-World Verification Challenges / month",
      "Basic AI Code Feedback & AST Analysis",
      "Public LifeProof Verified Profile URL",
      "3 Core Skill Badges (Frontend, Backend, TS)",
      "Community Discord & Leaderboards",
    ],
    cta: "Start Free",
    popular: false,
    href: "/signup",
  },
  {
    name: "Career Verified Pro",
    price: "$19",
    period: "per month",
    description: "For serious engineers seeking fast-track hiring visibility and AI coaching.",
    features: [
      "Unlimited Verification Challenges & Sandboxes",
      "Autonomous GPT-4o AI Architecture Coach",
      "Tamper-Proof Cryptographic Certificates",
      "Direct Fast-Track Hiring Partner Pipeline",
      "Multi-Vector Dynamic Skill DNA & Radar",
      "Priority AST Execution & Zero Queue",
    ],
    cta: "Get Verified Pro",
    popular: true,
    href: "/signup",
  },
  {
    name: "University & Teams",
    price: "Custom",
    period: "annual license",
    description: "For academic institutions, bootcamps, and enterprise engineering departments.",
    features: [
      "Custom Challenge Sandboxes & Curriculum Integration",
      "Cohort Analytics & Anti-Cheat Telemetry",
      "Single Sign-On (SAML / Okta / Google)",
      "Dedicated Verification Consensus Node",
      "Custom Branded Proof Certificates",
    ],
    cta: "Contact Enterprise",
    popular: false,
    href: "/signup",
  },
];

export const SKILL_CATEGORIES = [
  "All Categories",
  "Frontend Architecture",
  "Backend & Distributed Systems",
  "AI & Machine Learning",
  "Smart Contracts & Web3",
  "Cloud & DevOps",
  "System Design",
];

export const DIFFICULTY_LEVELS = ["All Difficulties", "Beginner", "Intermediate", "Advanced", "Mastery"];
