import type { TeamMember } from "../types";

export const team: TeamMember[] = [
  { id: "m-priya", authorId: "a-priya", role: "postdoc", joinedAt: "2025-09-01", isCurrentUser: true, color: "bg-indigo-500" },
  { id: "m-hiro", authorId: "a-hiro", role: "pi", joinedAt: "2022-03-15", color: "bg-violet-500" },
  { id: "m-marcus", authorId: "a-marcus", role: "phd", joinedAt: "2023-09-01", color: "bg-amber-500" },
  { id: "m-zara", authorId: "a-zara", role: "phd", joinedAt: "2024-09-01", color: "bg-emerald-500" },
  { id: "m-dmitri", authorId: "a-dmitri", role: "phd", joinedAt: "2024-09-01", color: "bg-sky-500" },
  { id: "m-okafor", authorId: "a-okafor", role: "collaborator", joinedAt: "2026-02-12", color: "bg-rose-500" },
];

export const currentUserId = "m-priya";
export const labName = "Kawamura Lab";
export const institution = "UCSF Computational Biology";
export const activeResearchQuestion =
  "What structural and dynamic principles govern protein folding stability in extreme-temperature environments, and can we de novo design thermostable enzymes for industrial use?";
