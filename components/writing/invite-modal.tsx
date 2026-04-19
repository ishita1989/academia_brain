"use client";
import * as React from "react";
import Link from "next/link";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { useStore } from "@/lib/store";
import type { Notebook } from "@/lib/types";
import { authors } from "@/lib/mock-data/authors";
import { BookOpen, Check, Copy, Crown, Eye, MessageSquare, Pencil, Users, AlertCircle, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const roles = [
  { id: "owner", label: "Owner", description: "Full control incl. delete & invite", icon: Crown },
  { id: "editor", label: "Editor", description: "Can add, edit, comment on any block", icon: Pencil },
  { id: "commenter", label: "Commenter", description: "Can comment but not edit content", icon: MessageSquare },
  { id: "viewer", label: "Viewer", description: "Read-only access", icon: Eye },
];

const scopes = [
  { id: "whole", label: "Whole notebook", description: "All blocks and future additions" },
  { id: "section", label: "Specific section", description: "Only selected heading + children" },
  { id: "block", label: "Specific block", description: "Only one block" },
];

export function InviteModal({ notebook }: { notebook: Notebook }) {
  const open = useStore((s) => s.inviteModalOpen);
  const setOpen = useStore((s) => s.setInviteModalOpen);
  const [email, setEmail] = React.useState("amina.okafor@ox.ac.uk");
  const [role, setRole] = React.useState("commenter");
  const [scope, setScope] = React.useState("whole");
  const [sent, setSent] = React.useState(false);

  const suggestions = authors.filter((a) => a.affiliation.includes("Oxford") || a.affiliation.includes("Max Planck") || a.affiliation.includes("UW")).slice(0, 3);

  return (
    <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) setSent(false); }}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="w-4 h-4" /> Invite a collaborator
          </DialogTitle>
          <DialogDescription>
            Collaborators see a <strong>context-rich preview</strong> (no cold-start) with the notebook's paper count, hypothesis links, and a summary of the current state.
          </DialogDescription>
        </DialogHeader>

        {!sent ? (
          <>
            <div className="space-y-4">
              <div>
                <label className="text-[11px] font-semibold text-zinc-700 uppercase tracking-wider">Email or handle</label>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="collaborator@university.edu"
                  className="mt-1 w-full text-sm bg-white border border-zinc-200 rounded-md px-3 py-2 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-brand-400"
                />
                {suggestions.length ? (
                  <div className="mt-1.5 text-[10px] text-zinc-500 flex flex-wrap gap-1">
                    Suggested:
                    {suggestions.map((s) => (
                      <button key={s.id} onClick={() => setEmail(`${s.name.toLowerCase().replace(" ", ".")}@inst.edu`)} className="text-brand-700 hover:underline">
                        {s.name}
                      </button>
                    ))}
                  </div>
                ) : null}
              </div>

              <div>
                <label className="text-[11px] font-semibold text-zinc-700 uppercase tracking-wider mb-2 block">Role</label>
                <div className="grid grid-cols-2 gap-2">
                  {roles.map((r) => (
                    <button key={r.id} onClick={() => setRole(r.id)} className={cn("text-left border rounded-md p-2.5 transition-all", role === r.id ? "border-brand-400 bg-brand-50" : "border-zinc-200 hover:border-zinc-300")}>
                      <div className="flex items-center gap-1.5">
                        <r.icon className="w-3.5 h-3.5 text-zinc-600" />
                        <span className="text-xs font-semibold">{r.label}</span>
                        {role === r.id ? <Check className="w-3 h-3 text-brand-600 ml-auto" /> : null}
                      </div>
                      <div className="text-[10px] text-zinc-600 mt-1 leading-snug">{r.description}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-zinc-700 uppercase tracking-wider mb-2 block">Scope</label>
                <div className="grid grid-cols-3 gap-2">
                  {scopes.map((s) => (
                    <button key={s.id} onClick={() => setScope(s.id)} className={cn("text-left border rounded-md p-2.5 transition-all", scope === s.id ? "border-brand-400 bg-brand-50" : "border-zinc-200 hover:border-zinc-300")}>
                      <div className="text-xs font-semibold">{s.label}</div>
                      <div className="text-[10px] text-zinc-600 mt-0.5 leading-snug">{s.description}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Preview */}
              <div className="bg-gradient-to-br from-brand-50 to-violet-50 border border-brand-200 rounded-lg p-3">
                <div className="flex items-center gap-1.5 mb-2">
                  <Sparkles className="w-3 h-3 text-brand-600" />
                  <div className="text-[10px] font-semibold uppercase tracking-wider text-brand-700">What they'll see</div>
                </div>
                <div className="bg-white border border-brand-100 rounded-md p-3">
                  <div className="text-[11px] text-zinc-500 mb-0.5">Invitation preview</div>
                  <div className="text-sm font-semibold text-zinc-900">Priya Menon (Kawamura Lab, UCSF) invited you</div>
                  <div className="text-xs text-zinc-700 mt-1 leading-relaxed">to collaborate on <strong>{notebook.title}</strong> as <strong>{role}</strong>.</div>
                  <div className="mt-2 flex flex-wrap gap-1.5 text-[10px]">
                    <Badge>47 papers synthesized</Badge>
                    <Badge>3 hypotheses linked</Badge>
                    <Badge>18 blocks drafted</Badge>
                    <Badge>Active R01 submission</Badge>
                  </div>
                  <div className="mt-2 text-[10px] text-zinc-600 italic line-clamp-2">
                    "{notebook.description.slice(0, 140)}…"
                  </div>
                </div>
              </div>
            </div>

            <DialogFooter>
              <div className="flex items-center gap-2 mr-auto text-[10px] text-zinc-500">
                <Copy className="w-3 h-3" />
                <button className="hover:text-brand-700">Copy shareable link (view-only)</button>
              </div>
              <button onClick={() => setOpen(false)} className="px-4 py-2 text-sm text-zinc-600 hover:text-zinc-900">Cancel</button>
              <button onClick={() => setSent(true)} className="px-4 py-2 text-sm font-medium bg-brand-600 hover:bg-brand-700 text-white rounded-md">
                Send invitation
              </button>
            </DialogFooter>
          </>
        ) : (
          <div className="py-6 text-center">
            <div className="w-12 h-12 mx-auto rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <Check className="w-5 h-5" />
            </div>
            <div className="mt-3 font-semibold">Invitation sent</div>
            <div className="text-xs text-zinc-600 mt-1">
              <strong>{email}</strong> has been invited as <strong>{role}</strong> ({scope} scope).
            </div>
            <button onClick={() => setOpen(false)} className="mt-4 px-4 py-2 text-sm bg-brand-600 hover:bg-brand-700 text-white rounded-md">Done</button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return <span className="bg-brand-50 text-brand-700 rounded-full px-2 py-0.5 font-medium border border-brand-100">{children}</span>;
}
