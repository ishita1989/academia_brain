"use client";
import * as React from "react";
import { Bold, Italic, Underline, Link2, List, ListOrdered, Heading1, Heading2, Quote, Strikethrough, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const BUTTONS = [
  { icon: Heading1, label: "H1", cmd: "h1" },
  { icon: Heading2, label: "H2", cmd: "h2" },
  { icon: Bold, label: "Bold", cmd: "bold" },
  { icon: Italic, label: "Italic", cmd: "italic" },
  { icon: Underline, label: "Underline", cmd: "underline" },
  { icon: Strikethrough, label: "Strike", cmd: "strike" },
  { icon: List, label: "Bulleted list", cmd: "ul" },
  { icon: ListOrdered, label: "Numbered list", cmd: "ol" },
  { icon: Quote, label: "Quote", cmd: "quote" },
  { icon: Link2, label: "Link", cmd: "link" },
];

export function FormattingToolbar({ onBrain }: { onBrain?: () => void }) {
  const [active, setActive] = React.useState<Set<string>>(new Set());
  const toggle = (cmd: string) => {
    setActive((prev) => {
      const next = new Set(prev);
      if (next.has(cmd)) next.delete(cmd); else next.add(cmd);
      return next;
    });
  };
  return (
    <div className="inline-flex items-center gap-0.5 bg-white border border-zinc-200 rounded-lg shadow-sm p-1">
      {BUTTONS.map((b) => (
        <button
          key={b.cmd}
          onClick={() => toggle(b.cmd)}
          title={b.label}
          className={cn("w-7 h-7 rounded flex items-center justify-center transition-colors", active.has(b.cmd) ? "bg-brand-100 text-brand-700" : "text-zinc-600 hover:bg-zinc-100")}
        >
          <b.icon className="w-3.5 h-3.5" />
        </button>
      ))}
      <span className="w-px h-5 bg-zinc-200 mx-1" />
      <button
        onClick={onBrain}
        title="Ask the Brain about this block"
        className="inline-flex items-center gap-1 text-[11px] font-medium text-brand-700 bg-brand-50 hover:bg-brand-100 rounded px-2 py-1 transition-colors"
      >
        <Sparkles className="w-3 h-3" /> /brain
      </button>
    </div>
  );
}
