"use client";
import * as React from "react";
import Link from "next/link";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { paperById } from "@/lib/mock-data/papers";
import type { Citation } from "@/lib/types";
import { BookOpen, ExternalLink } from "lucide-react";

export function CitationPopover({ citations, children }: { citations: Citation[]; children: React.ReactNode }) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <span className="cursor-pointer bg-brand-50/60 hover:bg-brand-100/80 border-b border-dotted border-brand-400 transition-colors">
          {children}
        </span>
      </PopoverTrigger>
      <PopoverContent className="w-96" align="start">
        <div className="text-[10px] uppercase tracking-wide text-zinc-500 font-semibold mb-2">Citations ({citations.length})</div>
        <div className="space-y-2">
          {citations.map((c, i) => {
            const p = paperById(c.paperId);
            if (!p) return null;
            return (
              <Link
                key={i}
                href={`/reader/${p.id}`}
                className="block bg-zinc-50 hover:bg-brand-50 border border-zinc-200 hover:border-brand-300 rounded-md p-2.5 transition-colors"
              >
                <div className="flex items-start gap-2">
                  <BookOpen className="w-3.5 h-3.5 text-brand-600 mt-0.5 shrink-0" />
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-medium text-zinc-900 leading-snug">{p.title}</div>
                    <div className="text-[10px] text-zinc-500 mt-1 flex items-center gap-1">
                      <span>{p.venue} · {p.year}</span>
                      <span>· p.{c.page}</span>
                      <a href={p.externalUrl} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="inline-flex items-center gap-0.5 hover:text-brand-600 ml-auto">
                        {p.externalId.split(" ").slice(0, 2).join(" ")}
                        <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    </div>
                    <div className="mt-1.5 text-[11px] text-zinc-700 italic border-l-2 border-brand-300 pl-2">"{c.sentence}"</div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
}
