export interface Annotation {
  id: string;
  paperId: string;
  text: string;
  quote: string;
  authorId: string;
  at: string;
  isContradictionHighlight?: boolean;
}

export const annotations: Annotation[] = [
  {
    id: "an-1",
    paperId: "p-chen-2026",
    quote:
      "Under OPC water at 363 K, backbone flexibility is 27–41% higher in loop regions than the TIP3P-derived Kawamura et al. (2024) figures.",
    text: "This is the sentence that directly overturns our Nat Comm 2024 Fig 3c. Priya wrote this annotation within 4 hours of the paper being posted.",
    authorId: "m-priya",
    at: "2026-04-17T22:15:00Z",
    isContradictionHighlight: true,
  },
  {
    id: "an-2",
    paperId: "p-lindorff-2022",
    quote: "AMBER-ff14SB provides superior loop-region accuracy for thermostable variants relative to CHARMM36m.",
    text: "Use this quote in R01 Aim 1 methodology justification.",
    authorId: "m-marcus",
    at: "2026-04-17T23:02:00Z",
  },
  {
    id: "an-3",
    paperId: "p-lindorff-2022",
    quote: "at the cost of slight over-rigidification on mesophilic controls.",
    text: "Don't forget this caveat — will matter for any mesophilic control experiments.",
    authorId: "m-marcus",
    at: "2026-04-17T23:08:00Z",
  },
  {
    id: "an-4",
    paperId: "p-imoto-2023",
    quote: "OPC yields 3–7 kcal/mol lower unfolding barriers, matching experiment more closely.",
    text: "Concrete magnitude we can cite in Significance.",
    authorId: "m-marcus",
    at: "2026-04-17T23:20:00Z",
  },
  {
    id: "an-5",
    paperId: "p-kawamura-2024",
    quote: "We propose backbone rigidification — not increased salt-bridge networks — as the dominant driver of hyperthermostability in this clade.",
    text: "The claim under threat from Chen 2026 and Volkov 2025. Revisit this framing in any new paper.",
    authorId: "m-priya",
    at: "2026-04-18T07:10:00Z",
  },
  {
    id: "an-6",
    paperId: "p-schuler-2023",
    quote: "We observe microsecond transitions in three archaeal enzymes that cannot be reconciled with a purely rigidified mechanism.",
    text: "Independent experimental evidence for flexibility — will be strongest single support for H-2.",
    authorId: "m-hiro",
    at: "2026-03-22T15:20:00Z",
  },
];

export function annotationsFor(paperId: string): Annotation[] {
  return annotations.filter((a) => a.paperId === paperId);
}
