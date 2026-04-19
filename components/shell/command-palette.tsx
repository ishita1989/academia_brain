"use client";
import * as React from "react";
import { useRouter } from "next/navigation";
import { Search, FileText, Sparkles, FlaskConical, NotebookPen, Share2, Command } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useStore } from "@/lib/store";
import { papers } from "@/lib/mock-data/papers";
import { syntheses } from "@/lib/mock-data/syntheses";
import { ideationSessions } from "@/lib/mock-data/hypotheses";
import { notebooks } from "@/lib/mock-data/notebooks";

interface Item {
  id: string;
  label: string;
  sublabel?: string;
  type: "paper" | "synthesis" | "ideation" | "notebook" | "nav";
  href: string;
}

export function CommandPalette() {
  const open = useStore((s) => s.paletteOpen);
  const setOpen = useStore((s) => s.setPaletteOpen);
  const router = useRouter();
  const [q, setQ] = React.useState("");

  const items: Item[] = React.useMemo(() => {
    const base: Item[] = [
      { id: "nav-dash", label: "Dashboard", type: "nav", href: "/dashboard" },
      { id: "nav-graph", label: "Knowledge Graph", type: "nav", href: "/graph" },
      { id: "nav-writing", label: "Writing Studio", type: "nav", href: "/writing" },
      { id: "nav-ideation", label: "Ideation Lab", type: "nav", href: "/ideation" },
      { id: "nav-synthesis", label: "Synthesis", type: "nav", href: "/synthesis" },
    ];
    const p = papers.slice(0, 15).map<Item>((p) => ({
      id: `p-${p.id}`,
      label: p.title,
      sublabel: `${p.venue} ${p.year} · ${p.externalId}`,
      type: "paper",
      href: `/reader/${p.id}`,
    }));
    const s = syntheses.map<Item>((s) => ({
      id: `s-${s.id}`,
      label: s.title,
      sublabel: `${s.paperCount} papers · ${s.contradictions} contradictions`,
      type: "synthesis",
      href: `/synthesis/${s.id}`,
    }));
    const i = ideationSessions.map<Item>((i) => ({
      id: `i-${i.id}`,
      label: i.title,
      sublabel: `${i.hypotheses.length} hypotheses · ${i.participants.length} people`,
      type: "ideation",
      href: `/ideation/${i.id}`,
    }));
    const n = notebooks.map<Item>((n) => ({
      id: `n-${n.id}`,
      label: n.title,
      sublabel: `${n.mode.toUpperCase()} · ${n.blocks.length} blocks · ${n.collaborators.length} collaborators`,
      type: "notebook",
      href: `/writing/${n.id}`,
    }));
    return [...base, ...s, ...i, ...n, ...p];
  }, []);

  const filtered = React.useMemo(() => {
    const qq = q.trim().toLowerCase();
    if (!qq) return items.slice(0, 10);
    return items
      .filter((i) => i.label.toLowerCase().includes(qq) || i.sublabel?.toLowerCase().includes(qq))
      .slice(0, 12);
  }, [q, items]);

  const go = (i: Item) => {
    setOpen(false);
    setQ("");
    router.push(i.href);
  };

  const icon = (t: Item["type"]) => {
    const cls = "w-3.5 h-3.5";
    switch (t) {
      case "paper": return <FileText className={cls} />;
      case "synthesis": return <Sparkles className={cls} />;
      case "ideation": return <FlaskConical className={cls} />;
      case "notebook": return <NotebookPen className={cls} />;
      case "nav": return <Share2 className={cls} />;
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="p-0 overflow-hidden max-w-xl gap-0">
        <DialogTitle className="sr-only">Search</DialogTitle>
        <div className="flex items-center gap-2 px-4 py-3 border-b border-zinc-100">
          <Search className="w-4 h-4 text-zinc-400" />
          <input
            autoFocus
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search papers, syntheses, notebooks, or ask the brain…"
            className="flex-1 text-sm bg-transparent outline-none placeholder:text-zinc-400"
          />
          <span className="text-[10px] text-zinc-400 inline-flex items-center gap-1 bg-zinc-100 px-1.5 py-0.5 rounded">
            <Command className="w-2.5 h-2.5" />K
          </span>
        </div>
        <div className="max-h-[360px] overflow-auto scrollbar-thin">
          {filtered.length === 0 ? (
            <div className="px-4 py-8 text-center text-sm text-zinc-500">No results. Try &quot;thermostability&quot; or &quot;CRISPR&quot;.</div>
          ) : (
            <ul className="py-1">
              {filtered.map((i) => (
                <li key={i.id}>
                  <button
                    onClick={() => go(i)}
                    className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-brand-50 transition-colors text-left"
                  >
                    <div className="w-7 h-7 rounded-md bg-zinc-100 text-zinc-600 flex items-center justify-center shrink-0">
                      {icon(i.type)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-medium truncate">{i.label}</div>
                      {i.sublabel ? <div className="text-[11px] text-zinc-500 truncate">{i.sublabel}</div> : null}
                    </div>
                    <span className="text-[9px] uppercase tracking-wide text-zinc-400">{i.type}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="border-t border-zinc-100 px-4 py-2 text-[10px] text-zinc-400 flex items-center gap-3">
          <span>↑↓ navigate</span>
          <span>↵ open</span>
          <span>esc close</span>
        </div>
      </DialogContent>
    </Dialog>
  );
}
