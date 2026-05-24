# CORE

> Measure what you move.

A calm daily stretching + core-strength PWA. Every exercise feeds a measurable KPI (touch your toes, hold a 60s side plank, reach your ear to your shoulder), scored 1–5. The daily ritual stays calm. The measurement layer makes it _mean_ something.

## Stack

Pure vanilla — no build step, no npm install needed:

- **HTML + ES modules** (no framework)
- **CSS variables** for design tokens (PRD §3)
- **IndexedDB** for local-first storage (JSON export/import for backup)
- **Service worker** for offline-first PWA
- **Portrait-locked** via CSS, with a polite "rotate" overlay

## Run locally

```bash
python3 dev-server.py
# → http://127.0.0.1:3000
```

The included `dev-server.py` adds `Cache-Control: no-store` so iteration always shows fresh code. Any static file server works (`python3 -m http.server`, `npx serve`, etc).

For best portrait emulation: open the URL in Chrome DevTools device mode at 390×844 (iPhone 14 Pro), or open it on your phone over LAN.

## Deploy

Vercel auto-detects this as a static site. `vercel.json` pins:

- Clean URLs
- Long-cache headers on JS / CSS / SVG
- `no-store` on `sw.js` (so service worker updates land fast)
- Correct MIME for `manifest.webmanifest`

## What's in the repo

```
core-app/
├── index.html                  # PWA shell
├── manifest.webmanifest
├── sw.js                       # offline-first service worker
├── vercel.json                 # static-deploy headers
├── dev-server.py               # no-cache local dev server
├── styles/                     # design tokens + screens
├── scripts/
│   ├── app.js                  # router + boot
│   ├── store.js                # IndexedDB persistence + JSON I/O
│   ├── data/                   # Areas, KPIs (17), Exercises (116)
│   ├── engine/                 # routine generator + CORE Index calc
│   ├── components/             # icons, radar, sparkline, illustrations
│   └── screens/                # one file per route
├── icons/
└── docs/
    └── PRD.html                # the design reference this app is built from
```

## Content

- **15 Areas** — Neck → Balance (PRD §7)
- **17 KPIs** — Forward Fold (cm), Side Plank (s), Cervical ROM (1–5), etc — each with banded scoring
- **116 exercises** — 80+ from the PRD plus a Pilates pack (Hundred, Roll Up, Teaser, Mermaid, etc.)
- Each exercise has a distinct inline-SVG illustration and a one-line action instruction

## Design system (PRD §3)

| Token | Value |
|---|---|
| Background | `#0A0A0F` |
| Surface | `#16161F` |
| Accent (teal) | `#5BC0A7` |
| Warm accent (asymmetry only) | `#E89B7C` |
| Display font | Fraunces |
| UI font | Outfit |
| Mono | JetBrains Mono |

## Roadmap

- V1 (this): manual + guided KPI tests, JSON backup, offline PWA
- V1.5: merge-mode backup, voice-guided checks
- V2: MediaPipe pose estimation for select KPIs, optional account sync

See [docs/PRD.html](docs/PRD.html) for the full product requirements + design reference.
