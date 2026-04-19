"use client";
import * as React from "react";
import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { paperById } from "@/lib/mock-data/papers";
import { annotationsFor } from "@/lib/mock-data/annotations";
import { authors } from "@/lib/mock-data/authors";
import { team } from "@/lib/mock-data/team";
import { useStore } from "@/lib/store";
import { initials, cn, formatRelative } from "@/lib/utils";
import { AlertTriangle, BookOpen, ExternalLink, GitBranch, Highlighter, MessageCircle, Pin, ArrowRight, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function ReaderPage() {
  const { paperId } = useParams<{ paperId: string }>();
  const paper = paperById(paperId);
  const setSurface = useStore((s) => s.setSurface);
  const setMessagesForSurface = useStore((s) => s.setMessagesForSurface);
  const [activeAnnotation, setActiveAnnotation] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (paper) {
      setSurface({ surface: "reader", entityId: paper.id, entityLabel: `${paper.venue} · ${paper.year}` });
      setMessagesForSurface("reader");
    }
  }, [paper, setSurface, setMessagesForSurface]);

  if (!paper) return notFound();
  const anns = annotationsFor(paper.id);
  const isContradiction = paper.id === "p-chen-2026";

  return (
    <div className="flex h-full min-h-0">
      {/* Left rail: prior belief */}
      <aside className="w-[280px] shrink-0 bg-zinc-50 border-r border-zinc-200 overflow-y-auto scrollbar-thin">
        {isContradiction ? (
          <div className="p-5">
            <div className="flex items-center gap-1.5 mb-3">
              <Pin className="w-3.5 h-3.5 text-rose-600" />
              <div className="text-[10px] font-semibold uppercase tracking-wider text-rose-700">Prior lab belief</div>
            </div>
            <div className="bg-white border border-rose-200 rounded-lg p-3">
              <div className="text-[10px] font-semibold uppercase tracking-wide text-zinc-500 mb-1">Kawamura 2024 · Nat Comm</div>
              <div className="text-xs italic text-zinc-800 leading-relaxed border-l-2 border-rose-400 pl-2.5">
                "We propose backbone rigidification — not increased salt-bridge networks — as the dominant driver of hyperthermostability in this clade."
              </div>
              <Link href="/reader/p-kawamura-2024" className="mt-2 inline-flex items-center gap-1 text-[10px] text-rose-700 font-medium hover:underline">
                Open Kawamura 2024 <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            <div className="mt-5 flex items-center gap-1.5 mb-3">
              <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
              <div className="text-[10px] font-semibold uppercase tracking-wider text-rose-700">Disagreement</div>
            </div>
            <div className="text-[11px] text-zinc-600 leading-relaxed">
              Chen 2026 directly contradicts the rigidification framing at the solvent-model level — under OPC water, backbone flexibility is 27–41% higher than TIP3P-based estimates.
            </div>
            <div className="mt-3 text-[10px] text-zinc-500">
              The brain has pre-highlighted the contradicting passage. Click to expand.
            </div>
          </div>
        ) : (
          <div className="p-5 text-[11px] text-zinc-500 leading-relaxed">
            Reading with full team context. Highlights by lab members appear in-line; the brain's contextual sidebar (right) shows related papers, methods, and team discussions.
          </div>
        )}

        <div className="mt-2 border-t border-zinc-200 p-5">
          <div className="flex items-center gap-1.5 mb-2">
            <Highlighter className="w-3.5 h-3.5 text-brand-600" />
            <div className="text-[10px] font-semibold uppercase tracking-wider text-zinc-600">Team annotations</div>
          </div>
          {anns.length === 0 ? (
            <div className="text-[11px] text-zinc-500">No team annotations yet. Select text in the paper to add one.</div>
          ) : (
            <div className="space-y-2">
              {anns.map((a) => {
                const m = team.find((t) => t.id === a.authorId) ?? team.find((t) => t.authorId === a.authorId);
                const au = authors.find((x) => x.id === (m?.authorId ?? a.authorId));
                if (!m || !au) return null;
                return (
                  <button key={a.id} onClick={() => setActiveAnnotation(a.id)} className={cn("block w-full text-left bg-white border rounded-md p-2.5 transition-colors", activeAnnotation === a.id ? "border-brand-400 ring-2 ring-brand-100" : "border-zinc-200 hover:border-brand-300")}>
                    <div className="flex items-center gap-1.5 mb-1">
                      <div className={cn("w-4 h-4 rounded-full text-[8px] font-semibold text-white flex items-center justify-center", m.color)}>{initials(au.name)}</div>
                      <div className="text-[10px] font-medium text-zinc-700">{au.name}</div>
                      <div className="text-[9px] text-zinc-400 ml-auto">{formatRelative(a.at)}</div>
                    </div>
                    <div className="text-[10px] text-zinc-600 italic border-l-2 border-brand-300 pl-1.5 line-clamp-2">"{a.quote}"</div>
                    <div className="mt-1 text-[11px] text-zinc-800 line-clamp-2">{a.text}</div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </aside>

      {/* Main paper view */}
      <div className="flex-1 overflow-y-auto scrollbar-thin">
        <div className="max-w-3xl mx-auto px-10 py-10">
          {/* Paper header */}
          <div className="mb-8 pb-6 border-b border-zinc-200">
            <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-wider text-zinc-500 mb-3">
              <span className="text-brand-700">{paper.venue}</span>
              <span>·</span>
              <span>{paper.year}</span>
              <span>·</span>
              <a href={paper.externalUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 hover:text-brand-700">
                {paper.externalId} <ExternalLink className="w-2.5 h-2.5" />
              </a>
              {paper.replicated ? <Badge variant="success" className="text-[9px]">replicated</Badge> : null}
              {paper.confidence < 0.7 ? <Badge variant="warn" className="text-[9px]">contested</Badge> : null}
            </div>
            <h1 className="text-3xl font-bold tracking-tight leading-tight mb-4">{paper.title}</h1>
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-zinc-600">
              {paper.authors.map((aid) => {
                const a = authors.find((x) => x.id === aid);
                return a ? <span key={aid}>{a.name}</span> : null;
              })}
            </div>
          </div>

          {/* Abstract */}
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500 mb-2">Abstract</div>
            <div className="text-[15px] leading-[1.75] text-zinc-800">
              {renderAbstractWithHighlights(paper.abstract, anns, activeAnnotation, setActiveAnnotation)}
            </div>
          </div>

          {/* Faux body content */}
          <div className="mt-10 space-y-6 text-[15px] leading-[1.75] text-zinc-800">
            <FauxSection title="Introduction" paragraphs={[
              "Enzymes evolved by hyperthermophilic archaea operate in temperature regimes where most globular proteins unfold rapidly. Understanding the structural and dynamic principles that stabilize them is both scientifically interesting and practically important: industrial biocatalysis at 70–95 °C would unlock continuous-flow chemical processes that are currently limited by enzyme denaturation.",
              "Classical molecular dynamics (MD) simulations have formed the computational backbone of this field for over two decades. The overwhelming majority of published studies use the TIP3P water model, which has the advantage of being fast, well-parameterized against ambient-temperature data, and present in virtually every MD workflow.",
            ]} />
            <FauxSection title="Results" paragraphs={[
              "We re-simulated three archaeal enzymes previously reported as rigid by Kawamura et al. (2024) using OPC water at 363 K, with otherwise identical parameters and sampling protocols. In all three systems we observed backbone flexibility in loop regions that was markedly higher than under TIP3P.",
              "The magnitude of the effect was not small. Averaged across the three enzymes, OPC-derived backbone RMSF in designated loop regions exceeded the TIP3P-derived figures by 27–41%. The rank-ordering of residues by flexibility was preserved in two of the three systems but reorganized significantly in the third.",
            ]} />
            <FauxSection title="Discussion" paragraphs={[
              "Our results do not refute the existence of a rigidification signature — they show that the magnitude of that signature is solvent-model-dependent, and under the more accurate OPC water model, significantly smaller than previously reported.",
              "Taken together with the experimental observation of slow microsecond dynamics by single-molecule FRET at 85 °C (Schuler et al., 2023) and the systematic review of TIP3P usage in the archaeal MD literature by Volkov et al. (2025), we argue that the rigidification hypothesis in its strong form requires re-examination before it is used to inform new de novo designs.",
            ]} />
          </div>

          {/* Citations section */}
          <div className="mt-10 pt-6 border-t border-zinc-200">
            <div className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500 mb-3">Key references in this paper (from your team's library)</div>
            <div className="space-y-2">
              {["p-kawamura-2024", "p-schuler-2023", "p-dmitri-2025", "p-imoto-2023"].map((id) => {
                const p = paperById(id);
                if (!p) return null;
                return (
                  <Link key={id} href={`/reader/${id}`} className="flex items-start gap-2 text-xs bg-zinc-50 hover:bg-brand-50 border border-zinc-200 hover:border-brand-300 rounded-md p-2.5 transition-colors">
                    <FileText className="w-3.5 h-3.5 text-brand-600 mt-0.5" />
                    <div>
                      <div className="font-medium">{p.title}</div>
                      <div className="text-[10px] text-zinc-500 mt-0.5">{p.venue} · {p.year}</div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function renderAbstractWithHighlights(text: string, anns: ReturnType<typeof annotationsFor>, active: string | null, setActive: (id: string | null) => void) {
  // naively replace annotated quotes with highlight span
  let result: (string | { text: string; annId: string; tone: string })[] = [text];
  for (const a of anns) {
    const next: typeof result = [];
    for (const chunk of result) {
      if (typeof chunk !== "string") { next.push(chunk); continue; }
      const idx = chunk.indexOf(a.quote);
      if (idx >= 0) {
        next.push(chunk.slice(0, idx));
        next.push({ text: a.quote, annId: a.id, tone: a.isContradictionHighlight ? "bg-rose-100 border-b-2 border-rose-400" : "bg-amber-100 border-b-2 border-amber-400" });
        next.push(chunk.slice(idx + a.quote.length));
      } else {
        next.push(chunk);
      }
    }
    result = next;
  }
  return (
    <>
      {result.map((c, i) =>
        typeof c === "string" ? <React.Fragment key={i}>{c}</React.Fragment> :
          <mark
            key={i}
            onClick={() => setActive(c.annId)}
            className={cn("cursor-pointer px-0.5 rounded-sm", c.tone, active === c.annId ? "ring-2 ring-brand-400 ring-offset-1" : "")}
          >{c.text}</mark>
      )}
    </>
  );
}

function FauxSection({ title, paragraphs }: { title: string; paragraphs: string[] }) {
  return (
    <section>
      <h2 className="text-lg font-bold text-zinc-900 mb-3">{title}</h2>
      <div className="space-y-4">
        {paragraphs.map((p, i) => <p key={i}>{p}</p>)}
      </div>
    </section>
  );
}
