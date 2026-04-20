import type { ChatMessage, Citation } from "../types";

// Pre-scripted brain responses, keyed by substring match on the user's question
// + optional surface context. We also expose a "default" Ask-the-Brain response
// and seed the drawer with a context-aware welcome.

export interface ChatScript {
  matchAny: string[]; // any substring match triggers this
  surface?: string;
  response: string;
  citations?: Citation[];
  followups?: string[];
  mode?: "ask" | "suggest" | "decide";
}

export const chatScripts: ChatScript[] = [
  {
    matchAny: ["why did we pick md", "why md over rosetta", "md vs rosetta", "why md"],
    response:
      "Your lab chose **MD simulation over Rosetta** on 2023-05-10. The core reasoning was that the research question is about **dynamics** — how backbone flexibility changes with temperature — not single-structure scoring. Rosetta's energy function doesn't natively capture dynamic ensembles, and MD is the field standard for RMSF and residue-level flexibility analysis. You use Rosetta only on the design-phase side.\n\nAlternatives considered: Rosetta relax + repack (single-structure, can't measure dynamics) and Elastic Network Models (cheap but too qualitative for Nat Comm). Decided by Hiro Kawamura and Priya Menon, grounded in Kawamura 2024 and Lindorff-Larsen 2022.",
    citations: [
      { paperId: "p-kawamura-2024", page: 3, sentence: "Microsecond-scale MD simulations…" },
      { paperId: "p-lindorff-2022", page: 4, sentence: "AMBER-ff14SB provides superior loop accuracy…" },
    ],
    followups: ["What about AMBER vs CHARMM?", "Why stay on TIP3P in 2024?", "Why Rosetta for design but AF2 for validation?"],
    mode: "decide",
  },
  {
    matchAny: ["amber vs charmm", "why amber", "amber over charmm"],
    response:
      "You chose **AMBER-ff14SB over CHARMM36m** on 2023-11-02. Benchmarks in Lindorff-Larsen 2022 across 12 archaeal globular proteins showed AMBER gives 15–24% tighter loop-region RMSF agreement with NMR S² order parameters. Your pipeline already had AMBER parameterization files in place, which made cross-study comparability easier for the 2024 Nat Comm paper.\n\nYou did note that CHARMM36m is slightly better on mesophilic controls but over-rigidifies; and AMOEBA (polarizable) would be more accurate but is 8× slower and wasn't viable at the scale you needed.",
    citations: [{ paperId: "p-lindorff-2022", page: 4, sentence: "AMBER-ff14SB gives 15–24% tighter loop-region RMSF agreement." }],
    followups: ["What about OPC vs TIP3P now?", "Would we re-decide this today?"],
    mode: "decide",
  },
  {
    matchAny: ["tip3p", "opc", "water model"],
    response:
      "In late 2022, you chose **TIP3P over OPC** for the Nat Comm 2024 paper because OPC was less battle-tested for protein MD at that time and the field's TIP3P corpus made comparison easier. Given **Chen 2026** and **Imoto 2023**, this is the single decision you would most likely revisit today — which is exactly why the R01 Aim 1 exists.\n\nVolkov 2025's systematic review estimates ~22% of published archaeal MD conclusions may be solvent-artifact-dependent. The rigidification claim in your own Fig 3c is now contested, not refuted, pending the OPC re-simulation.",
    citations: [
      { paperId: "p-chen-2026", page: 2, sentence: "Under OPC water at 363 K, flexibility is 27–41% higher in loop regions." },
      { paperId: "p-imoto-2023", page: 4, sentence: "OPC yields 3–7 kcal/mol lower unfolding barriers, matching experiment." },
      { paperId: "p-dmitri-2025", page: 5, sentence: "~22% of published archaeal MD conclusions may be solvent-artifact-dependent." },
    ],
    followups: ["Open the OPC re-simulation hypothesis", "Draft a corrigendum block"],
    mode: "decide",
  },
  {
    matchAny: ["contradicts", "contradiction", "chen 2026", "chen disagrees"],
    surface: "reader",
    response:
      "This paper (**Chen 2026**) disagrees with your lab's **Kawamura 2024** at a specific, quantitative level. Kawamura 2024 Fig 3c reported 15–24% RMSF reduction in thermostable archaeal loop regions relative to mesophilic homologs, based on TIP3P-water MD at 298–363 K. Chen 2026 re-runs similar simulations with **OPC water at 363 K** and finds 27–41% higher flexibility in the same loop regions.\n\nThe disagreement is not about the physics but about the **solvent model**: OPC captures water dynamics at elevated temperature more faithfully than TIP3P. Combined with Imoto 2023's explicit-solvent free-energy results and Volkov 2025's systematic review, this is the strongest case in the recent literature that the rigidification conclusion is at least partially solvent-model-dependent.",
    citations: [
      { paperId: "p-chen-2026", page: 2, sentence: "27–41% higher flexibility in loop regions under OPC at 363 K." },
      { paperId: "p-kawamura-2024", page: 5, sentence: "Fig 3c: reduced loop-region RMSF in thermostable variants." },
    ],
    followups: ["What would re-simulation with OPC imply?", "See all force-field decisions", "Open H-2 (OPC re-simulation)"],
  },
  {
    matchAny: ["summarize this paper", "tl;dr", "summarise", "what is this paper about"],
    response:
      "I can give a short summary grounded in the team's prior reading. Try a specific paper: *'summarize Baker 2024 in context of our lab's rigidification work'* — that way I can connect it to your Synthesis Canvas findings, not just restate the abstract.",
    followups: ["Summarize Baker 2024 for me", "What papers are most relevant to Aim 2?"],
  },
  {
    matchAny: ["baker 2024", "de novo", "ultra-thermostable"],
    response:
      "**Baker 2024** (Science, [doi](https://doi.org/10.1126/science.adk2024)) designs seven de novo α/β hydrolases that retain activity after 48h at 95 °C using RFdiffusion coupled to AlphaFold2 validation. In the context of your lab's work: this is the strongest proof-of-concept that de novo ultra-thermostability is achievable, and it directly motivates your R01 Innovation paragraph. Marcus 2025 (your own preprint) quantified 10–18% RMSF divergence on these designs across force fields — relevant when you stress-test reproducibility.\n\nIn your Knowledge Graph, Baker 2024 sits in the Rosetta/Design cluster with three incoming edges from your team's work. It has no replication yet (Gap G-02).",
    citations: [
      { paperId: "p-baker-2024", page: 2, sentence: "Seven designs retained >80% initial activity after 48h at 95 °C." },
      { paperId: "p-marcus-2025", page: 3, sentence: "10–18% RMSF divergence across AMBER, CHARMM, and AMOEBA on Baker-lab designs." },
    ],
    followups: ["Show me the Rosetta cluster", "Open H-4 (ESM-2 + portability)"],
  },
  {
    matchAny: ["r01", "grant", "aims", "nih"],
    response:
      "Your current R01 draft in the Notebook has three Aims: (1) re-examine the rigidification hypothesis with OPC and TIP4P-Ew water, (2) anchor with smFRET at 85 °C, (3) scale to continuous-flow biocatalysis. 47 papers from the team library are cited across the blocks. The brain flags one open contradiction: Aim 3 (flexible dynamics matter for biocatalysis) conflicts with the Aim 1 framing — Marcus raised this in a comment yesterday. Worth resolving before submission.",
    followups: ["Open the R01 notebook", "Resolve the Aim 1 / Aim 3 contradiction", "Draft a reviewer-rebuttal for TIP3P"],
  },
  {
    matchAny: ["cross pollination", "cross-pollination", "what did marcus read", "what did marcus annotate"],
    response:
      "**Marcus** annotated two papers last night that connect directly to your R01 Aim 2 methodology block: **Lindorff-Larsen 2022** (AMBER vs CHARMM loop accuracy) and **Imoto 2023** (explicit-solvent free energies). His highlights focus on the solvent-model effect magnitude — exactly the rationale you need to cite when justifying the OPC-water choice in Aim 1. I've already pre-slotted both as citation suggestions in the Aim 2 methodology block.",
    followups: ["Open Marcus's annotations", "Open the R01 Aim 2 block"],
  },
  {
    matchAny: ["find citations", "what should i cite", "citations for this paragraph", "cite from library"],
    surface: "writing",
    mode: "suggest",
    response:
      "Based on this block's content ('OPC rationale and solvent-model justification'), three citations from the team's library fit strongly:\n\n1. **Chen 2026** — primary disagreement with TIP3P rigidification claim. Strongest single citation.\n2. **Imoto 2023** — independent explicit-solvent free-energy evidence.\n3. **Volkov 2025** — systematic review framing field-wide concern.\n\nWant me to insert all three as a Reference block under this paragraph?",
    followups: ["Insert all three", "Just Chen 2026", "Also suggest a methodological precedent for smFRET"],
  },
  {
    matchAny: ["invite", "add a collaborator", "add collaborator"],
    surface: "writing",
    response:
      "To invite a collaborator, use the **+ Invite** button at the top-right of the notebook. The invite modal offers four role levels (Owner · Editor · Commenter · Viewer) and three scopes (whole notebook · specific section · specific block). The invitee receives a context-rich preview — not a blank invite — with paper count, hypothesis links, and the notebook abstract.",
    followups: ["Open the invite modal"],
  },
  {
    matchAny: ["unknown", "what don't i know", "surprise me", "don't know", "what am i missing"],
    response:
      "Three cross-disciplinary papers flagged as high-relevance but outside your lab's usual reading: **Rocha 2024** (Nature Materials — activation-energy framework for ceramic thermal aging; directly applicable to enzyme denaturation kinetics), **Rocha 2024 npj Comp Mater** (DL-discovered activation-energy feature from ceramic cyclic-load data; could transfer to enzyme half-life datasets), and **Chen 2024 eLife** (HSP90 tumor allostery sharing activation motifs with archaeal chaperones).\n\nNone of these have been read by your team yet. They're surfaced in the Knowledge Graph Explorer's 'Find the unknown unknowns' mode.",
    citations: [
      { paperId: "p-rocha-2024", page: 2, sentence: "Our activation-energy framework is general to activated thermal degradation processes." },
      { paperId: "p-chen-heat-shock-2024", page: 3, sentence: "Shared activation motifs between HSP90 and archaeal chaperones." },
    ],
    followups: ["Jump to the graph with these highlighted", "Propose a hypothesis from Rocha 2024"],
  },
  {
    matchAny: ["hello", "hi ", "hey"],
    response: "Hi Priya 👋 I'm your lab's brain. I'm grounded in 432 papers the Kawamura Lab has processed, 3 active syntheses, 6 open hypotheses, and 8 decision archaeology entries. What are we working on?",
    followups: ["Summarize today's alerts", "Open R01 Aim 2", "Why did we pick MD over Rosetta?"],
  },
];

// Default fallback when no script matches.
export const defaultBrainReply: ChatScript = {
  matchAny: [],
  response:
    "I can answer this more helpfully if you point me at a specific paper, synthesis, hypothesis, or block. In the meantime: if this is a decision-history question, try *'Why did we pick X over Y?'*. If it's a citation question, try *'What should I cite here?'*. And if you want to be surprised, try *'What don't I know?'*",
  followups: ["Why did we pick MD over Rosetta?", "What should I cite for Aim 2?", "What don't I know?"],
};

export function findScript(userText: string, surface?: string): ChatScript {
  const q = userText.toLowerCase();
  // Prefer surface-specific match if surface provided.
  if (surface) {
    for (const s of chatScripts) {
      if (s.surface === surface && s.matchAny.some((m) => q.includes(m))) return s;
    }
  }
  for (const s of chatScripts) {
    if (!s.surface && s.matchAny.some((m) => q.includes(m))) return s;
  }
  return defaultBrainReply;
}

export const seededOpeningMessages: Record<string, ChatMessage[]> = {
  dashboard: [
    {
      id: "seed-dash-1",
      role: "brain",
      content:
        "Good morning, Priya. Overnight: **3 new alerts** (1 high-priority: Chen 2026 contradicts your rigidification hypothesis), **2 team annotations** from Marcus on force-field papers, and **1 replication confirmation** of your 2024 esterase work (Patel 2025).",
      followups: ["What's the Chen 2026 disagreement about?", "What did Marcus annotate?", "Summarize alerts"],
      surfaceContext: "dashboard",
      at: "2026-04-18T08:30:00Z",
    },
  ],
  reader: [
    {
      id: "seed-reader-1",
      role: "brain",
      content:
        "Grounded in this paper. Ask me: *'why does this contradict us?'*, *'who cites it so far?'*, *'what would it take to overturn our Fig 3c?'*.",
      followups: ["Why does this contradict us?", "What does Imoto 2023 say?", "Draft a corrigendum"],
      surfaceContext: "reader",
      at: new Date().toISOString(),
    },
  ],
  synthesis: [
    {
      id: "seed-syn-1",
      role: "brain",
      content:
        "I'm grounded in this synthesis (47 papers, 2 open contradictions). Hover any claim to see its citation. Ask me about any finding or the evidence strength map.",
      followups: ["Why is f-2 marked contested?", "What's the strongest claim here?", "Export to Word"],
      surfaceContext: "synthesis",
      at: new Date().toISOString(),
    },
  ],
  graph: [
    {
      id: "seed-graph-1",
      role: "brain",
      content:
        "Graph grounded across 5 disciplines. Click any node for details. Try **'What don't I know?'** to see cross-disciplinary bridges your team has missed, or shift-click two concepts to trace a citation path.",
      followups: ["What don't I know?", "Trace a path from de novo design → industrial biocatalysis", "Show only team-read nodes"],
      surfaceContext: "graph",
      at: new Date().toISOString(),
    },
  ],
  ideation: [
    {
      id: "seed-ide-1",
      role: "brain",
      content:
        "Session active with 4 participants. I'm watching for evidence links and cross-disciplinary bridges. I have one suggestion waiting: *Consider Patel 2025 for H-1 — similar method in a different domain.*",
      followups: ["Why Patel 2025?", "Generate a hypothesis from Gap G-01"],
      surfaceContext: "ideation",
      at: new Date().toISOString(),
    },
  ],
  writing: [
    {
      id: "seed-writ-1",
      role: "brain",
      content:
        "Notebook context loaded. I'll suggest citations from your library as you write and flag cross-section contradictions. One contradiction currently flagged: Aim 3 dynamics framing vs Aim 1 rigidification framing (Marcus opened the thread).",
      followups: ["Resolve the contradiction", "Suggest citations for Innovation", "Draft a TIP3P reviewer response"],
      surfaceContext: "writing",
      at: new Date().toISOString(),
    },
  ],
};
