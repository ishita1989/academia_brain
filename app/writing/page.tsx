"use client";
import * as React from "react";
import Link from "next/link";
import { NotebookPen, Plus, Users, FileText, MessageCircle, Bookmark, AlertTriangle } from "lucide-react";
import { notebooks } from "@/lib/mock-data/notebooks";
import { useStore } from "@/lib/store";
import { team } from "@/lib/mock-data/team";
import { authors } from "@/lib/mock-data/authors";
import { initials, cn, formatRelative } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";

const modes = [
  { id: "manuscript", label: "Manuscript", description: "Free-form writing with reference manager" },
  { id: "r01", label: "NIH R01", description: "Specific Aims, Significance, Innovation, Approach pre-seeded" },
  { id: "nsf", label: "NSF", description: "Intellectual Merit, Broader Impacts" },
  { id: "erc", label: "ERC", description: "PI Track Record, High-Risk/High-Gain" },
  { id: "peer-review", label: "Peer-Review Response", description: "Upload reviewer letter, brain drafts responses" },
  { id: "protocol", label: "Lab Protocol", description: "Step blocks, reagents, equipment, safety" },
  { id: "lit-review", label: "Literature Review", description: "Structured review from a synthesis" },
  { id: "experiment-plan", label: "Experiment Plan", description: "Derived from a hypothesis card" },
];

export default function NotebookHomePage() {
  const setSurface = useStore((s) => s.setSurface);
  const [creating, setCreating] = React.useState(false);
  React.useEffect(() => setSurface({ surface: "writing" }), [setSurface]);
  return (
    <div className="px-8 py-6 max-w-[1200px] mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Notebook</h1>
          <p className="text-sm text-zinc-600 mt-1">Collaborative research notebooks. Block-based. Attributable. AI as a first-class contributor.</p>
        </div>
        <button onClick={() => setCreating(true)} className="inline-flex items-center gap-2 px-3.5 py-2 rounded-md bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium shadow-sm">
          <Plus className="w-4 h-4" /> New notebook
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {notebooks.map((n) => {
          const commentCount = n.comments.filter((c) => !c.resolved).length;
          const contradictions = n.blocks.filter((b) => b.flag === "contradiction").length;
          return (
            <Link key={n.id} href={`/writing/${n.id}`} className="group bg-white border border-zinc-200 rounded-xl p-5 hover:border-brand-300 hover:shadow-sm transition-all">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-9 h-9 rounded-lg bg-violet-50 text-violet-700 flex items-center justify-center shrink-0">
                  <NotebookPen className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <Badge variant="secondary" className="text-[9px] uppercase">{n.mode}</Badge>
                  <h3 className="font-semibold text-zinc-900 leading-tight mt-1.5">{n.title}</h3>
                </div>
              </div>
              <p className="text-[11px] text-zinc-600 line-clamp-3 leading-relaxed mb-3">{n.description}</p>
              <div className="flex items-center gap-1.5 mb-3 flex-wrap text-[10px]">
                <span className="inline-flex items-center gap-1 text-zinc-600"><FileText className="w-3 h-3" />{n.blocks.length} blocks</span>
                {commentCount > 0 ? <span className="inline-flex items-center gap-1 text-brand-700 font-medium"><MessageCircle className="w-3 h-3" />{commentCount}</span> : null}
                {contradictions > 0 ? <span className="inline-flex items-center gap-1 text-rose-700 font-medium"><AlertTriangle className="w-3 h-3" />{contradictions}</span> : null}
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <div className="flex -space-x-1.5">
                    {n.collaborators.map((c) => {
                      const m = team.find((t) => t.id === c.memberId)!;
                      const a = authors.find((x) => x.id === m.authorId)!;
                      return <div key={c.memberId} className={cn("w-5 h-5 rounded-full ring-2 ring-white text-[8px] font-semibold text-white flex items-center justify-center", m.color, c.status === "invited" ? "opacity-60" : "")}>{initials(a.name)}</div>;
                    })}
                  </div>
                  <span className="text-[10px] text-zinc-500">{n.collaborators.length} collaborators</span>
                </div>
                <span className="text-[10px] text-zinc-500">{formatRelative(n.updatedAt)}</span>
              </div>
            </Link>
          );
        })}

        <button onClick={() => setCreating(true)} className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-zinc-300 hover:border-brand-400 hover:bg-brand-50/40 rounded-xl p-5 min-h-[180px] text-zinc-500 hover:text-brand-700 transition-all">
          <Plus className="w-6 h-6" />
          <div className="text-sm font-medium">New notebook</div>
          <div className="text-[10px] text-zinc-400">Manuscript · Grant · Protocol · Peer-review…</div>
        </button>
      </div>

      <Dialog open={creating} onOpenChange={setCreating}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create a new notebook</DialogTitle>
            <DialogDescription>Pick a starting mode. The brain will pre-seed the right block structure and tailor its suggestions.</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
            {modes.map((m) => (
              <button key={m.id} onClick={() => setCreating(false)} className="text-left bg-white border border-zinc-200 hover:border-brand-300 hover:bg-brand-50/40 rounded-lg p-3 transition-all">
                <div className="text-xs font-semibold text-zinc-900">{m.label}</div>
                <div className="text-[11px] text-zinc-600 mt-0.5 leading-snug">{m.description}</div>
              </button>
            ))}
          </div>
          <DialogFooter>
            <button onClick={() => setCreating(false)} className="px-4 py-2 text-sm text-zinc-600 hover:text-zinc-900">Cancel</button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
