"use client";
import * as React from "react";
import { Sidebar } from "./sidebar";
import { Topbar } from "./topbar";
import { ChatDrawer } from "./chat-drawer";
import { CommandPalette } from "./command-palette";
import { useStore } from "@/lib/store";

export function AppShell({ children }: { children: React.ReactNode }) {
  const chatOpen = useStore((s) => s.chatOpen);
  const setPaletteOpen = useStore((s) => s.setPaletteOpen);

  React.useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setPaletteOpen(true);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [setPaletteOpen]);

  return (
    <div className="min-h-screen flex">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar />
        <div className="flex-1 flex min-h-0 overflow-hidden">
          <main className={`flex-1 overflow-auto scrollbar-thin transition-all ${chatOpen ? "mr-[380px]" : "mr-12"}`}>
            {children}
          </main>
          <ChatDrawer />
        </div>
      </div>
      <CommandPalette />
    </div>
  );
}
