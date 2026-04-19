"use client";
import * as React from "react";
import { notFound, useParams } from "next/navigation";
import { notebookById } from "@/lib/mock-data/notebooks";
import { useStore } from "@/lib/store";
import { NotebookBlockRenderer } from "@/components/writing/block-renderer";
import { OutlineRail } from "@/components/writing/outline-rail";
import { ContextPanel } from "@/components/writing/context-panel";
import { InviteModal } from "@/components/writing/invite-modal";
import { ModeSwitcher } from "@/components/writing/mode-switcher";
import { TabsBar } from "@/components/writing/tabs-bar";
import { AddBlockMenu } from "@/components/writing/add-block-menu";
import { team } from "@/lib/mock-data/team";
import { authors } from "@/lib/mock-data/authors";
import { Download, Share2, Sparkles, Tag, UserPlus } from "lucide-react";
import { cn, initials } from "@/lib/utils";
import type { BlockType, Notebook, NotebookBlock, NotebookTab } from "@/lib/types";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export default function NotebookPage() {
  const { id } = useParams<{ id: string }>();
  const seed = notebookById(id);
  const setSurface = useStore((s) => s.setSurface);
  const setMessagesForSurface = useStore((s) => s.setMessagesForSurface);
  const setInviteOpen = useStore((s) => s.setInviteModalOpen);

  const [notebook, setNotebook] = React.useState<Notebook | undefined>(seed);
  const [activeTab, setActiveTab] = React.useState<string>("notes");
  const [activeBlock, setActiveBlock] = React.useState<string | null>(null);
  const [mode, setMode] = React.useState<string>(seed?.mode ?? "manuscript");
  const [tagFilter, setTagFilter] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (notebook) {
      setSurface({ surface: "writing", entityId: notebook.id, entityLabel: notebook.title });
      setMessagesForSurface("writing");
    }
  }, [notebook, setSurface, setMessagesForSurface]);

  const visibleBlocks = React.useMemo(() => {
    if (!notebook) return [];
    return notebook.blocks.filter((b) => {
      const tabId = b.tabId ?? "notes";
      if (tabId !== activeTab) return false;
      if (tagFilter && !(b.tags ?? []).includes(tagFilter)) return false;
      return true;
    });
  }, [notebook, activeTab, tagFilter]);

  if (!notebook) return notFound();

  const addTab = (tab: NotebookTab) => {
    const seeds = seedBlocksForTemplate(tab.template ?? "blank", tab.id);
    setNotebook({ ...notebook, tabs: [...(notebook.tabs ?? []), tab], blocks: [...notebook.blocks, ...seeds] });
    setActiveTab(tab.id);
  };

  const addBlock = (type: BlockType) => {
    const newBlock = seedBlock(type, activeTab);
    setNotebook({ ...notebook, blocks: [...notebook.blocks, newBlock] });
  };

  return (
    <div className="flex h-full min-h-0">
      <OutlineRail notebook={notebook} activeBlock={activeBlock} onPick={setActiveBlock} activeTab={activeTab} />

      <div className="flex-1 overflow-y-auto scrollbar-thin">
        <div className="max-w-3xl mx-auto px-10 pt-10 pb-8">
          {/* ===== HEADER ===== */}
          <NotebookHeader notebook={notebook} mode={mode} onModeChange={setMode} onInvite={() => setInviteOpen(true)} />

          {/* ===== TABS + FILTER ===== */}
          <div className="mt-7 mb-4">
            <TabsBar
              notebook={notebook}
              active={activeTab}
              onChange={(t) => { setActiveTab(t); setActiveBlock(null); }}
              onAddTab={addTab}
              tagFilter={tagFilter}
              onTagFilter={setTagFilter}
            />
          </div>

          {/* ===== BLOCKS ===== */}
          <div className="space-y-3">
            {visibleBlocks.length === 0 ? (
              <div className="border-2 border-dashed border-zinc-200 rounded-xl py-12 text-center">
                <div className="text-sm font-medium text-zinc-700">No blocks yet{tagFilter ? ` with tag "${tagFilter}"` : ""}.</div>
                <div className="text-xs text-zinc-500 mt-1">Click the + button below to add one.</div>
              </div>
            ) : (
              visibleBlocks.map((b) => (
                <NotebookBlockRenderer
                  key={b.id}
                  block={b}
                  notebook={notebook}
                  isActive={activeBlock === b.id}
                  onActivate={() => setActiveBlock(b.id)}
                />
              ))
            )}
          </div>

          {/* ===== ADD BLOCK ===== */}
          <div className="mt-4 flex items-center justify-between gap-3">
            <AddBlockMenu onAdd={addBlock} />
            <div className="text-[10px] text-zinc-400">
              Type <kbd className="px-1 py-0.5 rounded bg-zinc-100 border border-zinc-200 font-mono text-[9px]">/</kbd> inside a block for commands, or <kbd className="px-1 py-0.5 rounded bg-zinc-100 border border-zinc-200 font-mono text-[9px]">/brain</kbd> for AI.
            </div>
          </div>
        </div>
      </div>

      <ContextPanel notebook={notebook} activeBlockId={activeBlock} />

      <InviteModal notebook={notebook} />
    </div>
  );
}

/* ==========================================================================
 * Header — hierarchy:
 *   Row 1: meta line (mode · status · tags) — one tight row of muted chips
 *   Row 2: Title (extra-large, tight leading)
 *   Row 3: Description + right-aligned action cluster (Mode / Invite / Share / Download)
 *   Row 4: Presence — compact avatars + subtle activity text
 * =========================================================================*/
function NotebookHeader({ notebook, mode, onModeChange, onInvite }: {
  notebook: Notebook;
  mode: string;
  onModeChange: (m: string) => void;
  onInvite: () => void;
}) {
  const editingMember = team.find((t) => t.id === "m-marcus")!;
  const editingAuthor = authors.find((a) => a.id === editingMember.authorId)!;
  const invitePending = notebook.collaborators.find((c) => c.status === "invited");

  return (
    <header className="flex flex-col gap-4">
      {/* Meta row */}
      <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.12em]">
        <span className="text-brand-700">{mode}</span>
        <span className="text-zinc-300">·</span>
        <span className={cn(
          notebook.status === "draft" ? "text-zinc-500" :
          notebook.status === "in-review" ? "text-amber-600" :
          "text-emerald-600",
        )}>{notebook.status}</span>
        {notebook.tags?.length ? (
          <>
            <span className="text-zinc-300">·</span>
            <div className="flex items-center gap-1.5 flex-wrap normal-case tracking-normal font-medium text-[11px]">
              {notebook.tags.slice(0, 4).map((t) => (
                <span key={t} className="inline-flex items-center gap-1 text-zinc-500">
                  <Tag className="w-2.5 h-2.5 text-zinc-400" />{t}
                </span>
              ))}
              {notebook.tags.length > 4 ? <span className="text-zinc-400">+{notebook.tags.length - 4}</span> : null}
              <button className="text-zinc-400 hover:text-brand-700 underline underline-offset-2">+ Tag</button>
            </div>
          </>
        ) : null}
      </div>

      {/* Title + action cluster on the same row */}
      <div className="flex items-start justify-between gap-6">
        <div className="flex-1 min-w-0">
          <h1 className="text-[28px] font-bold tracking-[-0.02em] leading-[1.15] text-zinc-900">{notebook.title}</h1>
          <p className="mt-2 text-[13px] text-zinc-600 leading-relaxed max-w-[58ch]">{notebook.description}</p>
        </div>
        <div className="flex flex-col items-end gap-2 shrink-0">
          <ModeSwitcher current={mode} onChange={onModeChange} />
          <div className="flex items-center gap-1">
            <button onClick={onInvite} className="inline-flex items-center gap-1.5 text-[11px] font-medium bg-brand-600 hover:bg-brand-700 text-white rounded-md px-2.5 py-1.5 transition-colors shadow-sm">
              <UserPlus className="w-3 h-3" /> Invite
            </button>
            <button className="inline-flex items-center gap-1.5 text-[11px] text-zinc-600 hover:text-brand-700 border border-zinc-200 hover:border-brand-300 rounded-md px-2.5 py-1.5 transition-colors">
              <Share2 className="w-3 h-3" /> Share
            </button>
            <button className="inline-flex items-center justify-center w-7 h-7 text-zinc-500 hover:text-brand-700 border border-zinc-200 hover:border-brand-300 rounded-md transition-colors" aria-label="Export">
              <Download className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Presence bar — slim, subtle */}
      <div className="flex items-center gap-3 pt-1 border-t border-zinc-100">
        <div className="flex items-center gap-2 pt-3">
          <span className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-[0.15em] text-emerald-700">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Live
          </span>
          <div className="flex -space-x-1.5">
            {notebook.collaborators.map((c) => {
              const m = team.find((t) => t.id === c.memberId);
              const a = m ? authors.find((x) => x.id === m.authorId) : null;
              if (!m || !a) return null;
              const isEditing = c.memberId === "m-marcus";
              return (
                <Tooltip key={c.memberId}>
                  <TooltipTrigger asChild>
                    <div className="relative">
                      <div className={cn(
                        "w-6 h-6 rounded-full ring-2 ring-white text-[9px] font-semibold text-white flex items-center justify-center",
                        m.color,
                        c.status === "invited" ? "opacity-50" : "",
                      )}>
                        {initials(a.name)}
                      </div>
                      {isEditing ? (
                        <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-emerald-500 ring-2 ring-white animate-pulse" />
                      ) : null}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <div className="font-medium">{a.name}</div>
                    <div className="text-[10px] text-zinc-300 mt-0.5 capitalize">
                      {c.role} · {c.status === "invited" ? "invite pending" : isEditing ? "editing now" : "idle"}
                    </div>
                  </TooltipContent>
                </Tooltip>
              );
            })}
          </div>
          <span className="text-[11px] text-zinc-500">
            <strong className="text-zinc-700">{editingAuthor.name.split(" ")[0]}</strong> is editing
          </span>
          {invitePending ? (
            <>
              <span className="text-zinc-300">·</span>
              <span className="text-[10px] text-amber-700 bg-amber-50 border border-amber-200 rounded-full px-2 py-0.5 font-medium">1 invite pending</span>
            </>
          ) : null}
        </div>
      </div>
    </header>
  );
}

/* ==========================================================================
 * Block seeding helpers
 * =========================================================================*/
function seedBlock(type: BlockType, tabId: string): NotebookBlock {
  const base: NotebookBlock = {
    id: `b-new-${Date.now()}`,
    type,
    content: "",
    source: "hand-written",
    authorId: "m-priya",
    createdAt: new Date().toISOString(),
    tabId,
  };
  switch (type) {
    case "heading": return { ...base, content: "New section" };
    case "date-header": return { ...base, content: "", dateISO: new Date().toISOString().slice(0, 10) };
    case "text": return { ...base, content: "Start typing here…" };
    case "methodology": return { ...base, content: "Describe the protocol here.", subcontent: "Parameters / instrumentation / conditions." };
    case "experimental-plan": return { ...base, content: "Hypothesis:\nProcedure:\nExpected results:\nSuccess criterion:" };
    case "research-note": return { ...base, content: "Observation…" };
    case "ai-insight": return { ...base, source: "ai-generated", sourceRef: "grounded in 0 papers — add context", content: "Click /brain to generate an insight grounded in your team library.", aiGroundedIn: [] };
    case "reference": return { ...base, content: "Citations from your team library:" };
    case "data": return { ...base, content: "Dataset description", subcontent: "Source / size / access" };
    case "figure": return { ...base, content: "Figure 1 — caption here" };
    case "image": return { ...base, content: "New image", imageData: { placeholder: "Drop an image here or paste from clipboard.", caption: "Caption (optional)", annotations: [] } };
    case "table": return { ...base, content: "New table", tableData: { headers: ["Column A", "Column B", "Column C"], rows: [["", "", ""], ["", "", ""], ["", "", ""]] } };
    case "callout": return { ...base, content: "⚠️ Note / warning / TODO" };
    case "decision": return { ...base, content: "Decision: …\nRationale: …\nAlternatives considered: …" };
  }
}

function seedBlocksForTemplate(template: string, tabId: string): NotebookBlock[] {
  const author = "m-priya";
  const now = new Date().toISOString();
  const mk = (b: Partial<NotebookBlock>): NotebookBlock => ({
    id: `b-tpl-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    type: "text",
    content: "",
    source: "hand-written",
    authorId: author,
    createdAt: now,
    tabId,
    ...b,
  });
  switch (template) {
    case "protocol":
      return [
        mk({ type: "heading", content: "Protocol title" }),
        mk({ type: "methodology", content: "Stepwise procedure:", subcontent: "Reagents · Equipment · Timing" }),
        mk({ type: "callout", content: "⚠️ Safety: list hazards and PPE." }),
      ];
    case "experiment-plan":
      return [
        mk({ type: "heading", content: "Experiment plan" }),
        mk({ type: "experimental-plan", content: "Hypothesis:\nProcedure:\nExpected results:\nSuccess criterion:" }),
      ];
    case "lit-review":
      return [
        mk({ type: "heading", content: "Literature review" }),
        mk({ type: "reference", content: "Key references to be synthesized:" }),
      ];
    case "peer-review":
      return [
        mk({ type: "heading", content: "Reviewer response" }),
        mk({ type: "callout", content: "Reviewer comment: \"paste reviewer quote here\"" }),
        mk({ type: "ai-insight", source: "ai-generated", content: "Click /brain to draft a response grounded in team evidence." }),
      ];
    case "meeting-notes":
      return [
        mk({ type: "date-header", dateISO: new Date().toISOString().slice(0, 10) }),
        mk({ type: "heading", content: "Lab meeting notes" }),
        mk({ type: "text", content: "Attendees:" }),
        mk({ type: "text", content: "Decisions:" }),
        mk({ type: "text", content: "Action items:" }),
      ];
    default:
      return [mk({ type: "heading", content: "New tab" })];
  }
}
