"use client";
import * as React from "react";
import Link from "next/link";
import { AlertTriangle, ArrowRight, Brain, ChevronRight, Flame, GitBranch, Sparkles, TrendingUp, Users, Zap, FileText, CheckCircle2, BookOpenCheck, Database, Quote, DollarSign, Beaker, Lightbulb } from "lucide-react";
import { useStore } from "@/lib/store";
import { papers } from "@/lib/mock-data/papers";
import { alerts } from "@/lib/mock-data/alerts";
import { syntheses } from "@/lib/mock-data/syntheses";
import { decisions } from "@/lib/mock-data/decisions";
import { authors } from "@/lib/mock-data/authors";
import { team, activeResearchQuestion, labName, institution } from "@/lib/mock-data/team";
import { ideationSessions } from "@/lib/mock-data/hypotheses";
import { notebooks } from "@/lib/mock-data/notebooks";
import { initials, formatRelative, cn } from "@/lib/utils";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { PaperCard } from "@/components/shared/paper-card";

export default function DashboardPage() {
  const setSurface = useStore((s) => s.setSurface);
  const setMessagesForSurface = useStore((s) => s.setMessagesForSurface);

  React.useEffect(() => {
    setSurface({ surface: "dashboard" });
    setMessagesForSurface("dashboard");
  }, [setSurface, setMessagesForSurface]);

  const [tab, setTab] = React.useState("team");
  const highAlerts = alerts.filter((a) => a.priority === "high");
  const medAlerts = alerts.filter((a) => a.priority === "med");
  const lowAlerts = alerts.filter((a) => a.priority === "low");

  return (
    <div className="px-8 py-6 max-w-[1400px] mx-auto">
      {/* Hero */}
      <div className="mb-7">
        <div className="flex items-baseline gap-3 mb-1">
          <h1 className="text-2xl font-bold tracking-tight">Good morning, Priya</h1>
          <span className="text-sm text-zinc-500">Saturday · April 18</span>
        </div>
        <p className="text-sm text-zinc-600 max-w-3xl leading-relaxed">
          Overnight in your lab's brain: <strong className="text-zinc-900">3 alerts</strong> (1 high-priority contradiction), <strong className="text-zinc-900">2 team annotations</strong> from Marcus, and a <strong className="text-zinc-900">replication confirmation</strong> of your 2024 esterase work.
        </p>
      </div>

      {/* Alerts */}
      <section className="mb-7">
        <SectionHeader icon={Zap} title="Proactive intelligence" subtitle="Alerts from your lab's knowledge graph" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 mt-3">
          {[...highAlerts, ...medAlerts, ...lowAlerts].slice(0, 3).map((a) => (
            <AlertCard key={a.id} alert={a} />
          ))}
        </div>
        <div className="mt-2 text-right">
          <Link href="#" className="text-xs text-brand-700 font-medium inline-flex items-center gap-1 hover:underline">
            See all {alerts.length} alerts <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </section>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="team">Team view</TabsTrigger>
          <TabsTrigger value="personal">Personal view</TabsTrigger>
          <TabsTrigger value="trending">Trending concepts</TabsTrigger>
        </TabsList>

        <TabsContent value="personal" className="space-y-6 mt-5">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            <section className="lg:col-span-2 space-y-5">
              <div>
                <SectionHeader icon={Sparkles} title="Your active synthesis threads" subtitle="Living summaries that evolve as the team explores" />
                <div className="mt-3 space-y-2">
                  {syntheses.map((s) => (
                    <Link
                      key={s.id}
                      href={`/synthesis/${s.id}`}
                      className="group flex items-center gap-4 bg-white border border-zinc-200 rounded-lg p-4 hover:border-brand-300 transition-all"
                    >
                      <div className="w-10 h-10 rounded-lg bg-brand-50 text-brand-600 flex items-center justify-center shrink-0">
                        <Sparkles className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <div className="font-semibold text-sm text-zinc-900">{s.title}</div>
                          {s.contradictions > 0 ? (
                            <Badge variant="warn" className="text-[9px]">{s.contradictions} contradiction{s.contradictions > 1 ? "s" : ""}</Badge>
                          ) : null}
                        </div>
                        <div className="text-[11px] text-zinc-500 mt-0.5 truncate">{s.question}</div>
                        <div className="mt-1.5 text-[10px] text-zinc-500 flex items-center gap-2">
                          <span>{s.paperCount} papers</span>
                          <span>·</span>
                          <span>{s.collaborators.length} collaborators</span>
                          <span>·</span>
                          <span>updated {formatRelative(s.updatedAt)}</span>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-zinc-300 group-hover:text-brand-600 shrink-0" />
                    </Link>
                  ))}
                </div>
              </div>

              <div>
                <SectionHeader icon={BookOpenCheck} title="Recent reading" subtitle="Papers you've read or annotated recently" />
                <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-2.5">
                  {papers.filter((p) => p.readByTeam.includes("m-priya")).slice(0, 4).map((p) => (
                    <PaperCard key={p.id} paper={p} />
                  ))}
                </div>
              </div>
            </section>

            <aside className="space-y-5">
              <QuickActions />
              <ActiveNotebooks />
              <RecommendedForYou />
            </aside>
          </div>
        </TabsContent>

        <TabsContent value="team" className="space-y-6 mt-5">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            <section className="lg:col-span-2 space-y-5">
              <div>
                <SectionHeader icon={Users} title="Team activity" subtitle="Who read what, when" />
                <TeamActivityFeed />
              </div>
              <div>
                <SectionHeader icon={GitBranch} title="Cross-pollination suggestions" subtitle="Connections your brain spotted between team members' work" />
                <CrossPollination />
              </div>
            </section>
            <aside className="space-y-5">
              <DecisionTimeline />
              <TeamRoster />
            </aside>
          </div>
        </TabsContent>

        <TabsContent value="trending" className="mt-5">
          <TrendingConcepts />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function SectionHeader({ icon: Icon, title, subtitle }: { icon: any; title: string; subtitle?: string }) {
  return (
    <div className="flex items-end justify-between">
      <div>
        <div className="flex items-center gap-1.5 mb-0.5">
          <Icon className="w-3.5 h-3.5 text-brand-600" />
          <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-600">{title}</h2>
        </div>
        {subtitle ? <p className="text-xs text-zinc-500">{subtitle}</p> : null}
      </div>
    </div>
  );
}

function AlertCard({ alert }: { alert: typeof alerts[number] }) {
  const config = {
    contradiction: { icon: AlertTriangle, color: "bg-rose-50 text-rose-700 border-rose-200", label: "Contradiction" },
    replication: { icon: CheckCircle2, color: "bg-emerald-50 text-emerald-700 border-emerald-200", label: "Replication" },
    dataset: { icon: Database, color: "bg-sky-50 text-sky-700 border-sky-200", label: "Dataset" },
    citing: { icon: Quote, color: "bg-violet-50 text-violet-700 border-violet-200", label: "Citing" },
    grant: { icon: DollarSign, color: "bg-amber-50 text-amber-700 border-amber-200", label: "Grant" },
    method: { icon: Beaker, color: "bg-indigo-50 text-indigo-700 border-indigo-200", label: "Method" },
    "cross-pollination": { icon: GitBranch, color: "bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200", label: "Cross-pollination" },
    hypothesis: { icon: Lightbulb, color: "bg-orange-50 text-orange-700 border-orange-200", label: "New hypothesis" },
  }[alert.type];
  const Icon = config.icon;
  return (
    <Link
      href={alert.actionHref ?? "#"}
      className={cn(
        "group block border rounded-xl p-4 transition-all hover:shadow-sm relative overflow-hidden",
        alert.priority === "high" ? "border-rose-200 bg-rose-50/30 hover:border-rose-300" : "border-zinc-200 bg-white hover:border-brand-300",
      )}
    >
      {alert.priority === "high" ? <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-rose-500 to-orange-400" /> : null}
      <div className="flex items-start gap-2.5">
        <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border", config.color)}>
          <Icon className="w-4 h-4" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-0.5">
            <span className={cn("text-[9px] font-semibold uppercase tracking-wider", alert.priority === "high" ? "text-rose-700" : "text-zinc-500")}>
              {config.label}
            </span>
            {alert.priority === "high" ? <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" /> : null}
            <span className="ml-auto text-[10px] text-zinc-400">{formatRelative(alert.createdAt)}</span>
          </div>
          <div className="text-sm font-semibold text-zinc-900 leading-snug mb-1">{alert.title}</div>
          <div className="text-[11px] text-zinc-600 leading-relaxed line-clamp-3">{alert.detail}</div>
          {alert.actionLabel ? (
            <div className="mt-2 text-[11px] text-brand-700 font-medium inline-flex items-center gap-1 group-hover:gap-1.5 transition-all">
              {alert.actionLabel} <ArrowRight className="w-3 h-3" />
            </div>
          ) : null}
        </div>
      </div>
    </Link>
  );
}

function QuickActions() {
  const actions = [
    { label: "New synthesis", icon: Sparkles, href: "/synthesis", color: "bg-brand-50 text-brand-700" },
    { label: "New notebook", icon: FileText, href: "/writing", color: "bg-violet-50 text-violet-700" },
    { label: "Open Knowledge Graph", icon: GitBranch, href: "/graph", color: "bg-emerald-50 text-emerald-700" },
    { label: "Start ideation", icon: Beaker, href: "/ideation", color: "bg-amber-50 text-amber-700" },
  ];
  return (
    <div className="bg-white border border-zinc-200 rounded-xl p-4">
      <div className="flex items-center gap-1.5 mb-3">
        <Zap className="w-3.5 h-3.5 text-brand-600" />
        <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-600">Quick actions</h3>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {actions.map((a) => (
          <Link
            key={a.label}
            href={a.href}
            className="group flex flex-col items-start gap-1.5 p-3 rounded-lg border border-zinc-200 hover:border-brand-300 hover:bg-brand-50/40 transition-all"
          >
            <div className={cn("w-7 h-7 rounded-md flex items-center justify-center", a.color)}>
              <a.icon className="w-3.5 h-3.5" />
            </div>
            <div className="text-xs font-medium text-zinc-900 leading-tight">{a.label}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}

function ActiveNotebooks() {
  return (
    <div className="bg-white border border-zinc-200 rounded-xl p-4">
      <div className="flex items-center gap-1.5 mb-3">
        <FileText className="w-3.5 h-3.5 text-brand-600" />
        <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-600">Active notebooks</h3>
      </div>
      <div className="space-y-2">
        {notebooks.map((n) => (
          <Link key={n.id} href={`/writing/${n.id}`} className="block text-xs hover:bg-brand-50/40 -mx-2 px-2 py-1.5 rounded transition-colors">
            <div className="font-medium text-zinc-900 line-clamp-1">{n.title}</div>
            <div className="text-[10px] text-zinc-500 mt-0.5">{n.mode.toUpperCase()} · {n.blocks.length} blocks · updated {formatRelative(n.updatedAt)}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}

function RecommendedForYou() {
  return (
    <div className="bg-gradient-to-br from-brand-50 to-violet-50 border border-brand-100 rounded-xl p-4">
      <div className="flex items-center gap-1.5 mb-2">
        <Brain className="w-3.5 h-3.5 text-brand-600" />
        <h3 className="text-xs font-semibold uppercase tracking-wider text-brand-700">Recommended for you</h3>
      </div>
      <div className="text-xs text-zinc-700 leading-relaxed mb-3">
        Because you're writing the R01 Aim 2 block on smFRET methodology:
      </div>
      <div className="space-y-1.5">
        {papers.filter((p) => ["p-schuler-2023", "p-imoto-2023", "p-lindorff-2022"].includes(p.id)).map((p) => (
          <Link key={p.id} href={`/reader/${p.id}`} className="block text-[11px] bg-white/70 hover:bg-white border border-transparent hover:border-brand-200 rounded-md px-2 py-1.5 transition-all">
            <div className="font-medium text-zinc-900 line-clamp-1">{p.title}</div>
            <div className="text-[10px] text-zinc-500 mt-0.5">{p.venue} · {p.year}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}

function TeamActivityFeed() {
  const events = [
    { id: "e-1", member: "m-marcus", action: "annotated 2 passages in", target: "Lindorff-Larsen 2022", href: "/reader/p-lindorff-2022", at: "2026-04-18T07:38:00Z" },
    { id: "e-2", member: "m-hiro", action: "added Significance block to", target: "R01 — Thermostable Enzymes", href: "/writing/nb-r01", at: "2026-04-17T22:00:00Z" },
    { id: "e-3", member: "m-dmitri", action: "joined ideation session", target: "Testing enzyme stability at 95 °C", href: "/ideation/ses-enzymes-95c", at: "2026-04-17T19:15:00Z" },
    { id: "e-4", member: "m-zara", action: "created hypothesis", target: "Directed evolution of psychrophilic lipases", href: "/ideation/ses-psychrophiles", at: "2026-04-15T11:00:00Z" },
    { id: "e-5", member: "m-marcus", action: "promoted hypothesis", target: "H-2 OPC re-simulation → experiment design", href: "/ideation/ses-enzymes-95c", at: "2026-04-18T06:10:00Z" },
    { id: "e-6", member: "m-priya", action: "started notebook", target: "Peer-Review Response — Reviewer 2", href: "/writing/nb-peer-review", at: "2026-04-08T10:00:00Z" },
  ];
  return (
    <div className="mt-3 bg-white border border-zinc-200 rounded-xl p-4">
      <div className="space-y-3.5">
        {events.map((e) => {
          const m = team.find((t) => t.id === e.member)!;
          const a = authors.find((x) => x.id === m.authorId)!;
          return (
            <div key={e.id} className="flex items-start gap-3">
              <div className={cn("w-7 h-7 rounded-full text-[10px] font-semibold text-white flex items-center justify-center shrink-0", m.color)}>{initials(a.name)}</div>
              <div className="flex-1 min-w-0">
                <div className="text-xs">
                  <span className="font-semibold text-zinc-900">{a.name}</span>{" "}
                  <span className="text-zinc-500">{e.action}</span>{" "}
                  <Link href={e.href} className="font-medium text-brand-700 hover:underline">{e.target}</Link>
                </div>
                <div className="text-[10px] text-zinc-400 mt-0.5">{formatRelative(e.at)}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function CrossPollination() {
  const cards = [
    {
      id: "cp-1",
      from: "m-marcus",
      to: "m-priya",
      paper: "p-lindorff-2022",
      context: "R01 Aim 2 methodology block",
      why: "Marcus highlighted Lindorff-Larsen's AMBER vs CHARMM benchmark — the exact precedent Priya needs to justify AMBER-ff14SB in Aim 2.",
    },
    {
      id: "cp-2",
      from: "m-hiro",
      to: "m-priya",
      paper: "p-schuler-2023",
      context: "Ideation H-2 (OPC re-simulation)",
      why: "Hiro's 2023 annotation on Schuler's smFRET paper becomes the strongest independent experimental support for H-2 — worth pulling into the ideation session.",
    },
  ];
  return (
    <div className="mt-3 space-y-2.5">
      {cards.map((c) => {
        const fromM = team.find((t) => t.id === c.from)!;
        const toM = team.find((t) => t.id === c.to)!;
        const fromA = authors.find((x) => x.id === fromM.authorId)!;
        const toA = authors.find((x) => x.id === toM.authorId)!;
        const p = papers.find((pp) => pp.id === c.paper)!;
        return (
          <div key={c.id} className="bg-white border border-zinc-200 rounded-xl p-4">
            <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-fuchsia-700 font-semibold mb-2">
              <GitBranch className="w-3 h-3" />
              Cross-pollination
            </div>
            <div className="flex items-center gap-2 text-xs mb-2">
              <div className={cn("w-6 h-6 rounded-full text-[9px] font-semibold text-white flex items-center justify-center", fromM.color)}>{initials(fromA.name)}</div>
              <span className="font-medium">{fromA.name}</span>
              <ArrowRight className="w-3 h-3 text-zinc-300" />
              <div className={cn("w-6 h-6 rounded-full text-[9px] font-semibold text-white flex items-center justify-center", toM.color)}>{initials(toA.name)}</div>
              <span className="font-medium">{toA.name}</span>
              <span className="text-zinc-500">· {c.context}</span>
            </div>
            <Link href={`/reader/${p.id}`} className="block bg-zinc-50 hover:bg-brand-50 border border-zinc-200 hover:border-brand-300 rounded-md p-2.5 transition-colors">
              <div className="text-xs font-medium text-zinc-900 line-clamp-1">{p.title}</div>
              <div className="text-[10px] text-zinc-500 mt-0.5">{p.venue} · {p.year}</div>
            </Link>
            <div className="mt-2 text-[11px] text-zinc-600 italic leading-relaxed">{c.why}</div>
          </div>
        );
      })}
    </div>
  );
}

function DecisionTimeline() {
  return (
    <div className="bg-white border border-zinc-200 rounded-xl p-4">
      <div className="flex items-center gap-1.5 mb-3">
        <Flame className="w-3.5 h-3.5 text-brand-600" />
        <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-600">Decision archaeology</h3>
      </div>
      <div className="relative pl-5 space-y-4">
        <div className="absolute left-1.5 top-1.5 bottom-1.5 w-px bg-zinc-200" />
        {decisions.slice(0, 4).map((d) => (
          <div key={d.id} className="relative">
            <div className="absolute -left-3.5 top-1 w-3 h-3 rounded-full bg-brand-500 ring-4 ring-white" />
            <div className="text-[10px] text-zinc-400">{d.decidedAt}</div>
            <div className="text-xs font-medium text-zinc-900 leading-snug mt-0.5">{d.question}</div>
            <div className="text-[10px] text-brand-700 mt-0.5">→ {d.choice}</div>
          </div>
        ))}
      </div>
      <Link href="#" className="mt-3 block text-[11px] text-brand-700 font-medium hover:underline">
        See all {decisions.length} decisions →
      </Link>
    </div>
  );
}

function TeamRoster() {
  return (
    <div className="bg-white border border-zinc-200 rounded-xl p-4">
      <div className="flex items-center gap-1.5 mb-3">
        <Users className="w-3.5 h-3.5 text-brand-600" />
        <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-600">{labName}</h3>
      </div>
      <div className="text-[11px] text-zinc-500 leading-relaxed mb-3">
        {institution}
      </div>
      <div className="text-[10px] text-zinc-600 italic border-l-2 border-brand-300 pl-2 leading-relaxed mb-3">
        {activeResearchQuestion}
      </div>
      <div className="space-y-2">
        {team.map((m) => {
          const a = authors.find((x) => x.id === m.authorId)!;
          return (
            <div key={m.id} className="flex items-center gap-2 text-xs">
              <div className={cn("w-6 h-6 rounded-full text-[9px] font-semibold text-white flex items-center justify-center shrink-0", m.color)}>{initials(a.name)}</div>
              <div className="min-w-0 flex-1">
                <div className="font-medium truncate">{a.name}{m.isCurrentUser ? " (you)" : ""}</div>
                <div className="text-[10px] text-zinc-500 capitalize">{m.role}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function TrendingConcepts() {
  const concepts = [
    { label: "OPC water model", delta: "+340%", surge: "Chen 2026 + Volkov 2025", href: "/graph" },
    { label: "RFdiffusion de novo", delta: "+180%", surge: "Baker 2024 aftermath", href: "/graph" },
    { label: "Backbone rigidification", delta: "-22%", surge: "Under review after Chen 2026", href: "/graph" },
    { label: "Continuous-flow biocatalysis", delta: "+95%", surge: "Williams 2025 pilot", href: "/graph" },
    { label: "ESM-2 protein language models", delta: "+60%", surge: "Sustained momentum", href: "/graph" },
    { label: "Psychrophilic directed evolution", delta: "+12%", surge: "Gap identified; still sparse", href: "/graph" },
  ];
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
      {concepts.map((c) => {
        const up = c.delta.startsWith("+");
        return (
          <Link key={c.label} href={c.href} className="group block bg-white border border-zinc-200 rounded-xl p-4 hover:border-brand-300 transition-all">
            <div className="flex items-start justify-between">
              <div className="text-sm font-semibold text-zinc-900 leading-tight">{c.label}</div>
              <span className={cn("text-xs font-bold", up ? "text-emerald-600" : "text-rose-600")}>{c.delta}</span>
            </div>
            <div className="mt-2 text-[11px] text-zinc-500">{c.surge}</div>
            <div className="mt-3 flex items-center gap-1 text-[10px] text-brand-700 opacity-0 group-hover:opacity-100 transition-opacity">
              Open in graph <ArrowRight className="w-3 h-3" />
            </div>
          </Link>
        );
      })}
    </div>
  );
}
