"use client";
import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Brain, Compass, FlaskConical, LayoutDashboard, NotebookPen, Share2, Sparkles, LibraryBig } from "lucide-react";
import { cn } from "@/lib/utils";

const nav = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard, badge: "3" },
  { href: "/synthesis", label: "Synthesis", icon: Sparkles, badge: "2" },
  { href: "/ideation", label: "Ideation", icon: FlaskConical },
  { href: "/writing", label: "Writing", icon: NotebookPen, badge: "3" },
  { href: "/graph", label: "Graph", icon: Share2 },
  { href: "/library", label: "Library", icon: LibraryBig },
];

export function Sidebar() {
  const pathname = usePathname() ?? "";
  return (
    <aside className="w-[220px] shrink-0 bg-white border-r border-zinc-200 flex flex-col">
      <Link href="/dashboard" className="px-5 py-4 flex items-center gap-2.5 border-b border-zinc-100 hover:bg-zinc-50/60 transition-colors">
        <div className="w-8 h-8 rounded-lg gradient-brand flex items-center justify-center shadow-sm">
          <Brain className="w-4 h-4 text-white" />
        </div>
        <div className="leading-tight">
          <div className="font-semibold text-sm">Research Brain</div>
          <div className="text-[11px] text-zinc-500">Kawamura Lab · UCSF</div>
        </div>
      </Link>
      <nav className="flex-1 px-2.5 py-3 space-y-0.5">
        {nav.map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href + "/");
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              prefetch={false}
              className={cn(
                "group flex items-center justify-between gap-2 px-3 py-2 rounded-md text-sm transition-colors",
                active
                  ? "bg-brand-50 text-brand-700 font-medium"
                  : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900",
              )}
            >
              <span className="flex items-center gap-2.5">
                <Icon className={cn("w-4 h-4", active ? "text-brand-600" : "text-zinc-500 group-hover:text-zinc-700")} />
                {item.label}
              </span>
              {item.badge ? (
                <span className="text-[10px] bg-zinc-100 group-hover:bg-white text-zinc-600 px-1.5 py-0.5 rounded-full font-medium">{item.badge}</span>
              ) : null}
            </Link>
          );
        })}
      </nav>
      <div className="mx-2.5 my-2 rounded-lg border border-zinc-200 bg-zinc-50/70 p-3 text-xs text-zinc-600">
        <div className="flex items-center gap-1.5 mb-1 font-medium text-zinc-900">
          <Compass className="w-3.5 h-3.5 text-brand-600" /> Team brain
        </div>
        <div className="leading-relaxed">432 papers processed · 47 syntheses · 8 decisions logged</div>
      </div>
      <div className="px-4 py-3 border-t border-zinc-100 flex items-center gap-2">
        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-[11px] font-semibold text-white">PM</div>
        <div className="leading-tight">
          <div className="text-sm font-medium">Priya Menon</div>
          <div className="text-[11px] text-zinc-500">Postdoc · you</div>
        </div>
      </div>
    </aside>
  );
}
