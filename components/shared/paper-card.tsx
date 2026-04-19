"use client";
import * as React from "react";
import Link from "next/link";
import { BookOpen, ExternalLink } from "lucide-react";
import type { Paper } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const disciplineColors: Record<string, string> = {
  biophysics: "bg-indigo-50 text-indigo-700",
  cs: "bg-violet-50 text-violet-700",
  biochem: "bg-amber-50 text-amber-700",
  microbio: "bg-emerald-50 text-emerald-700",
  materials: "bg-rose-50 text-rose-700",
};

export function PaperCard({ paper, compact }: { paper: Paper; compact?: boolean }) {
  return (
    <Link
      href={`/reader/${paper.id}`}
      className="group block bg-white border border-zinc-200 rounded-lg p-3 hover:border-brand-300 hover:shadow-sm transition-all"
    >
      <div className="flex items-start gap-2">
        <div className="w-8 h-8 rounded-md bg-zinc-100 text-zinc-600 flex items-center justify-center shrink-0 group-hover:bg-brand-50 group-hover:text-brand-600 transition-colors">
          <BookOpen className="w-4 h-4" />
        </div>
        <div className="flex-1 min-w-0">
          <div className={cn("font-medium text-zinc-900 leading-snug", compact ? "text-xs line-clamp-2" : "text-sm")}>
            {paper.title}
          </div>
          <div className="mt-1 text-[11px] text-zinc-500 flex items-center gap-1.5 flex-wrap">
            <span className="font-medium">{paper.venue}</span>
            <span>·</span>
            <span>{paper.year}</span>
            <span>·</span>
            <a href={paper.externalUrl} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="inline-flex items-center gap-0.5 hover:text-brand-600">
              {paper.externalId}
              <ExternalLink className="w-2.5 h-2.5" />
            </a>
          </div>
          {!compact ? (
            <div className="mt-2 flex flex-wrap gap-1">
              {paper.disciplines.slice(0, 3).map((d) => (
                <span key={d} className={cn("text-[9px] px-1.5 py-0.5 rounded-full font-medium uppercase tracking-wide", disciplineColors[d])}>{d}</span>
              ))}
              {paper.confidence < 0.7 ? <Badge variant="warn" className="text-[9px]">contested</Badge> : null}
              {paper.replicated ? <Badge variant="success" className="text-[9px]">replicated</Badge> : null}
            </div>
          ) : null}
        </div>
      </div>
    </Link>
  );
}
