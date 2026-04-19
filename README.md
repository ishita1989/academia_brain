# Collaborative Research Brain — Clickable Prototype

A Next.js prototype of the **Collaborative Research Brain** — an AI-native research intelligence platform for academic labs. This prototype demonstrates the end-to-end user experience across five surfaces plus a persistent, context-aware **"Ask the Brain"** chat drawer.

Built to show a VP of Product what the experience feels like. Domain seed: **computational biology / protein folding in extreme environments** (Kawamura Lab, UCSF).

## Run it

```
npm install
npm run dev
```

Open http://localhost:3000 — the app redirects to `/dashboard`.

## The Golden Path (6-minute demo)

Walk the VP through this script:

1. **Dashboard** → See Priya's Monday morning. Notice the high-priority **contradiction alert** (Chen 2026 disagrees with the lab's rigidification hypothesis), the **cross-pollination** card (Marcus annotated papers relevant to Priya's R01), and the **Decision Archaeology** timeline.
2. **Click the red Chen 2026 alert** → Lands in the **Paper Reader**. The contradicting passage is pre-highlighted; the left rail pins the lab's prior belief; the right chat drawer explains the disagreement with citations.
3. **Navigate to Synthesis Canvas** (sidebar → `Synthesis`) → Open *"Thermostability in extremophile proteins."* Hover any underlined claim to see a **citation popover** with paper + page + sentence. Click **Version history** to see how understanding evolved from Nov 2025 → April 2026. Notice **Marcus editing live** in Section 2.
4. **Navigate to Knowledge Graph** (sidebar → `Graph`) → 120 nodes across five disciplines. Switch cluster modes (**Methodology → Finding → Approach**). Scrub the temporal slider 2019 → 2026 (or press **Play**). Click a gap patch — see the psychrophile directed-evolution gap. Click **Find the unknown unknowns** to pulse cross-disciplinary bridges from materials science and cancer biology.
5. **Navigate to Ideation Lab** → Open *"Testing enzyme stability at 95 °C."* Vote on a hypothesis. Click **Promote to experiment** on H-2 — watch the brain draft an experimental plan grounded in the supporting papers.
6. **Navigate to Writing Studio** → Open the **R01 notebook**. Hover any block to see **attribution + source chip** (hand-written / AI-generated / pulled-from-paper / from-hypothesis). Click the 💬 icon on Aim 2 Methodology for the resolved comment thread. Click **+ Invite** — walk through role (Owner / Editor / Commenter / Viewer), scope, and the context-rich invitee preview. Switch modes to **Peer-Review Response**.
7. **From any surface**, expand the right-side chat drawer and ask: *"Why did we pick MD over Rosetta?"* — get a full **Decision Archaeology** answer with citations.

Also try `⌘K` / `Ctrl K` at any time to open the command palette.

## Feature coverage

Full coverage of the PRD is tabulated in the [plan file](~/.claude/plans/users-raggupta-downloads-collaborative-cheeky-sutton.md). Summary:

**P0 — deeply interactive**
- Brain Dashboard (Personal / Team / Trending views)
- Paper Reader with smart annotations + contextual sidebar
- Synthesis Canvas with sentence-level citations, version history, evidence-strength map, contradictions panel
- Semantic command-palette search (⌘K)
- Shareable synthesis artifacts (Share + Export buttons)
- 5-step Onboarding (`/onboarding`)
- Personal research memory (chat drawer references prior reading)

**P1 — visible and functional**
- Proactive alerts panel (6 alert types)
- Contradiction & replication detection (badges throughout)
- Hypothesis generation + method recommendation
- Knowledge Graph Explorer (5 disciplines, 3 cluster modes, temporal animation, gaps, unknown-unknowns, path tracing)

**P2 — multi-user & collaboration**
- Shared team brain + team activity feed + cross-pollination cards
- Decision Archaeology (in chat drawer + dashboard timeline)
- Collaborative Synthesis Canvas (multi-cursor presence, live edit indicator)
- **Collaborative Research Notebook** (Writing Studio): block-based, attribution per block, source chips, comment threads, invite modal with role/scope/preview, activity history, live presence
- Ideation Lab (hypothesis cards, evidence strips, brain suggestions, promote-to-experiment, hypothesis evolution timeline)
- Co-author consistency checker (cross-section contradiction flag)

**P3 — scripted demo flows**
- Grant matching card on dashboard
- NIH R01 mode in Writing Studio
- Peer-Review Response mode (full notebook example)
- Cross-institutional collaborator (Dr. Okafor @ Oxford, invite-pending)

## The Chat Drawer (key addition)

The existing mock lacked a natural way to chat with the brain. This prototype adds a **persistent right-side drawer** that is context-aware across every surface. It has three modes:

- **Ask** — free-form chat with citations, followup chips, and source attribution
- **Suggest** — proactive surface-specific suggestions (e.g., "Draft a TIP3P reviewer rebuttal")
- **Decide** — Decision Archaeology quick-access (click any past decision for full rationale + alternatives)

The drawer knows which surface / paper / synthesis / hypothesis / notebook you're looking at and grounds answers accordingly.

## Files worth knowing

```
app/
├── dashboard/page.tsx       (Surface 1)
├── synthesis/[id]/page.tsx  (Surface 2)
├── ideation/[id]/page.tsx   (Surface 3)
├── writing/[id]/page.tsx    (Surface 4 — notebook editor)
├── graph/page.tsx           (Surface 5)
├── reader/[paperId]/page.tsx
└── onboarding/page.tsx

components/
├── shell/chat-drawer.tsx    (the key addition over the original mock)
├── graph/graph-canvas.tsx   (react-flow, multi-disciplinary)
└── writing/                 (block-renderer, context-panel, invite-modal, …)

lib/
├── mock-data/               (papers, authors, team, syntheses, hypotheses, alerts, graph, notebooks, chat-scripts, decisions, annotations)
├── store.ts                 (Zustand: chat, surface context, UI state)
└── types.ts
```

## Notes for reviewers

- No backend. Chat replies are pre-scripted in `lib/mock-data/chat-scripts.ts` with typewriter streaming.
- References point to real arXiv / bioRxiv / PubMed / DOI identifiers where possible; the `Chen 2026` paper is a fabricated but realistic contradictor used to drive the demo narrative.
- Votes, panel state, and UI toggles persist in Zustand during the session — they reset on refresh.
- Tested at 1280, 1440, 1920 widths on Chrome.

## Deploying to Railway

This repo ships Railway-ready. [Railway](https://railway.com/) auto-detects Next.js via Nixpacks, reads `railway.json` for the explicit build/start/healthcheck config, and reads `.node-version` (or the `engines` field in `package.json`) to pick a Node LTS image.

### GitHub → Railway (auto-deploy on push)

1. Push this repo to GitHub (already done if you cloned from the `academia_brain` repo).
2. Sign in at [railway.com](https://railway.com/) using GitHub OAuth.
3. `+ New Project` → `Deploy from GitHub repo` → pick `academia_brain`.
4. Railway reads `railway.json` and starts the first build immediately (~2–3 min: `npm ci` + `npm run build`).
5. Under `Settings → Networking`, click `Generate Domain` — you'll get a public `*.up.railway.app` URL.
6. Every subsequent `git push origin main` redeploys automatically.

### What Railway needs (already configured)

| File | Purpose |
|---|---|
| `railway.json` | Explicit build + start commands + healthcheck path (`/dashboard`) |
| `.node-version` | Pins Node 20 for Nixpacks |
| `package.json` → `engines` | Redundant Node pin for clarity |
| `next.config.js` → `output: "standalone"` | Smaller production bundle |

### Notes

- **No env vars needed** — all data is bundled.
- **Free hobby tier** ($5/mo credit) is plenty for this prototype.
- **Custom domain** is set up under `Settings → Networking → Custom Domain` if you want to swap the generated subdomain later.
- **Logs** are in the Railway `Deployments → Logs` tab if something fails at runtime.
