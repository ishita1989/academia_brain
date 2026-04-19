"use client";
import * as React from "react";
import {
  AlertTriangle, Brain, Calendar, Check, ChevronDown, FileText, FlaskConical, Beaker, BookOpen,
  Flame, Lightbulb, MessageSquare, Sparkles, Database, Table as TableIcon, ImageIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Notebook, NotebookBlock } from "@/lib/types";

const blockIcon = (b: NotebookBlock) => {
  switch (b.type) {
    case "methodology": return FlaskConical;
    case "experimental-plan": return Beaker;
    case "research-note": return BookOpen;
    case "ai-insight": return Brain;
    case "reference": return BookOpen;
    case "data": return Database;
    case "figure": return ImageIcon;
    case "image": return ImageIcon;
    case "table": return TableIcon;
    case "callout": return Flame;
    case "decision": return Lightbulb;
    case "date-header": return Calendar;
    default: return FileText;
  }
};

// Compact title for non-heading blocks — prefer the user's first line, fall back to type label.
const blockTitle = (b: NotebookBlock): string => {
  if (b.type === "heading") return b.content;
  if (b.type === "date-header") {
    const d = new Date(b.dateISO ?? b.createdAt);
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  }
  if (b.type === "ai-insight") return "AI insight";
  if (b.type === "callout") return b.content.replace(/^[⚠️\s]+/, "").split(/[.!]/)[0] ?? "Callout";
  if (b.type === "methodology") return "Methodology";
  if (b.type === "experimental-plan") return "Experiment plan";
  if (b.type === "research-note") return "Research note";
  if (b.type === "reference") return "References";
  if (b.type === "data") return "Data";
  if (b.type === "figure") return b.content || "Figure";
  if (b.type === "image") return b.content || "Image";
  if (b.type === "table") return b.content || "Table";
  if (b.type === "decision") return "Decision";
  return b.content.split("\n")[0]!.slice(0, 48);
};

// Section = heading + all non-heading blocks that follow it, in the same tab.
interface Section {
  heading: NotebookBlock | null; // null for blocks before any heading
  subBlocks: NotebookBlock[];
}

function groupIntoSections(blocks: NotebookBlock[]): Section[] {
  const sections: Section[] = [];
  let current: Section = { heading: null, subBlocks: [] };
  for (const b of blocks) {
    if (b.type === "heading") {
      if (current.heading || current.subBlocks.length) sections.push(current);
      current = { heading: b, subBlocks: [] };
    } else {
      current.subBlocks.push(b);
    }
  }
  if (current.heading || current.subBlocks.length) sections.push(current);
  return sections;
}

interface SectionFlags {
  contradictions: number;
  insights: number;
  cautions: number;
  consensus: number;
  comments: number;
  decisions: number;
}

function sectionFlags(section: Section, notebook: Notebook): SectionFlags {
  const all = [section.heading, ...section.subBlocks].filter(Boolean) as NotebookBlock[];
  let contradictions = 0, insights = 0, cautions = 0, consensus = 0, comments = 0, decisions = 0;
  for (const b of all) {
    if (b.flag === "contradiction") contradictions++;
    if (b.type === "ai-insight") insights++;
    if (b.type === "callout") cautions++;
    if (b.type === "decision") decisions++;
    if (b.commentThreadId) {
      const t = notebook.comments.find((c) => c.threadId === b.commentThreadId);
      if (t && !t.resolved) comments++;
      else if (t?.resolved) consensus++;
    }
  }
  return { contradictions, insights, cautions, consensus, comments, decisions };
}

export function OutlineRail({ notebook, activeBlock, onPick, activeTab }: {
  notebook: Notebook;
  activeBlock: string | null;
  onPick: (id: string) => void;
  activeTab: string;
}) {
  // Filter to current tab
  const blocks = React.useMemo(
    () => notebook.blocks.filter((b) => (b.tabId ?? "notes") === activeTab),
    [notebook.blocks, activeTab],
  );
  const sections = React.useMemo(() => groupIntoSections(blocks), [blocks]);

  // Rollup totals across tab
  const totals = React.useMemo(() => {
    const t: SectionFlags = { contradictions: 0, insights: 0, cautions: 0, consensus: 0, comments: 0, decisions: 0 };
    for (const s of sections) {
      const f = sectionFlags(s, notebook);
      t.contradictions += f.contradictions;
      t.insights += f.insights;
      t.cautions += f.cautions;
      t.consensus += f.consensus;
      t.comments += f.comments;
      t.decisions += f.decisions;
    }
    return t;
  }, [sections, notebook]);

  return (
    <aside className="w-[252px] shrink-0 border-r border-zinc-200 bg-zinc-50/60 overflow-y-auto scrollbar-thin">
      <div className="px-4 pt-5 pb-3 sticky top-0 bg-zinc-50/90 backdrop-blur z-10 border-b border-zinc-200/70">
        <div className="flex items-center justify-between mb-2">
          <div className="text-[10px] font-semibold uppercase tracking-[0.12em] text-zinc-500">Outline</div>
          <div className="text-[10px] text-zinc-400 capitalize">{activeTab}</div>
        </div>
        <FlagStrip totals={totals} compact />
      </div>

      <nav className="px-2 py-2 space-y-0.5">
        {sections.length === 0 ? (
          <div className="text-[11px] text-zinc-400 px-2 py-4 text-center">No blocks on this tab.</div>
        ) : (
          sections.map((s, i) => (
            <SectionGroup
              key={(s.heading?.id ?? "intro") + i}
              section={s}
              notebook={notebook}
              activeBlock={activeBlock}
              onPick={onPick}
            />
          ))
        )}
      </nav>
    </aside>
  );
}

function SectionGroup({ section, notebook, activeBlock, onPick }: {
  section: Section;
  notebook: Notebook;
  activeBlock: string | null;
  onPick: (id: string) => void;
}) {
  const [expanded, setExpanded] = React.useState(true);
  const flags = sectionFlags(section, notebook);
  const heading = section.heading;
  const scrollTo = (id: string) => {
    onPick(id);
    document.getElementById(`block-${id}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="mb-1">
      {heading ? (
        <button
          onClick={() => { scrollTo(heading.id); }}
          className={cn(
            "group w-full flex items-start gap-1.5 px-2 py-1.5 rounded-md text-left transition-colors",
            activeBlock === heading.id ? "bg-white shadow-sm" : "hover:bg-white/70",
          )}
        >
          <button
            onClick={(e) => { e.stopPropagation(); setExpanded(!expanded); }}
            className="mt-[3px] text-zinc-400 hover:text-zinc-700 shrink-0"
            aria-label={expanded ? "Collapse" : "Expand"}
          >
            <ChevronDown className={cn("w-3 h-3 transition-transform", expanded ? "" : "-rotate-90")} />
          </button>
          <div className="min-w-0 flex-1">
            <div className={cn(
              "text-[12px] font-semibold leading-snug line-clamp-2",
              activeBlock === heading.id ? "text-brand-700" : "text-zinc-900",
            )}>{heading.content}</div>
            <FlagStrip totals={flags} />
          </div>
        </button>
      ) : null}

      {expanded ? (
        <div className={cn("space-y-0.5", heading ? "pl-6 pr-1 mt-0.5" : "")}>
          {section.subBlocks.map((b) => {
            if (b.type === "date-header") {
              const d = new Date(b.dateISO ?? b.createdAt);
              return (
                <div key={b.id} className="flex items-center gap-1.5 px-2 py-1 mt-1 text-[9px] font-semibold uppercase tracking-[0.15em] text-zinc-400">
                  <Calendar className="w-2.5 h-2.5" />
                  {d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
                </div>
              );
            }
            const Icon = blockIcon(b);
            const t = b.commentThreadId ? notebook.comments.find((c) => c.threadId === b.commentThreadId) : null;
            const isContradiction = b.flag === "contradiction";
            const isAI = b.type === "ai-insight";
            const isCaution = b.type === "callout";
            const isDecision = b.type === "decision";
            const hasOpenComment = t && !t.resolved;
            const hasResolvedComment = t?.resolved;
            return (
              <button
                key={b.id}
                onClick={() => scrollTo(b.id)}
                className={cn(
                  "group relative w-full text-left rounded-md px-2 py-1 transition-colors flex items-center gap-2",
                  activeBlock === b.id ? "bg-white shadow-sm" : "hover:bg-white/70",
                )}
              >
                <Icon className={cn(
                  "w-3 h-3 shrink-0",
                  isAI ? "text-violet-500" : isCaution ? "text-amber-500" : isDecision ? "text-indigo-500" : "text-zinc-400",
                )} />
                <span className={cn(
                  "flex-1 min-w-0 truncate text-[11px]",
                  activeBlock === b.id ? "text-zinc-900 font-medium" : "text-zinc-600",
                )}>{blockTitle(b)}</span>
                {/* Flags on the right */}
                <span className="flex items-center gap-0.5 shrink-0">
                  {isContradiction ? <FlagDot tone="rose" title="Contradiction" /> : null}
                  {isAI ? <FlagDot tone="violet" title="AI insight" /> : null}
                  {isCaution ? <FlagDot tone="amber" title="Caution" /> : null}
                  {isDecision ? <FlagDot tone="indigo" title="Decision" /> : null}
                  {hasOpenComment ? <FlagDot tone="brand" title="Open comment" /> : null}
                  {hasResolvedComment ? <FlagDot tone="emerald" title="Resolved" /> : null}
                </span>
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

function FlagDot({ tone, title }: { tone: "rose" | "amber" | "violet" | "emerald" | "brand" | "indigo"; title: string }) {
  const cls: Record<string, string> = {
    rose: "bg-rose-500",
    amber: "bg-amber-500",
    violet: "bg-violet-500",
    emerald: "bg-emerald-500",
    brand: "bg-brand-500",
    indigo: "bg-indigo-500",
  };
  return <span title={title} className={cn("w-1.5 h-1.5 rounded-full", cls[tone])} />;
}

// Strip of count pills (used at the top of the outline + per section)
function FlagStrip({ totals, compact }: { totals: SectionFlags; compact?: boolean }) {
  const items: { count: number; icon: any; tone: string; label: string }[] = [
    { count: totals.contradictions, icon: AlertTriangle, tone: "text-rose-700 bg-rose-50 border-rose-200", label: "contradiction" },
    { count: totals.insights, icon: Sparkles, tone: "text-violet-700 bg-violet-50 border-violet-200", label: "insight" },
    { count: totals.cautions, icon: Flame, tone: "text-amber-700 bg-amber-50 border-amber-200", label: "caution" },
    { count: totals.consensus, icon: Check, tone: "text-emerald-700 bg-emerald-50 border-emerald-200", label: "resolved" },
    { count: totals.comments, icon: MessageSquare, tone: "text-brand-700 bg-brand-50 border-brand-200", label: "comment" },
    { count: totals.decisions, icon: Lightbulb, tone: "text-indigo-700 bg-indigo-50 border-indigo-200", label: "decision" },
  ];
  const present = items.filter((i) => i.count > 0);
  if (present.length === 0) return null;
  return (
    <div className={cn("flex flex-wrap gap-1 mt-1", compact ? "" : "")}>
      {present.map((p) => {
        const Icon = p.icon;
        return (
          <span
            key={p.label}
            title={`${p.count} ${p.label}${p.count === 1 ? "" : "s"}`}
            className={cn("inline-flex items-center gap-0.5 text-[9px] font-semibold rounded-full border px-1.5 py-[1px]", p.tone)}
          >
            <Icon className="w-2.5 h-2.5" />
            {p.count}
          </span>
        );
      })}
    </div>
  );
}
