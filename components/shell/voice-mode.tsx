"use client";
import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, MicOff, Sparkles, X, Check, Waves } from "lucide-react";
import { useStore, askBrain } from "@/lib/store";
import { cn } from "@/lib/utils";

// A small library of voice prompts the user can choose from during the demo.
// Picked so they exercise each chat-drawer behavior (decide, ask, suggest).
const SUGGESTED_PROMPTS = [
  "Why did we pick MD over Rosetta?",
  "What does Chen 2026 contradict?",
  "What don't I know?",
  "Summarize today's alerts",
  "What should I cite for Aim 2?",
];

export function VoiceModeButton({ variant = "toolbar" }: { variant?: "toolbar" | "inline" }) {
  const [open, setOpen] = React.useState(false);
  const isInline = variant === "inline";
  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className={cn(
          "relative rounded-md flex items-center justify-center transition-colors",
          isInline
            ? "w-7 h-7 text-zinc-400 hover:text-brand-700 hover:bg-white"
            : "w-9 h-9 text-zinc-600 hover:bg-zinc-100 hover:text-brand-700",
        )}
        aria-label="Voice mode"
        title="Voice mode"
      >
        <Mic className={isInline ? "w-3.5 h-3.5" : "w-4 h-4"} />
        {!isInline ? (
          <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-emerald-500 ring-2 ring-white" />
        ) : null}
      </button>
      <AnimatePresence>{open ? <VoiceModal onClose={() => setOpen(false)} /> : null}</AnimatePresence>
    </>
  );
}

type Phase = "listening" | "transcribing" | "sending";

function VoiceModal({ onClose }: { onClose: () => void }) {
  const surface = useStore((s) => s.surface);
  const setChatOpen = useStore((s) => s.setChatOpen);
  const [phase, setPhase] = React.useState<Phase>("listening");
  const [transcript, setTranscript] = React.useState("");
  const [chosenPrompt, setChosenPrompt] = React.useState<string | null>(null);
  const [muted, setMuted] = React.useState(false);

  // Fake "listening" → pick a prompt → stream it as a transcript → send to brain
  React.useEffect(() => {
    if (phase !== "listening") return;
    if (!chosenPrompt) return;
    setPhase("transcribing");
    let i = 0;
    const interval = setInterval(() => {
      i += 2;
      setTranscript(chosenPrompt.slice(0, i));
      if (i >= chosenPrompt.length) {
        clearInterval(interval);
        setTimeout(async () => {
          setPhase("sending");
          setChatOpen(true);
          await new Promise((r) => setTimeout(r, 400));
          await askBrain(chosenPrompt, surface.surface ?? undefined);
          onClose();
        }, 500);
      }
    }, 35);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chosenPrompt, phase]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 bg-zinc-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-6"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 10 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-8 relative overflow-hidden"
      >
        {/* Ambient gradient background */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-brand-50/60 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-violet-50/60 to-transparent" />
        </div>

        <button onClick={onClose} className="absolute top-5 right-5 text-zinc-400 hover:text-zinc-700 z-10">
          <X className="w-4 h-4" />
        </button>

        {/* Status pill */}
        <div className="relative flex items-center gap-1.5 mb-5">
          <span className={cn("inline-block w-2 h-2 rounded-full", phase === "listening" ? "bg-emerald-500 animate-pulse" : phase === "transcribing" ? "bg-amber-500 animate-pulse" : "bg-brand-500 animate-pulse")} />
          <div className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
            {phase === "listening" ? "Listening…" : phase === "transcribing" ? "Transcribing" : "Sending to Brain…"}
          </div>
          <div className="ml-auto text-[10px] text-zinc-400">
            Grounded in {surface.surface ? surface.surface : "Research Brain"}
          </div>
        </div>

        {/* Orbiting visual */}
        <div className="relative flex flex-col items-center py-6">
          <div className="relative">
            {/* Concentric pulses */}
            {phase !== "sending" ? (
              <>
                <span className="absolute inset-0 rounded-full bg-brand-400 opacity-20 animate-ping" style={{ animationDuration: "2s" }} />
                <span className="absolute inset-0 rounded-full bg-brand-400 opacity-10 animate-ping" style={{ animationDuration: "2s", animationDelay: "0.6s" }} />
              </>
            ) : null}
            <button
              onClick={() => setMuted(!muted)}
              className={cn(
                "relative w-24 h-24 rounded-full flex items-center justify-center shadow-xl transition-all",
                muted ? "bg-zinc-300 text-zinc-600" : "gradient-brand text-white",
              )}
            >
              {muted ? <MicOff className="w-9 h-9" /> : <Mic className="w-9 h-9" />}
            </button>
          </div>

          {/* Waveform / transcript */}
          <div className="mt-7 min-h-[48px] flex items-center justify-center w-full">
            {phase === "listening" && !chosenPrompt ? (
              <Waveform />
            ) : (
              <div className="text-lg font-medium text-zinc-900 text-center leading-snug px-2">
                {transcript || "…"}
                {phase === "transcribing" ? <span className="inline-block w-0.5 h-4 bg-brand-500 ml-1 animate-pulse align-middle" /> : null}
              </div>
            )}
          </div>
        </div>

        {/* Suggestions (only while listening) */}
        {phase === "listening" && !chosenPrompt ? (
          <div className="relative">
            <div className="text-[10px] uppercase tracking-wider font-semibold text-zinc-500 text-center mb-3">Try saying</div>
            <div className="space-y-1.5">
              {SUGGESTED_PROMPTS.map((p) => (
                <button
                  key={p}
                  onClick={() => setChosenPrompt(p)}
                  className="w-full text-left bg-white/80 hover:bg-brand-50 border border-zinc-200 hover:border-brand-300 rounded-lg px-3 py-2 text-sm transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-brand-500 shrink-0" />
                    <span className="font-medium">"{p}"</span>
                  </div>
                </button>
              ))}
            </div>
            <div className="mt-4 text-center text-[11px] text-zinc-500">
              <Mic className="w-3 h-3 inline mr-1" />
              Speak naturally, or pick a prompt above.
            </div>
          </div>
        ) : phase === "transcribing" ? (
          <div className="relative text-center">
            <div className="text-[10px] uppercase tracking-wider font-semibold text-zinc-500 mb-2">Recognized in your voice</div>
            <div className="text-[11px] text-zinc-500">Click anywhere to cancel.</div>
          </div>
        ) : (
          <div className="relative text-center">
            <div className="flex items-center justify-center gap-1.5 text-sm text-emerald-700 font-medium">
              <Check className="w-3.5 h-3.5" /> Sent to the Brain
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

function Waveform() {
  // Animated bars that mimic a microphone waveform.
  const bars = Array.from({ length: 22 }, (_, i) => i);
  return (
    <div className="flex items-end gap-[3px] h-10">
      {bars.map((i) => (
        <motion.span
          key={i}
          className="w-1 rounded-full bg-gradient-to-t from-brand-500 to-violet-400"
          animate={{ height: ["20%", "100%", "40%", "80%", "30%"] }}
          transition={{ duration: 0.9 + (i % 5) * 0.1, repeat: Infinity, delay: i * 0.04 }}
        />
      ))}
    </div>
  );
}
