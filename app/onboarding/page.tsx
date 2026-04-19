"use client";
import * as React from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, Check, ArrowRight, Upload, Users, Sparkles, BookOpen } from "lucide-react";

const steps = [
  { id: 1, title: "Welcome", subtitle: "Tell us about your research" },
  { id: 2, title: "Connect your library", subtitle: "Import from Zotero, Mendeley, or BibTeX" },
  { id: 3, title: "Join your lab brain", subtitle: "Plug into the Kawamura Lab's shared memory" },
  { id: 4, title: "First question", subtitle: "Ask the brain anything — grounded in your lab's 432 papers" },
  { id: 5, title: "You're ready", subtitle: "Jump into the dashboard" },
];

export default function OnboardingPage() {
  const [step, setStep] = React.useState(1);
  const router = useRouter();
  return (
    <div className="min-h-full flex items-center justify-center p-10 bg-gradient-to-br from-brand-50 via-white to-violet-50">
      <div className="max-w-xl w-full">
        <div className="flex items-center gap-2 mb-6 justify-center">
          <div className="w-9 h-9 rounded-lg gradient-brand flex items-center justify-center">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <div className="font-bold text-lg">Research Brain</div>
        </div>

        {/* Stepper */}
        <div className="flex items-center gap-1 mb-8">
          {steps.map((s, i) => (
            <React.Fragment key={s.id}>
              <div className={`h-1.5 flex-1 rounded-full transition-colors ${step >= s.id ? "bg-brand-500" : "bg-zinc-200"}`} />
            </React.Fragment>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-white border border-zinc-200 rounded-2xl p-8 shadow-sm"
          >
            <div className="text-[11px] uppercase tracking-wider text-brand-600 font-semibold mb-1">Step {step} of {steps.length}</div>
            <h1 className="text-2xl font-bold tracking-tight">{steps[step - 1].title}</h1>
            <p className="text-sm text-zinc-600 mt-1 mb-6">{steps[step - 1].subtitle}</p>

            {step === 1 ? (
              <div className="space-y-3">
                <Field label="Your name" value="Priya Menon" />
                <Field label="Role" value="Postdoctoral researcher" />
                <Field label="Research field" value="Computational biology · protein folding" />
                <Field label="Institutional affiliation" value="UCSF · Kawamura Lab" />
              </div>
            ) : step === 2 ? (
              <div className="space-y-3">
                {[
                  { name: "Zotero library", count: "238 references imported", icon: BookOpen },
                  { name: "Mendeley", count: "Not connected", icon: BookOpen, empty: true },
                  { name: "BibTeX upload", count: "14 references imported", icon: Upload },
                ].map((s) => (
                  <div key={s.name} className="flex items-center gap-3 border border-zinc-200 rounded-lg p-3">
                    <div className={`w-9 h-9 rounded-md flex items-center justify-center ${s.empty ? "bg-zinc-100 text-zinc-400" : "bg-emerald-50 text-emerald-700"}`}>
                      {s.empty ? <s.icon className="w-4 h-4" /> : <Check className="w-4 h-4" />}
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-semibold">{s.name}</div>
                      <div className="text-xs text-zinc-500">{s.count}</div>
                    </div>
                    {s.empty ? <button className="text-xs text-brand-700 font-medium">Connect</button> : null}
                  </div>
                ))}
              </div>
            ) : step === 3 ? (
              <div className="space-y-3">
                <div className="bg-gradient-to-br from-brand-50 to-violet-50 border border-brand-200 rounded-xl p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <Users className="w-4 h-4 text-brand-600" />
                    <div className="font-bold">Kawamura Lab</div>
                  </div>
                  <div className="text-[11px] text-zinc-600 leading-relaxed mb-3">
                    UCSF Computational Biology. Active research question:
                    <span className="italic"> "What structural and dynamic principles govern protein folding stability in extreme-temperature environments…"</span>
                  </div>
                  <div className="text-[11px] space-y-1.5">
                    <div>• 432 papers processed</div>
                    <div>• 47 active synthesis threads</div>
                    <div>• 8 methodology decisions logged</div>
                    <div>• 5 team members</div>
                  </div>
                </div>
              </div>
            ) : step === 4 ? (
              <div>
                <div className="rounded-lg border border-zinc-200 p-3 bg-zinc-50 mb-3">
                  <div className="text-[10px] uppercase font-semibold tracking-wider text-zinc-500 mb-1">Your first question</div>
                  <div className="text-sm font-medium italic">"What is our lab's current understanding of protein folding stability in extreme environments?"</div>
                </div>
                <div className="rounded-lg border border-brand-200 bg-brand-50/50 p-3">
                  <div className="flex items-center gap-1.5 text-[10px] uppercase font-semibold tracking-wider text-brand-700 mb-2">
                    <Brain className="w-3 h-3" /> Brain answer preview
                  </div>
                  <div className="text-[13px] text-zinc-800 leading-relaxed">
                    The lab's 2024 Nat Comm paper proposed <strong>backbone rigidification</strong> as the dominant driver of hyperthermostability. As of this month, this is <strong>contested</strong>: Chen 2026 and Volkov 2025 suggest solvent-model artifacts may explain 22% of published conclusions. Three active syntheses are tracking this — you'll see them on your dashboard.
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-6">
                <div className="w-12 h-12 mx-auto rounded-full gradient-brand flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div className="mt-3 text-lg font-bold">You're plugged in.</div>
                <div className="text-sm text-zinc-600 mt-1">Jump to your Dashboard to see today's alerts and team activity.</div>
              </div>
            )}

            <div className="mt-6 flex justify-between items-center">
              <button
                onClick={() => setStep(Math.max(1, step - 1))}
                disabled={step === 1}
                className="text-xs text-zinc-500 disabled:opacity-30 hover:text-zinc-800"
              >
                Back
              </button>
              <button
                onClick={() => {
                  if (step < steps.length) setStep(step + 1);
                  else router.push("/dashboard");
                }}
                className="inline-flex items-center gap-1.5 bg-brand-600 hover:bg-brand-700 text-white rounded-md px-4 py-2 text-sm font-medium"
              >
                {step === steps.length ? "Go to dashboard" : "Continue"} <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <label className="text-[11px] font-semibold text-zinc-700 uppercase tracking-wider">{label}</label>
      <input defaultValue={value} className="mt-1 w-full text-sm bg-white border border-zinc-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-400" />
    </div>
  );
}
