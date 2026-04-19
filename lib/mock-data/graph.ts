import type { GraphNode, GraphEdge, GraphGap, Discipline } from "../types";

// Node layout by cluster-mode, position normalized to a ~1000x700 canvas.
// We generate positions by combining a cluster center + small jitter.

type ClusterDef = { label: string; center: { x: number; y: number }; discipline: Discipline; methodology?: string; finding?: string; approach?: string };

const methodologyClusters: Record<string, ClusterDef> = {
  MD: { label: "MD Simulation", center: { x: 300, y: 220 }, discipline: "biophysics", methodology: "MD" },
  AF: { label: "AlphaFold / DL Folding", center: { x: 700, y: 200 }, discipline: "cs", methodology: "AlphaFold" },
  ROSETTA: { label: "Rosetta / Design", center: { x: 520, y: 380 }, discipline: "cs", methodology: "Rosetta" },
  CRYO: { label: "Cryo-EM", center: { x: 200, y: 470 }, discipline: "biophysics", methodology: "Cryo-EM" },
  WET: { label: "Wet-lab Stability Assays", center: { x: 400, y: 560 }, discipline: "biochem", methodology: "Wet-lab" },
  EVO: { label: "Directed Evolution", center: { x: 720, y: 500 }, discipline: "biochem", methodology: "Directed Evolution" },
  PROTEOMICS: { label: "Proteomics", center: { x: 880, y: 340 }, discipline: "microbio", methodology: "Proteomics" },
  PROCESS: { label: "Process Engineering", center: { x: 900, y: 560 }, discipline: "materials", methodology: "Process Eng" },
};

function jitter(seed: number, max = 80) {
  const r1 = ((Math.sin(seed * 12.9898) * 43758.5453) % 1 + 1) % 1;
  const r2 = ((Math.sin(seed * 78.233) * 12345.6789) % 1 + 1) % 1;
  return { x: (r1 - 0.5) * max, y: (r2 - 0.5) * max };
}

// Define nodes: ~50 curated papers-as-nodes + methods + findings + datasets + concepts.
const rawNodes: (Omit<GraphNode, "size"> & { clusterKey: keyof typeof methodologyClusters })[] = [
  // MD cluster
  { id: "n-kawamura-2024", type: "paper", label: "Kawamura 2024 — rigidification hypothesis", discipline: "biophysics", year: 2024, paperId: "p-kawamura-2024", teamRead: true, cluster: { methodology: "MD", finding: "Rigidification", approach: "Computational" }, clusterKey: "MD" },
  { id: "n-chen-2026", type: "paper", label: "Chen 2026 — OPC contradicts rigidification", discipline: "biophysics", year: 2026, paperId: "p-chen-2026", teamRead: true, cluster: { methodology: "MD", finding: "Contradicts rigidification", approach: "Computational" }, clusterKey: "MD" },
  { id: "n-lindorff-2022", type: "paper", label: "Lindorff-Larsen 2022 — AMBER vs CHARMM", discipline: "biophysics", year: 2022, paperId: "p-lindorff-2022", teamRead: true, cluster: { methodology: "MD", finding: "Force-field effects", approach: "Computational" }, clusterKey: "MD" },
  { id: "n-imoto-2023", type: "paper", label: "Imoto 2023 — explicit solvent", discipline: "biophysics", year: 2023, paperId: "p-imoto-2023", teamRead: true, cluster: { methodology: "MD", finding: "Force-field effects", approach: "Computational" }, clusterKey: "MD" },
  { id: "n-dmitri-2025", type: "paper", label: "Volkov 2025 — TIP3P artifact review", discipline: "biophysics", year: 2025, paperId: "p-dmitri-2025", teamRead: true, cluster: { methodology: "MD", finding: "Force-field effects", approach: "Computational" }, clusterKey: "MD" },
  { id: "n-marcus-2025", type: "paper", label: "Marcus 2025 — FF portability", discipline: "biophysics", year: 2025, paperId: "p-marcus-2025", teamRead: true, cluster: { methodology: "MD", finding: "Force-field effects", approach: "Computational" }, clusterKey: "MD" },
  { id: "n-method-md", type: "method", label: "MD Simulation", discipline: "biophysics", cluster: { methodology: "MD" }, teamRead: true, clusterKey: "MD" },
  { id: "n-dataset-thermo", type: "dataset", label: "ThermoMutDB", discipline: "biochem", cluster: { methodology: "MD", finding: "Stabilizing mutations" }, teamRead: true, clusterKey: "MD" },
  { id: "n-concept-rigid", type: "concept", label: "Backbone rigidification", discipline: "biophysics", cluster: { methodology: "MD", finding: "Rigidification" }, teamRead: true, clusterKey: "MD" },
  { id: "n-concept-flex", type: "concept", label: "Loop-region flexibility", discipline: "biophysics", cluster: { methodology: "MD", finding: "Contradicts rigidification" }, teamRead: true, clusterKey: "MD" },

  // AlphaFold cluster
  { id: "n-jumper-2021", type: "paper", label: "Jumper 2021 — AlphaFold 2", discipline: "cs", year: 2021, paperId: "p-jumper-2021", teamRead: true, cluster: { methodology: "AlphaFold", approach: "DL-based" }, clusterKey: "AF", landmark: true },
  { id: "n-abramson-2024", type: "paper", label: "Abramson 2024 — AlphaFold 3", discipline: "cs", year: 2024, paperId: "p-abramson-2024", teamRead: true, cluster: { methodology: "AlphaFold", approach: "DL-based" }, clusterKey: "AF", landmark: true },
  { id: "n-ovchinnikov-2023", type: "paper", label: "Ovchinnikov 2023 — ESM-2 probe", discipline: "cs", year: 2023, paperId: "p-ovchinnikov-2023", teamRead: true, cluster: { methodology: "AlphaFold", finding: "Force-field effects", approach: "DL-based" }, clusterKey: "AF" },
  { id: "n-method-af", type: "method", label: "AlphaFold 2/3", discipline: "cs", cluster: { methodology: "AlphaFold" }, teamRead: true, clusterKey: "AF" },
  { id: "n-method-esm", type: "method", label: "ESM-2", discipline: "cs", cluster: { methodology: "AlphaFold" }, teamRead: true, clusterKey: "AF" },
  { id: "n-concept-plddt", type: "concept", label: "pLDDT confidence", discipline: "cs", cluster: { methodology: "AlphaFold" }, teamRead: true, clusterKey: "AF" },

  // Rosetta / Design
  { id: "n-baker-2024", type: "paper", label: "Baker 2024 — de novo ultra-thermostable", discipline: "cs", year: 2024, paperId: "p-baker-2024", teamRead: true, cluster: { methodology: "Rosetta", approach: "Computational de novo", finding: "Stabilizing mutations" }, clusterKey: "ROSETTA" },
  { id: "n-method-rfd", type: "method", label: "RFdiffusion", discipline: "cs", cluster: { methodology: "Rosetta", approach: "Computational de novo" }, teamRead: true, clusterKey: "ROSETTA" },
  { id: "n-method-rosetta", type: "method", label: "Rosetta", discipline: "cs", cluster: { methodology: "Rosetta" }, teamRead: true, clusterKey: "ROSETTA" },
  { id: "n-concept-denovo", type: "concept", label: "De novo enzyme design", discipline: "cs", cluster: { methodology: "Rosetta", approach: "Computational de novo" }, teamRead: true, clusterKey: "ROSETTA" },

  // Cryo-EM
  { id: "n-sali-2024", type: "paper", label: "Sali 2024 — PfuGroEL integrative", discipline: "biophysics", year: 2024, paperId: "p-sali-2024", teamRead: true, cluster: { methodology: "Cryo-EM", approach: "Hybrid" }, clusterKey: "CRYO" },
  { id: "n-method-cryoem", type: "method", label: "Cryo-EM", discipline: "biophysics", cluster: { methodology: "Cryo-EM" }, teamRead: true, clusterKey: "CRYO" },
  { id: "n-concept-chaperonin", type: "concept", label: "Chaperonin assemblies", discipline: "biophysics", cluster: { methodology: "Cryo-EM" }, teamRead: true, clusterKey: "CRYO" },

  // Wet-lab stability assays
  { id: "n-schuler-2023", type: "paper", label: "Schuler 2023 — smFRET at 85°C", discipline: "biophysics", year: 2023, paperId: "p-schuler-2023", teamRead: true, cluster: { methodology: "Wet-lab", finding: "Contradicts rigidification" }, clusterKey: "WET" },
  { id: "n-patel-2025", type: "paper", label: "Patel 2025 — esterase stabilization", discipline: "biochem", year: 2025, paperId: "p-patel-2025", teamRead: true, cluster: { methodology: "Wet-lab", approach: "Structure-guided", finding: "Stabilizing mutations" }, clusterKey: "WET" },
  { id: "n-method-smfret", type: "method", label: "smFRET", discipline: "biophysics", cluster: { methodology: "Wet-lab" }, teamRead: true, clusterKey: "WET" },
  { id: "n-method-dsc", type: "method", label: "DSC", discipline: "biochem", cluster: { methodology: "Wet-lab" }, teamRead: false, clusterKey: "WET" },

  // Directed Evolution
  { id: "n-zara-2024", type: "paper", label: "Ahmed 2024 — psychrophile DE review", discipline: "biochem", year: 2024, paperId: "p-zara-2024", teamRead: true, cluster: { methodology: "Directed Evolution", approach: "Directed evolution" }, clusterKey: "EVO" },
  { id: "n-method-de", type: "method", label: "Directed Evolution", discipline: "biochem", cluster: { methodology: "Directed Evolution", approach: "Directed evolution" }, teamRead: true, clusterKey: "EVO" },
  { id: "n-method-mutat7", type: "method", label: "MutaT7", discipline: "biochem", cluster: { methodology: "Directed Evolution", approach: "Directed evolution" }, teamRead: false, clusterKey: "EVO" },

  // Proteomics / Microbiology
  { id: "n-nguyen-2025", type: "paper", label: "Nguyen 2025 — Sulfolobus proteome", discipline: "microbio", year: 2025, paperId: "p-nguyen-2025", teamRead: true, cluster: { methodology: "Proteomics" }, clusterKey: "PROTEOMICS" },
  { id: "n-freund-2024", type: "paper", label: "Freund 2024 — evolutionary drivers", discipline: "microbio", year: 2024, paperId: "p-freund-2024", teamRead: true, cluster: { methodology: "Proteomics", finding: "Evolutionary drivers" }, clusterKey: "PROTEOMICS" },
  { id: "n-concept-extremophile", type: "concept", label: "Extremophile biology", discipline: "microbio", cluster: { methodology: "Proteomics" }, teamRead: true, clusterKey: "PROTEOMICS" },

  // Process engineering / Materials
  { id: "n-williams-2025", type: "paper", label: "Williams 2025 — continuous flow", discipline: "materials", year: 2025, paperId: "p-williams-2025", teamRead: true, cluster: { methodology: "Process Eng", finding: "Industrial application" }, clusterKey: "PROCESS" },
  { id: "n-rocha-2024", type: "paper", label: "Rocha 2024 — activation energy framework", discipline: "materials", year: 2024, paperId: "p-rocha-2024", teamRead: false, cluster: { methodology: "Process Eng" }, clusterKey: "PROCESS", unknownUnknown: true },
  { id: "n-rocha-dl-2024", type: "paper", label: "Rocha 2024 — DL ceramic failure", discipline: "materials", year: 2024, paperId: "p-rocha-dl-2024", teamRead: false, cluster: { methodology: "Process Eng" }, clusterKey: "PROCESS", unknownUnknown: true },
  { id: "n-chen-hsp-2024", type: "paper", label: "Chen 2024 — HSP90 tumor motifs", discipline: "biochem", year: 2024, paperId: "p-chen-heat-shock-2024", teamRead: false, cluster: { methodology: "Process Eng" }, clusterKey: "PROCESS", unknownUnknown: true },
  { id: "n-method-immobilize", type: "method", label: "Enzyme immobilization", discipline: "materials", cluster: { methodology: "Process Eng" }, teamRead: true, clusterKey: "PROCESS" },
  { id: "n-concept-biocatalysis", type: "concept", label: "Industrial biocatalysis", discipline: "materials", cluster: { methodology: "Process Eng" }, teamRead: true, clusterKey: "PROCESS" },
  { id: "n-concept-arrhenius", type: "concept", label: "Activation-energy kinetics", discipline: "materials", cluster: { methodology: "Process Eng" }, teamRead: false, clusterKey: "PROCESS", unknownUnknown: true },
];

export const graphNodes: GraphNode[] = rawNodes.map((n, i) => {
  const c = methodologyClusters[n.clusterKey];
  const j = jitter(i + 1, 110);
  return {
    ...n,
    // store position as extra fields; react-flow reads them via `position`
    size: n.type === "paper" ? 1 : n.type === "method" ? 0.8 : 0.7,
    // add x,y as top-level fields for consumption
    x: c.center.x + j.x,
    y: c.center.y + j.y,
  } as GraphNode & { x: number; y: number };
});

export const graphEdges: GraphEdge[] = [
  // Core citation/contradiction skeleton
  { id: "e-1", source: "n-chen-2026", target: "n-kawamura-2024", relation: "contradicts", weight: 3 },
  { id: "e-2", source: "n-dmitri-2025", target: "n-kawamura-2024", relation: "contradicts", weight: 2 },
  { id: "e-3", source: "n-marcus-2025", target: "n-baker-2024", relation: "extends", weight: 2 },
  { id: "e-4", source: "n-imoto-2023", target: "n-chen-2026", relation: "cites", weight: 1 },
  { id: "e-5", source: "n-lindorff-2022", target: "n-kawamura-2024", relation: "cites", weight: 1 },
  { id: "e-6", source: "n-lindorff-2022", target: "n-chen-2026", relation: "cites", weight: 1 },
  { id: "e-7", source: "n-abramson-2024", target: "n-jumper-2021", relation: "extends", weight: 2 },
  { id: "e-8", source: "n-baker-2024", target: "n-jumper-2021", relation: "uses-method", weight: 2 },
  { id: "e-9", source: "n-baker-2024", target: "n-method-rfd", relation: "uses-method", weight: 2 },
  { id: "e-10", source: "n-marcus-2025", target: "n-lindorff-2022", relation: "extends", weight: 1 },
  { id: "e-11", source: "n-ovchinnikov-2023", target: "n-method-esm", relation: "uses-method", weight: 1 },
  { id: "e-12", source: "n-schuler-2023", target: "n-kawamura-2024", relation: "contradicts", weight: 2 },
  { id: "e-13", source: "n-chen-2026", target: "n-schuler-2023", relation: "cites", weight: 1 },
  { id: "e-14", source: "n-patel-2025", target: "n-kawamura-2024", relation: "replicates", weight: 2 },
  { id: "e-15", source: "n-williams-2025", target: "n-patel-2025", relation: "uses-method", weight: 1 },
  { id: "e-16", source: "n-williams-2025", target: "n-kawamura-2024", relation: "cites", weight: 1 },
  { id: "e-17", source: "n-nguyen-2025", target: "n-method-md", relation: "uses-method", weight: 1 },
  { id: "e-18", source: "n-freund-2024", target: "n-concept-extremophile", relation: "uses-method", weight: 1 },
  { id: "e-19", source: "n-sali-2024", target: "n-method-cryoem", relation: "uses-method", weight: 1 },
  { id: "e-20", source: "n-sali-2024", target: "n-method-md", relation: "uses-method", weight: 1 },
  { id: "e-21", source: "n-concept-rigid", target: "n-kawamura-2024", relation: "cites", weight: 2 },
  { id: "e-22", source: "n-concept-flex", target: "n-chen-2026", relation: "cites", weight: 2 },
  { id: "e-23", source: "n-dmitri-2025", target: "n-concept-rigid", relation: "contradicts", weight: 1 },
  { id: "e-24", source: "n-zara-2024", target: "n-method-de", relation: "uses-method", weight: 1 },
  { id: "e-25", source: "n-zara-2024", target: "n-method-mutat7", relation: "uses-method", weight: 1 },
  // Cross-disciplinary bridges (unknown unknowns)
  { id: "e-30", source: "n-rocha-2024", target: "n-concept-arrhenius", relation: "cites", weight: 1 },
  { id: "e-31", source: "n-rocha-2024", target: "n-williams-2025", relation: "extends", weight: 1 },
  { id: "e-32", source: "n-rocha-dl-2024", target: "n-rocha-2024", relation: "extends", weight: 1 },
  { id: "e-33", source: "n-chen-hsp-2024", target: "n-sali-2024", relation: "cites", weight: 1 },
  { id: "e-34", source: "n-ovchinnikov-2023", target: "n-marcus-2025", relation: "cites", weight: 1 },
  { id: "e-35", source: "n-method-esm", target: "n-method-af", relation: "uses-method", weight: 1 },
  { id: "e-36", source: "n-method-rosetta", target: "n-method-af", relation: "uses-method", weight: 1 },
  { id: "e-37", source: "n-imoto-2023", target: "n-method-md", relation: "uses-method", weight: 1 },
  { id: "e-38", source: "n-kawamura-2024", target: "n-method-md", relation: "uses-method", weight: 1 },
  { id: "e-39", source: "n-kawamura-2024", target: "n-dataset-thermo", relation: "uses-dataset", weight: 1 },
  { id: "e-40", source: "n-concept-biocatalysis", target: "n-williams-2025", relation: "cites", weight: 1 },
  { id: "e-41", source: "n-concept-biocatalysis", target: "n-method-immobilize", relation: "uses-method", weight: 1 },
];

export const graphGaps: GraphGap[] = [
  {
    id: "gap-psychro-de",
    label: "Directed evolution × psychrophilic proteins",
    disciplines: ["biochem", "microbio"],
    center: { x: 770, y: 470 },
    radius: 110,
    paperCount: 6,
    openQuestions: 3,
    why: "Only 6 papers in the surveyed literature apply modern directed evolution to psychrophilic proteins, despite clear biotechnological demand for low-temperature biocatalysis.",
    hypothesisSeeds: ["h-3"],
  },
  {
    id: "gap-baker-repl",
    label: "Replication of Baker-lab de novo designs",
    disciplines: ["cs", "biochem"],
    center: { x: 560, y: 330 },
    radius: 90,
    paperCount: 3,
    openQuestions: 2,
    why: "Baker 2024 reported 7 ultra-thermostable designs — but no independent lab has published a replication to date.",
    hypothesisSeeds: ["h-4"],
  },
  {
    id: "gap-industrial-flow",
    label: "Continuous-flow industrial biocatalysis with extremophile enzymes",
    disciplines: ["materials", "biochem"],
    center: { x: 960, y: 590 },
    radius: 100,
    paperCount: 4,
    openQuestions: 4,
    why: "Williams 2025 is one of few published pilot-scale demonstrations; no long-duration (>300h) studies and no cross-enzyme benchmarks exist.",
    hypothesisSeeds: ["h-1", "h-5"],
  },
];

export const unknownUnknowns: { nodeId: string; why: string }[] = [
  {
    nodeId: "n-rocha-2024",
    why: "Materials-science paper on ceramic thermal aging uses an activation-energy framework directly applicable to enzyme denaturation kinetics. Nobody in the comp bio literature has cited it yet.",
  },
  {
    nodeId: "n-rocha-dl-2024",
    why: "Graph neural network trained on ceramic cyclic-thermal-load data discovered a transferable activation-energy feature. Same method could work on enzyme half-life datasets.",
  },
  {
    nodeId: "n-chen-hsp-2024",
    why: "Cancer biology paper on HSP90 allostery shares activation motifs with the archaeal chaperones in your Sali 2024 reading. Cross-system allostery transfer is unexplored in your lab.",
  },
];
