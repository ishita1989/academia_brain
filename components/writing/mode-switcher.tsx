"use client";
import * as React from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const modes = [
  { id: "manuscript", label: "Manuscript" },
  { id: "r01", label: "NIH R01" },
  { id: "nsf", label: "NSF" },
  { id: "erc", label: "ERC" },
  { id: "peer-review", label: "Peer-Review Response" },
  { id: "protocol", label: "Lab Protocol" },
  { id: "lit-review", label: "Literature Review" },
  { id: "experiment-plan", label: "Experiment Plan" },
];

export function ModeSwitcher({ current, onChange }: { current: string; onChange: (m: string) => void }) {
  const cur = modes.find((m) => m.id === current) ?? modes[0];
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="inline-flex items-center gap-1 text-[11px] text-zinc-700 border border-zinc-200 hover:border-brand-300 rounded-md px-2.5 py-1.5 bg-white transition-colors">
          Mode: <span className="font-semibold text-zinc-900">{cur.label}</span> <ChevronDown className="w-3 h-3" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-60 p-1.5" align="end">
        {modes.map((m) => (
          <button key={m.id} onClick={() => onChange(m.id)} className={cn("w-full text-left flex items-center gap-2 px-2 py-1.5 rounded text-xs hover:bg-brand-50 transition-colors", current === m.id ? "bg-brand-50 text-brand-700 font-semibold" : "text-zinc-700")}>
            {current === m.id ? <Check className="w-3 h-3" /> : <span className="w-3" />}
            {m.label}
          </button>
        ))}
      </PopoverContent>
    </Popover>
  );
}
