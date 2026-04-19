"use client";
import * as React from "react";
import { Search, Command, MessageSquareMore, Bell } from "lucide-react";
import { useStore } from "@/lib/store";
import { PresenceAvatars } from "./presence-avatars";
import { team } from "@/lib/mock-data/team";
import { Button } from "@/components/ui/button";
import { VoiceModeButton } from "./voice-mode";

export function Topbar() {
  const setPaletteOpen = useStore((s) => s.setPaletteOpen);
  const toggleChat = useStore((s) => s.toggleChat);
  const chatOpen = useStore((s) => s.chatOpen);
  return (
    <header className="h-14 bg-white border-b border-zinc-200 flex items-center gap-3 px-5 shrink-0">
      <button
        onClick={() => setPaletteOpen(true)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-100 hover:bg-zinc-200 transition-colors text-xs text-zinc-500 w-[320px]"
      >
        <Search className="w-3.5 h-3.5" />
        Search papers, syntheses, hypotheses…
        <span className="ml-auto inline-flex items-center gap-1 text-[10px] text-zinc-400">
          <Command className="w-3 h-3" /> K
        </span>
      </button>

      <div className="ml-auto flex items-center gap-3">
        <PresenceAvatars members={team.filter((m) => ["m-hiro", "m-marcus", "m-zara"].includes(m.id))} label="Live in lab" />
        <VoiceModeButton />
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500" />
        </Button>
        <Button
          variant={chatOpen ? "default" : "outline"}
          size="sm"
          onClick={toggleChat}
          className="gap-1.5"
        >
          <MessageSquareMore className="w-3.5 h-3.5" />
          Ask the Brain
        </Button>
      </div>
    </header>
  );
}
