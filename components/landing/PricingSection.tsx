"use client";

import { motion } from "framer-motion";
import { Check, Sparkles, ArrowRight } from "lucide-react";
import { PRICING_PLANS } from "@/lib/constants";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import Link from "next/link";

export function PricingSection() {
  return (
    <section id="pricing" className="py-24 border-t border-white/10 relative scroll-mt-16 bg-slate-950/30">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
            Transparent Pricing
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
            Invest in Verifiable Career Growth
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg">
            Start for free, then upgrade to unlock autonomous AI coaching and fast-track recruiter distribution.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {PRICING_PLANS.map((plan, idx) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.15 }}
              className="flex"
            >
              <Card
                className={`w-full flex flex-col justify-between p-6 sm:p-8 rounded-3xl transition-all duration-300 ${
                  plan.popular
                    ? "border-primary/60 bg-gradient-to-b from-indigo-950/80 via-slate-950/90 to-slate-950 shadow-glow/30 ring-1 ring-primary/40 relative"
                    : "border-white/15 bg-slate-950/60"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <Badge variant="purple" className="shadow-lg px-3 py-1 text-xs uppercase tracking-wider font-bold">
                      Most Popular
                    </Badge>
                  </div>
                )}

                <CardHeader className="p-0 space-y-4">
                  <div className="space-y-1">
                    <CardTitle className="text-xl font-extrabold text-white">
                      {plan.name}
                    </CardTitle>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {plan.description}
                    </p>
                  </div>

                  <div className="flex items-baseline gap-2 pt-2 border-b border-white/10 pb-4">
                    <span className="text-4xl sm:text-5xl font-black text-white">
                      {plan.price}
                    </span>
                    <span className="text-xs text-muted-foreground font-mono">
                      / {plan.period}
                    </span>
                  </div>
                </CardHeader>

                <CardContent className="p-0 py-6 space-y-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                    Included Features:
                  </span>
                  <ul className="space-y-2.5">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300">
                        <Check className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>

                <CardFooter className="p-0 pt-4 mt-auto">
                  <Link href={plan.href} className="w-full">
                    <Button
                      variant={plan.popular ? "glow" : "outline"}
                      className="w-full h-11 text-sm font-bold gap-2"
                    >
                      {plan.popular && <Sparkles className="h-4 w-4" />}
                      {plan.cta}
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
