"use client";
import * as React from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import type { BlockType } from "@/lib/types";
import { Beaker, BookOpen, Brain, Calendar, Database, FileText, FlaskConical, Flame, ImageIcon, Lightbulb, List, Plus, Sparkles, Table as TableIcon, Type } from "lucide-react";
import { cn } from "@/lib/utils";

const CATALOG: { type: BlockType; label: string; description: string; icon: any }[] = [
  { type: "text", label: "Text", description: "A paragraph or section of prose.", icon: Type },
  { type: "heading", label: "Heading", description: "Visual divider / section label.", icon: FileText },
  { type: "date-header", label: "New day", description: "Benchling-style dated section header.", icon: Calendar },
  { type: "methodology", label: "Methodology", description: "Protocol, parameters, conditions.", icon: FlaskConical },
  { type: "experimental-plan", label: "Experimental plan", description: "Hypothesis → procedure → success criteria.", icon: Beaker },
  { type: "research-note", label: "Research note", description: "Free-form observation / journal entry.", icon: BookOpen },
  { type: "ai-insight", label: "AI insight", description: "Grounded in team library. Slash /brain inline.", icon: Brain },
  { type: "reference", label: "References", description: "Citation block pulled from team library.", icon: Sparkles },
  { type: "data", label: "Data", description: "Attach or describe a dataset.", icon: Database },
  { type: "figure", label: "Figure", description: "Figure placeholder with caption.", icon: ImageIcon },
  { type: "image", label: "Image", description: "Upload or drop an image with annotations.", icon: ImageIcon },
  { type: "table", label: "Table", description: "Editable table with headers and rows.", icon: TableIcon },
  { type: "callout", label: "Callout", description: "Note, warning, TODO.", icon: Flame },
  { type: "decision", label: "Decision", description: "Chosen option + rationale + alternatives.", icon: Lightbulb },
];

export function AddBlockMenu({ onAdd }: { onAdd: (type: BlockType) => void }) {
  const [open, setOpen] = React.useState(false);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button className="inline-flex items-center gap-1 text-[11px] font-medium text-brand-700 bg-white border border-brand-200 rounded-md px-2.5 py-1 hover:bg-brand-50 transition-colors">
          <Plus className="w-3 h-3" /> Add block
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-2" align="start">
        <div className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500 mb-1.5 px-1">Insert block</div>
        <div className="grid grid-cols-1 gap-0.5 max-h-80 overflow-auto">
          {CATALOG.map((c) => (
            <button
              key={c.type}
              onClick={() => { onAdd(c.type); setOpen(false); }}
              className="flex items-start gap-2 text-left hover:bg-brand-50 rounded-md p-2 transition-colors"
            >
              <c.icon className="w-3.5 h-3.5 text-zinc-500 mt-0.5 shrink-0" />
              <div className="min-w-0">
                <div className="text-xs font-semibold">{c.label}</div>
                <div className="text-[10px] text-zinc-600 mt-0.5 leading-snug">{c.description}</div>
              </div>
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
