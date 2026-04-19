"use client";
import * as React from "react";
import Link from "next/link";
import { AlertTriangle, Brain, Calendar, ChevronDown, ChevronUp, ExternalLink, FileText, Flame, Lightbulb, MessageSquarePlus, MoreHorizontal, Sparkles, BookOpen, FlaskConical, Beaker, ImageIcon, Database, MessageSquare, Table as TableIcon, Tag, Upload, Plus, X } from "lucide-react";
import type { Notebook, NotebookBlock } from "@/lib/types";
import { paperById } from "@/lib/mock-data/papers";
import { synthesisById } from "@/lib/mock-data/syntheses";
import { hypothesisById } from "@/lib/mock-data/hypotheses";
import { team } from "@/lib/mock-data/team";
import { authors } from "@/lib/mock-data/authors";
import { cn, initials, formatRelative } from "@/lib/utils";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";

const sourceLabel = (block: NotebookBlock) => {
  switch (block.source) {
    case "hand-written": return "Hand-written";
    case "ai-generated": return block.sourceRef ? `AI · ${block.sourceRef}` : "AI-generated";
    case "from-paper": {
      const p = block.sourceRef ? paperById(block.sourceRef) : null;
      return p ? `Pulled from ${p.venue} ${p.year}` : "From paper";
    }
    case "from-synthesis": {
      const s = block.sourceRef ? synthesisById(block.sourceRef) : null;
      return s ? `From synthesis: ${s.title.slice(0, 30)}…` : "From synthesis";
    }
    case "from-hypothesis": {
      const h = block.sourceRef ? hypothesisById(block.sourceRef) : null;
      return h ? `From hypothesis ${h.id}` : "From hypothesis";
    }
    case "pasted": return "Pasted";
  }
};

const sourceColor = (block: NotebookBlock) => {
  switch (block.source) {
    case "hand-written": return "bg-zinc-50 text-zinc-600 border-zinc-200";
    case "ai-generated": return "bg-brand-50 text-brand-700 border-brand-200";
    case "from-paper": return "bg-amber-50 text-amber-700 border-amber-200";
    case "from-synthesis": return "bg-violet-50 text-violet-700 border-violet-200";
    case "from-hypothesis": return "bg-emerald-50 text-emerald-700 border-emerald-200";
    case "pasted": return "bg-zinc-50 text-zinc-600 border-zinc-200";
  }
};

export function NotebookBlockRenderer({ block, notebook, isActive, onActivate }: { block: NotebookBlock; notebook: Notebook; isActive: boolean; onActivate: () => void }) {
  const author = team.find((t) => t.authorId === block.authorId) ?? team.find((t) => t.id === block.authorId);
  const authorRec = author ? authors.find((a) => a.id === author.authorId) : null;
  const thread = block.commentThreadId ? notebook.comments.find((c) => c.threadId === block.commentThreadId) : null;
  const [showComments, setShowComments] = React.useState(thread && !thread.resolved);

  const isContradiction = block.flag === "contradiction";
  const isAI = block.type === "ai-insight";

  // Date headers get their own compact layout
  if (block.type === "date-header") {
    const d = new Date(block.dateISO ?? block.createdAt);
    const weekday = d.toLocaleDateString("en-US", { weekday: "long" }).toUpperCase();
    const dateStr = d.toLocaleDateString("en-US", { month: "numeric", day: "numeric", year: "numeric" });
    return (
      <div id={`block-${block.id}`} onMouseEnter={onActivate} className="group flex items-center gap-3 py-3 -mb-1">
        <Calendar className="w-3.5 h-3.5 text-brand-600 shrink-0" />
        <div className="text-[11px] font-semibold uppercase tracking-[0.15em] text-zinc-500 whitespace-nowrap">{weekday}, {dateStr}</div>
        <div className="flex-1 h-px bg-zinc-200" />
      </div>
    );
  }

  return (
    <div
      id={`block-${block.id}`}
      onMouseEnter={onActivate}
      className={cn(
        "group relative rounded-lg transition-all",
        isContradiction ? "bg-rose-50/30 border border-rose-200" :
        isAI ? "bg-gradient-to-br from-brand-50/40 to-violet-50/30 border border-brand-100" :
        block.type === "callout" ? "bg-amber-50/40 border border-amber-200" :
        isActive ? "bg-brand-50/30 border border-brand-200" : "border border-transparent hover:border-zinc-200 hover:bg-white",
      )}
    >
      {/* Margin comment indicator */}
      {thread || block.commentThreadId ? (
        <button onClick={() => setShowComments(!showComments)} className={cn("absolute -left-8 top-2 w-6 h-6 rounded-md flex items-center justify-center transition-all", thread?.resolved ? "bg-zinc-100 text-zinc-500" : "bg-brand-100 text-brand-700")}>
          <MessageSquare className="w-3 h-3" />
        </button>
      ) : null}

      <div className="px-4 py-3">
        {/* Block type / attribution strip (visible on hover) */}
        <div className={cn("flex items-center gap-2 text-[10px] mb-1.5 opacity-60 group-hover:opacity-100 transition-opacity", isActive ? "opacity-100" : "")}>
          <BlockTypeBadge block={block} />
          {authorRec ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="inline-flex items-center gap-1 cursor-default">
                  <div className={cn("w-4 h-4 rounded-full text-[8px] font-semibold text-white flex items-center justify-center", author?.color ?? "bg-zinc-500")}>
                    {initials(authorRec.name)}
                  </div>
                  <span className="text-zinc-600 font-medium">{authorRec.name.split(" ")[0]}</span>
                </div>
              </TooltipTrigger>
              <TooltipContent>Added by {authorRec.name} · {formatRelative(block.createdAt)}</TooltipContent>
            </Tooltip>
          ) : null}
          <span className="text-zinc-400">·</span>
          <span className="text-zinc-500">{formatRelative(block.createdAt)}</span>
          <span className={cn("inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-medium border", sourceColor(block))}>
            {block.source === "ai-generated" ? <Brain className="w-2.5 h-2.5" /> : block.source === "from-paper" ? <FileText className="w-2.5 h-2.5" /> : null}
            {sourceLabel(block)}
          </span>
          {block.editedAt ? (
            <span className="text-zinc-400">· edited {formatRelative(block.editedAt)}</span>
          ) : null}
          {isContradiction ? (
            <span className="inline-flex items-center gap-1 text-[9px] font-semibold text-rose-700 bg-rose-100 rounded px-1.5 py-0.5 border border-rose-200">
              <AlertTriangle className="w-2.5 h-2.5" />
              {block.flagMessage}
            </span>
          ) : null}
        </div>

        {/* Block content */}
        <BlockContent block={block} />

        {/* Block-level tags */}
        {block.tags?.length ? (
          <div className="mt-2 flex items-center gap-1 flex-wrap">
            {block.tags.map((t) => (
              <span key={t} className="inline-flex items-center gap-1 text-[9px] bg-zinc-100 text-zinc-700 rounded-full px-1.5 py-0.5 font-medium">
                <Tag className="w-2 h-2 text-zinc-500" />{t}
              </span>
            ))}
            <button className="text-[9px] text-zinc-400 hover:text-brand-700 inline-flex items-center gap-0.5"><Plus className="w-2 h-2" /> tag</button>
          </div>
        ) : null}

        {/* Citations footer */}
        {block.citations?.length ? (
          <div className="mt-3 pt-3 border-t border-dashed border-zinc-200 flex flex-wrap gap-1.5">
            {block.citations.map((c, i) => {
              const p = paperById(c.paperId);
              if (!p) return null;
              return (
                <Tooltip key={i}>
                  <TooltipTrigger asChild>
                    <Link href={`/reader/${p.id}`} className="inline-flex items-center gap-1 text-[10px] bg-white border border-zinc-200 hover:border-brand-300 rounded-full px-2 py-0.5 text-zinc-700 hover:text-brand-700 transition-colors">
                      <FileText className="w-2.5 h-2.5" />
                      {p.authors[0] ? authors.find((a) => a.id === p.authors[0])?.name.split(" ").slice(-1)[0] : "?"} {p.year}
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent>
                    <div className="max-w-xs">
                      <div className="font-medium">{p.title}</div>
                      <div className="text-zinc-300 mt-0.5 italic">"{c.sentence}"</div>
                    </div>
                  </TooltipContent>
                </Tooltip>
              );
            })}
          </div>
        ) : null}

        {/* AI grounding footer */}
        {isAI && block.aiGroundedIn?.length ? (
          <div className="mt-3 pt-3 border-t border-dashed border-brand-200">
            <div className="text-[10px] font-semibold text-brand-700 mb-1.5 inline-flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> Grounded in {block.aiGroundedIn.length} team papers
            </div>
            <div className="flex flex-wrap gap-1.5">
              {block.aiGroundedIn.map((pid) => {
                const p = paperById(pid);
                if (!p) return null;
                return (
                  <Link key={pid} href={`/reader/${pid}`} className="text-[10px] bg-white border border-brand-200 hover:border-brand-400 rounded-full px-2 py-0.5 text-brand-700 transition-colors">
                    {authors.find((a) => a.id === p.authors[0])?.name.split(" ").slice(-1)[0] ?? "?"} {p.year}
                  </Link>
                );
              })}
            </div>
          </div>
        ) : null}

        {/* Inline comment thread */}
        {thread && showComments ? (
          <div className="mt-3 pt-3 border-t border-brand-200">
            <CommentThread thread={thread} />
          </div>
        ) : null}

        {/* Hover toolbar */}
        <div className="absolute right-2 top-2 flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
          <button className="w-6 h-6 rounded bg-white border border-zinc-200 hover:border-brand-300 text-zinc-500 hover:text-brand-600 flex items-center justify-center">
            <MessageSquarePlus className="w-3 h-3" />
          </button>
          <button className="w-6 h-6 rounded bg-white border border-zinc-200 hover:border-brand-300 text-zinc-500 hover:text-brand-600 flex items-center justify-center">
            <MoreHorizontal className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
}

function BlockTypeBadge({ block }: { block: NotebookBlock }) {
  const cfg: Record<string, { label: string; icon: any; color: string }> = {
    heading: { label: "Heading", icon: FileText, color: "text-zinc-600" },
    text: { label: "Text", icon: FileText, color: "text-zinc-500" },
    methodology: { label: "Methodology", icon: FlaskConical, color: "text-sky-700 bg-sky-50 border-sky-200 border rounded px-1 py-0.5" },
    "experimental-plan": { label: "Experimental Plan", icon: Beaker, color: "text-emerald-700 bg-emerald-50 border-emerald-200 border rounded px-1 py-0.5" },
    "research-note": { label: "Research Note", icon: BookOpen, color: "text-amber-700 bg-amber-50 border-amber-200 border rounded px-1 py-0.5" },
    "ai-insight": { label: "AI Insight", icon: Brain, color: "text-brand-700 bg-brand-50 border-brand-200 border rounded px-1 py-0.5" },
    reference: { label: "References", icon: BookOpen, color: "text-violet-700 bg-violet-50 border-violet-200 border rounded px-1 py-0.5" },
    data: { label: "Data", icon: Database, color: "text-teal-700 bg-teal-50 border-teal-200 border rounded px-1 py-0.5" },
    figure: { label: "Figure", icon: ImageIcon, color: "text-fuchsia-700 bg-fuchsia-50 border-fuchsia-200 border rounded px-1 py-0.5" },
    callout: { label: "Callout", icon: Flame, color: "text-amber-700 bg-amber-50 border-amber-200 border rounded px-1 py-0.5" },
    decision: { label: "Decision", icon: Lightbulb, color: "text-indigo-700 bg-indigo-50 border-indigo-200 border rounded px-1 py-0.5" },
    image: { label: "Image", icon: ImageIcon, color: "text-fuchsia-700 bg-fuchsia-50 border-fuchsia-200 border rounded px-1 py-0.5" },
    table: { label: "Table", icon: TableIcon, color: "text-teal-700 bg-teal-50 border-teal-200 border rounded px-1 py-0.5" },
    "date-header": { label: "Date", icon: Calendar, color: "text-zinc-600" },
  };
  const c = cfg[block.type] ?? cfg.text;
  const Icon = c.icon;
  return (
    <span className={cn("inline-flex items-center gap-1 text-[9px] font-medium uppercase tracking-wide", c.color)}>
      <Icon className="w-2.5 h-2.5" />
      {c.label}
    </span>
  );
}

function BlockContent({ block }: { block: NotebookBlock }) {
  if (block.type === "heading") {
    return <h2 className="text-xl font-bold text-zinc-900 leading-tight">{block.content}</h2>;
  }
  if (block.type === "ai-insight") {
    return (
      <div className="flex items-start gap-2.5">
        <div className="w-6 h-6 rounded-md gradient-brand flex items-center justify-center shrink-0 mt-0.5">
          <Brain className="w-3 h-3 text-white" />
        </div>
        <div className="text-[14px] leading-relaxed text-zinc-800">{block.content}</div>
      </div>
    );
  }
  if (block.type === "callout") {
    return <div className="text-sm leading-relaxed text-zinc-800">{block.content}</div>;
  }
  if (block.type === "reference") {
    return (
      <div>
        <div className="text-sm text-zinc-700 mb-2">{block.content}</div>
        <div className="flex flex-wrap gap-1.5">
          {["p-kawamura-2024", "p-chen-2026", "p-imoto-2023", "p-dmitri-2025", "p-schuler-2023", "p-baker-2024", "p-lindorff-2022"].slice(0, 7).map((pid) => {
            const p = paperById(pid);
            if (!p) return null;
            return (
              <Link key={pid} href={`/reader/${pid}`} className="text-[10px] bg-white border border-zinc-200 hover:border-brand-300 rounded-full px-2 py-0.5 text-zinc-700 hover:text-brand-700 transition-colors">
                {authors.find((a) => a.id === p.authors[0])?.name.split(" ").slice(-1)[0] ?? "?"} {p.year}
              </Link>
            );
          })}
        </div>
      </div>
    );
  }
  if (block.type === "methodology") {
    return (
      <div>
        <div className="text-[14px] leading-relaxed text-zinc-800 whitespace-pre-line">{block.content}</div>
        {block.subcontent ? <div className="mt-2 text-[11px] text-zinc-600 font-mono bg-zinc-50 border border-zinc-200 rounded p-2.5">{block.subcontent}</div> : null}
      </div>
    );
  }
  if (block.type === "experimental-plan") {
    return (
      <div>
        <div className="text-[14px] leading-relaxed text-zinc-800 whitespace-pre-line">{block.content}</div>
        {block.subcontent ? <div className="mt-2 text-[11px] text-zinc-600 italic bg-emerald-50/60 border border-emerald-100 rounded p-2.5">{block.subcontent}</div> : null}
      </div>
    );
  }
  if (block.type === "image") {
    const data = block.imageData;
    return (
      <div>
        {block.content ? <div className="text-sm font-medium text-zinc-900 mb-2">{block.content}</div> : null}
        <div className="relative bg-zinc-900 rounded-lg overflow-hidden border border-zinc-200">
          {data?.src ? (
            <img src={data.src} alt={data.caption ?? "image"} className="w-full" />
          ) : (
            <div className="aspect-[16/10] flex items-center justify-center bg-gradient-to-br from-zinc-800 via-zinc-900 to-black text-zinc-300">
              <FauxGelImage />
            </div>
          )}
          {data?.annotations?.length ? (
            <div className="absolute right-3 top-3 bg-black/60 backdrop-blur text-zinc-100 rounded-md px-3 py-2 text-[10px] font-mono leading-snug max-w-[40%]">
              {data.annotations.map((a, i) => <div key={i}>{a.label}</div>)}
            </div>
          ) : null}
          <div className="absolute left-3 top-3 bg-white/10 backdrop-blur text-white rounded-md px-2 py-1 text-[10px] font-mono inline-flex items-center gap-1">
            <ImageIcon className="w-2.5 h-2.5" />{block.imageData?.placeholder ?? "image.png"}
          </div>
        </div>
        {data?.caption ? <div className="mt-2 text-[11px] text-zinc-600 italic">{data.caption}</div> : null}
        {!data?.src ? (
          <button className="mt-2 inline-flex items-center gap-1 text-[11px] text-zinc-500 hover:text-brand-700 transition-colors">
            <Upload className="w-3 h-3" /> Drop an image, or paste from clipboard
          </button>
        ) : null}
      </div>
    );
  }
  if (block.type === "table") {
    const t = block.tableData;
    if (!t) return null;
    return (
      <div>
        {block.content ? <div className="text-sm font-medium text-zinc-900 mb-2 flex items-center gap-1.5"><TableIcon className="w-3.5 h-3.5 text-zinc-500" />{block.content}</div> : null}
        <div className="rounded-lg border border-zinc-200 overflow-hidden">
          <table className="w-full text-[12px]">
            <thead className="bg-zinc-50 border-b border-zinc-200">
              <tr>
                {t.headers.map((h, i) => <th key={i} className="text-left font-semibold text-zinc-700 px-3 py-2 whitespace-nowrap">{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {t.rows.map((row, i) => (
                <tr key={i} className="border-b border-zinc-100 last:border-0 hover:bg-zinc-50/60">
                  {row.map((cell, j) => <td key={j} className="px-3 py-2 text-zinc-800">{cell || <span className="text-zinc-400">—</span>}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {t.caption ? <div className="mt-2 text-[11px] text-zinc-600 italic">{t.caption}</div> : null}
        <div className="mt-2 flex items-center gap-2 text-[10px] text-zinc-500">
          <button className="hover:text-brand-700 inline-flex items-center gap-0.5"><Plus className="w-2.5 h-2.5" /> Row</button>
          <button className="hover:text-brand-700 inline-flex items-center gap-0.5"><Plus className="w-2.5 h-2.5" /> Column</button>
        </div>
      </div>
    );
  }
  return <div className="text-[14px] leading-relaxed text-zinc-800 whitespace-pre-line">{block.content}</div>;
}

// Synthetic gel image — a faux 5-lane agarose gel we draw with divs. Stands in
// for Benchling's drag-and-drop image feature when no actual image is attached.
function FauxGelImage() {
  const lanes = [
    // [density from top to bottom — "bands"]
    [0, 1, 0.8, 0.6, 0.3, 0.2, 0.9], // ladder
    [0, 0, 0, 0.3, 0, 0, 0.1], // undigested
    [0, 0, 0.6, 0, 0, 0.8, 0], // digested vector
    [0, 0, 0, 0, 0.9, 0, 0], // insert
    [0, 0, 0.4, 0, 0.7, 0.8, 0], // ligation tube
  ];
  return (
    <div className="relative w-4/5 max-w-2xl aspect-[16/9] bg-gradient-to-b from-zinc-950 to-black rounded-md shadow-inner overflow-hidden flex gap-3 px-6 py-5">
      {lanes.map((lane, i) => (
        <div key={i} className="flex-1 relative">
          {lane.map((opacity, j) => opacity > 0 ? (
            <div
              key={j}
              className="absolute left-0 right-0 rounded-full"
              style={{
                top: `${(j / lane.length) * 100}%`,
                height: `${3 + opacity * 7}px`,
                background: `rgba(220,240,220,${opacity})`,
                filter: `blur(${1 + (1 - opacity) * 2}px)`,
                boxShadow: "0 0 12px rgba(180,220,180,0.35)",
              }}
            />
          ) : null)}
        </div>
      ))}
    </div>
  );
}

function CommentThread({ thread }: { thread: any }) {
  const all = [{ id: "root", authorId: thread.authorId, body: thread.body, createdAt: thread.createdAt }, ...thread.replies];
  return (
    <div className="space-y-3">
      {all.map((c: any) => {
        const m = team.find((t) => t.id === c.authorId);
        const a = m ? authors.find((x) => x.id === m.authorId) : null;
        return (
          <div key={c.id} className="flex gap-2">
            <div className={cn("w-6 h-6 rounded-full text-[9px] font-semibold text-white flex items-center justify-center shrink-0", m?.color ?? "bg-zinc-400")}>{a ? initials(a.name) : "?"}</div>
            <div className="min-w-0 flex-1">
              <div className="text-[11px]">
                <span className="font-semibold text-zinc-900">{a?.name ?? "Someone"}</span>
                <span className="text-zinc-500 ml-2">{formatRelative(c.createdAt)}</span>
              </div>
              <div className="text-xs text-zinc-800 mt-0.5 leading-relaxed">{c.body}</div>
            </div>
          </div>
        );
      })}
      {thread.resolved ? (
        <Badge variant="success" className="text-[9px]">Resolved</Badge>
      ) : (
        <div className="flex items-center gap-2">
          <input placeholder="Reply…" className="flex-1 text-xs bg-white border border-zinc-200 rounded-md px-2.5 py-1.5 placeholder:text-zinc-400" />
          <button className="text-[11px] bg-brand-600 text-white rounded-md px-2.5 py-1.5 font-medium">Reply</button>
          <button className="text-[11px] text-zinc-500 hover:text-emerald-700 font-medium">Resolve</button>
        </div>
      )}
    </div>
  );
}
