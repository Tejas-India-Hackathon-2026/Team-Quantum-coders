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
  { label: "Features", href: "/#features" },
  { label: "Challenges", href: "/challenges" },
  { label: "Pricing", href: "/#pricing" },
  { label: "Recruiter Suite", href: "/recruiter" },
];

export const APP_NAV_LINKS = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Challenges", href: "/challenges" },
  { label: "AI Coach", href: "/coach" },
  { label: "Verified Profile", href: "/profile" },
  { label: "Recruiter Portal", href: "/recruiter" },
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
      "LifeProof completely revolutionized how we hire at ScaleVortex. We stopped filtering through hundreds of inflated resumes and started making direct offers based on verified Redis and Next.js proofs.",
    author: "Elena Rostova",
    role: "VP of Engineering at ScaleVortex",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
    badge: "Hiring Partner Seal",
    rating: 5,
    category: "Recruiter Experience",
  },
  {
    id: "test-2",
    quote:
      "The AI Coach pinpointed an edge-case concurrency race condition in my distributed lock implementation in under 5 seconds. Earning my Grandmaster IV badge helped me land my dream staff engineer role.",
    author: "David K.",
    role: "Senior Distributed Systems Engineer",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    badge: "Top 1% Verified",
    rating: 5,
    category: "Candidate Success",
  },
  {
    id: "test-3",
    quote:
      "We adopted LifeProof for our CS Capstone course at Berkeley. Students love the instant AST feedback and graduate with a tamper-proof portfolio of real system design work.",
    author: "Prof. Michael Sterling",
    role: "Director of Distributed Systems Lab",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    badge: "Academic Accreditation",
    rating: 5,
    category: "Higher Education",
  },
];

export const PRICING_PLANS = [
  {
    name: "Developer Starter",
    price: "$0",
    period: "forever free",
    description: "Ideal for aspiring engineers building their first verified proof portfolio.",
    features: [
      "Access to 5 core sandbox challenges",
      "Dynamic Skill DNA tracking",
      "Standard AST automated test audits",
      "1 verifiable cryptographic proof badge",
      "Community forum support",
    ],
    popular: false,
    cta: "Start Free",
    href: "/signup",
  },
  {
    name: "Engineering Pro",
    price: "$29",
    period: "per month",
    description: "For ambitious engineers looking to master advanced systems and get hired fast.",
    features: [
      "Unlimited access to all 50+ challenge sandboxes",
      "Autonomous GPT-4o AI Architecture Mentor",
      "High-concurrency load simulation drills",
      "Unlimited cryptographic proof-of-work badges",
      "Direct recruiter visibility & pipeline fast-track",
      "Priority verification seal generation",
    ],
    popular: true,
    cta: "Start 14-Day Free Trial",
    href: "/signup?plan=pro",
  },
  {
    name: "Enterprise & Recruiters",
    price: "$199",
    period: "per seat / month",
    description: "For engineering teams & hiring partners evaluating top-tier technical talent.",
    features: [
      "Full API access to verify candidate proof hashes",
      "Custom sandbox challenge authoring & bounties",
      "Pre-screened top 5% talent talent search pool",
      "Team skill matrix benchmarks & heatmaps",
      "Dedicated account manager & SLA guarantee",
      "SOC2 compliance audit exports",
    ],
    popular: false,
    cta: "Contact Enterprise Sales",
    href: "/recruiter",
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
