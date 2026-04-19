import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Fixed "now" anchor shared by server + client so formatRelative is deterministic
// across the SSR/hydration boundary. We anchor to the most-recent event in the
// demo dataset (2026-04-18T08:30Z) so relative strings always feel like
// "Monday morning." Demo data — no real clock involved.
const DEMO_NOW = new Date("2026-04-18T08:30:00Z").getTime();

export function formatRelative(iso: string): string {
  const then = new Date(iso).getTime();
  const diff = DEMO_NOW - then;
  if (diff < 0) return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" });
  const minutes = Math.round(diff / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  if (days < 7) return `${days}d ago`;
  const weeks = Math.round(days / 7);
  if (weeks < 5) return `${weeks}w ago`;
  const months = Math.round(days / 30);
  if (months < 12) return `${months}mo ago`;
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((s) => s[0]!.toUpperCase())
    .join("");
}

export function palette(seed: string): string {
  const colors = [
    "bg-indigo-500",
    "bg-violet-500",
    "bg-amber-500",
    "bg-emerald-500",
    "bg-rose-500",
    "bg-sky-500",
    "bg-fuchsia-500",
  ];
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) | 0;
  return colors[Math.abs(h) % colors.length]!;
}
