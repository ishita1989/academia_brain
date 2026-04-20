import type { Alert } from "../types";

export const alerts: Alert[] = [
  {
    id: "al-chen-contradiction",
    type: "contradiction",
    priority: "high",
    title: "A paper published yesterday contradicts your lab's hypothesis",
    detail:
      "Chen et al. 2026 (bioRxiv) shows OPC water yields 27–41% higher backbone flexibility in archaeal enzymes than the TIP3P-based Kawamura 2024 figures. This directly disagrees with the rigidification conclusion in your Nat Comm paper.",
    paperId: "p-chen-2026",
    createdAt: "2026-04-17T19:42:00Z",
    actionLabel: "Open paper",
    actionHref: "/reader/p-chen-2026",
  },
  {
    id: "al-new-hypothesis",
    type: "hypothesis",
    priority: "med",
    title: "A new hypothesis your lab could test this quarter",
    detail:
      "Drawing on Chen 2026's OPC findings and your lab's 12-enzyme archaeal MD panel, the brain proposes: re-simulating the panel under OPC water at 363 K will overturn the rigidification conclusion in ≥3 systems. 3 supporting papers, 1 contradicting (Kawamura 2024). Ready to promote to an ideation session.",
    actorIds: ["m-marcus", "m-priya"],
    createdAt: "2026-04-18T06:15:00Z",
    actionLabel: "Open in Ideation Lab",
    actionHref: "/ideation/ses-enzymes-95c",
  },
  {
    id: "al-cross-pollination",
    type: "cross-pollination",
    priority: "low",
    title: "Marcus just annotated 2 papers relevant to your R01 Section 3",
    detail:
      "Marcus highlighted key passages in Lindorff-Larsen 2022 (force-field comparison) and Imoto 2023 (explicit solvent effects). Both directly support the methodology choices you're drafting.",
    actorIds: ["m-marcus"],
    createdAt: "2026-04-18T07:38:00Z",
    actionLabel: "View annotations",
    actionHref: "/reader/p-lindorff-2022",
  },
  {
    id: "al-replication",
    type: "replication",
    priority: "med",
    title: "Replication confirmed — your 2024 esterase stability finding",
    detail:
      "Patel et al. 2025 (PNAS) independently replicated your 18–24 °C Tm improvement on industrial esterases using a structure-guided approach with evolutionary constraints.",
    paperId: "p-patel-2025",
    createdAt: "2026-04-15T11:20:00Z",
    actionLabel: "Open paper",
    actionHref: "/reader/p-patel-2025",
  },
  {
    id: "al-dataset",
    type: "dataset",
    priority: "low",
    title: "New PDB dataset relevant to your Approach section",
    detail:
      "The Nguyen 2025 proteome dataset (48 thermostability-divergent proteins from S. acidocaldarius) was deposited last week. 11 of the 48 proteins fall within your Aim 2 scope.",
    paperId: "p-nguyen-2025",
    createdAt: "2026-04-14T08:00:00Z",
    actionLabel: "Open paper",
    actionHref: "/reader/p-nguyen-2025",
  },
  {
    id: "al-citing",
    type: "citing",
    priority: "low",
    title: "A new paper cites your Kawamura 2024 work",
    detail:
      "Williams 2025 (ACS Catal.) cites your backbone-rigidification framework as motivation for their immobilization strategy. They achieved 120 h continuous-flow retention at 75 °C.",
    paperId: "p-williams-2025",
    createdAt: "2026-04-11T15:50:00Z",
    actionLabel: "Open paper",
    actionHref: "/reader/p-williams-2025",
  },
  {
    id: "al-grant",
    type: "grant",
    priority: "med",
    title: "NSF MCB matches your current work — deadline 2026-06-15",
    detail:
      "NSF MCB-2026-Q3 call explicitly mentions computational-experimental integration for extremophile enzyme engineering. Your active R01 notebook already covers 4 of the 6 priority topics.",
    createdAt: "2026-04-10T09:05:00Z",
    actionLabel: "Draft in Notebook",
    actionHref: "/writing",
  },
  {
    id: "al-method",
    type: "method",
    priority: "low",
    title: "New methodology paper — Dmitri's systematic review",
    detail:
      "Dmitri published his systematic review of TIP3P artifacts in the archaeal MD literature. The review estimates ~22% of published conclusions may be solvent-artifact-dependent — directly informs H-2.",
    paperId: "p-dmitri-2025",
    createdAt: "2026-03-04T12:00:00Z",
    actionLabel: "Open paper",
    actionHref: "/reader/p-dmitri-2025",
  },
];
