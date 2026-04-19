"use client";
import * as React from "react";
import { cn } from "@/lib/utils";

export function ConfidenceMeter({ value, label, size = "md" }: { value: number; label?: string; size?: "sm" | "md" | "lg" }) {
  const pct = Math.round(value * 100);
  const tone =
    value >= 0.8 ? "bg-emerald-500 text-emerald-700 bg-emerald-50" :
    value >= 0.65 ? "bg-amber-500 text-amber-700 bg-amber-50" :
    "bg-rose-500 text-rose-700 bg-rose-50";
  const [bar, textClr, bg] = tone.split(" ");
  const heights = { sm: "h-1", md: "h-1.5", lg: "h-2" }[size];
  return (
    <div className={cn("flex items-center gap-2", size === "sm" ? "text-[10px]" : "text-[11px]")}>
      <div className={cn("flex-1 rounded-full overflow-hidden", bg, heights)}>
        <div className={bar} style={{ width: `${pct}%`, height: "100%" }} />
      </div>
      {label !== undefined ? <span className={cn("font-medium shrink-0", textClr)}>{label ?? `${pct}%`}</span> : <span className={cn("font-medium shrink-0", textClr)}>{pct}%</span>}
    </div>
  );
}
