"use client";

import * as React from "react";
import {
  X,
  PlusCircle,
  Sparkles,
  ShieldCheck,
  Zap,
  Code2,
  Database,
  Layers,
  Cpu,
  Cloud,
  Network,
  Shield,
  Play,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { Skill, SkillCategory } from "@/types";
import { useAuth } from "@/context/AuthContext";

interface AddSkillModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSkillAdded?: (newSkill: Skill) => void;
  onTakeVerificationDrill?: (skill: Skill) => void;
}

const AVAILABLE_ICONS = [
  { id: "Code2", label: "Code", icon: Code2 },
  { id: "Database", label: "Database", icon: Database },
  { id: "Layers", label: "Architecture", icon: Layers },
  { id: "Cpu", label: "AI / Engine", icon: Cpu },
  { id: "Cloud", label: "Cloud", icon: Cloud },
  { id: "Network", label: "Network", icon: Network },
  { id: "Shield", label: "Security", icon: Shield },
];

const PRESET_SUGGESTIONS = [
  "GraphQL & Apollo Server",
  "Kafka Event Streaming",
  "Docker & Kubernetes",
  "pgvector Hybrid RAG",
  "WebAssembly & Rust",
  "gRPC Microservices",
  "TailwindCSS & Design Systems",
  "Solidity & EVM Protocols",
];

export function AddSkillModal({
  isOpen,
  onClose,
  onSkillAdded,
  onTakeVerificationDrill,
}: AddSkillModalProps) {
  const { addCustomSkill } = useAuth();
  const [skillName, setSkillName] = React.useState("");
  const [category, setCategory] = React.useState<SkillCategory>("Backend & Distributed Systems");
  const [selectedIcon, setSelectedIcon] = React.useState("Code2");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [createdSkill, setCreatedSkill] = React.useState<Skill | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!skillName.trim()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      const newSkill = addCustomSkill({
        name: skillName.trim(),
        category,
        iconName: selectedIcon,
      });

      setIsSubmitting(false);
      setCreatedSkill(newSkill);
      onSkillAdded?.(newSkill);
    }, 400);
  };

  const handleResetAndClose = () => {
    setSkillName("");
    setCreatedSkill(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-3xl border border-slate-200 dark:border-white/20 bg-white dark:bg-slate-950 p-6 sm:p-8 shadow-2xl space-y-6 text-left overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-indigo-50 dark:bg-primary/10 text-indigo-600 dark:text-primary border border-indigo-100 dark:border-primary/20 shadow-xs">
              <PlusCircle className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                Add Custom Engineering Skill
              </h3>
              <p className="text-xs text-slate-500 dark:text-muted-foreground">
                Add skill to your matrix and take an interactive test to calculate your real score
              </p>
            </div>
          </div>
          <button
            onClick={handleResetAndClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-900 hover:bg-slate-100 dark:hover:text-white dark:hover:bg-white/10"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Success Screen: Take verification test */}
        {createdSkill ? (
          <div className="space-y-6 text-center py-4 animate-in fade-in">
            <div className="w-16 h-16 rounded-3xl bg-indigo-50 dark:bg-primary/10 border border-indigo-200 dark:border-primary/30 flex items-center justify-center text-indigo-600 dark:text-primary mx-auto shadow-xs">
              <Sparkles className="h-8 w-8" />
            </div>

            <div className="space-y-1">
              <h4 className="text-xl font-black text-slate-900 dark:text-white">
                Skill Added (0% Score · Unverified)
              </h4>
              <p className="text-xs text-slate-500 dark:text-muted-foreground max-w-sm mx-auto">
                <strong>{createdSkill.name}</strong> is registered. Take the 3-question technical test now to evaluate your proficiency and earn verified points!
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 flex items-center justify-between text-xs">
              <div className="text-left">
                <span className="font-bold text-slate-900 dark:text-white block">{createdSkill.name}</span>
                <span className="text-[10px] text-slate-500 dark:text-muted-foreground">{createdSkill.category}</span>
              </div>
              <Badge variant="outline" className="font-mono text-[10px] text-amber-600 border-amber-300">
                Score: 0% (Test Required)
              </Badge>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Button
                variant="glow"
                size="lg"
                onClick={() => {
                  onTakeVerificationDrill?.(createdSkill);
                  handleResetAndClose();
                }}
                className="w-full gap-2 font-bold shadow-xs cursor-pointer"
              >
                <Play className="h-4 w-4 fill-current" />
                Start Technical Test Now (+250 XP)
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={handleResetAndClose}
                className="w-full font-semibold cursor-pointer"
              >
                Take Later (Dashboard)
              </Button>
            </div>
          </div>
        ) : (
          /* Form Screen */
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Notice about rigorous testing */}
            <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-500/30 text-amber-800 dark:text-amber-300 text-xs flex items-start gap-2.5">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
              <span>
                <strong>Proof-of-Work Protocol:</strong> Skills start at 0% proficiency. Your final score and rank will only be generated after you pass the interactive technical evaluation.
              </span>
            </div>

            {/* Quick preset suggestions */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-500 dark:text-muted-foreground uppercase tracking-wider">
                Quick Suggestions
              </label>
              <div className="flex flex-wrap gap-1.5 max-h-20 overflow-y-auto no-scrollbar">
                {PRESET_SUGGESTIONS.map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setSkillName(preset)}
                    className="text-[10px] px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:text-indigo-600 hover:border-indigo-300 transition-colors font-medium cursor-pointer"
                  >
                    + {preset}
                  </button>
                ))}
              </div>
            </div>

            {/* Skill Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-muted-foreground">
                Skill / Technology Name
              </label>
              <Input
                type="text"
                placeholder="e.g. Kafka Event Streaming, Kubernetes, Rust"
                value={skillName}
                onChange={(e) => setSkillName(e.target.value)}
                required
              />
            </div>

            {/* Category */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-muted-foreground">
                Engineering Domain / Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as SkillCategory)}
                className="w-full h-11 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 px-3 text-xs text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-xs font-medium"
              >
                <option value="Frontend Architecture">Frontend Architecture</option>
                <option value="Backend & Distributed Systems">Backend & Distributed Systems</option>
                <option value="AI & Machine Learning">AI & Machine Learning</option>
                <option value="Smart Contracts & Web3">Smart Contracts & Web3</option>
                <option value="Cloud & DevOps">Cloud & DevOps</option>
                <option value="System Design">System Design</option>
              </select>
            </div>

            {/* Icon selection */}
            <div className="space-y-1.5 pt-1">
              <label className="text-xs font-bold text-slate-700 dark:text-muted-foreground">
                Skill Icon
              </label>
              <div className="flex items-center gap-2">
                {AVAILABLE_ICONS.map((item) => {
                  const Icon = item.icon;
                  const isSelected = selectedIcon === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setSelectedIcon(item.id)}
                      className={`p-2.5 rounded-xl border flex items-center justify-center transition-all cursor-pointer ${
                        isSelected
                          ? "bg-indigo-50 dark:bg-primary/20 border-indigo-400 text-indigo-700 dark:text-white shadow-xs"
                          : "bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-500 hover:text-slate-900"
                      }`}
                      title={item.label}
                    >
                      <Icon className="h-4 w-4" />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-3">
              <Button
                type="submit"
                variant="glow"
                size="lg"
                disabled={isSubmitting || !skillName.trim()}
                className="w-full gap-2 font-bold text-sm h-12 shadow-xs cursor-pointer"
              >
                <Sparkles className="h-4 w-4" />
                {isSubmitting ? "Adding to Skill Matrix..." : "Add Skill & Prepare Test"}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
