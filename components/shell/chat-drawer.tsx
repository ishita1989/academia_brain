"use client";
import * as React from "react";
import Link from "next/link";
import { ArrowRight, Brain, ChevronRight, MessageSquareMore, Mic, PanelRightClose, PanelRightOpen, Send, Sparkles, FileText, Lightbulb, History } from "lucide-react";
import { VoiceModeButton } from "./voice-mode";
import { useStore, askBrain } from "@/lib/store";
import { cn } from "@/lib/utils";
import { paperById } from "@/lib/mock-data/papers";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { decisions } from "@/lib/mock-data/decisions";

export function ChatDrawer() {
  const open = useStore((s) => s.chatOpen);
  const setOpen = useStore((s) => s.setChatOpen);
  const mode = useStore((s) => s.chatMode);
  const setMode = useStore((s) => s.setChatMode);
  const messages = useStore((s) => s.messages);
  const surface = useStore((s) => s.surface);
  const streaming = useStore((s) => s.streamingText);
  const [input, setInput] = React.useState("");
  const scrollRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages.length, streaming]);

  const submit = async (text?: string) => {
    const t = (text ?? input).trim();
    if (!t) return;
    setInput("");
    await askBrain(t, surface.surface ?? undefined);
  };

  const contextHeader = React.useMemo(() => {
    if (!surface.surface) return "Asking the Brain";
    const pretty: Record<string, string> = {
      dashboard: "Dashboard",
      synthesis: "Synthesis",
      ideation: "Ideation",
      writing: "Notebook",
      graph: "Graph",
      reader: "Reading",
      onboarding: "Onboarding",
    };
    return `${pretty[surface.surface]}${surface.entityLabel ? `: ${surface.entityLabel}` : ""}`;
  }, [surface]);

  if (!open) {
    return (
      <div className="fixed right-0 top-14 bottom-0 w-12 bg-white border-l border-zinc-200 flex flex-col items-center py-4 gap-3 z-20">
        <button
          onClick={() => setOpen(true)}
          className="w-8 h-8 rounded-lg gradient-brand flex items-center justify-center shadow-sm hover:shadow-md transition-shadow"
          aria-label="Open Ask the Brain"
        >
          <Brain className="w-4 h-4 text-white" />
        </button>
        <div className="text-[10px] text-zinc-400 [writing-mode:vertical-rl] tracking-wider mt-2">ASK THE BRAIN</div>
      </div>
    );
  }

  return (
    <div className="fixed right-0 top-14 bottom-0 w-[380px] bg-white border-l border-zinc-200 flex flex-col z-20">
      {/* Header */}
      <div className="px-4 py-3 border-b border-zinc-100">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-md gradient-brand flex items-center justify-center">
            <Brain className="w-3.5 h-3.5 text-white" />
          </div>
          <div className="leading-tight flex-1 min-w-0">
            <div className="text-[11px] text-zinc-500 font-medium uppercase tracking-wide">Grounded in</div>
            <div className="text-sm font-semibold truncate">{contextHeader}</div>
          </div>
          <button onClick={() => setOpen(false)} className="text-zinc-400 hover:text-zinc-700" aria-label="Collapse">
            <PanelRightClose className="w-4 h-4" />
          </button>
        </div>
        <Tabs value={mode} onValueChange={(v) => setMode(v as any)} className="mt-3">
          <TabsList className="w-full grid grid-cols-3 h-8">
            <TabsTrigger value="ask" className="gap-1 text-[11px]"><MessageSquareMore className="w-3 h-3" />Ask</TabsTrigger>
            <TabsTrigger value="suggest" className="gap-1 text-[11px]"><Lightbulb className="w-3 h-3" />Suggest</TabsTrigger>
            <TabsTrigger value="decide" className="gap-1 text-[11px]"><History className="w-3 h-3" />Decide</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Body */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto scrollbar-thin px-4 py-4 space-y-4">
        {mode === "decide" ? <DecideMode /> : mode === "suggest" ? <SuggestMode /> : (
          <>
            {messages.map((m) => (
              <Message key={m.id} m={m} onFollowup={submit} />
            ))}
            {streaming !== null ? (
              <div className="bg-brand-50/50 border border-brand-100 rounded-xl p-3">
                <div className="flex items-center gap-1.5 mb-1.5">
                  <Brain className="w-3.5 h-3.5 text-brand-600" />
                  <div className="text-[11px] font-semibold text-brand-700">Brain</div>
                  <div className="flex gap-0.5 ml-1">
                    <span className="w-1 h-1 rounded-full bg-brand-400 animate-bounce" />
                    <span className="w-1 h-1 rounded-full bg-brand-400 animate-bounce [animation-delay:120ms]" />
                    <span className="w-1 h-1 rounded-full bg-brand-400 animate-bounce [animation-delay:240ms]" />
                  </div>
                </div>
                <div className="text-sm leading-relaxed text-zinc-800 whitespace-pre-wrap">{streaming}<span className="inline-block w-1 h-3 bg-brand-500 ml-0.5 animate-pulse" /></div>
              </div>
            ) : null}
          </>
        )}
      </div>

      {/* Input */}
      {mode !== "decide" ? (
        <div className="border-t border-zinc-100 p-3">
          <div className="relative">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  submit();
                }
              }}
              placeholder={mode === "suggest" ? "What do you want suggestions on?" : "Ask anything grounded in your team's brain…"}
              className="w-full text-sm bg-zinc-50 border border-zinc-200 rounded-lg pl-3 pr-[72px] py-2.5 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-transparent"
            />
            <div className="absolute right-1.5 top-1/2 -translate-y-1/2 flex items-center gap-1">
              <VoiceModeButton variant="inline" />
              <button
                onClick={() => submit()}
                className="w-7 h-7 rounded-md bg-brand-600 hover:bg-brand-700 text-white flex items-center justify-center transition-colors"
                aria-label="Send"
              >
                <Send className="w-3 h-3" />
              </button>
            </div>
          </div>
          <div className="mt-2 text-[10px] text-zinc-400 leading-relaxed">
            <Sparkles className="w-2.5 h-2.5 inline align-text-top mr-1 text-brand-500" />
            Grounded in 432 team papers — responses are cited. Voice + memory across sessions.
          </div>
        </div>
      ) : null}
    </div>
  );
}

function Message({ m, onFollowup }: { m: { role: string; content: string; citations?: any[]; followups?: string[] }; onFollowup: (t: string) => void }) {
  if (m.role === "user") {
    return (
      <div className="flex justify-end">
        <div className="max-w-[85%] bg-zinc-900 text-white rounded-2xl rounded-br-md px-3.5 py-2 text-sm leading-relaxed">
          {m.content}
        </div>
      </div>
    );
  }
  return (
    <div className="bg-brand-50/50 border border-brand-100 rounded-xl p-3">
      <div className="flex items-center gap-1.5 mb-1.5">
        <Brain className="w-3.5 h-3.5 text-brand-600" />
        <div className="text-[11px] font-semibold text-brand-700">Brain</div>
        {m.role === "brain" && (m as any).mode === "decide" ? <Badge variant="brand" className="text-[9px]">Decision</Badge> : null}
      </div>
      <div className="text-sm leading-relaxed text-zinc-800 whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: formatBrainContent(m.content) }} />
      {m.citations?.length ? (
        <div className="mt-3 pt-3 border-t border-brand-100/60">
          <div className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wide mb-1.5">Sources ({m.citations.length})</div>
          <div className="space-y-1.5">
            {m.citations.map((c, i) => {
              const p = paperById(c.paperId);
              if (!p) return null;
              return (
                <Link key={i} href={`/reader/${p.id}`} className="group flex items-start gap-2 text-xs bg-white hover:bg-brand-50 border border-zinc-200 rounded-md p-2 transition-colors">
                  <FileText className="w-3 h-3 text-brand-600 mt-0.5 shrink-0" />
                  <div className="min-w-0">
                    <div className="font-medium text-zinc-800 truncate">{p.title}</div>
                    <div className="text-zinc-500 text-[10px] mt-0.5">{p.venue} {p.year} · p.{c.page} · "{c.sentence.slice(0, 60)}…"</div>
                  </div>
                  <ChevronRight className="w-3 h-3 text-zinc-300 group-hover:text-brand-600 mt-0.5" />
                </Link>
              );
            })}
          </div>
        </div>
      ) : null}
      {m.followups?.length ? (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {m.followups.map((f) => (
            <button
              key={f}
              onClick={() => onFollowup(f)}
              className="text-[11px] bg-white border border-zinc-200 hover:border-brand-300 hover:bg-brand-50 text-zinc-700 hover:text-brand-700 rounded-full px-2.5 py-1 transition-colors"
            >
              {f}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function formatBrainContent(s: string): string {
  // Bold **x**, links [t](u), escape <>
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold text-zinc-900">$1</strong>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-brand-700 underline decoration-dotted">$1</a>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>');
}

function DecideMode() {
  return (
    <div className="space-y-3">
      <div className="text-[11px] text-zinc-500">
        <Sparkles className="inline w-3 h-3 mr-1" />
        Decision archaeology — every methodological choice your lab has made, with rationale and alternatives considered.
      </div>
      {decisions.slice(0, 6).map((d) => (
        <Link
          key={d.id}
          href={`/dashboard#${d.id}`}
          className="block bg-white border border-zinc-200 rounded-lg p-3 hover:border-brand-300 transition-colors"
        >
          <div className="text-xs text-zinc-500 mb-0.5">{d.decidedAt}</div>
          <div className="text-sm font-semibold text-zinc-900 leading-tight">{d.question}</div>
          <div className="mt-1 text-xs text-zinc-700 line-clamp-2">{d.rationale}</div>
          <div className="mt-2 flex items-center gap-1">
            <Badge variant="brand" className="text-[9px]">{d.choice}</Badge>
            <span className="text-[10px] text-zinc-400">· {d.alternatives.length} alternatives considered</span>
          </div>
        </Link>
      ))}
    </div>
  );
}

function SuggestMode() {
  const surface = useStore((s) => s.surface);
  const suggestions = React.useMemo(() => {
    const base = [
      { title: "Draft a TIP3P reviewer rebuttal", detail: "Based on Volkov 2025 + Imoto 2023 — pre-empts the biggest reviewer-2 concern on the R01." },
      { title: "Promote H-2 to experiment plan", detail: "Hypothesis H-2 has 3 supports and 1 contradiction. Ready for experimental design." },
      { title: "Propose a cross-disciplinary hypothesis from Rocha 2024", detail: "Materials-science activation-energy framework, transferable to enzyme denaturation." },
      { title: "Generate a Significance paragraph for NSF MCB", detail: "The NSF MCB call deadline is 2026-06-15; your R01 notebook already covers 4 of the 6 priority topics." },
    ];
    return base;
  }, [surface.surface]);

  return (
    <div className="space-y-3">
      <div className="text-[11px] text-zinc-500">
        <Sparkles className="inline w-3 h-3 mr-1" />
        Proactive suggestions for your current context.
      </div>
      {suggestions.map((s, i) => (
        <div key={i} className="bg-white border border-zinc-200 rounded-lg p-3 hover:border-brand-300 transition-colors">
          <div className="flex items-start gap-2">
            <div className="w-6 h-6 rounded-md bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
              <Lightbulb className="w-3.5 h-3.5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-zinc-900 leading-tight">{s.title}</div>
              <div className="text-xs text-zinc-600 mt-1 leading-relaxed">{s.detail}</div>
              <button className="mt-2 text-[11px] text-brand-700 font-medium inline-flex items-center gap-1 hover:underline">
                Accept <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
