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
    gradient: "from-blue-500/20 via-indigo-500/10 to-transparent",
    iconColor: "text-blue-400",
    borderGlow: "group-hover:border-blue-500/40",
  },
  {
    icon: Bot,
    title: "AI Skill Coach",
    description:
      "Autonomous GPT-4o architecture mentor that evaluates code quality, detects performance bottlenecks, and provides tailored mentorship.",
    gradient: "from-purple-500/20 via-pink-500/10 to-transparent",
    iconColor: "text-purple-400",
    borderGlow: "group-hover:border-purple-500/40",
  },
  {
    icon: ShieldCheck,
    title: "Verified Achievements",
    description:
      "Immutable, cryptographically signed proof badges that certify your problem-solving accuracy and system design mastery with zero fluff.",
    gradient: "from-cyan-500/20 via-blue-500/10 to-transparent",
    iconColor: "text-cyan-400",
    borderGlow: "group-hover:border-cyan-500/40",
  },
  {
    icon: Code2,
    title: "Challenge Marketplace",
    description:
      "A vast catalog of real-world coding sandboxes covering Next.js, distributed databases, concurrency, AI pipelines, and cloud systems.",
    gradient: "from-emerald-500/20 via-teal-500/10 to-transparent",
    iconColor: "text-emerald-400",
    borderGlow: "group-hover:border-emerald-500/40",
  },
  {
    icon: LineChart,
    title: "Smart Career Insights",
    description:
      "Data-driven insights comparing your verified percentile against worldwide engineering benchmarks to identify high-leverage skill gaps.",
    gradient: "from-amber-500/20 via-orange-500/10 to-transparent",
    iconColor: "text-amber-400",
    borderGlow: "group-hover:border-amber-500/40",
  },
  {
    icon: Globe2,
    title: "Global Talent Visibility",
    description:
      "Top tech companies and hiring partners query the LifeProof verification protocol to discover and interview pre-vetted engineers directly.",
    gradient: "from-indigo-500/20 via-purple-500/10 to-transparent",
    iconColor: "text-indigo-400",
    borderGlow: "group-hover:border-indigo-500/40",
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="py-24 border-t border-white/10 relative scroll-mt-16">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-primary/10 rounded-full blur-[160px] pointer-events-none -z-10" />

      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold">
            Features & Capabilities
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
            Everything You Need to Prove Mastery
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg leading-relaxed">
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
                <Card
                  className={`h-full group border border-white/10 bg-slate-950/50 hover:bg-slate-900/70 transition-all duration-300 ${feature.borderGlow} hover:-translate-y-1.5 shadow-xl hover:shadow-2xl flex flex-col justify-between`}
                >
                  <CardHeader className="space-y-4 p-6 sm:p-7">
                    <div
                      className={`w-13 h-13 rounded-2xl flex items-center justify-center bg-gradient-to-br ${feature.gradient} border border-white/10 p-3 shadow-inner`}
                    >
                      <Icon className={`h-6 w-6 ${feature.iconColor} transition-transform group-hover:scale-110`} />
                    </div>

                    <CardTitle className="text-lg sm:text-xl text-white font-bold group-hover:text-primary transition-colors">
                      {feature.title}
                    </CardTitle>

                    <CardDescription className="text-sm leading-relaxed text-muted-foreground">
                      {feature.description}
                    </CardDescription>
                  </CardHeader>

                  <div className="p-6 pt-0 border-t border-white/5 mt-auto">
                    <Link
                      href="/challenges"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-white transition-colors"
                    >
                      Explore feature <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
