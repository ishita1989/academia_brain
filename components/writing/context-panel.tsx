"use client";
import * as React from "react";
import Link from "next/link";
import { Brain, History, List, MessageSquare, Sparkles, AlertTriangle, Quote } from "lucide-react";
import { useStore } from "@/lib/store";
import type { Notebook } from "@/lib/types";
import { cn, initials, formatRelative } from "@/lib/utils";
import { team } from "@/lib/mock-data/team";
import { authors } from "@/lib/mock-data/authors";
import { paperById } from "@/lib/mock-data/papers";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export function ContextPanel({ notebook, activeBlockId }: { notebook: Notebook; activeBlockId: string | null }) {
  const tab = useStore((s) => s.writingPanel);
  const setTab = useStore((s) => s.setWritingPanel);
  return (
    <aside className="w-[320px] shrink-0 border-l border-zinc-200 bg-zinc-50/50 overflow-y-auto scrollbar-thin">
      <div className="p-4">
        <Tabs value={tab} onValueChange={(v) => setTab(v as any)}>
          <TabsList className="w-full grid grid-cols-4 h-8">
            <TabsTrigger value="brain" className="text-[10px] gap-1"><Brain className="w-3 h-3" />Brain</TabsTrigger>
            <TabsTrigger value="comments" className="text-[10px] gap-1"><MessageSquare className="w-3 h-3" />Comments</TabsTrigger>
            <TabsTrigger value="history" className="text-[10px] gap-1"><History className="w-3 h-3" />History</TabsTrigger>
            <TabsTrigger value="outline" className="text-[10px] gap-1"><List className="w-3 h-3" />Links</TabsTrigger>
          </TabsList>
          <TabsContent value="brain"><BrainTab notebook={notebook} activeBlockId={activeBlockId} /></TabsContent>
          <TabsContent value="comments"><CommentsTab notebook={notebook} /></TabsContent>
          <TabsContent value="history"><HistoryTab notebook={notebook} /></TabsContent>
          <TabsContent value="outline"><LinksTab notebook={notebook} /></TabsContent>
        </Tabs>
      </div>
    </aside>
  );
}

function BrainTab({ notebook, activeBlockId }: { notebook: Notebook; activeBlockId: string | null }) {
  return (
    <div className="space-y-3 mt-2">
      <div className="bg-gradient-to-br from-brand-50 to-violet-50 border border-brand-100 rounded-lg p-3">
        <div className="flex items-center gap-1.5 mb-2">
          <Sparkles className="w-3 h-3 text-brand-600" />
          <div className="text-[10px] font-semibold uppercase tracking-wider text-brand-700">Grounded in this notebook</div>
        </div>
        <div className="text-[11px] text-zinc-700 leading-relaxed">
          I'm aware of all {notebook.blocks.length} blocks in this notebook, the {notebook.linkedSyntheses.length} linked syntheses, and {notebook.linkedHypotheses.length} linked hypotheses. Ask me anything grounded in that context.
        </div>
      </div>

      <div className="bg-white border border-zinc-200 rounded-lg p-3">
        <div className="flex items-center gap-1.5 mb-2">
          <AlertTriangle className="w-3 h-3 text-rose-600" />
          <div className="text-[10px] font-semibold uppercase tracking-wider text-rose-700">Open flags in this notebook</div>
        </div>
        <div className="text-[11px] space-y-1.5">
          <div className="bg-rose-50/60 border border-rose-100 rounded p-2">
            <div className="font-medium text-zinc-900">Aim 3 contradicts Aim 1 framing</div>
            <div className="text-zinc-600 mt-0.5">Marcus flagged today. Thread open on block b-aim3-goal.</div>
          </div>
          <div className="bg-amber-50/60 border border-amber-100 rounded p-2">
            <div className="font-medium text-zinc-900">Reviewer-2 concern preempt</div>
            <div className="text-zinc-600 mt-0.5">Priya noted: TIP3P rationale needs explicit Volkov 2025 citation.</div>
          </div>
        </div>
      </div>

      <div className="bg-white border border-zinc-200 rounded-lg p-3">
        <div className="flex items-center gap-1.5 mb-2">
          <Quote className="w-3 h-3 text-brand-600" />
          <div className="text-[10px] font-semibold uppercase tracking-wider text-zinc-600">Cite-from-library</div>
        </div>
        <div className="text-[10px] text-zinc-500 mb-2">Suggestions for the active block — click to insert a citation.</div>
        <div className="space-y-1">
          {["p-chen-2026", "p-imoto-2023", "p-dmitri-2025"].map((pid) => {
            const p = paperById(pid);
            if (!p) return null;
            return (
              <button key={pid} className="w-full text-left bg-zinc-50 hover:bg-brand-50 border border-zinc-200 hover:border-brand-300 rounded-md p-2 transition-colors">
                <div className="text-[11px] font-medium text-zinc-900 line-clamp-1">{p.title}</div>
                <div className="text-[9px] text-zinc-500 mt-0.5">{p.venue} · {p.year}</div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function CommentsTab({ notebook }: { notebook: Notebook }) {
  const all = notebook.comments;
  const open = all.filter((c) => !c.resolved);
  const resolved = all.filter((c) => c.resolved);
  return (
    <div className="space-y-3 mt-2">
      <div className="text-[10px] text-zinc-500">{open.length} open · {resolved.length} resolved</div>
      {all.map((c) => {
        const m = team.find((t) => t.id === c.authorId);
        const a = m ? authors.find((x) => x.id === m.authorId) : null;
        return (
          <div key={c.id} className={cn("bg-white border rounded-lg p-3", c.resolved ? "border-zinc-200 opacity-70" : "border-brand-200")}>
            <div className="flex items-center gap-2 mb-1.5">
              <div className={cn("w-5 h-5 rounded-full text-[9px] font-semibold text-white flex items-center justify-center", m?.color)}>{a ? initials(a.name) : "?"}</div>
              <span className="text-[11px] font-medium">{a?.name}</span>
              <span className="text-[10px] text-zinc-400">{formatRelative(c.createdAt)}</span>
              {c.resolved ? <span className="ml-auto text-[9px] text-emerald-700 font-medium">Resolved</span> : null}
            </div>
            <div className="text-[11px] text-zinc-800 leading-relaxed">{c.body}</div>
            <div className="mt-1 text-[10px] text-zinc-500">
              on block: <span className="font-mono text-brand-700">{c.blockId}</span>
            </div>
            {c.replies.length > 0 ? (
              <div className="mt-2 pt-2 border-t border-zinc-100 space-y-1.5">
                {c.replies.map((r) => {
                  const rm = team.find((t) => t.id === r.authorId);
                  const ra = rm ? authors.find((x) => x.id === rm.authorId) : null;
                  return (
                    <div key={r.id} className="text-[11px]">
                      <span className="font-medium">{ra?.name.split(" ")[0] ?? "?"}:</span>
                      <span className="text-zinc-700 ml-1">{r.body}</span>
                    </div>
                  );
                })}
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}

function HistoryTab({ notebook }: { notebook: Notebook }) {
  return (
    <div className="mt-2 relative pl-5 space-y-3">
      <div className="absolute left-1.5 top-1.5 bottom-1.5 w-px bg-zinc-200" />
      {notebook.activity.slice().reverse().map((e) => {
        const m = team.find((t) => t.id === e.actorId);
        const a = m ? authors.find((x) => x.id === m.authorId) : null;
        return (
          <div key={e.id} className="relative">
            <div className="absolute -left-3.5 top-1 w-3 h-3 rounded-full bg-brand-500 ring-4 ring-white" />
            <div className="text-[10px] text-zinc-400">{formatRelative(e.at)}</div>
            <div className="text-[11px] text-zinc-800 mt-0.5">
              <span className="font-semibold">{a?.name}</span> {e.action}
              {e.target ? <span className="text-zinc-500"> ({e.target.slice(0, 20)})</span> : null}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function LinksTab({ notebook }: { notebook: Notebook }) {
  return (
    <div className="mt-2 space-y-3">
      {notebook.linkedSyntheses.length > 0 ? (
        <div>
          <div className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500 mb-1.5">Linked syntheses</div>
          {notebook.linkedSyntheses.map((sid) => (
            <Link key={sid} href={`/synthesis/${sid}`} className="block bg-white border border-zinc-200 hover:border-brand-300 rounded-md p-2 text-[11px] mb-1 transition-colors">
              <div className="font-medium text-zinc-900 line-clamp-1">{sid.replace("syn-", "").replace("-", " ")}</div>
            </Link>
          ))}
        </div>
      ) : null}
      {notebook.linkedHypotheses.length > 0 ? (
        <div>
          <div className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500 mb-1.5">Linked hypotheses</div>
          {notebook.linkedHypotheses.map((hid) => (
            <Link key={hid} href={`/ideation/ses-enzymes-95c`} className="block bg-white border border-zinc-200 hover:border-brand-300 rounded-md p-2 text-[11px] mb-1 transition-colors">
              <div className="font-medium text-zinc-900">{hid}</div>
            </Link>
          ))}
        </div>
      ) : null}
    </div>
  );
}
