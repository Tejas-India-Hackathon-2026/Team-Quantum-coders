import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-indigo-200 bg-indigo-50 text-indigo-700 dark:border-primary/30 dark:bg-primary/20 dark:text-primary",
        secondary:
          "border-slate-200 bg-slate-100 text-slate-700 dark:border-secondary/30 dark:bg-secondary/20 dark:text-secondary",
        outline: "text-slate-700 dark:text-foreground border-slate-200 dark:border-border bg-white/50 dark:bg-transparent",
        success:
          "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300",
        cyan: "border-sky-200 bg-sky-50 text-sky-700 dark:border-cyan-500/30 dark:bg-cyan-500/10 dark:text-cyan-300",
        warning:
          "border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-300",
        destructive:
          "border-red-200 bg-red-50 text-red-700 dark:border-destructive/30 dark:bg-destructive/10 dark:text-destructive-foreground",
        purple:
          "border-purple-200 bg-purple-50 text-purple-700 dark:border-purple-500/30 dark:bg-purple-500/10 dark:text-purple-300",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
