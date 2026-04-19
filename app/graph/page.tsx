"use client";
import * as React from "react";
import dynamic from "next/dynamic";
import { useStore } from "@/lib/store";

const GraphCanvas = dynamic(() => import("@/components/graph/graph-canvas"), { ssr: false });

export default function GraphPage() {
  const setSurface = useStore((s) => s.setSurface);
  const setMessagesForSurface = useStore((s) => s.setMessagesForSurface);
  React.useEffect(() => {
    setSurface({ surface: "graph", entityLabel: "Multi-disciplinary knowledge landscape" });
    setMessagesForSurface("graph");
  }, [setSurface, setMessagesForSurface]);
  return (
    <div className="h-full min-h-0">
      <GraphCanvas />
    </div>
  );
}
