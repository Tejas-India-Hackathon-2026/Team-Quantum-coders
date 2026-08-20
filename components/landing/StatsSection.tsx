"use client";

import { motion } from "framer-motion";
import { STATS_DATA } from "@/lib/constants";
import { Users, Building2, GraduationCap, Award, ShieldCheck } from "lucide-react";

const STAT_ICONS = [Users, Building2, GraduationCap, Award];

const LOGOS = [
  "TechCorp Labs",
  "ScaleVortex",
  "CloudMatrix",
  "NextGen AI",
  "HyperVector",
  "QuantumEngine",
];

export function StatsSection() {
  return (
    <section className="py-20 bg-slate-50/70 dark:bg-slate-950/50 border-y border-slate-200/80 dark:border-white/10 relative overflow-hidden">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Social Proof Brand Logobar */}
        <div className="text-center space-y-4">
          <p className="text-xs uppercase tracking-widest font-mono text-slate-500 dark:text-muted-foreground font-bold">
            Trusted by hiring engineering teams & academic institutions worldwide
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-14 opacity-70">
            {LOGOS.map((logo, idx) => (
              <span
                key={idx}
                className="text-sm sm:text-base font-extrabold tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2"
              >
                <span className="w-2 h-2 rounded-full bg-indigo-600 inline-block" />
                {logo}
              </span>
            ))}
          </div>
        </div>

        {/* 4 Core Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 text-center pt-4">
          {STATS_DATA.map((stat, idx) => {
            const Icon = STAT_ICONS[idx] || ShieldCheck;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="p-6 rounded-3xl bg-white dark:bg-slate-950/60 border border-slate-200/90 dark:border-white/10 shadow-sm space-y-2 hover:border-indigo-400 dark:hover:border-primary/40 transition-colors"
              >
                <div className="mx-auto w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-primary/10 border border-indigo-100 dark:border-primary/20 flex items-center justify-center text-indigo-600 dark:text-primary mb-3">
                  <Icon className="h-5 w-5" />
                </div>
                <div className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-900 dark:text-white">
                  <span className="text-gradient">{stat.value}</span>
                </div>
                <div className="text-sm sm:text-base font-bold text-slate-800 dark:text-foreground">
                  {stat.label}
                </div>
                <div className="text-xs text-slate-500 dark:text-muted-foreground font-medium">
                  {stat.subtext}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
