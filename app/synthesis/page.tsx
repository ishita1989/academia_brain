"use client";
import * as React from "react";
import Link from "next/link";
import { Sparkles, Plus, AlertTriangle, Users } from "lucide-react";
import { syntheses } from "@/lib/mock-data/syntheses";
import { useStore } from "@/lib/store";
import { formatRelative, initials, cn } from "@/lib/utils";
import { team } from "@/lib/mock-data/team";
import { authors } from "@/lib/mock-data/authors";
import { Badge } from "@/components/ui/badge";

export default function SynthesisListPage() {
  const setSurface = useStore((s) => s.setSurface);
  React.useEffect(() => setSurface({ surface: "synthesis" }), [setSurface]);
  return (
    <div className="px-8 py-6 max-w-[1200px] mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Synthesis Canvas</h1>
          <p className="text-sm text-zinc-600 mt-1">Structured, citable, living summaries of your team's research questions.</p>
        </div>
        <button className="inline-flex items-center gap-2 px-3.5 py-2 rounded-md bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium shadow-sm">
          <Plus className="w-4 h-4" /> New synthesis
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {syntheses.map((s) => (
          <Link key={s.id} href={`/synthesis/${s.id}`} className="group bg-white border border-zinc-200 rounded-xl p-5 hover:border-brand-300 hover:shadow-sm transition-all">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-brand-50 text-brand-600 flex items-center justify-center">
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-zinc-900 leading-tight">{s.title}</h3>
                  {s.contradictions > 0 ? <Badge variant="warn" className="text-[9px] inline-flex items-center gap-0.5"><AlertTriangle className="w-2.5 h-2.5" />{s.contradictions}</Badge> : null}
                </div>
                <p className="text-[11px] text-zinc-600 mt-1.5 line-clamp-2 italic">{s.question}</p>
                <div className="mt-3 flex items-center gap-3 text-[10px] text-zinc-500">
                  <span><strong className="text-zinc-900">{s.paperCount}</strong> papers</span>
                  <span><strong className="text-zinc-900">{s.sections.length}</strong> sections</span>
                  <span>updated {formatRelative(s.updatedAt)}</span>
                </div>
                <div className="mt-3 flex items-center gap-1.5">
                  <Users className="w-3 h-3 text-zinc-400" />
                  <div className="flex -space-x-1.5">
                    {s.collaborators.map((mid) => {
                      const m = team.find((t) => t.id === mid)!;
                      const a = authors.find((x) => x.id === m.authorId)!;
                      return <div key={mid} className={cn("w-5 h-5 rounded-full ring-2 ring-white text-[8px] font-semibold text-white flex items-center justify-center", m.color)}>{initials(a.name)}</div>;
                    })}
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
