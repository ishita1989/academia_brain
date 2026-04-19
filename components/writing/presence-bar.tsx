"use client";
import * as React from "react";
import type { Notebook } from "@/lib/types";
import { team } from "@/lib/mock-data/team";
import { authors } from "@/lib/mock-data/authors";
import { cn, initials } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";

const roleLabel = (r: string) => r[0].toUpperCase() + r.slice(1);

export function PresenceBar({ notebook }: { notebook: Notebook }) {
  return (
    <div className="flex items-center gap-2 text-[11px] text-zinc-500">
      <span className="inline-flex items-center gap-1">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
        <span className="font-medium text-emerald-700">Live</span>
      </span>
      <div className="flex -space-x-1.5">
        {notebook.collaborators.map((c) => {
          const m = team.find((t) => t.id === c.memberId);
          const a = m ? authors.find((x) => x.id === m.authorId) : null;
          if (!m || !a) return null;
          const isEditing = c.memberId === "m-marcus";
          return (
            <Tooltip key={c.memberId}>
              <TooltipTrigger asChild>
                <div className="relative">
                  <div className={cn("w-7 h-7 rounded-full ring-2 ring-white text-[10px] font-semibold text-white flex items-center justify-center", m.color, c.status === "invited" ? "opacity-50" : "")}>
                    {initials(a.name)}
                  </div>
                  {isEditing ? <div className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white animate-pulse" /> : null}
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <div className="font-medium">{a.name}</div>
                <div className="text-[10px] text-zinc-300 mt-0.5">
                  {roleLabel(c.role)} · {c.scope} · {c.status === "invited" ? "invite pending" : isEditing ? "editing block b-aim3-goal" : "idle"}
                </div>
              </TooltipContent>
            </Tooltip>
          );
        })}
      </div>
      <span className="text-zinc-400">·</span>
      <span><strong className="text-emerald-700">Marcus</strong> editing b-aim3-goal</span>
      {notebook.collaborators.some((c) => c.status === "invited") ? (
        <>
          <span className="text-zinc-400">·</span>
          <Badge variant="warn" className="text-[9px]">1 invite pending</Badge>
        </>
      ) : null}
    </div>
  );
}
