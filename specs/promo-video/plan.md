# Implementation Plan: Stream Reader App Store Promo Video

**Branch**: `master` | **Date**: 2026-03-04 | **Spec**: [spec.md](spec.md)
**Input**: [specs/promo-video/spec.md](spec.md)

---

## Summary

Build a 15-second (450-frame, 30fps, 1920×1080) promotional video using Remotion + React + TypeScript. Five self-contained scenes wire together via `@remotion/transitions` `TransitionSeries`. All animations use `spring()`/`interpolate()`; all colors come from `src/lib/tokens.ts`; all images use Remotion's `<Img>` + `staticFile()`. The video renders locally to `.mp4` via `npx remotion render`.

---

## Technical Context

**Language/Version**: TypeScript (strict mode), React 18
**Primary Dependencies**: `remotion` (latest), `@remotion/transitions`, `@remotion/cli`
**Storage**: Static files in `public/assets/` (PNG screenshots)
**Testing**: Visual — Remotion Studio preview (`npm start`). No automated test framework.
**Target Platform**: Local render → `.mp4` (H.264). macOS development.
**Project Type**: Video composition (promotional asset)
**Performance Goals**: 30fps render output; no frame drops in Studio preview
**Constraints**: Inline styles only; no CSS-in-JS runtime; no external font loading; no `<img>` tags; no hard-coded hex values in scene files
**Scale/Scope**: 5 scenes, ~450 frames, 1 composition, ~6–8 screenshot assets

---

## Constitution Check

*Gates evaluated against `.specify/memory/constitution.md` v1.0.0*

| Principle | Gate | Status |
|-----------|------|--------|
| I. Scene Isolation | Each scene in own file; no scene-to-scene imports; shared code in `src/lib/` | ✅ PASS — enforced by FR-010 |
| II. Animation Smoothness | All animations via `spring()`/`interpolate()`; explicit mass/damping/stiffness | ✅ PASS — enforced by FR-007 + research Decision 4 |
| III. Design System Compliance | All colors from `tokens.ts`; no hard-coded hex; glass morphism on dark background | ✅ PASS — enforced by FR-008; backdrop-filter fallback strategy defined in research |
| IV. Render-Ready Output | 1920×1080, 30fps, 450 durationInFrames, `.mp4` output, `staticFile()` for all assets | ✅ PASS — enforced by FR-009, spec success criteria |
| V. Simplicity Over Abstraction | No premature componentization; `src/lib/` abstractions only when used in 2+ scenes | ✅ PASS — plan uses lib only for tokens + content string |

**Complexity Tracking**: No violations. No justification table needed.

---

## Project Structure

### Documentation (this feature)

```text
specs/promo-video/
├── plan.md              ← this file
├── research.md          ← Phase 0 output
├── data-model.md        ← Phase 1 output
├── quickstart.md        ← Phase 1 output
├── contracts/
│   └── scene-interface.md  ← Phase 1 output
└── tasks.md             ← Phase 2 output (/speckit.tasks — not yet created)
```

### Source Code

```text
src/
├── Root.tsx                        # Composition root — TransitionSeries wiring
├── scenes/
│   ├── AppIntro.tsx                # Scene 1 — 75 frames (2.5s)
│   ├── StreamingTextDemo.tsx       # Scene 2 — 165 frames (5.5s)
│   ├── FormatVariations.tsx        # Scene 3 — 165 frames (5.5s)
│   ├── TextInputDemo.tsx           # Scene 4 — 75 frames (2.5s)
│   └── EndCard.tsx                 # Scene 5 — 30 frames (1s)
└── lib/
    ├── tokens.ts                   # All design tokens
    └── content.ts                  # Streaming text string (Scene 2)

public/
└── assets/
    ├── screenshot-01.png           # Scene 3 (0–8 files)
    ├── ...
    ├── screenshot-08.png
    └── text-input.png              # Scene 4
```

**Structure Decision**: Single-project layout. Remotion standard structure. No monorepo needed for a single composition.

---

## Phase 1: Implementation Design

### 1.1 Timing Architecture

Scenes use adjusted durations so that after `TransitionSeries` subtracts transition overlap, net playback = 450 frames (15s):

| Scene | Adjusted Frames | Seconds |
|-------|----------------|---------|
| AppIntro | 75 | 2.5s |
| StreamingTextDemo | 165 | 5.5s |
| FormatVariations | 165 | 5.5s |
| TextInputDemo | 75 | 2.5s |
| EndCard | 30 | 1.0s |
| **Sum** | **510** | |
| 4 transitions × 15 frames | −60 | |
| **Root durationInFrames** | **450** | **15.0s** ✓ |

Transition type: `slide()` from `@remotion/transitions` (horizontal, matching Scene 3's swiping motif).

### 1.2 tokens.ts Design

```typescript
// src/lib/tokens.ts
export const BG_DARK = '#0F1117';
export const BG_GRADIENT = 'linear-gradient(135deg, #0F1117 0%, #1A1F2E 100%)';
export const GLASS_BG = 'rgba(15, 17, 23, 0.65)';
export const GLASS_BORDER = '1px solid rgba(255,255,255,0.20)';
export const GLASS_SHADOW = '0 8px 32px rgba(0,0,0,0.40), inset 0 1px 0 rgba(255,255,255,0.10)';
export const BLUR_RADIUS = 'blur(24px)';
export const ACCENT_PEACH = '#FFCBA4';
export const TEXT_PRIMARY = 'rgba(255,255,255,0.95)';
export const TEXT_MUTED = 'rgba(255,255,255,0.55)';
export const GLOW_PEACH = '0 0 40px rgba(255,203,164,0.35)';
export const BORDER_RADIUS_CARD = 16;
export const BORDER_RADIUS_SM = 8;
export const FONT_FAMILY = "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
```

### 1.3 Scene-by-Scene Design

#### Scene 1: AppIntro (75 frames)

- `<AbsoluteFill>` with `BG_GRADIENT` background
- Centered glass card (600×300px) with `GLASS_BG`, `GLASS_BORDER`, `GLASS_SHADOW`, `backdropFilter: BLUR_RADIUS`
- "Stream Reader" title text in `ACCENT_PEACH`, `FONT_FAMILY`
- Animation: `spring()` fade-in + scale-up on card (mass 0.8, damping 12, stiffness 80)
- Peach ambient glow via `boxShadow: GLOW_PEACH` on the card
- Glow pulses via `interpolate()` between 0.3 and 1.0 opacity over frames [20, 75]

#### Scene 2: StreamingTextDemo (165 frames)

- `<AbsoluteFill>` with `BG_GRADIENT`
- Centered glass panel (~70% width, ~200px tall) — centered panel layout (deferred clarification defaulted to centered based on constitution visual system)
- Text string from `src/lib/content.ts` (80–120 words, focus/reading topic)
- Anchor formatting: each word split into `<span style={{fontWeight: 700}}>{firstLetters}</span>{rest}`
- Scroll: `interpolate(frame, [15, 150], [width, -textWidth], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})` applied as `translateX` on a `<div>` inside the panel with `overflow: 'hidden'` on the panel
- Panel fades in via `spring()` frames 0–15 before scroll begins

#### Scene 3: FormatVariations (165 frames)

- `<AbsoluteFill>` with `BG_GRADIENT`
- Centered glass frame (800×500px) containing screenshot images
- Screenshots: `['screenshot-01.png', ..., 'screenshot-08.png']` — filter to only those that exist (handled by static array defined at build time; graceful if array is shorter)
- Slide transition between images: each image holds for `Math.floor(135 / imageCount)` frames, with 15-frame horizontal slide between each
- Slide: `interpolate(frame - holdStart, [0, 15], [0, -frameWidth])` on outgoing; `interpolate(frame - holdStart, [0, 15], [frameWidth, 0])` on incoming
- All images use `objectFit: 'cover'` — landscape shots fill the portrait frame cleanly (cropped), no letterbox bars
- If no screenshots: render empty glass frame with muted "No screenshots" placeholder

#### Scene 4: TextInputDemo (75 frames)

- `<AbsoluteFill>` with `BG_GRADIENT`
- Centered glass card containing `text-input.png` via `<Img src={staticFile('assets/text-input.png')} />`
- Card fades in: `spring()` opacity 0→1 (frames 0–20, mass 0.8, damping 12, stiffness 80)
- Holds frames 20–55
- Fades out: `interpolate(frame, [55, 75], [1, 0], {extrapolateRight: 'clamp'})`
- If no screenshot: empty glass card with `TEXT_MUTED` placeholder text

#### Scene 5: EndCard (30 frames)

- `<AbsoluteFill>` with `BG_GRADIENT`
- Centered glass card (700×320px) with `GLOW_PEACH` box-shadow
- "Stream Reader" in large `ACCENT_PEACH` text
- "Available on the App Store" in `TEXT_MUTED` below
- Entire card fades + scales in via `spring()` (mass 1.0, damping 8, stiffness 90) — slight bounce for drama

### 1.4 Glass Morphism Fallback Strategy

Per research Decision 2, `backdropFilter` is unreliable in Remotion's headless renderer. Implementation approach:

1. Include `backdropFilter: BLUR_RADIUS` and `WebkitBackdropFilter: BLUR_RADIUS` in all glass panels
2. After first successful `npm run build`, check output `.mp4` for blur rendering
3. If blur is absent/broken in render: remove `backdropFilter`/`WebkitBackdropFilter` from all scene files (GLASS_SHADOW + GLASS_BG opacity provides sufficient depth without it)

### 1.5 Root.tsx Wiring

```tsx
<TransitionSeries>
  <TransitionSeries.Sequence durationInFrames={75}><AppIntro /></TransitionSeries.Sequence>
  <TransitionSeries.Transition presentation={slide()} durationInFrames={15} />
  <TransitionSeries.Sequence durationInFrames={165}><StreamingTextDemo /></TransitionSeries.Sequence>
  <TransitionSeries.Transition presentation={slide()} durationInFrames={15} />
  <TransitionSeries.Sequence durationInFrames={165}><FormatVariations /></TransitionSeries.Sequence>
  <TransitionSeries.Transition presentation={slide()} durationInFrames={15} />
  <TransitionSeries.Sequence durationInFrames={75}><TextInputDemo /></TransitionSeries.Sequence>
  <TransitionSeries.Transition presentation={slide()} durationInFrames={15} />
  <TransitionSeries.Sequence durationInFrames={30}><EndCard /></TransitionSeries.Sequence>
</TransitionSeries>
```

---

## Open Items / Deferred

| Item | Status | Resolution Path |
|------|--------|----------------|
| Scene 2 panel width (full vs. centered) | Deferred | Developer to determine from app screenshots; default to 70% centered per constitution aesthetics |
| `backdropFilter` render reliability | Deferred to implementation | Test on first `npm run build`; fallback defined in research.md |
| Screenshot asset filenames | Deferred | Assets provided by developer; filenames confirmed in spec Assumptions |
| Exact `textWidth` for Scene 2 scroll | Deferred to implementation | Measure at runtime or estimate conservatively at 4000px for 100-word string at 32px font |

---

## Suggested Next Command

```
/speckit.tasks
```
