"use client";
import * as React from "react";
import { papers } from "@/lib/mock-data/papers";
import { PaperCard } from "@/components/shared/paper-card";
import { useStore } from "@/lib/store";
import { LibraryBig } from "lucide-react";

export default function LibraryPage() {
  const setSurface = useStore((s) => s.setSurface);
  React.useEffect(() => setSurface({ surface: null, entityLabel: "Library" }), [setSurface]);
  return (
    <div className="px-8 py-6 max-w-[1400px] mx-auto">
      <div className="mb-6">
        <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-wider text-zinc-500 mb-2">
          <LibraryBig className="w-3 h-3" /> Library
        </div>
        <h1 className="text-2xl font-bold tracking-tight">Team library</h1>
        <p className="text-sm text-zinc-600 mt-1">All papers the Kawamura Lab has processed (~{papers.length} shown here; 432 in the full brain).</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {papers.map((p) => <PaperCard key={p.id} paper={p} />)}
      </div>
    </div>
  );
}
