"use client";
import * as React from "react";
import { Plus, FileText, FlaskConical, Tag, X, ChevronDown, Beaker, BookOpen, MessageSquare, Sparkles, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Notebook, NotebookTab } from "@/lib/types";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";

const defaultTabs: NotebookTab[] = [
  { id: "notes", label: "Notes" },
  { id: "protocol", label: "Protocol" },
  { id: "relevant", label: "Relevant Items" },
  { id: "metadata", label: "Metadata" },
];

const TEMPLATES: { id: string; label: string; description: string; icon: any }[] = [
  { id: "blank", label: "Blank", description: "Empty tab. Add whatever blocks you need.", icon: FileText },
  { id: "protocol", label: "Protocol", description: "Step list + reagents + safety callouts.", icon: FlaskConical },
  { id: "experiment-plan", label: "Experiment plan", description: "Hypothesis → procedure → expected results → success criteria table.", icon: Beaker },
  { id: "lit-review", label: "Literature review", description: "Themed findings + evidence-strength map.", icon: BookOpen },
  { id: "peer-review", label: "Peer-review response", description: "Reviewer quote callouts + AI-drafted rebuttals.", icon: MessageSquare },
  { id: "meeting-notes", label: "Meeting notes", description: "Date header + decisions + action items.", icon: Sparkles },
];

export function TabsBar({ notebook, active, onChange, onAddTab, tagFilter, onTagFilter }: {
  notebook: Notebook;
  active: string;
  onChange: (tabId: string) => void;
  onAddTab: (tab: NotebookTab) => void;
  tagFilter: string | null;
  onTagFilter: (tag: string | null) => void;
}) {
  const tabs = notebook.tabs ?? defaultTabs;
  return (
    <div className="flex items-center gap-4 border-b border-zinc-200">
      {/* Scrollable tab strip */}
      <div className="flex items-center gap-1 flex-1 min-w-0 overflow-x-auto scrollbar-thin pb-px">
        {tabs.map((t) => {
          const isActive = active === t.id;
          return (
            <button
              key={t.id}
              onClick={() => onChange(t.id)}
              className={cn(
                "group relative flex items-center gap-1.5 px-3 py-2.5 text-[11px] font-semibold uppercase tracking-[0.08em] whitespace-nowrap transition-colors",
                isActive ? "text-brand-700" : "text-zinc-500 hover:text-zinc-900",
              )}
            >
              <span>{t.label}</span>
              {t.userCreated ? (
                <span className="inline-block w-1 h-1 rounded-full bg-amber-400" title="Custom tab" />
              ) : null}
              <span className={cn(
                "pointer-events-none absolute inset-x-0 -bottom-px h-0.5 rounded-t-full transition-opacity",
                isActive ? "bg-brand-600 opacity-100" : "bg-transparent opacity-0",
              )} />
            </button>
          );
        })}
        <NewTabButton onAdd={onAddTab} />
      </div>

      {/* Tag filter — never overlaps the tab strip */}
      <TagFilter notebook={notebook} active={tagFilter} onChange={onTagFilter} />
    </div>
  );
}

function NewTabButton({ onAdd }: { onAdd: (tab: NotebookTab) => void }) {
  const [open, setOpen] = React.useState(false);
  const [name, setName] = React.useState("");
  const [template, setTemplate] = React.useState<string>("blank");
  const submit = () => {
    const n = name.trim() || "New tab";
    onAdd({
      id: `tab-${Date.now()}`,
      label: n,
      template,
      userCreated: true,
    });
    setOpen(false);
    setName("");
    setTemplate("blank");
  };
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          className="ml-0.5 inline-flex items-center justify-center w-7 h-7 rounded-md text-zinc-400 hover:text-brand-700 hover:bg-zinc-100 transition-colors shrink-0"
          title="New tab"
          aria-label="New tab"
        >
          <Plus className="w-3.5 h-3.5" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-[360px] p-4" align="start">
        <div className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500 mb-2">Name</div>
        <input
          autoFocus
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Reviewer prep, Lab meeting, Archive…"
          className="w-full text-sm border border-zinc-200 rounded-md px-3 py-2 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-brand-400 mb-3"
        />
        <div className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500 mb-2">Template</div>
        <div className="grid grid-cols-1 gap-1 max-h-56 overflow-auto">
          {TEMPLATES.map((t) => (
            <button
              key={t.id}
              onClick={() => setTemplate(t.id)}
              className={cn("flex items-start gap-2 text-left border rounded-md p-2 transition-all", template === t.id ? "border-brand-400 bg-brand-50" : "border-zinc-200 hover:border-zinc-300")}
            >
              <t.icon className="w-3.5 h-3.5 text-zinc-600 mt-0.5 shrink-0" />
              <div className="min-w-0">
                <div className="text-xs font-semibold flex items-center gap-1">{t.label}{template === t.id ? <Check className="w-3 h-3 text-brand-600" /> : null}</div>
                <div className="text-[10px] text-zinc-600 mt-0.5 leading-snug">{t.description}</div>
              </div>
            </button>
          ))}
        </div>
        <div className="mt-3 flex gap-2 justify-end">
          <button onClick={() => setOpen(false)} className="px-3 py-1.5 text-xs text-zinc-600 hover:text-zinc-900">Cancel</button>
          <button onClick={submit} className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium bg-brand-600 hover:bg-brand-700 text-white rounded-md">
            <Plus className="w-3 h-3" /> Create tab
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
}

function TagFilter({ notebook, active, onChange }: { notebook: Notebook; active: string | null; onChange: (t: string | null) => void }) {
  const all = React.useMemo(() => {
    const set = new Set<string>();
    (notebook.tags ?? []).forEach((t) => set.add(t));
    notebook.blocks.forEach((b) => (b.tags ?? []).forEach((t) => set.add(t)));
    return Array.from(set).sort();
  }, [notebook]);
  if (all.length === 0) return null;
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className={cn(
          "shrink-0 inline-flex items-center gap-1.5 text-[11px] font-medium rounded-md px-2.5 py-1.5 transition-colors",
          active ? "border border-brand-300 bg-brand-50 text-brand-700" : "border border-zinc-200 text-zinc-600 hover:border-zinc-300 hover:text-zinc-900",
        )}>
          <Tag className="w-3 h-3" />
          <span>{active ? active : "Filter"}</span>
          {active ? (
            <span onClick={(e) => { e.stopPropagation(); onChange(null); }} className="inline-flex items-center justify-center hover:text-rose-600">
              <X className="w-3 h-3" />
            </span>
          ) : (
            <ChevronDown className="w-3 h-3" />
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-56 p-2" align="end">
        <div className="text-[10px] uppercase tracking-wider text-zinc-500 font-semibold mb-1.5 px-1">Filter by tag</div>
        <div className="space-y-0.5 max-h-56 overflow-auto">
          <button onClick={() => onChange(null)} className={cn("w-full text-left text-xs rounded px-2 py-1 hover:bg-zinc-50", !active ? "font-semibold text-brand-700 bg-brand-50" : "text-zinc-700")}>All (no filter)</button>
          {all.map((t) => (
            <button key={t} onClick={() => onChange(t)} className={cn("w-full text-left text-xs rounded px-2 py-1 hover:bg-brand-50 flex items-center gap-1.5", active === t ? "font-semibold text-brand-700 bg-brand-50" : "text-zinc-700")}>
              <Tag className="w-2.5 h-2.5 text-zinc-400" /> {t}
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
