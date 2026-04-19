import type { Hypothesis, IdeationSession } from "../types";

export const hypotheses: Hypothesis[] = [
  {
    id: "h-1",
    statement:
      "Archaeal esterases immobilized on mesoporous silica maintain >95% activity at 90°C for 96h in continuous-flow conditions.",
    supportingPapers: ["p-williams-2025", "p-patel-2025"],
    contradictingPapers: [],
    votes: [
      { memberId: "m-priya", value: 1 },
      { memberId: "m-hiro", value: 1 },
      { memberId: "m-marcus", value: 1 },
      { memberId: "m-dmitri", value: -1 },
    ],
    createdBy: "m-priya",
    createdAt: "2026-03-24T14:00:00Z",
    status: "voted",
    suggestedMethods: ["enzyme immobilization", "continuous-flow reactor", "activity assay"],
    brainSuggestion:
      "Consider Patel 2025 — similar immobilization method on esterases but in a different domain; you could borrow their conversion-retention metric.",
  },
  {
    id: "h-2",
    statement:
      "Re-simulating the canonical 12-enzyme archaeal MD panel with OPC water at 363 K will overturn the rigidification conclusion for ≥3 of the 12 systems.",
    supportingPapers: ["p-chen-2026", "p-imoto-2023", "p-dmitri-2025"],
    contradictingPapers: ["p-kawamura-2024"],
    votes: [
      { memberId: "m-priya", value: 1 },
      { memberId: "m-hiro", value: -1 },
      { memberId: "m-marcus", value: 1 },
      { memberId: "m-zara", value: 1 },
    ],
    createdBy: "m-marcus",
    createdAt: "2026-04-06T09:12:00Z",
    status: "promoted",
    suggestedMethods: ["MD simulation", "OPC water model", "RMSF analysis"],
    brainSuggestion:
      "This directly stress-tests Kawamura 2024 Fig 3c. Consider also pairing with Schuler 2023 smFRET data as an experimental anchor — the team has not cited this pairing before.",
  },
  {
    id: "h-3",
    statement:
      "Directed evolution via MutaT7 applied to cold-active psychrophilic lipases yields >10°C Tm reduction without loss of kcat at 10°C.",
    supportingPapers: ["p-zara-2024", "p-patel-2025"],
    contradictingPapers: [],
    votes: [
      { memberId: "m-zara", value: 1 },
      { memberId: "m-priya", value: 1 },
    ],
    createdBy: "m-zara",
    createdAt: "2026-04-15T11:00:00Z",
    status: "draft",
    suggestedMethods: ["MutaT7", "activity assay", "DSC"],
    brainSuggestion:
      "This fills a literature gap identified in the Knowledge Graph Explorer — only 6 papers currently exist on directed evolution of psychrophiles (Gap G-01).",
  },
  {
    id: "h-4",
    statement:
      "ESM-2 embeddings combined with force-field-portability scores predict de novo design success better than AlphaFold2 pLDDT alone.",
    supportingPapers: ["p-ovchinnikov-2023", "p-marcus-2025", "p-baker-2024"],
    contradictingPapers: [],
    votes: [
      { memberId: "m-marcus", value: 1 },
      { memberId: "m-priya", value: 1 },
      { memberId: "m-dmitri", value: 1 },
    ],
    createdBy: "m-dmitri",
    createdAt: "2026-04-10T16:40:00Z",
    status: "voted",
    suggestedMethods: ["ESM-2 embedding", "MD cross-validation", "de novo design"],
  },
  {
    id: "h-5",
    statement:
      "An activation-energy-based denaturation model (transferred from ceramic thermal-aging) predicts enzyme half-life at industrial temperatures more accurately than Arrhenius-linear extrapolation.",
    supportingPapers: ["p-rocha-2024", "p-rocha-dl-2024", "p-williams-2025"],
    contradictingPapers: [],
    votes: [
      { memberId: "m-priya", value: 1 },
    ],
    createdBy: "m-priya",
    createdAt: "2026-04-17T19:15:00Z",
    status: "draft",
    suggestedMethods: ["kinetic modeling", "enzyme half-life assay"],
    brainSuggestion:
      "Unknown-unknown bridge: Rocha 2024 (materials science) has never been cited in the biophysics literature on enzyme denaturation. You'd be the first.",
  },
  {
    id: "h-6",
    statement:
      "Archaeal chaperone allosteric pathways share activation motifs with human HSP90 — enabling cross-domain drug-discovery insights.",
    supportingPapers: ["p-chen-heat-shock-2024", "p-sali-2024"],
    contradictingPapers: [],
    votes: [{ memberId: "m-hiro", value: 1 }],
    createdBy: "m-hiro",
    createdAt: "2026-04-02T13:20:00Z",
    status: "draft",
    suggestedMethods: ["comparative allosteric mapping"],
    brainSuggestion:
      "Cross-disciplinary bridge from cancer biology into archaeal chaperone biology. Chen 2024 (eLife) hasn't been read by anyone in the lab yet.",
  },
];

export const ideationSessions: IdeationSession[] = [
  {
    id: "ses-enzymes-95c",
    title: "Testing enzyme stability at 95 °C",
    research: "Which hypotheses can we test this quarter to strengthen the R01 aims around industrial-temperature biocatalysis?",
    participants: ["m-priya", "m-hiro", "m-marcus", "m-dmitri"],
    hypotheses: ["h-1", "h-2", "h-4", "h-5"],
    startedAt: "2026-03-20T10:00:00Z",
    active: true,
    evolutionTimeline: [
      { date: "2026-03-20", summary: "Session opened. Hiro framed the need: we want 3 fundable Aims for the R01 submission." },
      { date: "2026-03-24", summary: "H-1 (immobilized esterase) drafted by Priya; Patel 2025 pulled in." , hypothesisId: "h-1" },
      { date: "2026-04-06", summary: "H-2 (OPC re-simulation) drafted after Chen 2026 alert. Hiro initially voted against.", hypothesisId: "h-2" },
      { date: "2026-04-10", summary: "H-4 (ESM-2 + portability) drafted by Dmitri." , hypothesisId: "h-4" },
      { date: "2026-04-17", summary: "H-5 (materials-science bridge) drafted by Priya — flagged as cross-disciplinary." , hypothesisId: "h-5" },
      { date: "2026-04-18", summary: "H-2 promoted to experiment design; Priya drafting protocol." , hypothesisId: "h-2" },
    ],
  },
  {
    id: "ses-psychrophiles",
    title: "Directed evolution of psychrophilic lipases",
    research: "Is this a viable Aim 3 for the R01, or does it dilute focus?",
    participants: ["m-priya", "m-zara", "m-hiro"],
    hypotheses: ["h-3", "h-6"],
    startedAt: "2026-04-12T14:30:00Z",
    active: true,
    evolutionTimeline: [
      { date: "2026-04-12", summary: "Zara opened session after flagging the psychrophile gap in the Knowledge Graph." },
      { date: "2026-04-15", summary: "H-3 (psychrophile MutaT7) drafted by Zara.", hypothesisId: "h-3" },
      { date: "2026-04-02", summary: "H-6 (archaeal↔HSP90) drafted by Hiro — cross-disciplinary seed.", hypothesisId: "h-6" },
    ],
  },
];

export function hypothesisById(id: string): Hypothesis | undefined {
  return hypotheses.find((h) => h.id === id);
}

export function sessionById(id: string): IdeationSession | undefined {
  return ideationSessions.find((s) => s.id === id);
}
