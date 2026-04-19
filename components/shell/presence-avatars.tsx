"use client";
import * as React from "react";
import { authors } from "@/lib/mock-data/authors";
import { initials, cn } from "@/lib/utils";
import type { TeamMember } from "@/lib/types";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";

export function PresenceAvatars({ members, label }: { members: TeamMember[]; label?: string }) {
  return (
    <div className="flex items-center gap-2">
      {label ? (
        <span className="text-[11px] text-zinc-500 font-medium inline-flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          {label}
        </span>
      ) : null}
      <div className="flex -space-x-1.5">
        {members.map((m) => {
          const a = authors.find((x) => x.id === m.authorId)!;
          return (
            <Tooltip key={m.id}>
              <TooltipTrigger asChild>
                <div
                  className={cn(
                    "w-7 h-7 rounded-full ring-2 ring-white text-[10px] font-semibold text-white flex items-center justify-center",
                    m.color,
                  )}
                >
                  {initials(a.name)}
                </div>
              </TooltipTrigger>
              <TooltipContent>
                {a.name} · {m.role}
              </TooltipContent>
            </Tooltip>
          );
        })}
      </div>
    </div>
  );
}
