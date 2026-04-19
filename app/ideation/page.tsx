"use client";
import * as React from "react";
import Link from "next/link";
import { FlaskConical, Plus, Users, ArrowRight, AlertTriangle } from "lucide-react";
import { ideationSessions, hypotheses } from "@/lib/mock-data/hypotheses";
import { useStore } from "@/lib/store";
import { team } from "@/lib/mock-data/team";
import { authors } from "@/lib/mock-data/authors";
import { initials, cn, formatRelative } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export default function IdeationListPage() {
  const setSurface = useStore((s) => s.setSurface);
  React.useEffect(() => setSurface({ surface: "ideation" }), [setSurface]);
  return (
    <div className="px-8 py-6 max-w-[1200px] mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Ideation Lab</h1>
          <p className="text-sm text-zinc-600 mt-1">Real-time collaborative brainstorming. Every idea is linked to supporting and contradicting evidence.</p>
        </div>
        <button className="inline-flex items-center gap-2 px-3.5 py-2 rounded-md bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium shadow-sm">
          <Plus className="w-4 h-4" /> Start session
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {ideationSessions.map((s) => {
          const hs = hypotheses.filter((h) => s.hypotheses.includes(h.id));
          const contradicted = hs.filter((h) => h.contradictingPapers.length > 0).length;
          return (
            <Link key={s.id} href={`/ideation/${s.id}`} className="group bg-white border border-zinc-200 rounded-xl p-5 hover:border-brand-300 transition-all">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
                  <FlaskConical className="w-4 h-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-zinc-900 leading-tight">{s.title}</h3>
                    {s.active ? <Badge variant="success" className="text-[9px]">active</Badge> : null}
                  </div>
                  <p className="text-[11px] text-zinc-600 mt-1.5 line-clamp-2 italic">{s.research}</p>
                  <div className="mt-3 flex items-center gap-3 text-[10px] text-zinc-500">
                    <span><strong className="text-zinc-900">{hs.length}</strong> hypotheses</span>
                    {contradicted > 0 ? <span className="text-rose-700"><AlertTriangle className="w-2.5 h-2.5 inline mr-0.5" />{contradicted} with contradictions</span> : null}
                    <span>started {formatRelative(s.startedAt)}</span>
                  </div>
                  <div className="mt-3 flex items-center gap-1.5">
                    <Users className="w-3 h-3 text-zinc-400" />
                    <div className="flex -space-x-1.5">
                      {s.participants.map((mid) => {
                        const m = team.find((t) => t.id === mid)!;
                        const a = authors.find((x) => x.id === m.authorId)!;
                        return <div key={mid} className={cn("w-5 h-5 rounded-full ring-2 ring-white text-[8px] font-semibold text-white flex items-center justify-center", m.color)}>{initials(a.name)}</div>;
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
