<!--
SYNC IMPACT REPORT
==================
Version change: N/A → 1.0.0 (initial ratification)
Added sections:
  - Core Principles (5 principles)
  - Technical Constraints
  - Visual Design System
  - Governance
Modified principles: N/A (initial)
Removed sections: N/A (initial)
Templates reviewed:
  - .specify/templates/plan-template.md ✅ compatible (no amendments needed)
  - .specify/templates/spec-template.md ✅ compatible (no amendments needed)
  - .specify/templates/tasks-template.md ✅ compatible (no amendments needed)
Deferred TODOs: none
-->

# Stream Reader Promo Constitution

## Core Principles

### I. Scene Isolation (NON-NEGOTIABLE)

Each scene MUST live in its own file under `src/scenes/`. No scene file may import from another scene file.
Shared utilities (spring helpers, color tokens, easing presets) MUST live in `src/lib/` and be imported from there.
The root `src/Root.tsx` composes all scenes via the Remotion `<Composition>` API — it is the only file that knows scene order.

**Rationale**: Scene isolation ensures each file is independently editable, debuggable, and renderable in Remotion Studio's preview without side effects from neighboring scenes.

### II. Animation Smoothness First

All animated values MUST use Remotion's `spring()` or `interpolate()` with carefully tuned parameters — no instant cuts to visibility/opacity without easing.
Spring configs MUST specify explicit `mass`, `damping`, and `stiffness` values (no implicit defaults for key animations).
Frame-rate target is 30fps for render; all animations MUST be authored at 30fps (`fps: 30` in composition config).

**Rationale**: Promotional video quality is judged primarily on motion feel. A single jarring cut undermines the entire piece.

### III. Design System Compliance

All scenes MUST use only the color tokens defined in `src/lib/tokens.ts` — no hard-coded hex values in scene files.
The visual design system is: glass morphism on a deep navy background (`#0F1117`), accent colors peach (`#FFCBA4`) and lime (`#BFFF00`), semi-transparent white overlays (`rgba(255,255,255,0.10)`), backdrop blur, and soft glow effects.
No hard edges, drop shadows without blur, or solid opaque backgrounds are permitted in scene files.

**Rationale**: Visual consistency across scenes is essential for a polished promo — divergence in color or border treatment reads as amateur.

### IV. Render-Ready Output

The composition MUST be configured for: `width: 1920`, `height: 1080`, `fps: 30`, `durationInFrames: 450` (15 seconds at 30fps).
Render output format is `.mp4` (H.264). No deployment pipeline is required — local render via `npx remotion render` is the delivery mechanism.
All asset files (fonts, images, audio if any) MUST be placed under `public/` and referenced via `staticFile()` — no external URLs.

**Rationale**: Hard-coding these values in the constitution prevents accidental misconfiguration that would require a full re-render.

### V. Simplicity Over Abstraction

Each scene MUST be self-contained enough that a developer can understand its full animation logic by reading that one file.
Abstractions in `src/lib/` are permitted only when the same pattern appears in 2 or more scenes.
No premature componentization — prefer inline JSX over extracted sub-components unless the component is reused across scenes.

**Rationale**: Promotional videos are not maintained long-term. Readability and speed of iteration outweigh architectural elegance.

## Technical Constraints

- **Language**: TypeScript (strict mode)
- **Framework**: Remotion (latest) with React 18
- **Styling**: Inline styles only (Remotion renders frames outside a browser DOM — no CSS-in-JS runtime, no Tailwind JIT). CSS tokens expressed as TypeScript constants in `src/lib/tokens.ts`.
- **Package manager**: npm or bun (match whatever `specify init` used)
- **No testing framework required**: Visual output is validated by previewing in Remotion Studio (`npx remotion studio`)
- **No deployment**: Local render only

## Visual Design System

This section is the canonical reference for all visual decisions.

| Token | Value | Usage |
|-------|-------|-------|
| `BG_DARK` | `#0F1117` | Full-frame background |
| `GLASS_WHITE` | `rgba(255,255,255,0.10)` | Card/panel fill |
| `GLASS_BORDER` | `rgba(255,255,255,0.20)` | Card/panel border |
| `ACCENT_PEACH` | `#FFCBA4` | Highlight text, icons |
| `ACCENT_LIME` | `#BFFF00` | CTAs, key data points |
| `TEXT_PRIMARY` | `rgba(255,255,255,0.95)` | Body text |
| `TEXT_MUTED` | `rgba(255,255,255,0.55)` | Secondary labels |
| `BLUR_RADIUS` | `24px` | Glass backdrop blur |
| `GLOW_PEACH` | `0 0 40px rgba(255,203,164,0.35)` | Peach element glow |
| `GLOW_LIME` | `0 0 40px rgba(191,255,0,0.35)` | Lime element glow |

**Border radius**: `16px` for cards, `8px` for smaller elements.
**Typography**: System font stack or a single Google Font loaded via `staticFile()`. All text MUST have `fontWeight` and `letterSpacing` set explicitly.

## Governance

This constitution supersedes all other practices for this project. Since this is a short-lived promotional video project, amendments are informal but MUST be reflected in this file before implementation begins.

**Amendment procedure**: Edit this file, increment the version, and update `LAST_AMENDED_DATE`. No PR approval required for a solo project.

**Versioning policy**:
- MAJOR: Changes to composition dimensions, fps, or duration.
- MINOR: New design token, new principle, or scene structure change.
- PATCH: Wording clarifications, token value tweaks, non-breaking refinements.

**Compliance review**: Before running final render, verify all scene files use only tokens from `src/lib/tokens.ts` and all animations use `spring()` or `interpolate()`.

**Version**: 1.0.0 | **Ratified**: 2026-03-04 | **Last Amended**: 2026-03-04
