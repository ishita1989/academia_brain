"use client";
import * as React from "react";
import { notFound, useParams } from "next/navigation";
import Link from "next/link";
import { sessionById, hypothesisById, hypotheses } from "@/lib/mock-data/hypotheses";
import { useStore } from "@/lib/store";
import { team } from "@/lib/mock-data/team";
import { authors } from "@/lib/mock-data/authors";
import { papers, paperById } from "@/lib/mock-data/papers";
import { cn, initials, formatRelative } from "@/lib/utils";
import { AlertTriangle, ArrowRight, Brain, CheckCircle2, ChevronDown, ChevronUp, FlaskConical, Lightbulb, Plus, Rocket, ThumbsDown, ThumbsUp, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";

export default function IdeationSessionPage() {
  const { id } = useParams<{ id: string }>();
  const session = sessionById(id);
  const setSurface = useStore((s) => s.setSurface);
  const setMessagesForSurface = useStore((s) => s.setMessagesForSurface);
  const votes = useStore((s) => s.votes);
  const setVote = useStore((s) => s.setVote);
  const [promoted, setPromoted] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (session) {
      setSurface({ surface: "ideation", entityId: session.id, entityLabel: session.title });
      setMessagesForSurface("ideation");
    }
  }, [session, setSurface, setMessagesForSurface]);

  if (!session) return notFound();
  const hs = session.hypotheses.map((id) => hypothesisById(id)!).filter(Boolean);

  return (
    <div className="px-8 py-6 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="mb-7">
        <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-wider text-zinc-500 mb-2">
          <FlaskConical className="w-3 h-3" />
          Ideation Lab · {session.active ? <Badge variant="success" className="text-[9px]">live session</Badge> : null}
        </div>
        <h1 className="text-2xl font-bold tracking-tight">{session.title}</h1>
        <p className="mt-2 text-sm text-zinc-600 italic">{session.research}</p>
        <div className="mt-4 flex items-center gap-4 text-[11px] text-zinc-500">
          <div className="inline-flex items-center gap-1.5">
            <Users className="w-3 h-3" />
            <div className="flex -space-x-1.5">
              {session.participants.map((mid) => {
                const m = team.find((t) => t.id === mid)!;
                const a = authors.find((x) => x.id === m.authorId)!;
                return <div key={mid} className={cn("w-5 h-5 rounded-full ring-2 ring-white text-[8px] font-semibold text-white flex items-center justify-center", m.color)}>{initials(a.name)}</div>;
              })}
            </div>
            <span className="ml-1 font-medium">{session.participants.length} in session</span>
          </div>
          <span>started {formatRelative(session.startedAt)}</span>
          <span>·</span>
          <span><strong className="text-zinc-900">{hs.length}</strong> hypothesis cards</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr,280px] gap-6">
        {/* Hypothesis cards */}
        <div className="space-y-4">
          {/* AI suggestion */}
          <div className="bg-gradient-to-br from-brand-50 to-violet-50 border border-brand-200 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-md gradient-brand flex items-center justify-center shrink-0">
                <Brain className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-1.5 mb-1">
                  <div className="text-[10px] font-semibold uppercase tracking-wider text-brand-700">Brain suggestion</div>
                  <Badge variant="brand" className="text-[9px]">grounded in 47 team papers</Badge>
                </div>
                <div className="text-sm text-zinc-800 leading-relaxed">
                  Consider <strong>Patel 2025</strong> for H-1 — they used a similar immobilization method but in a different domain (industrial esterases). Their conversion-retention metric (120h at 75 °C) is the closest precedent for your team's 90 °C target.
                </div>
                <div className="mt-3 flex gap-1.5">
                  <button className="text-[11px] bg-white hover:bg-brand-50 border border-brand-200 rounded-full px-2.5 py-1 font-medium text-brand-700">Apply to H-1</button>
                  <button className="text-[11px] text-zinc-600 hover:text-zinc-900 rounded-full px-2.5 py-1">Dismiss</button>
                </div>
              </div>
            </div>
          </div>

          {hs.map((h) => (
            <HypothesisCard key={h.id} hypothesis={h} userVote={votes[h.id]} onVote={(v) => setVote(h.id, v === votes[h.id] ? null : v)} promoted={promoted === h.id} onPromote={() => setPromoted(h.id)} />
          ))}

          <button className="w-full border-2 border-dashed border-zinc-300 hover:border-brand-400 hover:bg-brand-50 text-zinc-600 hover:text-brand-700 rounded-xl py-4 text-sm font-medium transition-all inline-flex items-center justify-center gap-1.5">
            <Plus className="w-4 h-4" /> Add a new hypothesis
          </button>
        </div>

        {/* Session timeline */}
        <aside>
          <div className="bg-white border border-zinc-200 rounded-xl p-5 sticky top-2">
            <div className="flex items-center gap-1.5 mb-3">
              <Lightbulb className="w-3.5 h-3.5 text-brand-600" />
              <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-600">Hypothesis evolution</h3>
            </div>
            <div className="relative pl-5 space-y-3">
              <div className="absolute left-1.5 top-1.5 bottom-1.5 w-px bg-zinc-200" />
              {session.evolutionTimeline.map((e, i) => (
                <div key={i} className="relative">
                  <div className="absolute -left-3.5 top-1 w-3 h-3 rounded-full bg-brand-500 ring-4 ring-white" />
                  <div className="text-[10px] text-zinc-400">{e.date}</div>
                  <div className="text-[11px] text-zinc-700 mt-0.5 leading-relaxed">{e.summary}</div>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>

      <AnimatePresence>
        {promoted ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-zinc-900/40 backdrop-blur-sm z-30 flex items-center justify-center p-6"
            onClick={() => setPromoted(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6"
            >
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-md bg-gradient-to-br from-emerald-500 to-brand-500 flex items-center justify-center">
                  <Rocket className="w-4 h-4 text-white" />
                </div>
                <div>
                  <div className="text-[10px] font-semibold uppercase tracking-wider text-emerald-700">Promoted to experiment design</div>
                  <h3 className="text-lg font-bold">Hypothesis → Experimental Plan</h3>
                </div>
              </div>
              <div className="text-sm text-zinc-700 leading-relaxed mb-4">
                The brain has drafted a starting protocol grounded in the 3 supporting papers and the team's decision archaeology. The draft has been saved as an <strong>Experimental Plan block</strong> in the R01 notebook.
              </div>
              <div className="bg-zinc-50 border border-zinc-200 rounded-lg p-3 text-xs text-zinc-700 space-y-1.5 mb-4">
                <div>• <strong>Procedure:</strong> 1μs MD per enzyme per water model; triplicate replicates</div>
                <div>• <strong>Systems:</strong> TK1687, PF0974, Sso-AdhB (derived from Aim 1)</div>
                <div>• <strong>Success criterion:</strong> &gt;20% RMSF divergence in loop regions for ≥3/12 systems</div>
                <div>• <strong>Timeline:</strong> Months 1–9; 400k GPU-hours</div>
              </div>
              <div className="flex gap-2">
                <Link href="/writing/nb-r01" className="flex-1 inline-flex items-center justify-center gap-1.5 bg-brand-600 hover:bg-brand-700 text-white rounded-md px-4 py-2 text-sm font-medium">
                  Open R01 notebook <ArrowRight className="w-3 h-3" />
                </Link>
                <button onClick={() => setPromoted(null)} className="px-4 py-2 text-sm rounded-md border border-zinc-200 hover:border-zinc-300">Close</button>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

function HypothesisCard({ hypothesis: h, userVote, onVote, promoted, onPromote }: { hypothesis: any; userVote?: 1 | -1; onVote: (v: 1 | -1) => void; promoted: boolean; onPromote: () => void }) {
  const [expanded, setExpanded] = React.useState(false);
  const creator = team.find((t) => t.id === h.createdBy)!;
  const creatorA = authors.find((a) => a.id === creator.authorId)!;
  const upvotes = h.votes.filter((v: any) => v.value === 1).length + (userVote === 1 ? 1 : 0);
  const downvotes = h.votes.filter((v: any) => v.value === -1).length + (userVote === -1 ? 1 : 0);
  return (
    <div className={cn("bg-white border rounded-xl p-5 transition-all", h.contradictingPapers.length > 0 ? "border-amber-200" : "border-zinc-200")}>
      <div className="flex items-start gap-4">
        {/* Vote column */}
        <div className="flex flex-col items-center gap-0.5 shrink-0 text-[11px]">
          <button onClick={() => onVote(1)} className={cn("w-8 h-8 rounded-md transition-colors flex items-center justify-center", userVote === 1 ? "bg-emerald-50 text-emerald-700" : "text-zinc-400 hover:bg-zinc-50 hover:text-zinc-700")}>
            <ThumbsUp className="w-3.5 h-3.5" />
          </button>
          <div className="font-semibold text-zinc-700">{upvotes - downvotes}</div>
          <button onClick={() => onVote(-1)} className={cn("w-8 h-8 rounded-md transition-colors flex items-center justify-center", userVote === -1 ? "bg-rose-50 text-rose-700" : "text-zinc-400 hover:bg-zinc-50 hover:text-zinc-700")}>
            <ThumbsDown className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="muted" className="text-[9px] uppercase">{h.id}</Badge>
            {h.status === "promoted" ? <Badge variant="success" className="text-[9px]"><CheckCircle2 className="w-2.5 h-2.5 mr-0.5" />Promoted</Badge> : <Badge variant="outline" className="text-[9px] capitalize">{h.status}</Badge>}
            {h.contradictingPapers.length > 0 ? <Badge variant="warn" className="text-[9px]"><AlertTriangle className="w-2.5 h-2.5 mr-0.5" />contested</Badge> : null}
            <span className="ml-auto text-[10px] text-zinc-400">by {creatorA.name.split(" ")[0]} · {formatRelative(h.createdAt)}</span>
          </div>
          <div className="text-sm font-medium text-zinc-900 leading-snug">{h.statement}</div>

          {/* Evidence strip */}
          <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-2">
            {h.supportingPapers.length > 0 ? (
              <div className="bg-emerald-50/60 border border-emerald-100 rounded-md px-2.5 py-2">
                <div className="text-[9px] uppercase font-semibold text-emerald-700 mb-1">Supports ({h.supportingPapers.length})</div>
                <div className="space-y-0.5">
                  {h.supportingPapers.map((pid: string) => {
                    const p = paperById(pid);
                    if (!p) return null;
                    return <Link key={pid} href={`/reader/${pid}`} className="block text-[10px] text-zinc-700 hover:text-emerald-700 truncate">• {p.title.slice(0, 60)}</Link>;
                  })}
                </div>
              </div>
            ) : null}
            {h.contradictingPapers.length > 0 ? (
              <div className="bg-rose-50/60 border border-rose-100 rounded-md px-2.5 py-2">
                <div className="text-[9px] uppercase font-semibold text-rose-700 mb-1">Contradicts ({h.contradictingPapers.length})</div>
                <div className="space-y-0.5">
                  {h.contradictingPapers.map((pid: string) => {
                    const p = paperById(pid);
                    if (!p) return null;
                    return <Link key={pid} href={`/reader/${pid}`} className="block text-[10px] text-zinc-700 hover:text-rose-700 truncate">• {p.title.slice(0, 60)}</Link>;
                  })}
                </div>
              </div>
            ) : null}
          </div>

          {/* Brain suggestion */}
          {h.brainSuggestion ? (
            <div className="mt-3 bg-brand-50/60 border border-brand-100 rounded-md p-2.5 text-[11px] leading-relaxed">
              <div className="flex items-center gap-1 text-[9px] font-semibold uppercase tracking-wider text-brand-700 mb-1">
                <Brain className="w-3 h-3" /> Brain
              </div>
              <span className="text-zinc-800">{h.brainSuggestion}</span>
            </div>
          ) : null}

          <div className="mt-3 flex items-center gap-2">
            <button onClick={() => setExpanded(!expanded)} className="text-[10px] text-zinc-500 hover:text-zinc-800 inline-flex items-center gap-0.5">
              {expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />} Suggested methods
            </button>
            {h.status !== "promoted" ? (
              <button onClick={onPromote} className="ml-auto text-[11px] font-medium text-emerald-700 hover:bg-emerald-50 rounded-md px-2 py-1 inline-flex items-center gap-1 transition-colors">
                <Rocket className="w-3 h-3" /> Promote to experiment
              </button>
            ) : (
              <Link href="/writing/nb-r01" className="ml-auto text-[11px] font-medium text-brand-700 hover:bg-brand-50 rounded-md px-2 py-1 inline-flex items-center gap-1 transition-colors">
                Open experiment plan <ArrowRight className="w-3 h-3" />
              </Link>
            )}
          </div>
          {expanded ? (
            <div className="mt-2 bg-zinc-50 border border-zinc-200 rounded-md p-2.5 text-[11px] text-zinc-700">
              <div className="font-semibold mb-1">Suggested methods</div>
              <div className="flex flex-wrap gap-1">
                {(h.suggestedMethods ?? []).map((m: string) => <span key={m} className="px-2 py-0.5 bg-white border border-zinc-200 rounded-full">{m}</span>)}
              </div>
              {h.linkedDatasets?.length ? (
                <div className="mt-2 text-[10px] text-zinc-500">Linked datasets: {h.linkedDatasets.join(", ")}</div>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
