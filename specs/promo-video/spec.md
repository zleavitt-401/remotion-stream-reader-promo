# Feature Specification: Stream Reader App Store Promo Video

**Feature Branch**: `master`
**Created**: 2026-03-04
**Status**: Draft

## Clarifications

### Session 2026-03-04

- Q: Which accent color should be used — peach or lime? → A: Peach (orange-gold tone, matching the app's existing color palette, e.g. `#FFAB76` range)
- Q: What background treatment should appear behind the glass cards? → A: Dark gradient (near-black to dark charcoal/navy, vertical or radial)
- Q: What font family should be used across all scenes? → A: System sans-serif stack (`-apple-system, BlinkMacSystemFont, "Segoe UI"`)
- Q: What transition style should be used between screenshots in Scene 3? → A: Slide (horizontal translation, simulating a user swiping through settings)
- Q: What is the layout of the Scene 2 glass panel (full-width vs. centered)? → A: Deferred — to be determined from app screenshots provided by developer

---

## User Scenarios & Testing

### User Story 1 — Viewer experiences the full 15-second promo (Priority: P1)

A potential App Store customer watches the promo video and immediately understands what Stream Reader does, how it looks, and feels compelled to download it.

**Why this priority**: This is the entire purpose of the deliverable. Every scene exists to serve this single journey.

**Independent Test**: Play the rendered `.mp4` from start to finish. A viewer with no prior knowledge of Stream Reader should be able to describe the app's core function (streaming text reading), its visual style, and its platform (iOS App Store) within 5 seconds of the video ending.

**Acceptance Scenarios**:

1. **Given** the rendered `.mp4`, **When** a viewer watches it cold, **Then** they can identify: (a) the app name, (b) the core streaming text feature, (c) that settings like fonts and speed are configurable, (d) where to get it.
2. **Given** Remotion Studio is running, **When** the preview is played, **Then** all 5 scenes play in sequence without visual glitches, blank frames, or abrupt cuts.
3. **Given** the composition config, **When** checked, **Then** output is 1920×1080, 30fps, 450 frames (15 seconds).

---

### User Story 2 — Developer previews and renders the video locally (Priority: P2)

A developer on this project needs to scaffold the project, preview scenes in Remotion Studio, and produce the final `.mp4` without a deployment pipeline.

**Why this priority**: Without a working local build, the video cannot be produced or iterated on.

**Independent Test**: Running `npm start` opens Remotion Studio with all scenes visible. Running `npm run build` produces a valid `.mp4` file. Screenshots load from `public/assets/`.

**Acceptance Scenarios**:

1. **Given** a fresh clone of the repo, **When** `npm install && npm start` is run, **Then** Remotion Studio opens showing the full composition with all 5 scenes previewing correctly.
2. **Given** screenshot files placed in `public/assets/`, **When** Scene 3 and Scene 4 are previewed, **Then** images display correctly inside glass frames without broken image placeholders.
3. **Given** the project is ready, **When** `npm run build` is run, **Then** a `.mp4` file is produced with no render errors.

---

### Edge Cases

- What happens when no screenshots are present in `public/assets/` for Scene 3/4? Scenes should render empty glass frames without crashing the preview or render.
- What if the streaming text is too long to complete scrolling in 5 seconds? Text scroll speed must be calculated so the full string passes through the visible area within the scene duration.
- What if transition durations cause total frame count to drift from 450? The root composition's `durationInFrames` must account for transition overlap so net playback remains exactly 15 seconds.

---

## Requirements

### Functional Requirements

- **FR-001**: The video MUST contain exactly 5 scenes playing in sequence: App Intro, Streaming Text Demo, Format Variations, Text Input Demo, End Card.
- **FR-002**: Scene 1 (App Intro, ~2s / 60 frames) MUST display "Stream Reader" animating into a frosted glass card with a soft ambient glow using the peach accent color (orange-gold tone, e.g. `#FFAB76` range).
- **FR-003**: Scene 2 (Streaming Text Demo, ~5s / 150 frames) MUST animate a text string scrolling horizontally right-to-left, displayed inside a glass morphism panel. Text MUST apply Anchor formatting — first letters of each word rendered bold. This scene MUST be built entirely in Remotion code with no screenshots.
- **FR-004**: Scene 3 (Format Variations, ~5s / 150 frames) MUST cycle through 6–8 screenshots from `public/assets/`, each displayed inside a frosted glass frame, with smooth horizontal slide transitions between them to simulate a user swiping through app settings.
- **FR-005**: Scene 4 (Text Input Demo, ~2s / 60 frames) MUST display a single screenshot of the text input area inside a glass card, animating in with a fade, holding briefly, then transitioning out.
- **FR-006**: Scene 5 (End Card, ~1s / 30 frames) MUST display "Stream Reader" and "Available on the App Store" inside a frosted glass card with peach typography (orange-gold tone) and a soft ambient glow.
- **FR-007**: All animations MUST use Remotion's `spring()` or `interpolate()`. CSS transitions and Tailwind animation classes are forbidden per Remotion rendering constraints.
- **FR-008**: All colors MUST reference design tokens from `src/lib/tokens.ts`. Hard-coded hex values are forbidden in scene files.
- **FR-013**: All text MUST use the system sans-serif font stack (`-apple-system, BlinkMacSystemFont, "Segoe UI"`) defined as a token in `src/lib/tokens.ts`. No external font loading.
- **FR-009**: All images MUST use Remotion's `<Img>` component with `staticFile()`. Native HTML `<img>` tags are forbidden.
- **FR-010**: Each scene MUST reside in its own file under `src/scenes/`. Shared utilities MUST live in `src/lib/`. Composition root is `src/Root.tsx`.
- **FR-011**: The streaming text placeholder MUST be a passage approximately 80–120 words on the topic of focus and reading, long enough to scroll meaningfully across the screen in 5 seconds.
- **FR-012**: Scene 3 MUST gracefully handle fewer than 6 screenshot files by rendering only the available images without crashing.

### Key Entities

- **Composition**: Root video — 1920×1080, 30fps, 450 frames. Defined in `src/Root.tsx`.
- **Scene**: A self-contained React component in `src/scenes/` representing one timed segment.
- **Design Token**: A TypeScript constant in `src/lib/tokens.ts` — color, blur radius, border style, or glow value.
- **Screenshot Asset**: A static image file in `public/assets/` referenced via `staticFile()` in Scenes 3 and 4.
- **Streaming Text**: The horizontally-scrolling, Anchor-formatted text string rendered in code in Scene 2.

---

## Success Criteria

### Measurable Outcomes

- **SC-001**: The rendered `.mp4` is exactly 15 seconds (±0.1s) at 1920×1080 resolution.
- **SC-002**: All 5 scenes are visible and playable in Remotion Studio after `npm start`.
- **SC-003**: A first-time viewer can identify the app name, core feature, and platform within 5 seconds of the video ending.
- **SC-004**: The streaming text in Scene 2 scrolls at a pace where individual words are readable as they pass — not blurred by speed, not static.
- **SC-005**: Anchor formatting is visually distinguishable: bold first letters are noticeably heavier than the remainder of each word.
- **SC-006**: Glass morphism styling is consistent across all scenes — backdrop blur, semi-transparent overlay, and soft border are present on every card and panel.
- **SC-007**: `npm run build` completes without errors and produces a playable `.mp4`.
- **SC-008**: Each screenshot transition in Scene 3 completes in under 0.5 seconds, feeling like a user swiping through settings.

---

## Assumptions

- Screenshots for Scene 3 will be provided in `public/assets/` named `screenshot-01.png` through `screenshot-08.png` (or fewer). Scene 4 screenshot named `text-input.png`.
- No audio track is in scope.
- `@remotion/transitions` will be installed to support `TransitionSeries` for scene-to-scene transitions.
- `@remotion/transitions` TransitionSeries **subtracts** transition overlap from total. To achieve 450 frames (15s) net playback with 4 transitions × 15 frames each: scene durations sum to 510, root `durationInFrames = 510 − 60 = 450`. (See research.md Decision 1.)
- Inline styles are used throughout — Tailwind JIT and CSS-in-JS runtimes are not compatible with Remotion's frame renderer.
- `npm` is the package manager.
- Scene background across all 5 scenes is a dark gradient (near-black to dark charcoal/navy), defined as a design token in `src/lib/tokens.ts`.
