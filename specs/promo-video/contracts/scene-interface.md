# Scene Interface Contract

**Type**: UI Component Contract | **Date**: 2026-03-04

Since this is a Remotion video project (not a web service), the "interface" is the React component contract each scene must satisfy for the Root compositor.

---

## Scene Component Contract

Every file in `src/scenes/` MUST export a default React component conforming to this contract:

```tsx
// Each scene receives no props — all timing comes from Remotion hooks
export default function SceneName(): JSX.Element {
  const frame = useCurrentFrame();           // local frame (0 = scene start)
  const { fps, durationInFrames, width, height } = useVideoConfig(); // local Sequence config

  // ... animation logic using spring() / interpolate() only
  // ... all colors from tokens.ts only
  // ... all images via <Img src={staticFile(...)} />

  return <AbsoluteFill style={{ background: BG_GRADIENT }}>...</AbsoluteFill>;
}
```

### Rules

| Rule | Constraint |
|------|-----------|
| Props | None — scenes receive no external props |
| Frame source | `useCurrentFrame()` only (local to scene's Sequence) |
| Duration source | `useVideoConfig().durationInFrames` (local Sequence duration) |
| Colors | Imported from `src/lib/tokens.ts` only |
| Animations | `spring()` or `interpolate()` only |
| Images | `<Img src={staticFile("assets/filename.png")} />` only |
| Imports | May import from `src/lib/` only — never from other `src/scenes/` files |
| Background | Every scene wraps content in `<AbsoluteFill>` with `BG_GRADIENT` background |

---

## Root Composition Contract

`src/Root.tsx` is the only file that:
- Knows scene order
- Defines transition durations
- Sets composition dimensions/fps

```tsx
export const RemotionRoot: React.FC = () => (
  <Composition
    id="StreamReaderPromo"
    component={Main}
    durationInFrames={450}
    fps={30}
    width={1920}
    height={1080}
  />
);
```

---

## Design Token Contract

`src/lib/tokens.ts` MUST export all values used across scenes:

```tsx
// Required exports (minimum)
export const BG_DARK: string;
export const BG_GRADIENT: string;
export const GLASS_BG: string;
export const GLASS_BORDER: string;
export const GLASS_SHADOW: string;
export const BLUR_RADIUS: string;
export const ACCENT_PEACH: string;
export const TEXT_PRIMARY: string;
export const TEXT_MUTED: string;
export const GLOW_PEACH: string;
export const BORDER_RADIUS_CARD: number;
export const BORDER_RADIUS_SM: number;
export const FONT_FAMILY: string;
```

All values are TypeScript string/number constants — no runtime objects, no theme providers.
