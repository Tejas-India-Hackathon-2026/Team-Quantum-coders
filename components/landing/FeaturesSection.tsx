"use client";

import { motion } from "framer-motion";
import {
  Dna,
  Bot,
  ShieldCheck,
  Code2,
  LineChart,
  Globe2,
  ArrowRight,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import Link from "next/link";

const FEATURES = [
  {
    icon: Dna,
    title: "Dynamic Skill DNA",
    description:
      "A living, multi-dimensional representation of your engineering competencies that evolves in real time as you complete advanced challenges.",
    gradient: "from-blue-50 to-indigo-100/50 dark:from-blue-500/20 dark:via-indigo-500/10 dark:to-transparent",
    iconColor: "text-blue-600 dark:text-blue-400",
    borderGlow: "hover:border-blue-400",
    href: "/dashboard",
    cta: "View Skill DNA",
  },
  {
    icon: Bot,
    title: "AI Skill Coach",
    description:
      "Autonomous GPT-4o architecture mentor that evaluates code quality, detects performance bottlenecks, and provides tailored mentorship.",
    gradient: "from-purple-50 to-pink-100/50 dark:from-purple-500/20 dark:via-pink-500/10 dark:to-transparent",
    iconColor: "text-purple-600 dark:text-purple-400",
    borderGlow: "hover:border-purple-400",
    href: "/coach",
    cta: "Chat with AI Coach",
  },
  {
    icon: ShieldCheck,
    title: "Verified Achievements",
    description:
      "Immutable, cryptographically signed proof badges that certify your problem-solving accuracy and system design mastery with zero fluff.",
    gradient: "from-sky-50 to-cyan-100/50 dark:from-cyan-500/20 dark:via-blue-500/10 dark:to-transparent",
    iconColor: "text-sky-600 dark:text-cyan-400",
    borderGlow: "hover:border-sky-400",
    href: "/profile",
    cta: "Inspect Verified Proofs",
  },
  {
    icon: Code2,
    title: "Challenge Marketplace",
    description:
      "A vast catalog of real-world coding sandboxes covering Next.js, distributed databases, concurrency, AI pipelines, and cloud systems.",
    gradient: "from-emerald-50 to-teal-100/50 dark:from-emerald-500/20 dark:via-teal-500/10 dark:to-transparent",
    iconColor: "text-emerald-600 dark:text-emerald-400",
    borderGlow: "hover:border-emerald-400",
    href: "/challenges",
    cta: "Explore Marketplace",
  },
  {
    icon: LineChart,
    title: "Smart Career Insights",
    description:
      "Data-driven insights comparing your verified percentile against worldwide engineering benchmarks to identify high-leverage skill gaps.",
    gradient: "from-amber-50 to-orange-100/50 dark:from-amber-500/20 dark:via-orange-500/10 dark:to-transparent",
    iconColor: "text-amber-600 dark:text-amber-400",
    borderGlow: "hover:border-amber-400",
    href: "/dashboard",
    cta: "Explore Career Analytics",
  },
  {
    icon: Globe2,
    title: "Global Talent Visibility",
    description:
      "Top tech companies and hiring partners query the LifeProof verification protocol to discover and interview pre-vetted engineers directly.",
    gradient: "from-indigo-50 to-purple-100/50 dark:from-indigo-500/20 dark:via-purple-500/10 dark:to-transparent",
    iconColor: "text-indigo-600 dark:text-indigo-400",
    borderGlow: "hover:border-indigo-400",
    href: "/recruiter",
    cta: "Open Recruiter Suite",
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="py-24 border-t border-slate-200/80 dark:border-white/10 relative scroll-mt-16 text-left">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-primary/10 border border-indigo-200 dark:border-primary/20 text-indigo-700 dark:text-primary text-xs font-bold">
            Features & Capabilities
          </div>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900 dark:text-white">
            Everything You Need to Prove Mastery
          </h2>
          <p className="text-slate-600 dark:text-muted-foreground text-base sm:text-lg leading-relaxed font-normal">
            Replace self-reported resume bullet points with verified proof-of-work that stands up to technical scrutiny.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
              >
                <Link href={feature.href} className="block h-full">
                  <Card
                    className={`h-full group border border-slate-200/90 dark:border-white/10 bg-white dark:bg-slate-950/50 hover:bg-slate-50/70 dark:hover:bg-slate-900/70 transition-all duration-300 ${feature.borderGlow} hover:-translate-y-1.5 shadow-sm hover:shadow-md flex flex-col justify-between cursor-pointer`}
                  >
                    <CardHeader className="space-y-4 p-6 sm:p-7">
                      <div
                        className={`w-12 h-12 rounded-2xl flex items-center justify-center bg-gradient-to-br ${feature.gradient} border border-slate-200/80 dark:border-white/10 p-2.5 shadow-xs`}
                      >
                        <Icon className={`h-6 w-6 ${feature.iconColor} transition-transform group-hover:scale-110`} />
                      </div>

                      <CardTitle className="text-lg sm:text-xl text-slate-900 dark:text-white font-bold group-hover:text-indigo-600 dark:group-hover:text-primary transition-colors">
                        {feature.title}
                      </CardTitle>

                      <CardDescription className="text-sm leading-relaxed text-slate-600 dark:text-muted-foreground font-normal">
                        {feature.description}
                      </CardDescription>
                    </CardHeader>

                    <div className="p-6 pt-0 border-t border-slate-100 dark:border-white/5 mt-auto">
                      <span className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 group-hover:text-indigo-700 dark:text-primary dark:group-hover:text-white transition-colors">
                        {feature.cta} <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
                      </span>
                    </div>
                  </Card>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
