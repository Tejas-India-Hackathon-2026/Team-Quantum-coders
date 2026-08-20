"use client";

import { motion } from "framer-motion";
import { Star, ShieldCheck, Quote } from "lucide-react";
import { TESTIMONIALS_DATA } from "@/lib/constants";
import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

export function TestimonialsSection() {
  return (
    <section className="py-24 border-t border-slate-200/80 dark:border-white/10 relative text-left">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 dark:bg-purple-500/10 border border-purple-200 dark:border-purple-500/20 text-purple-700 dark:text-purple-300 text-xs font-bold">
            Real Stories & Trust Statements
          </div>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900 dark:text-white">
            Endorsed by Engineers, Recruiters & Educators
          </h2>
          <p className="text-slate-600 dark:text-muted-foreground text-base sm:text-lg font-normal">
            See how LifeProof is reshaping technical assessment and career verification worldwide.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {TESTIMONIALS_DATA.map((t, idx) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.15 }}
            >
              <Card className="h-full border border-slate-200/90 dark:border-white/15 bg-white dark:bg-slate-950/70 shadow-sm hover:shadow-md hover:border-indigo-300 dark:hover:border-primary/40 transition-all duration-300 flex flex-col justify-between p-6 sm:p-8">
                <CardHeader className="p-0 space-y-4">
                  {/* Category & Badge */}
                  <div className="flex items-center justify-between">
                    <Badge variant="cyan" className="text-[10px] font-mono">
                      {t.category}
                    </Badge>
                    <div className="flex gap-1 text-amber-500">
                      {[...Array(t.rating)].map((_, i) => (
                        <Star key={i} className="h-3.5 w-3.5 fill-current" />
                      ))}
                    </div>
                  </div>

                  {/* Quote */}
                  <div className="relative">
                    <Quote className="h-8 w-8 text-slate-200 dark:text-white/10 absolute -top-3 -left-2 -z-10" />
                    <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed italic font-medium">
                      &ldquo;{t.quote}&rdquo;
                    </p>
                  </div>
                </CardHeader>

                {/* Author Info */}
                <CardContent className="p-0 pt-6 border-t border-slate-100 dark:border-white/10 mt-6 flex items-center gap-4">
                  <div className="relative">
                    <img
                      src={t.avatar}
                      alt={t.author}
                      className="w-12 h-12 rounded-2xl object-cover ring-1 ring-indigo-200 dark:ring-primary/40"
                    />
                    <div className="absolute -bottom-1 -right-1 p-0.5 rounded-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/20">
                      <ShieldCheck className="h-3.5 w-3.5 text-indigo-600 dark:text-cyan-400" />
                    </div>
                  </div>
                  <div className="space-y-0.5 text-left">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">{t.author}</h4>
                    <p className="text-xs text-slate-500 dark:text-muted-foreground line-clamp-1">{t.role}</p>
                    <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-bold block">
                      {t.badge}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
