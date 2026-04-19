// Rich detail content for every non-paper graph node.
// Paper nodes pull detail from `papers.ts` via `paperById`.

export interface NodeDetail {
  summary: string;
  definition?: string;
  firstUsedByLab?: string;
  teamUsageCount?: number;
  keyPapers?: string[]; // paper ids
  openQuestions?: string[];
  stats?: { label: string; value: string }[];
}

export const nodeDetails: Record<string, NodeDetail> = {
  // ===== Methods =====
  "n-method-md": {
    summary: "Molecular Dynamics simulation — the workhorse technique of your lab. Used to probe protein dynamics at atomic resolution by numerically integrating Newton's equations.",
    definition: "Numerical simulation of atomic motion using classical force fields (typically AMBER or CHARMM) + water models (TIP3P, OPC, TIP4P-Ew).",
    firstUsedByLab: "2022-09 (decision d-md-over-rosetta-sim)",
    teamUsageCount: 38,
    keyPapers: ["p-kawamura-2024", "p-lindorff-2022", "p-chen-2026", "p-imoto-2023", "p-marcus-2025", "p-dmitri-2025"],
    openQuestions: [
      "Does the rigidification signature survive OPC water at industrial temperatures? (H-2)",
      "Is 1 μs sufficient for archaeal loop-region convergence?",
    ],
    stats: [
      { label: "Force-field default", value: "AMBER-ff14SB" },
      { label: "Water model (historical)", value: "TIP3P" },
      { label: "Compute/sim", value: "~100 GPU-hr/μs" },
    ],
  },
  "n-method-af": {
    summary: "AlphaFold 2/3 — deep-learning structure prediction. Near-experimental accuracy on folded domains; state-of-the-art on complexes as of AF3 (2024).",
    definition: "Attention-based neural architecture (Evoformer + structure module) trained on evolutionary + structural data; AF3 adds a diffusion-based output head for arbitrary biomolecular complexes.",
    firstUsedByLab: "2023-02 (added to validation pipeline)",
    teamUsageCount: 27,
    keyPapers: ["p-jumper-2021", "p-abramson-2024"],
    openQuestions: [
      "How well does AF2 pLDDT correlate with thermostability for de novo designs?",
      "Does AF3 capture loop-region flexibility relevant to your Aim 1?",
    ],
    stats: [
      { label: "Primary use in lab", value: "De novo design validation" },
      { label: "Current version", value: "AlphaFold 3 (Abramson 2024)" },
    ],
  },
  "n-method-esm": {
    summary: "ESM-2 — protein language model. Provides contextual embeddings useful for downstream tasks including Tm prediction and variant-effect scoring.",
    definition: "650M–15B parameter transformer trained on UniRef50 via masked language modeling on protein sequences.",
    firstUsedByLab: "2024-04 (used in Dmitri & Marcus portability benchmark)",
    teamUsageCount: 9,
    keyPapers: ["p-ovchinnikov-2023", "p-marcus-2025"],
    openQuestions: [
      "Do ESM-2 embeddings predict force-field-portability pLDDT drop? (H-4)",
    ],
    stats: [
      { label: "Parameters", value: "650M (t33)" },
      { label: "Training", value: "UniRef50 MLM" },
    ],
  },
  "n-method-rosetta": {
    summary: "Rosetta — classical protein design and scoring framework. Lab uses Rosetta for design-phase optimization, pairing with AlphaFold2 for validation.",
    definition: "Energy-function-based protein design and scoring suite developed by the Baker lab.",
    firstUsedByLab: "2024-02 (decision d-rosetta-af)",
    teamUsageCount: 14,
    keyPapers: ["p-baker-2024"],
    openQuestions: [
      "Does Rosetta score + AF2 pLDDT together outperform either alone for thermostability prediction?",
    ],
    stats: [{ label: "Primary use in lab", value: "Design-phase ranking" }],
  },
  "n-method-rfd": {
    summary: "RFdiffusion — generative diffusion model for protein backbone design. The Baker-lab method behind the 2024 ultra-thermostable hydrolases.",
    definition: "Denoising diffusion probabilistic model over 3D protein backbones; conditioned on binding targets, symmetry, or motifs.",
    firstUsedByLab: "2024-10 (pilot use for extremophile design)",
    teamUsageCount: 3,
    keyPapers: ["p-baker-2024"],
    openQuestions: [
      "Can RFdiffusion + extremophile sequence priors produce designs that survive 95°C for 72h+?",
    ],
  },
  "n-method-cryoem": {
    summary: "Cryo-EM — high-resolution single-particle electron microscopy. Lab uses it primarily for large archaeal assemblies in collaboration with the Sali group.",
    definition: "Electron cryomicroscopy of vitrified protein samples, yielding 3D density maps at resolutions routinely 2–3 Å on modern detectors.",
    firstUsedByLab: "2024-06 (via Sali collaboration on PfuGroEL)",
    teamUsageCount: 4,
    keyPapers: ["p-sali-2024"],
    openQuestions: ["Can integrative cryo-EM + MD disambiguate rigidification vs. flexibility signatures?"],
  },
  "n-method-smfret": {
    summary: "Single-molecule FRET — direct experimental probe of conformational dynamics at the microsecond scale. The critical experimental anchor for Aim 2.",
    definition: "Förster resonance energy transfer measured on individual labeled molecules; reveals distance distributions and dynamics not accessible to ensemble methods.",
    firstUsedByLab: "Not yet used in-lab; Aim 2 proposes adopting it via Schuler-group protocol",
    teamUsageCount: 0,
    keyPapers: ["p-schuler-2023"],
    openQuestions: [
      "Feasibility of Cy3/Cy5 labeling on archaeal enzymes — reviewer-2 raised this.",
    ],
    stats: [{ label: "Instrument", value: "Custom confocal (Schuler-group design)" }],
  },
  "n-method-dsc": {
    summary: "Differential Scanning Calorimetry — ensemble thermal denaturation measurement. Returns Tm and ΔH values directly; complements MD for validation.",
    definition: "Measures heat capacity as a function of temperature, revealing thermal transitions (Tm) and thermodynamic parameters.",
    firstUsedByLab: "2023-11 (occasional use via biophysics core)",
    teamUsageCount: 2,
    stats: [{ label: "Typical sample", value: "~50 μg, 25–100°C sweep" }],
  },
  "n-method-de": {
    summary: "Directed Evolution — experimental protein engineering via iterative random mutagenesis + selection. Gap-adjacent for this lab: very little use on psychrophiles in the literature.",
    definition: "Laboratory analog of natural selection: generate a mutant library, select/screen for desired function, iterate.",
    firstUsedByLab: "Not yet used in-lab; Zara's psychrophile-DE hypothesis (H-3) proposes bringing it in.",
    teamUsageCount: 0,
    keyPapers: ["p-zara-2024"],
    openQuestions: ["Why so few DE studies on psychrophiles? (Gap G-01)"],
  },
  "n-method-mutat7": {
    summary: "MutaT7 — continuous in-vivo mutagenesis via T7 RNA polymerase fusion. A modern DE approach Zara wants to adopt for psychrophilic lipases.",
    definition: "A catalytically dead Cas protein + error-prone T7 RNAP generates targeted hypermutation in living cells under antibiotic selection.",
    firstUsedByLab: "Not yet used in-lab",
    teamUsageCount: 0,
    keyPapers: ["p-zara-2024"],
    openQuestions: [
      "Can MutaT7 be adapted to the low-temperature growth regime of psychrophilic hosts? (H-3)",
    ],
  },
  "n-method-immobilize": {
    summary: "Enzyme immobilization — attaching enzymes to solid supports (mesoporous silica, polymer resins) for continuous-flow reactor use.",
    definition: "Covalent, electrostatic, or entrapment-based fixation of enzymes onto solid carriers while preserving activity.",
    firstUsedByLab: "Not yet used in-lab; Williams 2025 informs Aim 3 approach",
    teamUsageCount: 0,
    keyPapers: ["p-williams-2025", "p-patel-2025"],
    openQuestions: ["Does immobilization preserve the flexibility/dynamics signal identified in Aim 1?"],
  },

  // ===== Datasets =====
  "n-dataset-thermo": {
    summary: "ThermoMutDB — curated database of single-point mutations with experimentally measured ΔTm values. Standard benchmark for Tm-prediction models.",
    definition: "Open database of ~14,000 protein mutation–ΔTm pairs curated from literature.",
    teamUsageCount: 5,
    keyPapers: ["p-ovchinnikov-2023"],
    stats: [
      { label: "Size", value: "~14,000 mutation–ΔTm pairs" },
      { label: "Coverage", value: "~300 proteins" },
      { label: "Access", value: "Open (biosig.unimelb.edu.au/thermomutdb)" },
    ],
  },

  // ===== Concepts =====
  "n-concept-rigid": {
    summary: "Backbone rigidification hypothesis — the idea that thermostable archaeal enzymes are stable because they are stiffer, not more salt-bridged. Your 2024 Nat Comm paper's central claim. Now under active challenge.",
    definition: "The hypothesis that thermostability in hyperthermophilic proteins arises primarily from reduced backbone motion in loop regions, measurable as lowered RMSF.",
    firstUsedByLab: "Your Kawamura 2024 Nat Comm paper",
    keyPapers: ["p-kawamura-2024", "p-chen-2026", "p-schuler-2023", "p-dmitri-2025"],
    openQuestions: [
      "Does the claim survive OPC water re-simulation across the full 12-enzyme panel?",
      "Is rigidification a sufficient mechanism, or does it coexist with dynamic allostery?",
    ],
    stats: [{ label: "Confidence (current)", value: "0.50 — contested" }],
  },
  "n-concept-flex": {
    summary: "Loop-region flexibility — the counter-narrative to rigidification. Schuler's smFRET observations + Chen's OPC simulations converge on this reading of the data.",
    definition: "The observation that archaeal thermostable enzymes retain meaningful conformational dynamics in key loop regions at physiological (and industrial) temperatures.",
    firstUsedByLab: "Recently, via synthesis updates after Chen 2026",
    keyPapers: ["p-chen-2026", "p-schuler-2023", "p-imoto-2023"],
    openQuestions: ["How much flexibility is required for catalytic function at 85–95°C?"],
  },
  "n-concept-plddt": {
    summary: "pLDDT confidence — AlphaFold's per-residue predicted confidence score. Used in lab as a de novo design acceptance filter.",
    definition: "Per-residue predicted Local Distance Difference Test score (0–100) output by AlphaFold. Values >90 are typically taken as high-confidence.",
    teamUsageCount: 18,
    keyPapers: ["p-jumper-2021", "p-abramson-2024", "p-marcus-2025"],
    openQuestions: [
      "Does pLDDT drop under force-field portability stress-test predict design failure? (H-4)",
    ],
    stats: [{ label: "Lab acceptance threshold", value: ">85 mean pLDDT" }],
  },
  "n-concept-denovo": {
    summary: "De novo enzyme design — computational creation of new proteins from scratch. Baker 2024 proved ultra-thermostability is achievable; your lab's R01 Aim 3 extends this to industrial biocatalysis.",
    definition: "Generation of novel protein sequences and structures by computation, without direct natural homology, followed by experimental validation.",
    keyPapers: ["p-baker-2024", "p-marcus-2025"],
    openQuestions: [
      "Can Baker-lab designs be independently replicated? (Gap G-02)",
      "Do the designs retain function on industrial substrates?",
    ],
  },
  "n-concept-chaperonin": {
    summary: "Chaperonin assemblies — large protein complexes (e.g. GroEL, PfuGroEL) that assist folding. Your lab has one Sali-group collaboration paper on this.",
    definition: "Multi-subunit protein folding machines that encapsulate unfolded substrates in an ATP-driven cycle.",
    keyPapers: ["p-sali-2024"],
  },
  "n-concept-extremophile": {
    summary: "Extremophile biology — organisms (archaea, bacteria) thriving in extreme temperature, pH, salinity, or pressure. The biological source material for this lab's work.",
    definition: "Organisms with optimal growth in conditions hostile to mesophilic life (hyperthermophiles >80°C; psychrophiles <15°C; halophiles, acidophiles, piezophiles).",
    keyPapers: ["p-nguyen-2025", "p-freund-2024"],
    openQuestions: [
      "Are extremophile adaptations always domain-convergent, or clade-specific?",
    ],
  },
  "n-concept-biocatalysis": {
    summary: "Industrial biocatalysis — the use of enzymes in chemical manufacturing. The translational target for the lab's R01 Aim 3.",
    definition: "Use of biological catalysts (enzymes, whole cells) in industrial-scale chemical synthesis — often at elevated temperatures, non-aqueous solvents, or continuous-flow conditions.",
    keyPapers: ["p-williams-2025", "p-patel-2025"],
    openQuestions: [
      "What continuous-flow runtime is achievable at 85–95°C with extremophile enzymes?",
      "Which substrate classes benefit most from thermostable biocatalysts?",
    ],
  },
  "n-concept-arrhenius": {
    summary: "Activation-energy kinetics — classical Arrhenius framework for activated processes. Rocha 2024 (materials science) extended it to cooperative defect migration; transferable to enzyme denaturation kinetics.",
    definition: "k = A·exp(-Ea/RT): the rate of an activated process follows an exponential dependence on inverse temperature, with activation energy Ea.",
    keyPapers: ["p-rocha-2024", "p-rocha-dl-2024"],
    openQuestions: [
      "Can the Rocha 2024 cooperative framework predict enzyme half-life better than plain Arrhenius extrapolation? (H-5)",
    ],
  },
};
