import type { Decision } from "../types";

export const decisions: Decision[] = [
  {
    id: "d-amber-charmm",
    question: "Why did we choose AMBER-ff14SB over CHARMM36m for our archaeal simulations?",
    choice: "AMBER-ff14SB",
    rationale:
      "Lindorff-Larsen 2022 benchmarked both across 12 archaeal globular proteins and found AMBER gives 15–24% tighter loop-region RMSF agreement with NMR S² order parameters. Our pipeline already had AMBER parameterization files in place, and sticking with a single force field made cross-study comparability easier for the Nat Comm paper.",
    alternatives: [
      { label: "CHARMM36m", reason: "Better on mesophilic controls but over-rigidifies; marginal for our clade." },
      { label: "AMOEBA polarizable", reason: "Higher accuracy but 8× slower, not viable at the scale we needed." },
    ],
    citations: ["p-lindorff-2022"],
    decidedBy: ["m-hiro", "m-priya"],
    decidedAt: "2023-11-02",
  },
  {
    id: "d-tip3p-opc",
    question: "Why did we stay on TIP3P instead of OPC for the Nat Comm 2024 paper?",
    choice: "TIP3P",
    rationale:
      "When we designed the study in late 2022, OPC was still less battle-tested for protein MD and the broader field's TIP3P corpus made comparison easier. With Chen 2026 and Imoto 2023 now showing material OPC-vs-TIP3P differences at industrial temperatures, this is the single decision we would most likely revisit.",
    alternatives: [
      { label: "OPC", reason: "We now know this would have matched experimental Tm more closely." },
      { label: "TIP4P-Ew", reason: "Good option we didn't fully benchmark; Imoto 2023 supports it." },
    ],
    citations: ["p-kawamura-2024", "p-imoto-2023", "p-chen-2026"],
    decidedBy: ["m-hiro", "m-priya"],
    decidedAt: "2022-11-15",
  },
  {
    id: "d-explicit-implicit",
    question: "Why explicit solvent instead of implicit (GBSA)?",
    choice: "Explicit TIP3P",
    rationale:
      "Implicit solvent free-energies were consistently 5–10 kcal/mol off from experimental unfolding data at high T. For dynamics measurements on loop regions explicit solvent is standard.",
    alternatives: [{ label: "GBSA implicit", reason: "Faster but inaccurate at industrial temperatures." }],
    citations: ["p-imoto-2023"],
    decidedBy: ["m-hiro"],
    decidedAt: "2022-09-20",
  },
  {
    id: "d-rosetta-af",
    question: "Why do we use Rosetta for design but AlphaFold2 for validation?",
    choice: "Rosetta design, AlphaFold2 validation",
    rationale:
      "Rosetta's energy function is battle-tested for design-phase optimization. AlphaFold2's end-to-end accuracy is better for validation. Baker 2024 uses exactly this split and showed 7 ultra-thermostable α/β hydrolases as proof.",
    alternatives: [
      { label: "AlphaFold2 for both", reason: "Weak at design-phase ranking; we tried this in 2023 and abandoned it." },
      { label: "RFdiffusion standalone", reason: "New, promising, but less mature validation loop." },
    ],
    citations: ["p-baker-2024"],
    decidedBy: ["m-hiro", "m-priya", "m-marcus"],
    decidedAt: "2024-02-05",
  },
  {
    id: "d-journal-choice",
    question: "Why did we submit the backbone-rigidification paper to Nature Communications instead of eLife?",
    choice: "Nature Communications",
    rationale:
      "Nat Comm has better visibility in the structural biology and industrial biotech communities we need to reach for downstream biocatalysis collaborations. eLife's open-review model was attractive but the reviewer pool for archaeal MD at eLife is thinner.",
    alternatives: [
      { label: "eLife", reason: "Open review, but narrower reviewer pool for this niche." },
      { label: "JCIM", reason: "Too specialized; would bury the finding." },
    ],
    citations: ["p-kawamura-2024"],
    decidedBy: ["m-hiro"],
    decidedAt: "2024-01-12",
  },
  {
    id: "d-md-over-rosetta-sim",
    question: "Why did we pick MD over Rosetta for our thermostability simulations?",
    choice: "MD simulation",
    rationale:
      "Our core question is dynamics — how backbone flexibility changes with temperature — not single-structure scoring. Rosetta's energy function doesn't natively capture dynamic ensembles, and MD is the field standard for RMSF and residue-level flexibility analysis. We use Rosetta only on the design-phase side.",
    alternatives: [
      { label: "Rosetta relax + repack", reason: "Single-structure; can't measure dynamics." },
      { label: "Elastic network models", reason: "Computationally cheap but qualitative; not sufficient for Nat Comm." },
    ],
    citations: ["p-kawamura-2024", "p-lindorff-2022"],
    decidedBy: ["m-hiro", "m-priya"],
    decidedAt: "2023-05-10",
  },
  {
    id: "d-targets",
    question: "Why did we focus on T. kodakarensis over P. furiosus for Aim 1?",
    choice: "T. kodakarensis (with P. furiosus as validation)",
    rationale:
      "Better experimental characterization available from the Fukuda group; more complete growth-temperature-controlled proteomics. P. furiosus reserved for validation of top candidates.",
    alternatives: [{ label: "P. furiosus primary", reason: "Better-known genetics but spottier stability data." }],
    citations: ["p-nguyen-2025"],
    decidedBy: ["m-hiro", "m-priya"],
    decidedAt: "2025-10-01",
  },
  {
    id: "d-r01-aims",
    question: "Why three Aims (comp + exp + industrial) rather than focusing narrowly on computational?",
    choice: "Three integrated Aims",
    rationale:
      "NSF MCB study section explicitly prefers integrated comp-exp-translational proposals for this funding cycle. The Williams 2025 continuous-flow result gives us a legitimate industrial hook that connects back to Aims 1 and 2.",
    alternatives: [
      { label: "Narrow computational-only", reason: "Would fit specialized programs but not the NIH R01 we're targeting." },
      { label: "Experimental-only", reason: "Doesn't leverage the lab's computational strength." },
    ],
    citations: ["p-williams-2025"],
    decidedBy: ["m-hiro", "m-priya"],
    decidedAt: "2026-02-20",
  },
];

export function decisionById(id: string): Decision | undefined {
  return decisions.find((d) => d.id === id);
}
