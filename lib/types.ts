export type Discipline = "biophysics" | "cs" | "biochem" | "microbio" | "materials";

export type PaperSource = "arxiv" | "biorxiv" | "pubmed" | "nature" | "cell" | "science" | "elife" | "pnas" | "acm" | "neurips";

export interface Author {
  id: string;
  name: string;
  affiliation: string;
  orcid?: string;
}

export interface Paper {
  id: string;
  title: string;
  authors: string[]; // author ids
  year: number;
  venue: string;
  source: PaperSource;
  externalId: string; // e.g., arXiv:2401.12345, bioRxiv 2026.01.14, PMID 12345678
  externalUrl: string;
  doi?: string;
  abstract: string;
  tags: string[];
  disciplines: Discipline[];
  methodology: string[];
  findings: string[];
  confidence: number; // 0..1
  replicated: boolean;
  readByTeam: string[]; // team member ids
  citationCount: number;
}

export type TeamRole = "pi" | "postdoc" | "phd" | "collaborator";

export interface TeamMember {
  id: string;
  authorId: string;
  role: TeamRole;
  joinedAt: string;
  isCurrentUser?: boolean;
  color: string;
}

export interface Citation {
  paperId: string;
  page: number;
  sentence: string;
}

export interface SynthesisSection {
  id: string;
  heading: string;
  kind: "findings" | "methods" | "questions" | "evidence-map" | "annotations";
  items: SynthesisItem[];
}

export interface SynthesisItem {
  id: string;
  text: string;
  citations: Citation[];
  kind?: "statement" | "contradiction" | "open-question" | "consensus";
  authorId?: string; // null = AI
  confidence?: number;
}

export interface VersionEvent {
  id: string;
  date: string;
  actor: string;
  summary: string;
}

export interface Synthesis {
  id: string;
  title: string;
  question: string;
  sections: SynthesisSection[];
  collaborators: string[];
  versionHistory: VersionEvent[];
  createdAt: string;
  updatedAt: string;
  paperCount: number;
  contradictions: number;
}

export type HypothesisStatus = "draft" | "voted" | "promoted";

export interface Hypothesis {
  id: string;
  statement: string;
  supportingPapers: string[];
  contradictingPapers: string[];
  votes: { memberId: string; value: 1 | -1 }[];
  createdBy: string;
  createdAt: string;
  status: HypothesisStatus;
  linkedDatasets?: string[];
  suggestedMethods?: string[];
  brainSuggestion?: string;
}

export interface IdeationSession {
  id: string;
  title: string;
  research: string;
  participants: string[];
  hypotheses: string[]; // hypothesis ids
  startedAt: string;
  active: boolean;
  evolutionTimeline: { date: string; summary: string; hypothesisId?: string }[];
}

export type AlertType =
  | "contradiction"
  | "replication"
  | "dataset"
  | "citing"
  | "grant"
  | "method"
  | "cross-pollination"
  | "hypothesis";

export interface Alert {
  id: string;
  type: AlertType;
  title: string;
  detail: string;
  paperId?: string;
  actorIds?: string[];
  priority: "high" | "med" | "low";
  createdAt: string;
  actionLabel?: string;
  actionHref?: string;
}

export type BlockType =
  | "heading"
  | "text"
  | "methodology"
  | "experimental-plan"
  | "research-note"
  | "ai-insight"
  | "reference"
  | "data"
  | "figure"
  | "callout"
  | "decision"
  | "date-header"
  | "image"
  | "table";

export interface TableBlockData {
  headers: string[];
  rows: string[][];
  caption?: string;
}

export interface ImageBlockData {
  src?: string; // data URL or remote URL
  placeholder?: string; // text shown when no image (e.g. "Gel image — lane 1 ladder…")
  caption?: string;
  width?: number;
  annotations?: { label: string; y: number }[]; // vertical lane labels (Benchling-style)
}

export type BlockSource =
  | "hand-written"
  | "ai-generated"
  | "from-paper"
  | "from-synthesis"
  | "from-hypothesis"
  | "pasted";

export interface NotebookBlock {
  id: string;
  type: BlockType;
  content: string;
  subcontent?: string; // e.g., methodology params, figure caption, etc.
  source: BlockSource;
  sourceRef?: string; // paper id, synthesis id, etc.
  authorId: string;
  createdAt: string;
  editedByIds?: string[];
  editedAt?: string;
  citations?: Citation[];
  aiGroundedIn?: string[]; // paper ids
  commentThreadId?: string;
  flag?: "contradiction" | "gap" | "question";
  flagMessage?: string;
  tabId?: string; // which tab this block lives on; defaults to "notes"
  tags?: string[]; // block-level tags
  formatting?: { bold?: boolean; italic?: boolean; underline?: boolean; heading?: 0 | 1 | 2 | 3; list?: "bullet" | "number" | null };
  tableData?: TableBlockData;
  imageData?: ImageBlockData;
  dateISO?: string; // for date-header blocks
}

export type NotebookMode =
  | "manuscript"
  | "r01"
  | "nsf"
  | "erc"
  | "peer-review"
  | "protocol"
  | "lit-review"
  | "experiment-plan";

export type CollaboratorRole = "owner" | "editor" | "commenter" | "viewer";

export interface CollaboratorEntry {
  memberId: string;
  role: CollaboratorRole;
  scope: "whole" | "section" | "block";
  status: "active" | "invited";
  invitedAt?: string;
}

export interface NotebookComment {
  id: string;
  threadId: string;
  blockId: string;
  authorId: string;
  body: string;
  createdAt: string;
  resolved: boolean;
  replies: { id: string; authorId: string; body: string; createdAt: string }[];
}

export interface NotebookTab {
  id: string;
  label: string;
  icon?: string; // lucide icon name hint, resolved in UI
  template?: string; // template id; "blank" by default
  userCreated?: boolean;
}

export interface Notebook {
  id: string;
  title: string;
  description: string;
  mode: NotebookMode;
  status: "draft" | "in-review" | "submitted" | "published";
  blocks: NotebookBlock[];
  collaborators: CollaboratorEntry[];
  activity: { id: string; actorId: string; action: string; at: string; target?: string }[];
  comments: NotebookComment[];
  linkedSyntheses: string[];
  linkedHypotheses: string[];
  createdAt: string;
  updatedAt: string;
  tabs?: NotebookTab[]; // if absent, UI uses the default set
  tags?: string[]; // notebook-level tags
}

export interface Decision {
  id: string;
  question: string;
  choice: string;
  rationale: string;
  alternatives: { label: string; reason: string }[];
  citations: string[]; // paper ids
  decidedBy: string[];
  decidedAt: string;
}

export interface GraphNode {
  id: string;
  type: "paper" | "method" | "finding" | "dataset" | "author" | "concept" | "hypothesis";
  label: string;
  discipline: Discipline;
  year?: number;
  paperId?: string;
  cluster: { methodology?: string; finding?: string; approach?: string };
  teamRead: boolean;
  size?: number;
  landmark?: boolean;
  unknownUnknown?: boolean;
  // Rich content shown in the detail panel for non-paper nodes
  detail?: {
    summary: string;
    definition?: string;
    firstUsedByLab?: string;
    teamUsageCount?: number;
    keyPapers?: string[]; // paper ids
    openQuestions?: string[];
    stats?: { label: string; value: string }[];
  };
  userAdded?: boolean;
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  relation: "cites" | "extends" | "contradicts" | "replicates" | "uses-method" | "uses-dataset" | "co-authored";
  weight?: number;
}

export interface GraphGap {
  id: string;
  label: string;
  disciplines: Discipline[];
  center: { x: number; y: number };
  radius: number;
  paperCount: number;
  openQuestions: number;
  why: string;
  hypothesisSeeds: string[];
}

export interface ChatMessage {
  id: string;
  role: "user" | "brain";
  content: string;
  citations?: Citation[];
  followups?: string[];
  surfaceContext?: string;
  mode?: "ask" | "suggest" | "decide";
  at: string;
}

export interface SurfaceContext {
  surface: "dashboard" | "synthesis" | "ideation" | "writing" | "graph" | "reader" | "onboarding" | null;
  entityId?: string;
  entityLabel?: string;
  extra?: string;
}
