"use client";
import * as React from "react";
import { useStore } from "@/lib/store";
import { dataSources, type DataSource, type SourceStatus } from "@/lib/mock-data/data-sources";
import { authors } from "@/lib/mock-data/authors";
import { team } from "@/lib/mock-data/team";
import { cn, formatRelative, initials } from "@/lib/utils";
import {
  Check, ChevronRight, Database, ExternalLink, Globe, Plus, Search, Sparkles,
  Building2, KeyRound, ShieldCheck, Zap, Clock, Link2, X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

type FilterKey = "all" | "connected" | "free" | "premium" | "reference-manager" | "dataset" | "preprint";

export default function DataPage() {
  const setSurface = useStore((s) => s.setSurface);
  React.useEffect(() => setSurface({ surface: null, entityLabel: "Data sources" }), [setSurface]);
  const [filter, setFilter] = React.useState<FilterKey>("all");
  const [query, setQuery] = React.useState("");
  const [opened, setOpened] = React.useState<DataSource | null>(null);

  const visible = React.useMemo(() => {
    return dataSources.filter((s) => {
      if (filter === "connected" && s.status !== "connected") return false;
      if (filter !== "all" && filter !== "connected" && s.tier !== filter) return false;
      if (query) {
        const q = query.toLowerCase();
        if (!s.name.toLowerCase().includes(q) &&
            !(s.provider ?? "").toLowerCase().includes(q) &&
            !s.description.toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }, [filter, query]);

  const connectedCount = dataSources.filter((s) => s.status === "connected").length;
  const availableCount = dataSources.filter((s) => s.status !== "connected").length;
  const totalPapers = React.useMemo(() => {
    // Sum first "Papers" / "Works" / "Citations" stat per source
    let n = 0;
    for (const s of dataSources) {
      if (s.status !== "connected") continue;
      const primary = s.coverage[0]?.value ?? "";
      const m = primary.match(/([\d.]+)\s*([MmKk]?)/);
      if (m) {
        const v = parseFloat(m[1]!);
        const mult = m[2]?.toUpperCase() === "M" ? 1_000_000 : m[2]?.toUpperCase() === "K" ? 1_000 : 1;
        n += v * mult;
      }
    }
    return n;
  }, []);

  const groups = React.useMemo(() => {
    const connected = visible.filter((s) => s.status === "connected");
    const preprints = visible.filter((s) => s.status !== "connected" && s.tier === "preprint");
    const free = visible.filter((s) => s.status !== "connected" && s.tier === "free");
    const datasets = visible.filter((s) => s.status !== "connected" && s.tier === "dataset");
    const premium = visible.filter((s) => s.status !== "connected" && s.tier === "premium");
    const refMgrs = visible.filter((s) => s.status !== "connected" && s.tier === "reference-manager");
    return [
      { id: "connected", label: "Connected", items: connected, description: "Sources actively feeding your lab's brain." },
      { id: "preprints", label: "Preprints", items: preprints, description: "Open repositories with fresh, pre-publication papers." },
      { id: "free", label: "Free open-access", items: free, description: "Community and non-profit databases with no paywalls." },
      { id: "datasets", label: "Datasets & models", items: datasets, description: "Primary data, code, and ML models." },
      { id: "premium", label: "Premium publishers & abstracting", items: premium, description: "Paywalled sources — connect through your institutional subscriptions." },
      { id: "ref-mgrs", label: "Reference managers", items: refMgrs, description: "Sync your existing library into the brain." },
    ];
  }, [visible]);

  return (
    <div className="px-8 py-6 max-w-[1400px] mx-auto">
      {/* Header */}
      <header className="mb-8">
        <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-zinc-500 mb-2">
          <Database className="w-3 h-3 text-brand-600" />
          Data sources
        </div>
        <h1 className="text-[28px] font-bold tracking-[-0.02em] leading-[1.15]">Connect research data to your brain</h1>
        <p className="mt-2 text-[13px] text-zinc-600 leading-relaxed max-w-[62ch]">
          Every source your lab connects feeds the knowledge graph, powers proactive alerts, and grounds the brain's citations. Start with open preprints, add institutional subscriptions, and sync your reference managers.
        </p>

        {/* Stats pills */}
        <div className="mt-5 grid grid-cols-2 md:grid-cols-4 gap-2.5 max-w-3xl">
          <Stat icon={Zap} label="Connected" value={`${connectedCount}`} tone="emerald" />
          <Stat icon={Globe} label="Available" value={`${availableCount}`} tone="brand" />
          <Stat icon={Database} label="Papers indexed" value={formatBigNumber(totalPapers)} tone="indigo" />
          <Stat icon={Clock} label="Last sync" value="2m ago" tone="zinc" />
        </div>
      </header>

      {/* Search + filter */}
      <div className="flex flex-col md:flex-row md:items-center gap-3 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search sources by name, provider, or domain…"
            className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-zinc-200 rounded-lg placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-transparent"
          />
        </div>
        <Tabs value={filter} onValueChange={(v) => setFilter(v as FilterKey)} className="shrink-0">
          <TabsList className="h-9">
            <TabsTrigger value="all" className="text-[11px]">All</TabsTrigger>
            <TabsTrigger value="connected" className="text-[11px]">Connected</TabsTrigger>
            <TabsTrigger value="preprint" className="text-[11px]">Preprints</TabsTrigger>
            <TabsTrigger value="free" className="text-[11px]">Free</TabsTrigger>
            <TabsTrigger value="premium" className="text-[11px]">Premium</TabsTrigger>
            <TabsTrigger value="reference-manager" className="text-[11px]">Ref. managers</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Groups */}
      <div className="space-y-8">
        {groups.map((g) => g.items.length ? (
          <section key={g.id}>
            <div className="flex items-end justify-between mb-3">
              <div>
                <h2 className="text-[11px] font-semibold uppercase tracking-[0.12em] text-zinc-500">{g.label}</h2>
                <p className="text-[11px] text-zinc-500 mt-0.5">{g.description}</p>
              </div>
              <span className="text-[10px] text-zinc-400">{g.items.length}</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
              {g.items.map((s) => <SourceCard key={s.id} source={s} onOpen={() => setOpened(s)} />)}
              {g.id === "free" || g.id === "datasets" ? <CustomSourceCard /> : null}
            </div>
          </section>
        ) : null)}
        {visible.length === 0 ? (
          <div className="border-2 border-dashed border-zinc-200 rounded-xl py-14 text-center">
            <div className="text-sm font-medium text-zinc-700">No sources match your filter.</div>
            <div className="text-xs text-zinc-500 mt-1">Try clearing the search or switching tabs.</div>
          </div>
        ) : null}
      </div>

      {/* Request integration footer */}
      <div className="mt-12 bg-gradient-to-br from-brand-50 to-violet-50 border border-brand-100 rounded-2xl p-6 max-w-3xl">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl gradient-brand flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <div className="text-sm font-semibold">Don't see a source?</div>
            <div className="mt-1 text-[12px] text-zinc-600 leading-relaxed">
              Request an integration. We support any OAI-PMH repository, RSS feed, or REST API — our integrations team ships new connectors in &lt; 2 weeks.
            </div>
            <div className="mt-3 flex items-center gap-2">
              <button className="inline-flex items-center gap-1.5 text-[12px] font-medium bg-brand-600 hover:bg-brand-700 text-white rounded-md px-3 py-1.5">
                <Plus className="w-3 h-3" /> Request an integration
              </button>
              <button className="inline-flex items-center gap-1.5 text-[12px] text-zinc-600 hover:text-brand-700">
                <Link2 className="w-3 h-3" /> Add a custom endpoint
              </button>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>{opened ? <ConnectDialog source={opened} onClose={() => setOpened(null)} /> : null}</AnimatePresence>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Source card                                                                */
/* -------------------------------------------------------------------------- */
function SourceCard({ source, onOpen }: { source: DataSource; onOpen: () => void }) {
  const statusConfig: Record<SourceStatus, { label: string; tone: string; icon: any }> = {
    "connected": { label: "Connected", tone: "bg-emerald-50 text-emerald-700 border-emerald-200", icon: Check },
    "available": { label: "Connect", tone: "bg-brand-600 text-white hover:bg-brand-700 border-brand-600", icon: Plus },
    "institutional-required": { label: "Institutional", tone: "bg-amber-50 text-amber-700 border-amber-200", icon: Building2 },
    "coming-soon": { label: "Coming soon", tone: "bg-zinc-100 text-zinc-600 border-zinc-200", icon: Clock },
  };
  const sc = statusConfig[source.status];
  const StatusIcon = sc.icon;

  const connected = source.status === "connected";
  const connectedMember = source.connectedBy ? team.find((t) => t.id === source.connectedBy) : null;
  const connectedAuthor = connectedMember ? authors.find((a) => a.id === connectedMember.authorId) : null;

  return (
    <button
      onClick={onOpen}
      className={cn(
        "group text-left bg-white border rounded-xl p-4 transition-all hover:shadow-sm flex flex-col",
        connected ? "border-emerald-200" : "border-zinc-200 hover:border-brand-300",
      )}
    >
      {/* Monogram + name */}
      <div className="flex items-start gap-3">
        <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center shrink-0 bg-gradient-to-br shadow-sm", source.accent)}>
          <span className="text-white font-bold text-sm tracking-tight">{source.mono}</span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-semibold text-zinc-900 truncate">{source.name}</div>
          {source.provider ? <div className="text-[10px] text-zinc-500 truncate">{source.provider}</div> : null}
        </div>
        <button
          onClick={(e) => e.stopPropagation()}
          className={cn(
            "shrink-0 inline-flex items-center gap-1 text-[10px] font-medium rounded-md px-2 py-1 border",
            sc.tone,
          )}
        >
          <StatusIcon className="w-2.5 h-2.5" />
          {sc.label}
        </button>
      </div>

      {/* Description */}
      <p className="mt-3 text-[12px] text-zinc-600 leading-relaxed line-clamp-3">
        {source.description}
      </p>

      {/* Coverage stats */}
      <div className="mt-3 grid grid-cols-3 gap-1.5">
        {source.coverage.slice(0, 3).map((c, i) => (
          <div key={i} className="rounded-md bg-zinc-50 px-2 py-1.5 border border-zinc-100 min-w-0">
            <div className="text-[9px] uppercase tracking-wider text-zinc-500 truncate">{c.label}</div>
            <div className="text-[11px] font-semibold text-zinc-900 truncate">{c.value}</div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-3 pt-3 border-t border-zinc-100 flex items-center gap-2 text-[10px]">
        {connected && connectedAuthor && connectedMember ? (
          <>
            <div className={cn("w-4 h-4 rounded-full text-[8px] font-semibold text-white flex items-center justify-center", connectedMember.color)}>
              {initials(connectedAuthor.name)}
            </div>
            <span className="text-zinc-500">Connected by <strong className="text-zinc-700">{connectedAuthor.name.split(" ")[0]}</strong> · {formatRelative(source.connectedAt!)}</span>
          </>
        ) : (
          <>
            <AuthBadge requires={source.requiresAuth} />
            {source.pricingHint ? <span className="text-zinc-500 truncate">{source.pricingHint}</span> : null}
          </>
        )}
        <ChevronRight className="w-3 h-3 text-zinc-300 ml-auto group-hover:text-brand-500 transition-colors" />
      </div>
    </button>
  );
}

function CustomSourceCard() {
  return (
    <div className="bg-white/60 border-2 border-dashed border-zinc-300 hover:border-brand-400 rounded-xl p-4 transition-all flex flex-col items-start justify-center min-h-[232px]">
      <div className="w-10 h-10 rounded-lg bg-zinc-100 text-zinc-500 flex items-center justify-center">
        <Plus className="w-5 h-5" />
      </div>
      <div className="mt-3 text-sm font-semibold text-zinc-800">Add a custom source</div>
      <div className="mt-1 text-[12px] text-zinc-600 leading-relaxed">
        Connect any OAI-PMH repository, RSS feed, or REST API. The brain will ingest, deduplicate, and index automatically.
      </div>
      <button className="mt-3 inline-flex items-center gap-1 text-[11px] font-medium text-brand-700 hover:underline">
        Configure endpoint <ChevronRight className="w-3 h-3" />
      </button>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Connect dialog                                                             */
/* -------------------------------------------------------------------------- */
function ConnectDialog({ source, onClose }: { source: DataSource; onClose: () => void }) {
  const isConnected = source.status === "connected";
  const isInstitutional = source.status === "institutional-required";
  const isComingSoon = source.status === "coming-soon";
  const connectedMember = source.connectedBy ? team.find((t) => t.id === source.connectedBy) : null;
  const connectedAuthor = connectedMember ? authors.find((a) => a.id === connectedMember.authorId) : null;
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 bg-zinc-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-6"
    >
      <motion.div
        initial={{ scale: 0.95, y: 10 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 10 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden"
      >
        {/* Header */}
        <div className={cn("p-6 bg-gradient-to-br text-white relative", source.accent)}>
          <button onClick={onClose} className="absolute top-4 right-4 text-white/70 hover:text-white">
            <X className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-white/15 backdrop-blur flex items-center justify-center">
              <span className="text-white font-bold">{source.mono}</span>
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-[0.12em] text-white/70">{source.provider}</div>
              <h3 className="text-xl font-bold">{source.name}</h3>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-5">
          <p className="text-[13px] text-zinc-700 leading-relaxed">{source.description}</p>

          {/* Coverage */}
          <div className="grid grid-cols-3 gap-2">
            {source.coverage.map((c, i) => (
              <div key={i} className="rounded-lg bg-zinc-50 border border-zinc-100 px-3 py-2.5">
                <div className="text-[9px] uppercase tracking-wider text-zinc-500">{c.label}</div>
                <div className="text-sm font-semibold text-zinc-900 mt-0.5">{c.value}</div>
              </div>
            ))}
          </div>

          {/* Auth + pricing */}
          <div className="flex items-center gap-2 text-[11px] text-zinc-600 flex-wrap">
            <AuthBadge requires={source.requiresAuth} />
            {source.pricingHint ? <span className="inline-flex items-center gap-1 bg-zinc-100 rounded-full px-2 py-1"><ShieldCheck className="w-3 h-3" />{source.pricingHint}</span> : null}
            {source.website ? (
              <a href={source.website} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-brand-700 hover:underline">
                {source.website.replace(/^https?:\/\//, "")} <ExternalLink className="w-2.5 h-2.5" />
              </a>
            ) : null}
          </div>

          {/* Notes */}
          {source.notes ? (
            <div className="text-[12px] bg-amber-50/70 text-amber-800 border border-amber-200 rounded-lg px-3 py-2">
              {source.notes}
            </div>
          ) : null}

          {/* Action */}
          <div className="pt-2 border-t border-zinc-100">
            {isConnected && connectedAuthor && connectedMember ? (
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-[12px]">
                  <div className={cn("w-7 h-7 rounded-full text-[10px] font-semibold text-white flex items-center justify-center", connectedMember.color)}>
                    {initials(connectedAuthor.name)}
                  </div>
                  <div>
                    <div className="font-medium">Connected by {connectedAuthor.name}</div>
                    <div className="text-[10px] text-zinc-500">{formatRelative(source.connectedAt!)}</div>
                  </div>
                </div>
                <button className="text-[11px] font-medium text-zinc-600 hover:text-rose-600 transition-colors">
                  Disconnect
                </button>
              </div>
            ) : isComingSoon ? (
              <button disabled className="w-full inline-flex items-center justify-center gap-1.5 rounded-lg px-4 py-2.5 text-sm font-medium bg-zinc-100 text-zinc-500 cursor-not-allowed">
                <Clock className="w-3.5 h-3.5" /> Notify me when available
              </button>
            ) : isInstitutional ? (
              <button className="w-full inline-flex items-center justify-center gap-1.5 rounded-lg px-4 py-2.5 text-sm font-medium bg-gradient-to-br from-amber-500 to-orange-600 text-white hover:from-amber-600 hover:to-orange-700">
                <Building2 className="w-3.5 h-3.5" /> Connect via UCSF SSO
              </button>
            ) : (
              <button className="w-full inline-flex items-center justify-center gap-1.5 rounded-lg px-4 py-2.5 text-sm font-medium bg-brand-600 text-white hover:bg-brand-700">
                <Plus className="w-3.5 h-3.5" /> Connect {source.name}
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function AuthBadge({ requires }: { requires?: DataSource["requiresAuth"] }) {
  const cfg: Record<string, { label: string; icon: any; tone: string }> = {
    "none": { label: "No auth needed", icon: Zap, tone: "text-emerald-700 bg-emerald-50" },
    "api-key": { label: "API key", icon: KeyRound, tone: "text-indigo-700 bg-indigo-50" },
    "oauth": { label: "OAuth", icon: ShieldCheck, tone: "text-violet-700 bg-violet-50" },
    "institutional-sso": { label: "Institutional SSO", icon: Building2, tone: "text-amber-700 bg-amber-50" },
  };
  const k = requires ?? "none";
  const c = cfg[k];
  const Icon = c.icon;
  return (
    <span className={cn("inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-medium", c.tone)}>
      <Icon className="w-2.5 h-2.5" />
      {c.label}
    </span>
  );
}

function Stat({ icon: Icon, label, value, tone }: { icon: any; label: string; value: string; tone: "emerald" | "brand" | "indigo" | "zinc" }) {
  const tones: Record<string, { bg: string; text: string; icon: string }> = {
    emerald: { bg: "bg-emerald-50", text: "text-emerald-700", icon: "text-emerald-500" },
    brand: { bg: "bg-brand-50", text: "text-brand-700", icon: "text-brand-500" },
    indigo: { bg: "bg-indigo-50", text: "text-indigo-700", icon: "text-indigo-500" },
    zinc: { bg: "bg-zinc-50", text: "text-zinc-700", icon: "text-zinc-500" },
  };
  const t = tones[tone];
  return (
    <div className={cn("rounded-xl border border-zinc-100 p-3 flex items-center gap-3", t.bg)}>
      <Icon className={cn("w-4 h-4", t.icon)} />
      <div className="min-w-0">
        <div className={cn("text-lg font-bold leading-none tracking-tight", t.text)}>{value}</div>
        <div className="text-[10px] text-zinc-500 uppercase tracking-wider mt-0.5">{label}</div>
      </div>
    </div>
  );
}

function formatBigNumber(n: number): string {
  if (n >= 1e9) return `${(n / 1e9).toFixed(1)}B`;
  if (n >= 1e6) return `${Math.round(n / 1e6)}M`;
  if (n >= 1e3) return `${Math.round(n / 1e3)}K`;
  return `${n}`;
}
