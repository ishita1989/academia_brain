"use client";
import * as React from "react";
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  Node as RFNode,
  Edge as RFEdge,
  Handle,
  Position,
  MarkerType,
  useNodesState,
  useEdgesState,
  addEdge as rfAddEdge,
  Connection,
  NodeChange,
} from "reactflow";
import "reactflow/dist/style.css";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { graphNodes, graphEdges, graphGaps, unknownUnknowns } from "@/lib/mock-data/graph";
import { nodeDetails } from "@/lib/mock-data/graph-details";
import { paperById } from "@/lib/mock-data/papers";
import { useStore } from "@/lib/store";
import type { GraphNode } from "@/lib/types";
import { cn } from "@/lib/utils";
import {
  ArrowRight, BookOpen, Eye, EyeOff, FlaskConical, GitBranch, Lightbulb, Pause, Play, Sparkles, Users, X, Zap,
  Plus, Link2, Check, Database, Library, Target,
} from "lucide-react";
import { Switch } from "@/components/ui/switch";

const disciplineColor: Record<string, { bg: string; ring: string; text: string; label: string; hex: string; hull: string }> = {
  biophysics: { bg: "bg-indigo-500", ring: "ring-indigo-300", text: "text-indigo-700", label: "Biophysics", hex: "#6366f1", hull: "rgba(99,102,241,0.06)" },
  cs: { bg: "bg-violet-500", ring: "ring-violet-300", text: "text-violet-700", label: "Computer Science / ML", hex: "#a855f7", hull: "rgba(168,85,247,0.06)" },
  biochem: { bg: "bg-amber-500", ring: "ring-amber-300", text: "text-amber-700", label: "Biochemistry", hex: "#f59e0b", hull: "rgba(245,158,11,0.06)" },
  microbio: { bg: "bg-emerald-500", ring: "ring-emerald-300", text: "text-emerald-700", label: "Microbiology / Extremophiles", hex: "#10b981", hull: "rgba(16,185,129,0.06)" },
  materials: { bg: "bg-rose-500", ring: "ring-rose-300", text: "text-rose-700", label: "Materials / Process Eng", hex: "#f43f5e", hull: "rgba(244,63,94,0.06)" },
};

const relationColor: Record<string, { hex: string; label: string; dash?: string }> = {
  cites: { hex: "#a1a1aa", label: "cites" },
  extends: { hex: "#6366f1", label: "extends" },
  contradicts: { hex: "#e11d48", label: "contradicts", dash: "6 4" },
  replicates: { hex: "#10b981", label: "replicates", dash: "2 3" },
  "uses-method": { hex: "#f59e0b", label: "uses method" },
  "uses-dataset": { hex: "#14b8a6", label: "uses dataset" },
  "co-authored": { hex: "#a1a1aa", label: "co-authored" },
};

function NodeCard({ data }: { data: any }) {
  const d = data as GraphNode & { x: number; y: number; selected?: boolean; faded?: boolean; glowing?: boolean; pulseUnknown?: boolean; multiSelected?: boolean };
  const col = disciplineColor[d.discipline];
  const size = d.type === "paper" ? 58 : d.type === "method" || d.type === "dataset" ? 46 : d.type === "hypothesis" ? 54 : 42;
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <Handle type="target" position={Position.Top} style={{ visibility: "hidden" }} />
      {d.pulseUnknown ? (
        <span className={cn("absolute inset-0 rounded-full", col.bg, "opacity-30 animate-ping")} />
      ) : null}
      <div
        className={cn(
          "rounded-full flex items-center justify-center shadow-md text-white font-semibold transition-all cursor-grab active:cursor-grabbing",
          col.bg,
          d.type === "hypothesis" ? "rounded-2xl ring-2 ring-offset-2 ring-yellow-400" : "",
          d.glowing ? "ring-4 ring-offset-2 " + col.ring : "",
          d.faded ? "opacity-25 saturate-50" : "opacity-100",
          d.selected ? "ring-4 ring-brand-400 ring-offset-2" : "",
          d.multiSelected ? "ring-4 ring-emerald-400 ring-offset-2" : "",
          d.userAdded ? "border-2 border-dashed border-white" : "",
        )}
        style={{ width: size, height: size }}
      >
        {d.type === "paper" ? <BookOpen className="w-4 h-4" /> :
         d.type === "method" ? <FlaskConical className="w-4 h-4" /> :
         d.type === "dataset" ? <Database className="w-4 h-4" /> :
         d.type === "concept" ? <Sparkles className="w-4 h-4" /> :
         d.type === "hypothesis" ? <Lightbulb className="w-4 h-4" /> :
         <Users className="w-4 h-4" />}
      </div>
      {d.landmark ? <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-yellow-400 ring-2 ring-white" /> : null}
      {d.userAdded ? <div className="absolute -top-1 -right-1 text-[8px] bg-emerald-500 text-white rounded-full px-1 font-bold">NEW</div> : null}
      <div className={cn("absolute top-full left-1/2 -translate-x-1/2 mt-1 text-[10px] font-medium whitespace-nowrap px-1.5 py-0.5 rounded bg-white/95 border border-zinc-200 shadow-sm", d.faded ? "opacity-40" : "")} style={{ maxWidth: 180 }}>
        <span className="block truncate" style={{ maxWidth: 180 }}>{d.label}</span>
      </div>
      <Handle type="source" position={Position.Bottom} style={{ visibility: "hidden" }} />
    </div>
  );
}

const nodeTypes = { brain: NodeCard };

const methodologyCenters: Record<string, { x: number; y: number }> = {
  MD: { x: 300, y: 220 },
  AlphaFold: { x: 700, y: 200 },
  Rosetta: { x: 520, y: 380 },
  "Cryo-EM": { x: 200, y: 470 },
  "Wet-lab": { x: 400, y: 560 },
  "Directed Evolution": { x: 720, y: 500 },
  Proteomics: { x: 880, y: 340 },
  "Process Eng": { x: 900, y: 560 },
};
const findingCenters: Record<string, { x: number; y: number }> = {
  Rigidification: { x: 280, y: 240 },
  "Contradicts rigidification": { x: 560, y: 230 },
  "Force-field effects": { x: 420, y: 400 },
  "Stabilizing mutations": { x: 800, y: 260 },
  "Industrial application": { x: 860, y: 500 },
  "Evolutionary drivers": { x: 720, y: 560 },
};
const approachCenters: Record<string, { x: number; y: number }> = {
  Computational: { x: 320, y: 260 },
  "Computational de novo": { x: 580, y: 220 },
  "Structure-guided": { x: 780, y: 320 },
  Hybrid: { x: 260, y: 470 },
  "Directed evolution": { x: 680, y: 500 },
  "DL-based": { x: 820, y: 500 },
};

function computePositions(cluster: "methodology" | "finding" | "approach"): Record<string, { x: number; y: number }> {
  const centers = cluster === "methodology" ? methodologyCenters : cluster === "finding" ? findingCenters : approachCenters;
  const pos: Record<string, { x: number; y: number }> = {};
  const seenCounts: Record<string, number> = {};
  (graphNodes as any[]).forEach((n) => {
    const key = cluster === "methodology" ? (n.cluster?.methodology ?? "Other") : cluster === "finding" ? (n.cluster?.finding ?? "Other") : (n.cluster?.approach ?? "Other");
    const c = centers[key] ?? { x: 500, y: 400 };
    const idx = seenCounts[key] ?? 0;
    seenCounts[key] = idx + 1;
    const angle = idx * 0.9;
    const radius = 25 + idx * 14;
    pos[n.id] = { x: c.x + Math.cos(angle) * radius, y: c.y + Math.sin(angle) * radius };
  });
  return pos;
}

export default function GraphCanvas() {
  const cluster = useStore((s) => s.graphClusterMode);
  const setCluster = useStore((s) => s.setGraphClusterMode);
  const overlay = useStore((s) => s.graphOverlay);
  const setOverlay = useStore((s) => s.setGraphOverlay);
  const year = useStore((s) => s.graphYear);
  const setYear = useStore((s) => s.setGraphYear);
  const showGaps = useStore((s) => s.graphShowGaps);
  const setShowGaps = useStore((s) => s.setGraphShowGaps);
  const showUnknowns = useStore((s) => s.graphShowUnknowns);
  const setShowUnknowns = useStore((s) => s.setGraphShowUnknowns);

  const [selected, setSelected] = React.useState<string | null>(null);
  const [multiSelected, setMultiSelected] = React.useState<string[]>([]);
  const [connectMode, setConnectMode] = React.useState(false);
  const [connectSource, setConnectSource] = React.useState<string | null>(null);
  const [connectRelation, setConnectRelation] = React.useState<keyof typeof relationColor>("extends");
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [activeGap, setActiveGap] = React.useState<string | null>(null);
  const [addNodeOpen, setAddNodeOpen] = React.useState(false);
  const [newHypOpen, setNewHypOpen] = React.useState(false);

  // Extended node and edge datasets that include user-added entries
  const [customNodes, setCustomNodes] = React.useState<GraphNode[]>([]);
  const [customEdges, setCustomEdges] = React.useState<typeof graphEdges>([]);

  const allRawNodes = React.useMemo(() => [...graphNodes, ...customNodes], [customNodes]);
  const allRawEdges = React.useMemo(() => [...graphEdges, ...customEdges], [customEdges]);

  // Initial positions computed from cluster mode
  const [nodes, setNodes, onNodesChange] = useNodesState<any>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  // Re-seed nodes ONLY when cluster mode changes. Custom node additions are
  // appended directly in addNode() so user drags are preserved.
  React.useEffect(() => {
    const positions = computePositions(cluster);
    const next: RFNode[] = allRawNodes.map((n) => ({
      id: n.id,
      type: "brain",
      position: positions[n.id] ?? { x: 0, y: 0 },
      data: { ...n },
      draggable: true,
    }));
    setNodes(next);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cluster]);

  React.useEffect(() => {
    const rfEdges: RFEdge[] = allRawEdges.map((e) => {
      const style: React.CSSProperties = {
        stroke: relationColor[e.relation]?.hex ?? "#a1a1aa",
        strokeWidth: (e.weight ?? 1) * 1.2,
        strokeDasharray: relationColor[e.relation]?.dash,
      };
      return {
        id: e.id,
        source: e.source,
        target: e.target,
        style,
        markerEnd: { type: MarkerType.ArrowClosed, color: style.stroke as string, width: 12, height: 12 },
        animated: e.relation === "contradicts",
        data: { relation: e.relation },
      };
    });
    setEdges(rfEdges);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customEdges]);

  // Overlay + temporal fading applied via a separate data-merge step
  const visibleNodes = React.useMemo(() => {
    return nodes.map((n) => {
      const gn = n.data as GraphNode;
      const yearOk = !year || !gn.year || gn.year <= year;
      const faded =
        (overlay === "personal" && !gn.teamRead && !gn.unknownUnknown && !gn.userAdded) ||
        !yearOk ||
        (showUnknowns && !gn.unknownUnknown && !gn.userAdded);
      const glowing = (overlay === "personal" && gn.teamRead) || (showUnknowns && gn.unknownUnknown);
      const pulseUnknown = showUnknowns && gn.unknownUnknown;
      return { ...n, data: { ...n.data, faded, glowing, pulseUnknown, selected: n.id === selected, multiSelected: multiSelected.includes(n.id) } };
    });
  }, [nodes, overlay, year, showUnknowns, selected, multiSelected]);

  const visibleEdges = React.useMemo(() => {
    return edges.map((e) => {
      const sn = allRawNodes.find((n) => n.id === e.source);
      const tn = allRawNodes.find((n) => n.id === e.target);
      const yearOk = (!year || ((sn?.year ?? 0) <= year && (tn?.year ?? 0) <= year));
      const fadeNodes = overlay === "personal" && (!sn?.teamRead || !tn?.teamRead);
      const opacity = !yearOk ? 0 : fadeNodes ? 0.2 : 0.75;
      return { ...e, style: { ...e.style, opacity } };
    });
  }, [edges, year, overlay, allRawNodes]);

  // Temporal play
  React.useEffect(() => {
    if (!isPlaying) return;
    const initial = year ?? 2019;
    let y = initial;
    const iv = setInterval(() => {
      y += 1;
      if (y > 2026) {
        setIsPlaying(false);
        return;
      }
      setYear(y);
    }, 1200);
    return () => clearInterval(iv);
  }, [isPlaying, setYear, year]);

  const onNodeClick = (_: any, n: RFNode) => {
    if (connectMode) {
      if (!connectSource) {
        setConnectSource(n.id);
      } else if (connectSource !== n.id) {
        // Create edge
        const newEdgeId = `e-custom-${Date.now()}`;
        setCustomEdges((prev) => [
          ...prev,
          { id: newEdgeId, source: connectSource, target: n.id, relation: connectRelation, weight: 1 } as any,
        ]);
        setConnectSource(null);
        setConnectMode(false);
      }
    } else {
      // Shift = multi-select
      if ((window.event as MouseEvent | undefined)?.shiftKey) {
        setMultiSelected((prev) => prev.includes(n.id) ? prev.filter((x) => x !== n.id) : [...prev, n.id]);
      } else {
        setSelected(n.id);
        setMultiSelected([]);
      }
    }
  };

  const addNode = (spec: { label: string; type: GraphNode["type"]; discipline: GraphNode["discipline"] }) => {
    const id = `n-custom-${Date.now()}`;
    const node: GraphNode = {
      id,
      type: spec.type,
      label: spec.label,
      discipline: spec.discipline,
      teamRead: true,
      cluster: { methodology: "Other", finding: "Other", approach: "Other" },
      userAdded: true,
      detail: {
        summary: `${spec.label} — added by you from the graph. Click to fill in details or link to evidence.`,
      },
    };
    setCustomNodes((prev) => [...prev, node]);
    // Append directly to react-flow state so existing drags are preserved.
    setNodes((prev) => [
      ...prev,
      {
        id,
        type: "brain",
        position: { x: 520 + (prev.length % 3) * 80 - 80, y: 680 + Math.floor(prev.length / 8) * 70 },
        data: node,
        draggable: true,
      } as any,
    ]);
    setAddNodeOpen(false);
    setSelected(id);
  };

  const createHypothesisFromSelection = () => {
    if (multiSelected.length < 2) return;
    const id = `n-hyp-${Date.now()}`;
    const chosenNodes = multiSelected.map((mid) => allRawNodes.find((n) => n.id === mid)!);
    const node: GraphNode = {
      id,
      type: "hypothesis",
      label: `H-new · ${chosenNodes.map((n) => n.label.split(" ")[0]).slice(0, 3).join(" × ")}`,
      discipline: chosenNodes[0]!.discipline,
      teamRead: true,
      cluster: { methodology: "Other", finding: "Other", approach: "Other" },
      userAdded: true,
      detail: {
        summary: `New hypothesis linking ${multiSelected.length} nodes from the graph. Build on: ${chosenNodes.map((n) => n.label).join("; ")}.`,
        openQuestions: ["Define the testable prediction.", "Identify supporting and contradicting evidence.", "Propose a methodology."],
      },
    };
    setCustomNodes((prev) => [...prev, node]);
    setNodes((prev) => [
      ...prev,
      {
        id,
        type: "brain",
        position: { x: 500, y: 700 + (prev.length % 4) * 60 },
        data: node,
        draggable: true,
      } as any,
    ]);
    const newEdges = multiSelected.map((mid, i) => ({ id: `e-hyp-${Date.now()}-${i}`, source: id, target: mid, relation: "extends", weight: 1 } as any));
    setCustomEdges((prev) => [...prev, ...newEdges]);
    setMultiSelected([]);
    setNewHypOpen(false);
    setSelected(id);
  };

  const selectedNode = selected ? allRawNodes.find((n) => n.id === selected) : null;
  const selectedPaper = selectedNode?.paperId ? paperById(selectedNode.paperId) : null;
  const selectedDetail = selected && !selectedPaper ? (selectedNode?.detail ?? nodeDetails[selected]) : null;

  return (
    <div className="relative h-full flex">
      {/* Filter rail */}
      <aside className="w-60 shrink-0 border-r border-zinc-200 bg-white overflow-y-auto scrollbar-thin">
        <div className="p-5 space-y-5">
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500 mb-2">Cluster by</div>
            <div className="flex bg-zinc-100 rounded-lg p-0.5 text-[11px] font-medium">
              {(["methodology", "finding", "approach"] as const).map((m) => (
                <button key={m} onClick={() => setCluster(m)} className={cn("flex-1 px-2 py-1 rounded capitalize transition-colors", cluster === m ? "bg-white text-zinc-900 shadow" : "text-zinc-500")}>{m}</button>
              ))}
            </div>
          </div>

          <div>
            <div className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500 mb-2">Overlay</div>
            <div className="flex bg-zinc-100 rounded-lg p-0.5 text-[11px] font-medium">
              {([
                { v: "none", label: "None", icon: EyeOff },
                { v: "personal", label: "Team", icon: Eye },
              ] as const).map((m) => (
                <button key={m.v} onClick={() => setOverlay(m.v)} className={cn("flex-1 inline-flex items-center justify-center gap-1 px-2 py-1 rounded transition-colors", overlay === m.v ? "bg-white text-zinc-900 shadow" : "text-zinc-500")}>
                  <m.icon className="w-3 h-3" /> {m.label}
                </button>
              ))}
            </div>
            {overlay === "personal" ? (
              <div className="mt-2 text-[10px] text-zinc-500 leading-relaxed">
                Your lab has explored <strong className="text-zinc-900">42 of {graphNodes.length}</strong> nodes (35%). Unexplored territory includes 3 gaps.
              </div>
            ) : null}
          </div>

          <div>
            <div className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500 mb-2">Disciplines</div>
            <div className="space-y-1.5">
              {Object.entries(disciplineColor).map(([k, v]) => {
                const count = allRawNodes.filter((n) => n.discipline === (k as any)).length;
                return (
                  <div key={k} className="flex items-center gap-2 text-[11px]">
                    <span className={cn("w-2.5 h-2.5 rounded-full", v.bg)} />
                    <span className="text-zinc-700 flex-1">{v.label}</span>
                    <span className="text-zinc-400 text-[10px]">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div>
            <div className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500 mb-2">Node types</div>
            <div className="space-y-1.5 text-[11px]">
              <LegendRow icon={BookOpen} label="Paper" />
              <LegendRow icon={FlaskConical} label="Method" />
              <LegendRow icon={Database} label="Dataset" />
              <LegendRow icon={Sparkles} label="Concept" />
              <LegendRow icon={Lightbulb} label="Hypothesis" />
            </div>
          </div>

          <div>
            <div className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500 mb-2">Relation legend</div>
            <div className="space-y-1.5 text-[10px] text-zinc-600">
              <div className="flex items-center gap-1.5"><span className="w-3 h-px" style={{ borderTop: "2px dashed #e11d48", width: 14 }} /> contradicts</div>
              <div className="flex items-center gap-1.5"><span style={{ width: 14, borderTop: "1px dotted #10b981", display: "inline-block" }} /> replicates</div>
              <div className="flex items-center gap-1.5"><span className="w-3.5 h-0.5 bg-brand-500" /> extends</div>
              <div className="flex items-center gap-1.5"><span className="w-3.5 h-0.5 bg-amber-500" /> uses-method</div>
              <div className="flex items-center gap-1.5"><span className="w-3.5 h-0.5 bg-teal-500" /> uses-dataset</div>
              <div className="flex items-center gap-1.5"><span className="w-3.5 h-0.5 bg-zinc-400" /> cites</div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-zinc-700">Show gap regions</span>
              <Switch checked={showGaps} onCheckedChange={setShowGaps} />
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-zinc-700">Unknown unknowns</span>
              <Switch checked={showUnknowns} onCheckedChange={setShowUnknowns} />
            </div>
          </div>

          <button
            onClick={() => setShowUnknowns(true)}
            className="w-full inline-flex items-center justify-center gap-1.5 text-xs font-medium text-white bg-gradient-to-r from-brand-500 to-violet-500 hover:from-brand-600 hover:to-violet-600 rounded-lg px-3 py-2 shadow-sm"
          >
            <Lightbulb className="w-3.5 h-3.5" />
            Find the unknown unknowns
          </button>
        </div>
      </aside>

      {/* Canvas */}
      <div className="flex-1 relative min-w-0">
        <ReactFlow
          nodes={visibleNodes}
          edges={visibleEdges}
          nodeTypes={nodeTypes}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeClick={onNodeClick}
          onPaneClick={() => { setSelected(null); if (!connectMode) setMultiSelected([]); }}
          fitView
          fitViewOptions={{ padding: 0.2 }}
          minZoom={0.2}
          maxZoom={2}
          nodesDraggable={true}
          nodesConnectable={false}
          elementsSelectable={true}
          proOptions={{ hideAttribution: true }}
        >
          <Background color="#e4e4e7" gap={24} />
          <Controls showInteractive={false} className="!bg-white !border !border-zinc-200 !rounded-lg !shadow-sm" />
          <MiniMap
            pannable
            className="!bg-white !border !border-zinc-200 !rounded-lg"
            nodeColor={(n) => {
              const dn = (n as any).data as GraphNode;
              return disciplineColor[dn.discipline]?.hex ?? "#a1a1aa";
            }}
          />
        </ReactFlow>

        {/* Top toolbar */}
        <div className="absolute top-5 right-5 flex items-center gap-2 z-10">
          <button
            onClick={() => setAddNodeOpen(true)}
            className="inline-flex items-center gap-1.5 text-xs font-medium bg-white border border-zinc-200 hover:border-brand-300 shadow-sm rounded-lg px-3 py-2 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" /> Add node
          </button>
          <button
            onClick={() => { setConnectMode(!connectMode); setConnectSource(null); }}
            className={cn("inline-flex items-center gap-1.5 text-xs font-medium rounded-lg px-3 py-2 transition-colors shadow-sm", connectMode ? "bg-brand-600 text-white" : "bg-white border border-zinc-200 hover:border-brand-300")}
          >
            <Link2 className="w-3.5 h-3.5" />
            {connectMode ? (connectSource ? "Click target node…" : "Click source node…") : "Connect nodes"}
          </button>
          <button
            onClick={() => setNewHypOpen(true)}
            disabled={multiSelected.length < 2}
            className={cn("inline-flex items-center gap-1.5 text-xs font-medium rounded-lg px-3 py-2 shadow-sm transition-all", multiSelected.length >= 2 ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600" : "bg-white border border-zinc-200 text-zinc-400 cursor-not-allowed")}
          >
            <Target className="w-3.5 h-3.5" /> Create hypothesis {multiSelected.length >= 2 ? `(${multiSelected.length})` : ""}
          </button>
        </div>

        {/* Connect mode picker */}
        {connectMode ? (
          <div className="absolute top-20 right-5 bg-white border border-zinc-200 rounded-lg shadow-lg p-2 z-10">
            <div className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500 mb-1.5 px-1">Relation type</div>
            <div className="space-y-0.5">
              {(Object.keys(relationColor) as (keyof typeof relationColor)[]).map((k) => (
                <button key={k} onClick={() => setConnectRelation(k)} className={cn("w-full text-left text-[11px] rounded px-2 py-1 flex items-center gap-1.5 transition-colors", connectRelation === k ? "bg-brand-50 text-brand-700 font-medium" : "hover:bg-zinc-50")}>
                  <span className="w-2.5 h-0.5" style={{ background: relationColor[k].hex, borderTop: relationColor[k].dash ? `2px dashed ${relationColor[k].hex}` : undefined }} />
                  {relationColor[k].label}
                  {connectRelation === k ? <Check className="w-2.5 h-2.5 ml-auto" /> : null}
                </button>
              ))}
            </div>
            <button onClick={() => { setConnectMode(false); setConnectSource(null); }} className="mt-2 w-full text-[11px] text-zinc-500 hover:text-zinc-800 py-1 border-t border-zinc-100">Cancel</button>
          </div>
        ) : null}

        {/* Multi-select hint */}
        {multiSelected.length > 0 ? (
          <div className="absolute top-20 left-5 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2 z-10 shadow-sm">
            <div className="text-[10px] font-semibold uppercase tracking-wider text-emerald-700">
              {multiSelected.length} selected · shift-click to add
            </div>
          </div>
        ) : null}

        {/* Gap overlays */}
        {showGaps ? graphGaps.map((g) => (
          <div
            key={g.id}
            onClick={() => setActiveGap(g.id)}
            className="absolute pointer-events-auto cursor-pointer"
            style={{
              left: g.center.x - g.radius,
              top: g.center.y - g.radius,
              width: g.radius * 2,
              height: g.radius * 2,
            }}
          >
            <div className="relative w-full h-full rounded-full border-2 border-dashed border-amber-400 bg-amber-50/30 hover:bg-amber-100/50 transition-colors flex items-center justify-center" style={{ boxShadow: "0 0 0 20px rgba(251, 191, 36, 0.08)" }}>
              <div className="text-[10px] font-semibold text-amber-800 text-center px-2 leading-tight">Gap: {g.label}<br/><span className="font-normal text-amber-700">{g.paperCount} papers · {g.openQuestions} questions</span></div>
            </div>
          </div>
        )) : null}

        {/* Temporal slider */}
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 bg-white border border-zinc-200 rounded-full shadow-lg px-3 py-2 flex items-center gap-3 z-10">
          <button onClick={() => setIsPlaying(!isPlaying)} className="w-7 h-7 rounded-full bg-brand-600 hover:bg-brand-700 text-white flex items-center justify-center">
            {isPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
          </button>
          <input
            type="range"
            min={2019}
            max={2026}
            step={1}
            value={year ?? 2026}
            onChange={(e) => { setIsPlaying(false); setYear(Number(e.target.value)); }}
            className="w-[260px] accent-brand-600"
          />
          <div className="text-xs font-semibold text-zinc-900 min-w-[80px] flex items-center gap-1.5">
            <span>{year ?? 2026}</span>
            {year !== null ? <button onClick={() => setYear(null)} className="text-zinc-400 hover:text-zinc-700"><X className="w-3 h-3" /></button> : null}
          </div>
        </div>

        {/* Header badge */}
        <div className="absolute top-5 left-5 bg-white/95 backdrop-blur border border-zinc-200 rounded-xl shadow-sm px-4 py-3 max-w-md z-10">
          <div className="flex items-center gap-1.5 mb-1">
            <GitBranch className="w-3.5 h-3.5 text-brand-600" />
            <div className="text-[10px] font-semibold uppercase tracking-wider text-brand-700">Knowledge Graph</div>
          </div>
          <div className="text-xs text-zinc-700 leading-relaxed">
            {allRawNodes.length} nodes · {allRawEdges.length} edges · 5 disciplines. Clustered by <strong>{cluster}</strong>. Drag nodes to reorganize. Shift-click to multi-select, then create a hypothesis.
          </div>
        </div>
      </div>

      {/* Node detail drawer */}
      <AnimatePresence>
        {selectedNode ? (
          <motion.aside
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 300, opacity: 0 }}
            transition={{ type: "spring", damping: 22 }}
            className="absolute right-0 top-0 bottom-0 w-[360px] bg-white border-l border-zinc-200 overflow-y-auto scrollbar-thin z-20"
          >
            <div className="p-5">
              <button onClick={() => setSelected(null)} className="text-zinc-400 hover:text-zinc-700 mb-3"><X className="w-4 h-4" /></button>
              <div className="flex items-center gap-1.5 mb-1">
                <span className={cn("w-2 h-2 rounded-full", disciplineColor[selectedNode.discipline].bg)} />
                <span className={cn("text-[10px] font-semibold uppercase tracking-wider", disciplineColor[selectedNode.discipline].text)}>{disciplineColor[selectedNode.discipline].label}</span>
                <span className="ml-auto text-[9px] uppercase font-semibold tracking-wider text-zinc-400">{selectedNode.type}</span>
              </div>
              <h3 className="text-lg font-bold leading-tight">{selectedNode.label}</h3>
              {selectedNode.year ? <div className="text-xs text-zinc-500 mt-1">{selectedNode.year}</div> : null}
              {selectedNode.userAdded ? <Badge className="mt-2 bg-emerald-50 text-emerald-700 border border-emerald-200">Added by you</Badge> : null}

              {/* Paper content */}
              {selectedPaper ? (
                <>
                  <div className="mt-4 text-xs text-zinc-700 leading-relaxed">{selectedPaper.abstract.slice(0, 260)}…</div>
                  <div className="mt-4 flex items-center gap-2">
                    <Link href={`/reader/${selectedPaper.id}`} className="flex-1 inline-flex items-center justify-center gap-1.5 text-[11px] font-medium bg-brand-600 hover:bg-brand-700 text-white rounded-md px-3 py-1.5">
                      Open in Reader <ArrowRight className="w-3 h-3" />
                    </Link>
                    <a href={selectedPaper.externalUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center text-[11px] border border-zinc-200 hover:border-brand-300 rounded-md px-3 py-1.5">
                      Source
                    </a>
                  </div>
                </>
              ) : null}

              {/* Non-paper content */}
              {selectedDetail ? (
                <>
                  <div className="mt-4 text-xs text-zinc-700 leading-relaxed">{selectedDetail.summary}</div>
                  {selectedDetail.definition ? (
                    <div className="mt-3 bg-zinc-50 border border-zinc-200 rounded-md p-2.5 text-[11px] text-zinc-700 leading-relaxed">
                      <div className="text-[9px] font-semibold uppercase tracking-wider text-zinc-500 mb-1">Definition</div>
                      {selectedDetail.definition}
                    </div>
                  ) : null}
                  {selectedDetail.stats?.length ? (
                    <div className="mt-3 grid grid-cols-1 gap-1.5">
                      {selectedDetail.stats.map((s, i) => (
                        <div key={i} className="flex items-center justify-between text-[11px] bg-zinc-50 rounded px-2 py-1.5">
                          <span className="text-zinc-600">{s.label}</span>
                          <span className="font-medium text-zinc-900">{s.value}</span>
                        </div>
                      ))}
                    </div>
                  ) : null}
                  {selectedDetail.firstUsedByLab ? (
                    <div className="mt-3 text-[11px] text-zinc-600"><strong>First used by lab:</strong> {selectedDetail.firstUsedByLab}</div>
                  ) : null}
                  {selectedDetail.teamUsageCount !== undefined ? (
                    <div className="mt-1 text-[11px] text-zinc-600"><strong>Team usage count:</strong> {selectedDetail.teamUsageCount}</div>
                  ) : null}
                  {selectedDetail.keyPapers?.length ? (
                    <div className="mt-3">
                      <div className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500 mb-1.5">Key papers</div>
                      <div className="space-y-1">
                        {selectedDetail.keyPapers.map((pid) => {
                          const p = paperById(pid);
                          if (!p) return null;
                          return (
                            <Link key={pid} href={`/reader/${pid}`} className="block text-[11px] bg-zinc-50 hover:bg-brand-50 rounded-md px-2 py-1.5 border border-zinc-200 hover:border-brand-300 transition-colors">
                              <div className="font-medium truncate">{p.title}</div>
                              <div className="text-[10px] text-zinc-500 mt-0.5">{p.venue} · {p.year}</div>
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  ) : null}
                  {selectedDetail.openQuestions?.length ? (
                    <div className="mt-3 bg-amber-50/60 border border-amber-200 rounded-md p-2.5">
                      <div className="text-[9px] font-semibold uppercase tracking-wider text-amber-700 mb-1">Open questions</div>
                      <ul className="space-y-1 text-[11px] text-zinc-700">
                        {selectedDetail.openQuestions.map((q, i) => <li key={i}>• {q}</li>)}
                      </ul>
                    </div>
                  ) : null}
                </>
              ) : null}

              {showUnknowns && (unknownUnknowns.find((u) => u.nodeId === selectedNode.id)) ? (
                <div className="mt-4 bg-gradient-to-br from-amber-50 to-rose-50 border border-amber-200 rounded-lg p-3">
                  <div className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-amber-700 mb-1">
                    <Lightbulb className="w-3 h-3" /> Why this matters
                  </div>
                  <div className="text-xs text-zinc-800 leading-relaxed">
                    {unknownUnknowns.find((u) => u.nodeId === selectedNode.id)?.why}
                  </div>
                </div>
              ) : null}

              {/* Connections */}
              <div className="mt-5 pt-5 border-t border-zinc-100">
                <div className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500 mb-2">Connections ({allRawEdges.filter((e) => e.source === selectedNode.id || e.target === selectedNode.id).length})</div>
                <div className="space-y-1">
                  {allRawEdges.filter((e) => e.source === selectedNode.id || e.target === selectedNode.id).slice(0, 10).map((e) => {
                    const other = allRawNodes.find((n) => n.id === (e.source === selectedNode.id ? e.target : e.source));
                    if (!other) return null;
                    return (
                      <button key={e.id} onClick={() => setSelected(other.id)} className="w-full text-left text-xs hover:bg-brand-50 rounded-md px-2 py-1.5 flex items-center gap-2 transition-colors">
                        <span className="text-[9px] uppercase font-semibold" style={{ color: relationColor[e.relation]?.hex }}>{e.relation}</span>
                        <span className="truncate">{other.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Quick actions */}
              <div className="mt-5 pt-5 border-t border-zinc-100 space-y-2">
                <button onClick={() => { setConnectMode(true); setConnectSource(selectedNode.id); }} className="w-full inline-flex items-center justify-center gap-1.5 text-xs font-medium bg-white border border-zinc-200 hover:border-brand-300 rounded-md px-3 py-1.5 transition-colors">
                  <Link2 className="w-3 h-3" /> Connect to another node
                </button>
                <button onClick={() => { setMultiSelected([selectedNode.id]); setSelected(null); }} className="w-full inline-flex items-center justify-center gap-1.5 text-xs font-medium bg-white border border-zinc-200 hover:border-brand-300 rounded-md px-3 py-1.5 transition-colors">
                  <Target className="w-3 h-3" /> Use as hypothesis seed
                </button>
              </div>
            </div>
          </motion.aside>
        ) : null}
      </AnimatePresence>

      {/* Gap detail drawer */}
      <AnimatePresence>
        {activeGap ? (
          <motion.div
            initial={{ y: 300, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 300, opacity: 0 }}
            className="absolute bottom-24 left-1/2 -translate-x-1/2 w-[420px] bg-white border border-amber-200 rounded-xl shadow-xl z-20 p-5"
          >
            <button onClick={() => setActiveGap(null)} className="absolute top-3 right-3 text-zinc-400 hover:text-zinc-700"><X className="w-4 h-4" /></button>
            {(() => {
              const g = graphGaps.find((x) => x.id === activeGap)!;
              return (
                <>
                  <div className="flex items-center gap-1.5 mb-2">
                    <Lightbulb className="w-3.5 h-3.5 text-amber-600" />
                    <div className="text-[10px] font-semibold uppercase tracking-wider text-amber-700">Gap detected</div>
                  </div>
                  <div className="text-base font-bold text-zinc-900">{g.label}</div>
                  <div className="mt-2 text-xs text-zinc-700 leading-relaxed">{g.why}</div>
                  <div className="mt-3 flex items-center gap-4 text-[11px] text-zinc-600">
                    <span><strong className="text-zinc-900">{g.paperCount}</strong> papers</span>
                    <span><strong className="text-zinc-900">{g.openQuestions}</strong> open questions</span>
                    <span>disciplines: {g.disciplines.join(", ")}</span>
                  </div>
                  <Link href={`/ideation/ses-psychrophiles`} className="mt-4 inline-flex items-center gap-1.5 text-xs font-medium text-white bg-brand-600 hover:bg-brand-700 rounded-md px-3 py-1.5">
                    Generate hypothesis for this gap <ArrowRight className="w-3 h-3" />
                  </Link>
                </>
              );
            })()}
          </motion.div>
        ) : null}
      </AnimatePresence>

      {/* Add node modal */}
      <AnimatePresence>
        {addNodeOpen ? (
          <AddNodeModal onClose={() => setAddNodeOpen(false)} onAdd={addNode} />
        ) : null}
      </AnimatePresence>

      {/* New hypothesis modal */}
      <AnimatePresence>
        {newHypOpen ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setNewHypOpen(false)}
            className="fixed inset-0 bg-zinc-900/40 backdrop-blur-sm z-40 flex items-center justify-center p-6"
          >
            <motion.div
              initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6"
            >
              <div className="flex items-center gap-2 mb-3">
                <div className="w-9 h-9 rounded-md bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
                  <Target className="w-4 h-4 text-white" />
                </div>
                <div>
                  <div className="text-[10px] font-semibold uppercase tracking-wider text-amber-700">New hypothesis from graph</div>
                  <h3 className="text-lg font-bold">Link {multiSelected.length} selected nodes</h3>
                </div>
              </div>
              <div className="text-sm text-zinc-700 leading-relaxed mb-3">
                A hypothesis node will be added to the graph, linked to these {multiSelected.length} nodes via "extends" relations.
              </div>
              <div className="bg-zinc-50 border border-zinc-200 rounded-lg p-3 text-xs text-zinc-700 space-y-1 mb-4 max-h-48 overflow-auto">
                {multiSelected.map((id) => {
                  const n = allRawNodes.find((x) => x.id === id);
                  return <div key={id}>• {n?.label}</div>;
                })}
              </div>
              <div className="flex gap-2">
                <button onClick={createHypothesisFromSelection} className="flex-1 inline-flex items-center justify-center gap-1.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-md px-4 py-2 text-sm font-medium">
                  Create hypothesis <ArrowRight className="w-3 h-3" />
                </button>
                <button onClick={() => setNewHypOpen(false)} className="px-4 py-2 text-sm rounded-md border border-zinc-200 hover:border-zinc-300">Cancel</button>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

function LegendRow({ icon: Icon, label }: { icon: any; label: string }) {
  return (
    <div className="flex items-center gap-2 text-zinc-600">
      <span className="w-5 h-5 rounded-full bg-zinc-100 flex items-center justify-center"><Icon className="w-2.5 h-2.5" /></span>
      {label}
    </div>
  );
}

function Badge({ children, className }: { children: React.ReactNode; className?: string }) {
  return <span className={cn("inline-block text-[10px] rounded-full px-2 py-0.5 font-medium", className)}>{children}</span>;
}

function AddNodeModal({ onClose, onAdd }: { onClose: () => void; onAdd: (spec: { label: string; type: GraphNode["type"]; discipline: GraphNode["discipline"] }) => void }) {
  const [label, setLabel] = React.useState("");
  const [type, setType] = React.useState<GraphNode["type"]>("concept");
  const [discipline, setDiscipline] = React.useState<GraphNode["discipline"]>("biophysics");
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 bg-zinc-900/40 backdrop-blur-sm z-40 flex items-center justify-center p-6"
    >
      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.95 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6"
      >
        <div className="flex items-center gap-2 mb-3">
          <div className="w-9 h-9 rounded-md bg-brand-50 text-brand-600 flex items-center justify-center">
            <Plus className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-wider text-brand-700">Add to graph</div>
            <h3 className="text-lg font-bold">New node</h3>
          </div>
        </div>
        <div className="space-y-3">
          <div>
            <label className="text-[11px] font-semibold text-zinc-700 uppercase tracking-wider">Label</label>
            <input
              autoFocus
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="e.g. TIP4P-Ew water model"
              className="mt-1 w-full text-sm bg-white border border-zinc-200 rounded-md px-3 py-2 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-brand-400"
            />
          </div>
          <div>
            <label className="text-[11px] font-semibold text-zinc-700 uppercase tracking-wider mb-2 block">Type</label>
            <div className="grid grid-cols-3 gap-1.5">
              {(["paper", "method", "concept", "dataset", "hypothesis", "author"] as const).map((t) => (
                <button key={t} onClick={() => setType(t)} className={cn("text-[11px] capitalize rounded-md border px-2 py-1.5 transition-all", type === t ? "border-brand-400 bg-brand-50 text-brand-700" : "border-zinc-200 hover:border-zinc-300 text-zinc-700")}>
                  {t}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-[11px] font-semibold text-zinc-700 uppercase tracking-wider mb-2 block">Discipline</label>
            <div className="grid grid-cols-3 gap-1.5">
              {(["biophysics", "cs", "biochem", "microbio", "materials"] as const).map((d) => (
                <button key={d} onClick={() => setDiscipline(d)} className={cn("text-[11px] capitalize rounded-md border px-2 py-1.5 transition-all", discipline === d ? "border-brand-400 bg-brand-50 text-brand-700" : "border-zinc-200 hover:border-zinc-300 text-zinc-700")}>
                  {d}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-6 flex gap-2 justify-end">
          <button onClick={onClose} className="px-4 py-2 text-sm text-zinc-600 hover:text-zinc-900">Cancel</button>
          <button
            disabled={!label.trim()}
            onClick={() => onAdd({ label: label.trim(), type, discipline })}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium bg-brand-600 hover:bg-brand-700 text-white rounded-md disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Plus className="w-3.5 h-3.5" /> Add to graph
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
