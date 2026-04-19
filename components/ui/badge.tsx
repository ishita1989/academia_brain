import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-medium transition-colors focus:outline-none",
  {
    variants: {
      variant: {
        default: "border-transparent bg-zinc-900 text-zinc-50",
        secondary: "border-transparent bg-zinc-100 text-zinc-800",
        outline: "text-zinc-800 border-zinc-200 bg-white",
        brand: "border-transparent bg-brand-50 text-brand-700",
        success: "border-transparent bg-emerald-50 text-emerald-700",
        warn: "border-transparent bg-amber-50 text-amber-700",
        danger: "border-transparent bg-rose-50 text-rose-700",
        muted: "border-transparent bg-zinc-100 text-zinc-600",
      },
    },
    defaultVariants: { variant: "default" },
  },
);

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
