"use client";
import { create } from "zustand";
import type { ChatMessage, SurfaceContext } from "./types";
import { findScript, seededOpeningMessages } from "./mock-data/chat-scripts";

interface BrainStore {
  // Chat
  chatOpen: boolean;
  setChatOpen: (v: boolean) => void;
  toggleChat: () => void;
  chatMode: "ask" | "suggest" | "decide";
  setChatMode: (m: "ask" | "suggest" | "decide") => void;
  messages: ChatMessage[];
  addMessage: (m: ChatMessage) => void;
  setMessagesForSurface: (surface: keyof typeof seededOpeningMessages) => void;
  streamingText: string | null;
  setStreamingText: (t: string | null) => void;

  // Surface context
  surface: SurfaceContext;
  setSurface: (s: SurfaceContext) => void;

  // Votes persisted locally
  votes: Record<string, 1 | -1>;
  setVote: (hypothesisId: string, value: 1 | -1 | null) => void;

  // Command palette
  paletteOpen: boolean;
  setPaletteOpen: (v: boolean) => void;

  // Synthesis ui
  showVersionHistory: boolean;
  setShowVersionHistory: (v: boolean) => void;

  // Writing Studio ui
  writingPanel: "brain" | "comments" | "history" | "outline";
  setWritingPanel: (p: "brain" | "comments" | "history" | "outline") => void;
  inviteModalOpen: boolean;
  setInviteModalOpen: (v: boolean) => void;

  // Graph ui
  graphClusterMode: "methodology" | "finding" | "approach";
  setGraphClusterMode: (m: "methodology" | "finding" | "approach") => void;
  graphOverlay: "none" | "personal" | "team";
  setGraphOverlay: (o: "none" | "personal" | "team") => void;
  graphYear: number | null;
  setGraphYear: (y: number | null) => void;
  graphShowGaps: boolean;
  setGraphShowGaps: (v: boolean) => void;
  graphShowUnknowns: boolean;
  setGraphShowUnknowns: (v: boolean) => void;

  // Onboarding flag
  onboarded: boolean;
  setOnboarded: (v: boolean) => void;
}

export const useStore = create<BrainStore>((set, get) => ({
  chatOpen: true,
  setChatOpen: (v) => set({ chatOpen: v }),
  toggleChat: () => set({ chatOpen: !get().chatOpen }),
  chatMode: "ask",
  setChatMode: (m) => set({ chatMode: m }),
  messages: seededOpeningMessages.dashboard,
  addMessage: (m) => set({ messages: [...get().messages, m] }),
  setMessagesForSurface: (surface) => {
    const seed = seededOpeningMessages[surface];
    if (seed) set({ messages: seed });
  },
  streamingText: null,
  setStreamingText: (t) => set({ streamingText: t }),

  surface: { surface: null },
  setSurface: (s) => set({ surface: s }),

  votes: {},
  setVote: (id, value) => {
    const v = { ...get().votes };
    if (value === null) delete v[id];
    else v[id] = value;
    set({ votes: v });
  },

  paletteOpen: false,
  setPaletteOpen: (v) => set({ paletteOpen: v }),

  showVersionHistory: false,
  setShowVersionHistory: (v) => set({ showVersionHistory: v }),

  writingPanel: "brain",
  setWritingPanel: (p) => set({ writingPanel: p }),
  inviteModalOpen: false,
  setInviteModalOpen: (v) => set({ inviteModalOpen: v }),

  graphClusterMode: "methodology",
  setGraphClusterMode: (m) => set({ graphClusterMode: m }),
  graphOverlay: "personal",
  setGraphOverlay: (o) => set({ graphOverlay: o }),
  graphYear: null,
  setGraphYear: (y) => set({ graphYear: y }),
  graphShowGaps: true,
  setGraphShowGaps: (v) => set({ graphShowGaps: v }),
  graphShowUnknowns: false,
  setGraphShowUnknowns: (v) => set({ graphShowUnknowns: v }),

  onboarded: true,
  setOnboarded: (v) => set({ onboarded: v }),
}));

export async function askBrain(userText: string, surface?: string) {
  const st = useStore.getState();
  const userMsg: ChatMessage = {
    id: `u-${Date.now()}`,
    role: "user",
    content: userText,
    at: new Date().toISOString(),
    surfaceContext: surface,
  };
  st.addMessage(userMsg);
  const script = findScript(userText, surface);
  // Simulate streaming
  const full = script.response;
  st.setStreamingText("");
  const chunkSize = 6;
  let i = 0;
  await new Promise((r) => setTimeout(r, 220));
  while (i < full.length) {
    i = Math.min(full.length, i + chunkSize);
    st.setStreamingText(full.slice(0, i));
    await new Promise((r) => setTimeout(r, 14));
  }
  st.setStreamingText(null);
  const brainMsg: ChatMessage = {
    id: `b-${Date.now()}`,
    role: "brain",
    content: full,
    citations: script.citations,
    followups: script.followups,
    at: new Date().toISOString(),
    mode: script.mode,
    surfaceContext: surface,
  };
  st.addMessage(brainMsg);
}
