# Quickstart: Stream Reader Promo Video

**Date**: 2026-03-04

---

## Prerequisites

- Node.js 18+
- npm 9+

---

## Setup

```bash
git clone <repo-url>
cd remotion-stream-reader-promo
npm install
```

---

## Preview in Remotion Studio

```bash
npm start
# Opens http://localhost:3000 — select "StreamReaderPromo" composition
```

All 5 scenes should be visible and individually previewable in the left panel.

---

## Add Screenshot Assets

Place app screenshots in `public/assets/` before previewing Scenes 3 & 4:

```
public/assets/
├── screenshot-01.png   # Scene 3 (Format Variations) — up to screenshot-08.png
├── screenshot-02.png
├── ...
└── text-input.png      # Scene 4 (Text Input Demo)
```

Scenes render empty glass frames if assets are absent — no crash.

---

## Render to MP4

```bash
npm run build
# Output: out/StreamReaderPromo.mp4 (1920×1080, 30fps, ~15s)
```

Or with explicit options:

```bash
npx remotion render StreamReaderPromo out/promo.mp4
```

---

## Project Structure

```
src/
├── Root.tsx                    # Composition root — scene order & timing
├── scenes/
│   ├── AppIntro.tsx            # Scene 1 — 2s / 60 frames
│   ├── StreamingTextDemo.tsx   # Scene 2 — 5s / 150 frames
│   ├── FormatVariations.tsx    # Scene 3 — 5s / 150 frames
│   ├── TextInputDemo.tsx       # Scene 4 — 2s / 60 frames
│   └── EndCard.tsx             # Scene 5 — 1s / 30 frames
└── lib/
    ├── tokens.ts               # All design tokens (colors, blur, fonts)
    └── content.ts              # Streaming text string (Scene 2)

public/
└── assets/                     # Screenshot images for Scenes 3 & 4
```

---

## Key Rules (from Constitution)

- **No hard-coded hex values** in scene files — use `tokens.ts` only.
- **No CSS transitions or Tailwind** — use `spring()` / `interpolate()` only.
- **No `<img>` tags** — use Remotion `<Img src={staticFile(...)} />`.
- **No scene-to-scene imports** — shared code lives in `src/lib/` only.
- Spring configs MUST set explicit `mass`, `damping`, `stiffness`.
