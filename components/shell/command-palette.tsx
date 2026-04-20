"use client";
import * as React from "react";
import { useRouter } from "next/navigation";
import { Search, FileText, Sparkles, FlaskConical, NotebookPen, Share2, Command, BookOpen, Database, Lightbulb, AlertTriangle, CheckCircle2, GitBranch, Tag, Brain, Mic } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useStore } from "@/lib/store";
import { papers, paperById } from "@/lib/mock-data/papers";
import { syntheses } from "@/lib/mock-data/syntheses";
import { hypotheses, ideationSessions } from "@/lib/mock-data/hypotheses";
import { notebooks } from "@/lib/mock-data/notebooks";
import { graphNodes, graphEdges } from "@/lib/mock-data/graph";
import { annotations } from "@/lib/mock-data/annotations";
import type { Paper } from "@/lib/types";
import { cn } from "@/lib/utils";
import { VoiceModeButton } from "./voice-mode";

type ResultType = "paper" | "synthesis" | "ideation" | "notebook" | "hypothesis" | "nav" | "method" | "concept";

interface ConnectionReason {
  kind: "cites" | "contradicts" | "replicates" | "reads" | "writes" | "gap" | "hypothesis" | "synthesis" | "decision";
  text: string;
  tone: "amber" | "rose" | "emerald" | "brand" | "violet" | "zinc";
}

interface SearchResult {
  id: string;
  type: ResultType;
  label: string;
  sublabel?: string;
  snippet?: string;
  href: string;
  connections: ConnectionReason[];
  matchScore: number;
}

const SUGGESTED_QUERIES = [
  "OPC water model",
  "archaeal thermostability",
  "RFdiffusion de novo enzymes",
  "smFRET at 85°C",
  "industrial biocatalysis extremophile",
];

/**
 * Build connection reasons for a paper: scan the lab's knowledge graph to
 * derive human-readable reasons like "contradicts Kawamura 2024" or
 * "used in your R01 notebook".
 */
function connectionsFor(p: Paper): ConnectionReason[] {
  const rs: ConnectionReason[] = [];

  // Edges in the knowledge graph mention this paper
  const pnode = graphNodes.find((n) => n.paperId === p.id);
  if (pnode) {
    for (const e of graphEdges) {
      const other = e.source === pnode.id ? graphNodes.find((n) => n.id === e.target) : e.target === pnode.id ? graphNodes.find((n) => n.id === e.source) : null;
      if (!other) continue;
      if (e.relation === "contradicts") {
        rs.push({ kind: "contradicts", text: `Contradicts ${other.label.split(" —")[0]}`, tone: "rose" });
      } else if (e.relation === "replicates") {
        rs.push({ kind: "replicates", text: `Replicates ${other.label.split(" —")[0]}`, tone: "emerald" });
      } else if (e.relation === "cites" && other.paperId && p.readByTeam.length > 0) {
        // only mention cites if both sides are in team library
        const otherPaper = paperById(other.paperId);
        if (otherPaper && otherPaper.readByTeam.length > 0) {
          rs.push({ kind: "cites", text: `Cited by ${other.label.split(" —")[0]}`, tone: "brand" });
          break; // just one
        }
      }
    }
  }

  // Who on the lab has read this paper
  if (p.readByTeam.length > 0) {
    rs.push({ kind: "reads", text: `Read by ${p.readByTeam.length} in your lab`, tone: "emerald" });
  }

  // Is this paper cited in an active synthesis?
  const synWithPaper = syntheses.find((s) => s.sections.some((sec) => sec.items.some((it) => it.citations.some((c) => c.paperId === p.id))));
  if (synWithPaper) {
    rs.push({ kind: "synthesis", text: `In synthesis "${synWithPaper.title.slice(0, 30)}…"`, tone: "violet" });
  }

  // Is this paper cited in any notebook?
  const nbWithPaper = notebooks.find((n) => n.blocks.some((b) => (b.citations ?? []).some((c) => c.paperId === p.id) || b.aiGroundedIn?.includes(p.id) || b.sourceRef === p.id));
  if (nbWithPaper) {
    rs.push({ kind: "writes", text: `Cited in ${nbWithPaper.mode.toUpperCase()} notebook`, tone: "amber" });
  }

  // Does this paper support or contradict a team hypothesis?
  const hypWithPaper = hypotheses.find((h) => h.supportingPapers.includes(p.id) || h.contradictingPapers.includes(p.id));
  if (hypWithPaper) {
    const role = hypWithPaper.supportingPapers.includes(p.id) ? "supports" : "contradicts";
    rs.push({ kind: "hypothesis", text: `${role[0]!.toUpperCase()}${role.slice(1)} ${hypWithPaper.id}`, tone: role === "supports" ? "emerald" : "rose" });
  }

  // Team annotation exists?
  const ann = annotations.find((a) => a.paperId === p.id);
  if (ann) {
    const author = ann.authorId.replace("m-", "");
    rs.push({ kind: "reads", text: `Annotated by ${author[0]!.toUpperCase()}${author.slice(1)}`, tone: "zinc" });
  }

  // Dedupe & cap at 3 most informative
  const seen = new Set<string>();
  const uniq: ConnectionReason[] = [];
  for (const r of rs) {
    const k = r.kind + r.text;
    if (seen.has(k)) continue;
    seen.add(k);
    uniq.push(r);
    if (uniq.length >= 3) break;
  }
  return uniq;
}

function scorePaper(p: Paper, q: string): number {
  if (!q) return p.readByTeam.length * 2 + (p.replicated ? 1 : 0);
  const ql = q.toLowerCase();
  let score = 0;
  if (p.title.toLowerCase().includes(ql)) score += 40;
  if (p.abstract.toLowerCase().includes(ql)) score += 8;
  for (const t of p.tags) if (t.toLowerCase().includes(ql)) score += 12;
  for (const t of p.methodology) if (t.toLowerCase().includes(ql)) score += 10;
  for (const t of p.findings) if (t.toLowerCase().includes(ql)) score += 10;
  score += p.readByTeam.length; // team familiarity boost
  return score;
}

function buildResults(q: string): SearchResult[] {
  const out: SearchResult[] = [];

  // Papers
  const paperHits = papers
    .map((p) => ({ p, s: scorePaper(p, q) }))
    .filter((x) => x.s > 0)
    .sort((a, b) => b.s - a.s);
  for (const { p, s } of paperHits) {
    const connections = connectionsFor(p);
    let snippet: string | undefined;
    if (q) {
      const hay = p.abstract;
      const idx = hay.toLowerCase().indexOf(q.toLowerCase());
      if (idx >= 0) {
        const start = Math.max(0, idx - 60);
        const end = Math.min(hay.length, idx + q.length + 120);
        snippet = (start > 0 ? "…" : "") + hay.slice(start, end) + (end < hay.length ? "…" : "");
      }
    }
    out.push({
      id: `paper-${p.id}`,
      type: "paper",
      label: p.title,
      sublabel: `${p.venue} · ${p.year} · ${p.externalId}`,
      snippet,
      href: `/reader/${p.id}`,
      connections,
      matchScore: s,
    });
  }

  // Syntheses
  for (const s of syntheses) {
    const q2 = q.toLowerCase();
    const matches = !q || s.title.toLowerCase().includes(q2) || s.question.toLowerCase().includes(q2);
    if (!matches) continue;
    out.push({
      id: `syn-${s.id}`,
      type: "synthesis",
      label: s.title,
      sublabel: `${s.paperCount} papers · ${s.sections.length} sections · ${s.contradictions} contradictions`,
      href: `/synthesis/${s.id}`,
      connections: [
        { kind: "synthesis", text: "Active synthesis in your lab", tone: "violet" },
        s.contradictions > 0 ? { kind: "contradicts", text: `${s.contradictions} open contradiction${s.contradictions > 1 ? "s" : ""}`, tone: "rose" } : null,
      ].filter(Boolean) as ConnectionReason[],
      matchScore: q ? 30 : 5,
    });
  }

  // Ideation sessions + hypotheses
  for (const session of ideationSessions) {
    const q2 = q.toLowerCase();
    if (!q || session.title.toLowerCase().includes(q2) || session.research.toLowerCase().includes(q2)) {
      out.push({
        id: `ide-${session.id}`,
        type: "ideation",
        label: session.title,
        sublabel: `${session.hypotheses.length} hypotheses · ${session.participants.length} people · ${session.active ? "live" : "archived"}`,
        href: `/ideation/${session.id}`,
        connections: [{ kind: "hypothesis", text: session.active ? "Live session" : "Archived session", tone: "emerald" }],
        matchScore: q ? 25 : 3,
      });
    }
  }
  for (const h of hypotheses) {
    const q2 = q.toLowerCase();
    if (q && !h.statement.toLowerCase().includes(q2)) continue;
    out.push({
      id: `hyp-${h.id}`,
      type: "hypothesis",
      label: h.statement,
      sublabel: `${h.id} · ${h.supportingPapers.length} supports · ${h.contradictingPapers.length} contradicts · ${h.status}`,
      href: `/ideation/ses-enzymes-95c`,
      connections: [
        h.status === "promoted" ? { kind: "hypothesis", text: "Promoted to experiment", tone: "emerald" } :
        h.contradictingPapers.length > 0 ? { kind: "contradicts", text: "Has contradicting evidence", tone: "rose" } :
        { kind: "hypothesis", text: `Status: ${h.status}`, tone: "brand" },
      ],
      matchScore: q ? 28 : 3,
    });
  }

  // Notebooks
  for (const nb of notebooks) {
    const q2 = q.toLowerCase();
    if (!q || nb.title.toLowerCase().includes(q2) || nb.description.toLowerCase().includes(q2) || (nb.tags ?? []).some((t) => t.toLowerCase().includes(q2))) {
      out.push({
        id: `nb-${nb.id}`,
        type: "notebook",
        label: nb.title,
        sublabel: `${nb.mode.toUpperCase()} · ${nb.blocks.length} blocks · ${nb.collaborators.length} collaborators`,
        href: `/writing/${nb.id}`,
        connections: [{ kind: "writes", text: `Active ${nb.mode.toUpperCase()} notebook`, tone: "amber" }],
        matchScore: q ? 22 : 2,
      });
    }
  }

  // Graph methods/concepts
  for (const n of graphNodes) {
    if (n.type !== "method" && n.type !== "concept" && n.type !== "dataset") continue;
    const q2 = q.toLowerCase();
    if (q && !n.label.toLowerCase().includes(q2)) continue;
    out.push({
      id: `node-${n.id}`,
      type: n.type === "method" ? "method" : "concept",
      label: n.label,
      sublabel: `${n.discipline} · ${n.type} · ${n.teamRead ? "used by your lab" : "unexplored"}`,
      href: `/graph`,
      connections: n.teamRead
        ? [{ kind: "reads", text: "Used by your lab", tone: "emerald" }]
        : [{ kind: "gap", text: "Unexplored territory", tone: "amber" }],
      matchScore: q ? 18 : 1,
    });
  }

  // Navigation shortcuts (only if no query, to stay out of the way)
  if (!q) {
    out.push(
      { id: "nav-dash", type: "nav", label: "Dashboard", href: "/dashboard", connections: [], matchScore: 100 },
      { id: "nav-data", type: "nav", label: "Data sources", href: "/data", connections: [], matchScore: 100 },
      { id: "nav-graph", type: "nav", label: "Knowledge Graph Explorer", href: "/graph", connections: [], matchScore: 100 },
    );
  }

  return out.sort((a, b) => b.matchScore - a.matchScore);
}

export function CommandPalette() {
  const open = useStore((s) => s.paletteOpen);
  const setOpen = useStore((s) => s.setPaletteOpen);
  const router = useRouter();
  const [q, setQ] = React.useState("");
  const [cursor, setCursor] = React.useState(0);

  React.useEffect(() => { if (open) { setQ(""); setCursor(0); } }, [open]);

  const results = React.useMemo(() => buildResults(q), [q]);

  React.useEffect(() => { setCursor(0); }, [q]);

  const go = (r: SearchResult) => {
    setOpen(false);
    router.push(r.href);
  };

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setCursor((c) => Math.min(results.length - 1, c + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setCursor((c) => Math.max(0, c - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (results[cursor]) go(results[cursor]);
    }
  };

  // Group results by type (but keep ranked order within)
  const grouped = React.useMemo(() => {
    const g: Record<string, SearchResult[]> = {};
    for (const r of results) {
      const k = r.type;
      if (!g[k]) g[k] = [];
      g[k]!.push(r);
    }
    return g;
  }, [results]);

  const GROUP_ORDER: { key: ResultType; label: string; icon: any }[] = [
    { key: "paper", label: "Papers", icon: BookOpen },
    { key: "method", label: "Methods", icon: FlaskConical },
    { key: "concept", label: "Concepts", icon: Sparkles },
    { key: "synthesis", label: "Syntheses", icon: Sparkles },
    { key: "hypothesis", label: "Hypotheses", icon: Lightbulb },
    { key: "ideation", label: "Ideation sessions", icon: FlaskConical },
    { key: "notebook", label: "Notebooks", icon: NotebookPen },
    { key: "nav", label: "Jump to", icon: Share2 },
  ];

  const totalPapersInTeam = papers.filter((p) => p.readByTeam.length > 0).length;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="p-0 overflow-hidden max-w-3xl gap-0" onKeyDown={onKey}>
        <DialogTitle className="sr-only">Research search</DialogTitle>
        {/* Header */}
        <div className="flex items-center gap-2 px-5 py-3.5 border-b border-zinc-100">
          <Search className="w-4 h-4 text-zinc-400 shrink-0" />
          <input
            autoFocus
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search papers, methods, syntheses, notebooks…"
            className="flex-1 text-[15px] bg-transparent outline-none placeholder:text-zinc-400"
          />
          <div className="shrink-0 flex items-center gap-1.5">
            <VoiceModeButton variant="inline" />
            <span className="text-[10px] text-zinc-400 inline-flex items-center gap-1 bg-zinc-100 px-1.5 py-0.5 rounded">
              <Command className="w-2.5 h-2.5" />K
            </span>
          </div>
        </div>

        {/* Scope bar */}
        <div className="flex items-center gap-2 px-5 py-2 bg-zinc-50/70 border-b border-zinc-100 text-[10px] text-zinc-600">
          <span className="font-medium inline-flex items-center gap-1"><Brain className="w-3 h-3 text-brand-600" />Grounded in your lab's brain</span>
          <span className="text-zinc-300">·</span>
          <span>{totalPapersInTeam} team papers</span>
          <span className="text-zinc-300">·</span>
          <span>{syntheses.length} syntheses</span>
          <span className="text-zinc-300">·</span>
          <span>{notebooks.length} notebooks</span>
          <span className="text-zinc-300">·</span>
          <span>extending to 340M+ external sources</span>
        </div>

        {/* Body */}
        <div className="max-h-[540px] overflow-auto scrollbar-thin">
          {!q && results.length > 0 ? (
            <div className="px-5 pt-4 pb-2">
              <div className="text-[10px] font-semibold uppercase tracking-[0.12em] text-zinc-500 mb-2">Try</div>
              <div className="flex flex-wrap gap-1.5 mb-3">
                {SUGGESTED_QUERIES.map((s) => (
                  <button key={s} onClick={() => setQ(s)} className="text-[11px] bg-zinc-100 hover:bg-brand-50 hover:text-brand-700 text-zinc-700 rounded-full px-2.5 py-1 transition-colors">
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ) : null}

          {results.length === 0 ? (
            <div className="px-6 py-12 text-center text-sm text-zinc-500">
              Nothing matched "<strong className="text-zinc-700">{q}</strong>".<br/>
              <span className="text-[11px]">Try broader terms: "thermostability", "OPC water", "de novo design".</span>
            </div>
          ) : (
            <div className="pb-2">
              {GROUP_ORDER.map(({ key, label, icon: Icon }) => {
                const items = grouped[key];
                if (!items || items.length === 0) return null;
                const shown = items.slice(0, key === "paper" ? 6 : 4);
                return (
                  <div key={key} className="px-3 pt-3">
                    <div className="flex items-center justify-between px-2 mb-1.5">
                      <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-zinc-500">
                        <Icon className="w-3 h-3" />
                        {label}
                      </div>
                      <div className="text-[10px] text-zinc-400">{items.length}</div>
                    </div>
                    <div className="space-y-0.5">
                      {shown.map((r, i) => {
                        const absIdx = results.indexOf(r);
                        const isActive = absIdx === cursor;
                        return (
                          <ResultRow
                            key={r.id}
                            result={r}
                            active={isActive}
                            onClick={() => go(r)}
                            onMouseEnter={() => setCursor(absIdx)}
                          />
                        );
                      })}
                      {items.length > shown.length ? (
                        <div className="px-2 py-1 text-[10px] text-zinc-400">+ {items.length - shown.length} more</div>
                      ) : null}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-zinc-100 px-5 py-2 text-[10px] text-zinc-400 flex items-center gap-3">
          <span><kbd className="px-1 py-0.5 rounded bg-zinc-100 border border-zinc-200 font-mono text-[9px]">↑↓</kbd> navigate</span>
          <span><kbd className="px-1 py-0.5 rounded bg-zinc-100 border border-zinc-200 font-mono text-[9px]">↵</kbd> open</span>
          <span><kbd className="px-1 py-0.5 rounded bg-zinc-100 border border-zinc-200 font-mono text-[9px]">esc</kbd> close</span>
          <span className="ml-auto inline-flex items-center gap-1"><Mic className="w-2.5 h-2.5" /> Click the mic to search by voice</span>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function ResultRow({ result: r, active, onClick, onMouseEnter }: { result: SearchResult; active: boolean; onClick: () => void; onMouseEnter: () => void }) {
  const Icon = iconFor(r.type);
  return (
    <button
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      className={cn(
        "w-full text-left px-2 py-2.5 rounded-md transition-colors flex gap-3",
        active ? "bg-brand-50" : "hover:bg-zinc-50",
      )}
    >
      <div className={cn(
        "w-8 h-8 rounded-md flex items-center justify-center shrink-0 mt-0.5",
        r.type === "paper" ? "bg-indigo-50 text-indigo-600" :
        r.type === "method" ? "bg-amber-50 text-amber-600" :
        r.type === "concept" ? "bg-violet-50 text-violet-600" :
        r.type === "synthesis" ? "bg-brand-50 text-brand-600" :
        r.type === "hypothesis" ? "bg-orange-50 text-orange-600" :
        r.type === "ideation" ? "bg-emerald-50 text-emerald-600" :
        r.type === "notebook" ? "bg-fuchsia-50 text-fuchsia-600" :
        "bg-zinc-100 text-zinc-600",
      )}>
        <Icon className="w-3.5 h-3.5" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-sm font-medium text-zinc-900 line-clamp-2 leading-snug">{r.label}</div>
        {r.sublabel ? <div className="text-[10px] text-zinc-500 mt-0.5 truncate">{r.sublabel}</div> : null}
        {r.snippet ? <div className="text-[11px] text-zinc-600 mt-1 leading-relaxed italic line-clamp-2">"{r.snippet}"</div> : null}
        {r.connections.length ? (
          <div className="mt-1.5 flex items-center gap-1 flex-wrap">
            {r.connections.map((c, i) => <ConnectionChip key={i} c={c} />)}
          </div>
        ) : null}
      </div>
      <div className="text-[9px] uppercase tracking-wider text-zinc-400 shrink-0 mt-1 font-semibold">{r.type}</div>
    </button>
  );
}

function ConnectionChip({ c }: { c: ConnectionReason }) {
  const tones: Record<ConnectionReason["tone"], string> = {
    rose: "bg-rose-50 text-rose-700 border-rose-200",
    emerald: "bg-emerald-50 text-emerald-700 border-emerald-200",
    brand: "bg-brand-50 text-brand-700 border-brand-200",
    amber: "bg-amber-50 text-amber-700 border-amber-200",
    violet: "bg-violet-50 text-violet-700 border-violet-200",
    zinc: "bg-zinc-50 text-zinc-600 border-zinc-200",
  };
  const icons: Record<ConnectionReason["kind"], any> = {
    cites: FileText,
    contradicts: AlertTriangle,
    replicates: CheckCircle2,
    reads: BookOpen,
    writes: NotebookPen,
    gap: Lightbulb,
    hypothesis: Lightbulb,
    synthesis: Sparkles,
    decision: Lightbulb,
  };
  const Icon = icons[c.kind];
  return (
    <span className={cn("inline-flex items-center gap-1 text-[9px] font-medium rounded-full border px-1.5 py-[1px]", tones[c.tone])}>
      <Icon className="w-2.5 h-2.5" />
      {c.text}
    </span>
  );
}

function iconFor(type: ResultType) {
  switch (type) {
    case "paper": return BookOpen;
    case "method": return FlaskConical;
    case "concept": return Sparkles;
    case "synthesis": return Sparkles;
    case "hypothesis": return Lightbulb;
    case "ideation": return FlaskConical;
    case "notebook": return NotebookPen;
    case "nav": return Share2;
  }
}
