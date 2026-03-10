# Stream Reader Promo — Agent Context

**Project**: Stream Reader App Store Promo Video
**Type**: Remotion video composition → `.mp4`
**Spec**: `specs/promo-video/spec.md`
**Plan**: `specs/promo-video/plan.md`

---

## Tech Stack

- **Language**: TypeScript (strict mode)
- **Framework**: Remotion (latest) + React 18
- **Transitions**: `@remotion/transitions` (`TransitionSeries`)
- **Styling**: Inline styles only — no Tailwind, no CSS-in-JS
- **Package manager**: npm

## Key Paths

| Path | Purpose |
|------|---------|
| `src/Root.tsx` | Composition root — only file that knows scene order |
| `src/scenes/` | One file per scene (11 total) |
| `src/lib/tokens.ts` | All design tokens — colors, blur, font, glow |
| `src/lib/content.ts` | Streaming text string for Scene 2 |
| `public/assets/` | Screenshot PNGs for Scenes 3 & 4 |

## Critical Rules (Constitution)

1. **No hard-coded hex values** in scene files — `tokens.ts` only
2. **No CSS transitions or Tailwind** — `spring()` / `interpolate()` only; explicit `mass`, `damping`, `stiffness`
3. **No `<img>` tags** — `<Img src={staticFile(...)} />` only
4. **No scene imports from other scenes** — shared code in `src/lib/` only
5. **No external font loading** — system font stack only

## Timing Architecture

- Composition: 1920×1080, 30fps, `durationInFrames: 645` (21.5s net)
- Scene durations (adjusted for TransitionSeries overlap):

| Scene | File | Frames |
|-------|------|--------|
| AppIntro | `AppIntro.tsx` | 60 |
| StreamingTextDemo | `StreamingTextDemo.tsx` | 120 |
| AnchorDemo | `AnchorDemo.tsx` | 90 |
| FontVariations | `FontVariations.tsx` | 90 |
| SizeVariations | `SizeVariations.tsx` | 60 |
| ColorVariations | `ColorVariations.tsx` | 90 |
| ThemeVariations | `ThemeVariations.tsx` | 60 |
| WpmDemo | `WpmDemo.tsx` | 60 |
| InternationalDemo | `InternationalDemo.tsx` | 90 |
| TextAreaDemo | `TextAreaDemo.tsx` | 45 |
| EndCard | `EndCard.tsx` | 30 |
| **Sum** | | **795** |

- 10 transitions × 15 frames = 150 frames subtracted by TransitionSeries
- Net: 795 − 150 = **645 frames = 21.5s** ✓

## Glass Morphism Note

`backdropFilter: blur()` is unreliable in Remotion's headless renderer. Use `GLASS_BG` (semi-transparent dark) + `GLASS_SHADOW` as primary depth — these render reliably. Include `backdropFilter` as progressive enhancement and test on first `npm run build`.

## Commands

```bash
npm start       # Open Remotion Studio
npm run build   # Render to out/StreamReaderPromo.mp4
```
