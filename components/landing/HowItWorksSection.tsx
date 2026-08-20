"use client";

import { motion } from "framer-motion";
import { Sparkles, ArrowRight, ShieldCheck, Code2, Share2, Check } from "lucide-react";
import { HOW_IT_WORKS_STEPS } from "@/lib/constants";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

const ICONS = [Code2, Sparkles, ShieldCheck];

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-24 border-t border-white/10 relative scroll-mt-16 bg-slate-950/40">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold">
            Simple 3-Step Verification
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
            How LifeProof Works
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg leading-relaxed">
            From initial assessment to cryptographic certification in three seamless steps.
          </p>
        </div>

        {/* 3 Step Process Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {HOW_IT_WORKS_STEPS.map((item, idx) => {
            const Icon = ICONS[idx] || Sparkles;
            return (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.15 }}
                className="relative"
              >
                <Card className="h-full border border-white/15 bg-slate-900/60 backdrop-blur-xl hover:border-primary/50 transition-all duration-300 shadow-xl group flex flex-col justify-between">
                  <CardHeader className="p-6 sm:p-8 space-y-4">
                    {/* Step Number + Icon Header */}
                    <div className="flex items-center justify-between">
                      <span className="text-3xl sm:text-4xl font-extrabold font-mono text-white/20 group-hover:text-primary transition-colors">
                        {item.step}
                      </span>
                      <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary group-hover:scale-105 transition-transform">
                        <Icon className="h-6 w-6" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Badge variant="cyan" className="text-[10px] font-mono">
                        {item.tag}
                      </Badge>
                      <CardTitle className="text-xl font-bold text-white group-hover:text-primary transition-colors">
                        {item.title}
                      </CardTitle>
                    </div>

                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {item.description}
                    </p>
                  </CardHeader>

                  <CardContent className="p-6 sm:p-8 pt-0 border-t border-white/5 mt-auto">
                    <div className="flex items-center gap-2 text-xs text-emerald-400 font-medium">
                      <Check className="h-4 w-4" />
                      Verified on-chain & in recruiter portal
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom Action Prompt */}
        <div className="mt-16 text-center">
          <Link href="/signup">
            <Button variant="glow" size="lg" className="gap-2 font-bold shadow-glow">
              <Sparkles className="h-4 w-4" />
              Claim Your First Skill Now
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
