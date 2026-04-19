import type { Synthesis } from "../types";

export const syntheses: Synthesis[] = [
  {
    id: "syn-thermostability",
    title: "Thermostability in extremophile proteins",
    question: "What structural and dynamic principles drive thermostability in archaeal enzymes, and how robust are those conclusions to solvent-model choice?",
    paperCount: 47,
    contradictions: 2,
    collaborators: ["m-priya", "m-hiro", "m-marcus"],
    createdAt: "2025-11-14T10:20:00Z",
    updatedAt: "2026-04-18T08:05:00Z",
    versionHistory: [
      { id: "v-1", date: "2025-11-14T10:20:00Z", actor: "m-priya", summary: "Synthesis seeded with 180 papers; 47 kept after quality filter." },
      { id: "v-2", date: "2025-12-02T14:12:00Z", actor: "m-hiro", summary: "Moved Section 2 from 'Methods' to 'Methodological Landscape' and rewrote the framing." },
      { id: "v-3", date: "2026-01-20T09:44:00Z", actor: "m-marcus", summary: "Added force-field-portability findings from Marcus 2025." },
      { id: "v-4", date: "2026-02-18T16:30:00Z", actor: "m-priya", summary: "Added Imoto 2023 explicit-solvent results to Evidence Strength map." },
      { id: "v-5", date: "2026-03-15T11:05:00Z", actor: "m-priya", summary: "Added Chen 2026 contradiction flag; reclassified rigidification claim from 'high' to 'contested'." },
    ],
    sections: [
      {
        id: "sec-findings",
        heading: "Key findings (by theme)",
        kind: "findings",
        items: [
          {
            id: "f-1",
            kind: "consensus",
            confidence: 0.82,
            text: "Across microsecond-scale MD simulations, thermostable archaeal enzymes show reduced backbone RMSF at key loop regions relative to mesophilic homologs — consistent with the backbone-rigidification hypothesis.",
            citations: [
              { paperId: "p-kawamura-2024", page: 4, sentence: "Across all 12 systems we observe statistically consistent reductions in backbone RMSF…" },
              { paperId: "p-lindorff-2022", page: 6, sentence: "Thermostable variants exhibit 15–24% lower loop-region RMSF across both force fields tested." },
            ],
          },
          {
            id: "f-2",
            kind: "contradiction",
            confidence: 0.5,
            text: "However, single-molecule FRET and explicit-solvent recalculations contradict pure rigidification: slow conformational dynamics are observed at 85 °C, and OPC water reveals substantially more flexibility than TIP3P simulations predicted.",
            citations: [
              { paperId: "p-schuler-2023", page: 3, sentence: "We observe microsecond transitions in three archaeal enzymes that cannot be reconciled with a purely rigidified mechanism." },
              { paperId: "p-chen-2026", page: 2, sentence: "Under OPC water at 363 K, backbone flexibility is 27–41% higher in loop regions than the TIP3P-derived Kawamura et al. (2024) figures." },
              { paperId: "p-imoto-2023", page: 5, sentence: "OPC yields 3–7 kcal/mol lower unfolding barriers, matching experiment more closely." },
            ],
          },
          {
            id: "f-3",
            kind: "statement",
            confidence: 0.78,
            text: "Evolutionary analyses suggest selection for thermostability plateaus at environmental maximum temperature; stability beyond that appears to be an evolutionary by-product rather than a direct selection target.",
            citations: [
              { paperId: "p-freund-2024", page: 7, sentence: "Ancestral sequence reconstruction suggests selection on thermostability saturates at the environmental maximum." },
            ],
          },
          {
            id: "f-4",
            kind: "statement",
            confidence: 0.88,
            text: "De novo design pipelines coupling RFdiffusion to AlphaFold2 validation can produce ultra-thermostable α/β hydrolases retaining activity at 95 °C for 48 h — exceeding all known natural homologs.",
            citations: [
              { paperId: "p-baker-2024", page: 2, sentence: "Seven designs retained >80% initial activity after 48h at 95 °C." },
            ],
          },
        ],
      },
      {
        id: "sec-methods",
        heading: "Methodological landscape",
        kind: "methods",
        items: [
          {
            id: "m-1",
            text: "Dominant computational methods: AMBER-ff14SB (64% of papers), CHARMM36m (22%), AMOEBA polarizable (6%). TIP3P water remains the default (85% of published studies) despite mounting evidence of inaccuracy at >330 K.",
            citations: [
              { paperId: "p-lindorff-2022", page: 4, sentence: "AMBER-ff14SB provides superior loop accuracy for thermostable variants vs. CHARMM36m." },
              { paperId: "p-dmitri-2025", page: 3, sentence: "74 of 87 surveyed studies rely exclusively on TIP3P at simulated temperatures ≥ 330 K." },
            ],
          },
          {
            id: "m-2",
            text: "Structure determination has shifted decisively toward integrative cryo-EM + MD pipelines for large archaeal assemblies, replacing crystallography for chaperonin-scale problems.",
            citations: [
              { paperId: "p-sali-2024", page: 2, sentence: "We combine high-resolution cryo-EM with microsecond MD for the PfuGroEL assembly." },
            ],
          },
          {
            id: "m-3",
            text: "Protein language model embeddings (ESM-2) now provide a tractable orthogonal channel for Tm prediction when combined with conservation scores.",
            citations: [
              { paperId: "p-ovchinnikov-2023", page: 4, sentence: "Combining ESM-2 and PSSM signals yields 14% rank-correlation improvement on ThermoMutDB." },
            ],
          },
        ],
      },
      {
        id: "sec-questions",
        heading: "Open questions & contradictions",
        kind: "questions",
        items: [
          {
            id: "q-1",
            kind: "open-question",
            text: "To what extent does the rigidification hypothesis survive re-simulation with OPC water across the full published archaeal MD corpus? Dmitri (2025) estimates up to 22% of conclusions at risk.",
            citations: [
              { paperId: "p-dmitri-2025", page: 5, sentence: "We estimate ~22% of published archaeal MD conclusions may be solvent-artifact-dependent." },
              { paperId: "p-chen-2026", page: 1, sentence: "Classical TIP3P conclusions on archaeal rigidity require systematic re-examination." },
            ],
          },
          {
            id: "q-2",
            kind: "open-question",
            text: "Why has directed evolution been applied to only 6 psychrophilic proteins in the published literature despite clear biotechnological demand for low-temperature biocatalysis? (Graph-Gap G-01.)",
            citations: [{ paperId: "p-zara-2024", page: 3, sentence: "Only 6 publications apply modern directed evolution to psychrophilic proteins in our scoping review." }],
          },
          {
            id: "q-3",
            kind: "open-question",
            text: "Can the activation-energy framework from ceramic thermal aging (Rocha 2024) be transferred to enzyme denaturation kinetics? (Cross-disciplinary bridge from Materials Science.)",
            citations: [{ paperId: "p-rocha-2024", page: 2, sentence: "Our activation-energy framework is general to activated thermal degradation processes." }],
          },
        ],
      },
      {
        id: "sec-evidence",
        heading: "Evidence strength map",
        kind: "evidence-map",
        items: [
          { id: "e-1", confidence: 0.9, text: "De novo ultra-thermostable α/β hydrolases are experimentally demonstrated (strong, single-lab)." , citations: [{ paperId: "p-baker-2024", page: 2, sentence: "Seven designs retained activity at 95 °C for 48h." }] },
          { id: "e-2", confidence: 0.5, text: "Backbone rigidification as *the* mechanism of hyperthermostability — now contested pending OPC-water re-simulations." , citations: [{ paperId: "p-chen-2026", page: 2, sentence: "Under OPC water at 363 K, flexibility is 27–41% higher than TIP3P-based estimates." }] },
          { id: "e-3", confidence: 0.8, text: "ESM-2 embeddings provide orthogonal Tm signal (replicated on ThermoMutDB)." , citations: [{ paperId: "p-ovchinnikov-2023", page: 4, sentence: "+14% rank-correlation improvement." }] },
          { id: "e-4", confidence: 0.72, text: "Industrial continuous-flow biocatalysis feasible at 75 °C for 120 h (single-lab pilot).", citations: [{ paperId: "p-williams-2025", page: 3, sentence: "95% conversion retention over 120h continuous operation." }] },
        ],
      },
      {
        id: "sec-annotations",
        heading: "Team annotations",
        kind: "annotations",
        items: [
          { id: "n-1", authorId: "m-hiro", text: "Section 2 framing matters for the R01 Significance paragraph. — Hiro", citations: [] },
          { id: "n-2", authorId: "m-marcus", text: "Marcus 2025 and Chen 2026 probably mean our Fig 3 claim in the Nat Comm 2024 paper needs a corrigendum.", citations: [{ paperId: "p-kawamura-2024", page: 5, sentence: "Fig 3c: reduced loop RMSF in thermostable variants." }] },
        ],
      },
    ],
  },
  {
    id: "syn-forcefield",
    title: "MD force field choices for extremophile simulations",
    question: "Which water model and force field combination best matches experimental thermostability data for archaeal proteins at industrial-process temperatures?",
    paperCount: 22,
    contradictions: 1,
    collaborators: ["m-priya", "m-marcus", "m-dmitri"],
    createdAt: "2026-01-12T09:10:00Z",
    updatedAt: "2026-04-12T17:45:00Z",
    versionHistory: [
      { id: "v-1", date: "2026-01-12T09:10:00Z", actor: "m-marcus", summary: "Spun off from main thermostability synthesis after force-field findings grew." },
      { id: "v-2", date: "2026-03-02T13:20:00Z", actor: "m-priya", summary: "Added Dmitri 2025 systematic review — confirms widespread TIP3P reliance." },
    ],
    sections: [
      {
        id: "sec-ff-findings",
        heading: "Key findings (by theme)",
        kind: "findings",
        items: [
          { id: "ff-f-1", text: "OPC and TIP4P-Ew consistently match experimental Tm and unfolding free-energies more closely than TIP3P at T > 330 K.", citations: [{ paperId: "p-imoto-2023", page: 4, sentence: "OPC yields 3–7 kcal/mol lower unfolding barriers vs TIP3P, matching experiment." }] },
          { id: "ff-f-2", text: "AMBER-ff14SB outperforms CHARMM36m for loop-region accuracy on archaeal proteins but slightly over-rigidifies mesophilic controls.", citations: [{ paperId: "p-lindorff-2022", page: 4, sentence: "AMBER-ff14SB gives 15–24% tighter loop RMSF agreement." }] },
        ],
      },
    ],
  },
  {
    id: "syn-archaeal-design",
    title: "Archaeal protein design principles",
    question: "What design principles from natural archaeal enzymes can be transferred to de novo ultra-thermostable enzyme design?",
    paperCount: 31,
    contradictions: 0,
    collaborators: ["m-priya", "m-hiro", "m-zara"],
    createdAt: "2025-12-03T11:30:00Z",
    updatedAt: "2026-04-01T10:12:00Z",
    versionHistory: [
      { id: "v-1", date: "2025-12-03T11:30:00Z", actor: "m-priya", summary: "Initial synthesis, focus on structural motifs." },
      { id: "v-2", date: "2026-02-11T15:15:00Z", actor: "m-zara", summary: "Added evolutionary-drivers section per Freund 2024." },
    ],
    sections: [
      {
        id: "sec-ad-findings",
        heading: "Key findings (by theme)",
        kind: "findings",
        items: [
          { id: "ad-f-1", text: "Core packing density is consistently higher in thermostable archaeal enzymes but not sufficient to explain de novo design success — additional loop-region considerations matter.", citations: [{ paperId: "p-baker-2024", page: 3, sentence: "Packing density alone fails to predict stability of intermediate designs." }] },
          { id: "ad-f-2", text: "Selection for thermostability plateaus at environmental max temperature; any additional stability is evolutionary by-product, suggesting de novo design can exceed natural homologs.", citations: [{ paperId: "p-freund-2024", page: 7, sentence: "Selection on thermostability saturates at environmental maximum." }] },
        ],
      },
    ],
  },
];

export function synthesisById(id: string): Synthesis | undefined {
  return syntheses.find((s) => s.id === id);
}
