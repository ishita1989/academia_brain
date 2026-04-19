"use client";
import * as React from "react";
import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { synthesisById } from "@/lib/mock-data/syntheses";
import { useStore } from "@/lib/store";
import { initials, cn, formatRelative } from "@/lib/utils";
import { team } from "@/lib/mock-data/team";
import { authors } from "@/lib/mock-data/authors";
import { AlertTriangle, ArrowRight, BookOpenCheck, Check, Clock, Download, Eye, GitBranch, History, Pencil, Share2, Sparkles, Users } from "lucide-react";
import { CitationPopover } from "@/components/shared/citation-popover";
import { ConfidenceMeter } from "@/components/shared/confidence-meter";
import { Badge } from "@/components/ui/badge";

export default function SynthesisCanvasPage() {
  const { id } = useParams<{ id: string }>();
  const syn = synthesisById(id);
  const setSurface = useStore((s) => s.setSurface);
  const setMessagesForSurface = useStore((s) => s.setMessagesForSurface);
  const showHistory = useStore((s) => s.showVersionHistory);
  const setShowHistory = useStore((s) => s.setShowVersionHistory);

  React.useEffect(() => {
    if (syn) {
      setSurface({ surface: "synthesis", entityId: syn.id, entityLabel: syn.title });
      setMessagesForSurface("synthesis");
    }
  }, [syn, setSurface, setMessagesForSurface]);

  if (!syn) return notFound();

  return (
    <div className="flex h-full min-h-0">
      {/* Outline rail */}
      <aside className="w-60 shrink-0 border-r border-zinc-200 bg-white overflow-y-auto scrollbar-thin">
        <div className="p-5">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500 mb-2">Sections</div>
          <nav className="space-y-0.5">
            {syn.sections.map((s) => (
              <a key={s.id} href={`#${s.id}`} className="block text-xs text-zinc-600 hover:text-brand-700 hover:bg-brand-50 rounded px-2 py-1.5 transition-colors">
                {s.heading}
              </a>
            ))}
          </nav>
        </div>
      </aside>

      {/* Main canvas */}
      <div className="flex-1 overflow-y-auto scrollbar-thin">
        <div className="max-w-3xl mx-auto px-10 py-10">
          <div className="flex items-start justify-between gap-6 mb-8">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-wider text-zinc-500 mb-2">
                <Sparkles className="w-3 h-3" />
                <span>Synthesis Canvas</span>
                {syn.contradictions > 0 ? <Badge variant="warn" className="text-[9px]"><AlertTriangle className="w-2.5 h-2.5 mr-0.5" />{syn.contradictions} contradictions</Badge> : null}
              </div>
              <h1 className="text-3xl font-bold tracking-tight leading-tight">{syn.title}</h1>
              <p className="mt-3 text-sm text-zinc-600 italic leading-relaxed">{syn.question}</p>
              <div className="mt-4 flex items-center gap-4 text-[11px] text-zinc-500">
                <div className="inline-flex items-center gap-1.5"><BookOpenCheck className="w-3 h-3" /><strong className="text-zinc-900">{syn.paperCount}</strong> papers</div>
                <div className="inline-flex items-center gap-1.5"><Clock className="w-3 h-3" />updated {formatRelative(syn.updatedAt)}</div>
                <div className="inline-flex items-center gap-1.5"><Users className="w-3 h-3" />{syn.collaborators.length} collaborators</div>
              </div>
            </div>
            <div className="flex flex-col items-end gap-2">
              <div className="flex items-center gap-1.5">
                {/* Fake multi-user cursors */}
                <div className="flex -space-x-1.5">
                  {syn.collaborators.map((mid) => {
                    const m = team.find((t) => t.id === mid)!;
                    const a = authors.find((x) => x.id === m.authorId)!;
                    return (
                      <div key={mid} className="relative">
                        <div className={cn("w-7 h-7 rounded-full ring-2 ring-white text-[10px] font-semibold text-white flex items-center justify-center", m.color)}>{initials(a.name)}</div>
                        {mid === "m-marcus" ? (
                          <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white animate-pulse" />
                        ) : null}
                      </div>
                    );
                  })}
                </div>
                <span className="text-[10px] text-emerald-600 font-medium inline-flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Marcus editing
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <button onClick={() => setShowHistory(!showHistory)} className="inline-flex items-center gap-1.5 text-[11px] text-zinc-600 hover:text-brand-700 border border-zinc-200 hover:border-brand-300 rounded-md px-2 py-1 transition-colors">
                  <History className="w-3 h-3" />
                  Version history
                </button>
                <button className="inline-flex items-center gap-1.5 text-[11px] text-zinc-600 hover:text-brand-700 border border-zinc-200 hover:border-brand-300 rounded-md px-2 py-1 transition-colors">
                  <Share2 className="w-3 h-3" />
                  Share
                </button>
                <button className="inline-flex items-center gap-1.5 text-[11px] bg-brand-600 hover:bg-brand-700 text-white rounded-md px-2 py-1 transition-colors">
                  <Download className="w-3 h-3" />
                  Export
                </button>
              </div>
            </div>
          </div>

          {/* Version history panel */}
          {showHistory ? (
            <div className="mb-8 bg-gradient-to-br from-brand-50/50 to-violet-50/50 border border-brand-100 rounded-xl p-5">
              <div className="flex items-center gap-1.5 mb-3">
                <History className="w-3.5 h-3.5 text-brand-600" />
                <div className="text-[10px] font-semibold uppercase tracking-wider text-brand-700">Version history — how understanding evolved</div>
              </div>
              <div className="relative pl-5 space-y-3">
                <div className="absolute left-1.5 top-1.5 bottom-1.5 w-px bg-brand-200" />
                {syn.versionHistory.slice().reverse().map((v) => {
                  const m = team.find((t) => t.id === v.actor)!;
                  const a = authors.find((x) => x.id === m.authorId)!;
                  return (
                    <div key={v.id} className="relative">
                      <div className="absolute -left-3.5 top-1 w-3 h-3 rounded-full bg-brand-500 ring-4 ring-white" />
                      <div className="flex items-center gap-2 text-[11px]">
                        <div className={cn("w-5 h-5 rounded-full text-[9px] font-semibold text-white flex items-center justify-center", m.color)}>{initials(a.name)}</div>
                        <span className="font-semibold">{a.name}</span>
                        <span className="text-zinc-500">· {formatRelative(v.date)}</span>
                      </div>
                      <div className="text-xs text-zinc-700 mt-0.5 leading-relaxed">{v.summary}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : null}

          {/* Sections */}
          <div className="space-y-10">
            {syn.sections.map((sec) => (
              <section key={sec.id} id={sec.id}>
                <div className="flex items-center gap-2 mb-4">
                  <h2 className="text-lg font-bold text-zinc-900">{sec.heading}</h2>
                  <span className="text-[10px] uppercase tracking-wider text-zinc-400 font-semibold">{sec.items.length} entries</span>
                </div>
                <div className="space-y-4">
                  {sec.items.map((it) => <SynthesisItemView key={it.id} item={it} />)}
                </div>
              </section>
            ))}
          </div>

          <div className="mt-12 border-t border-zinc-200 pt-6 flex items-center justify-between text-[11px] text-zinc-500">
            <div>Every claim traces to a specific paper, page, and sentence.</div>
            <div className="inline-flex items-center gap-1">
              <GitBranch className="w-3 h-3" />
              Fork this synthesis · <span className="text-brand-700 hover:underline cursor-pointer">Publish a knowledge map</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SynthesisItemView({ item }: { item: any }) {
  const isContradiction = item.kind === "contradiction";
  const isOpenQuestion = item.kind === "open-question";
  return (
    <div className={cn("bg-white border rounded-lg p-4 relative", isContradiction ? "border-rose-200 bg-rose-50/30" : isOpenQuestion ? "border-amber-200 bg-amber-50/30" : "border-zinc-200")}>
      {isContradiction ? <div className="absolute left-0 top-3 bottom-3 w-0.5 bg-rose-500 rounded-r" /> : null}
      <div className="flex items-start gap-2 mb-2">
        {item.kind === "consensus" ? <Badge variant="success" className="text-[9px]"><Check className="w-2.5 h-2.5 mr-0.5" />Consensus</Badge> :
         isContradiction ? <Badge variant="danger" className="text-[9px]"><AlertTriangle className="w-2.5 h-2.5 mr-0.5" />Contradiction</Badge> :
         isOpenQuestion ? <Badge variant="warn" className="text-[9px]">Open question</Badge> :
         item.authorId ? <Badge variant="secondary" className="text-[9px]">Team annotation</Badge> :
         null}
        {item.confidence !== undefined ? (
          <div className="ml-auto flex items-center gap-2 min-w-[160px]">
            <ConfidenceMeter value={item.confidence} size="sm" />
          </div>
        ) : null}
      </div>
      <div className="text-sm leading-relaxed text-zinc-800">
        <RenderWithCitations text={item.text} citations={item.citations} />
      </div>
      {item.authorId ? (
        <div className="mt-2 text-[10px] text-zinc-500">
          — {authors.find((a) => a.id === team.find((t) => t.id === item.authorId)?.authorId)?.name ?? "team member"}
        </div>
      ) : null}
    </div>
  );
}

function RenderWithCitations({ text, citations }: { text: string; citations: any[] }) {
  // Split text into the last sentence and wrap it with citation popover
  if (!citations || citations.length === 0) return <>{text}</>;
  const sentences = text.split(/(?<=[.!?])\s+/);
  const last = sentences[sentences.length - 1];
  const rest = sentences.slice(0, -1).join(" ");
  return (
    <>
      {rest ? <>{rest} </> : null}
      <CitationPopover citations={citations}>{last}</CitationPopover>
    </>
  );
}
