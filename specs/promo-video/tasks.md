# Tasks: Stream Reader App Store Promo Video

**Input**: Design documents from `specs/promo-video/`
**Prerequisites**: plan.md ✅, spec.md ✅, research.md ✅, data-model.md ✅, contracts/scene-interface.md ✅
**Tests**: Not requested — visual validation via Remotion Studio preview only.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2)

---

## Phase 1: Setup (Project Initialization)

**Purpose**: Scaffold the Remotion project and install all dependencies.

- [x] T001 Initialize Remotion project with `npx create-video@latest` or manually scaffold `package.json` with `remotion`, `@remotion/cli`, `@remotion/transitions`, `react`, `react-dom`, `typescript` dependencies
- [x] T002 Configure `tsconfig.json` with strict mode, `jsx: react`, and `moduleResolution: bundler` compatible with Remotion
- [x] T003 Add npm scripts to `package.json`: `"start": "remotion studio"`, `"build": "remotion render StreamReaderPromo out/StreamReaderPromo.mp4"`
- [x] T004 Create directory structure: `src/scenes/`, `src/lib/`, `public/assets/`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core shared infrastructure that ALL scenes depend on. Must be complete before any scene can be built.

**⚠️ CRITICAL**: No scene work can begin until this phase is complete.

- [x] T005 Create `src/lib/tokens.ts` with all design tokens: `BG_DARK`, `BG_GRADIENT`, `GLASS_BG`, `GLASS_BORDER`, `GLASS_SHADOW`, `BLUR_RADIUS`, `ACCENT_PEACH`, `TEXT_PRIMARY`, `TEXT_MUTED`, `GLOW_PEACH`, `BORDER_RADIUS_CARD` (16), `BORDER_RADIUS_SM` (8), `FONT_FAMILY` (system sans-serif stack) — exact values from plan.md §1.2
- [x] T006 Create `src/lib/content.ts` exporting `STREAMING_TEXT` — an 80–120 word passage on the topic of focus and reading, suitable for Scene 2's Anchor-formatted scroll
- [x] T007 Create `src/Root.tsx` with `RemotionRoot` component registering the `StreamReaderPromo` composition (1920×1080, 30fps, `durationInFrames: 450`) and `Main` component wiring all 5 scenes via `TransitionSeries` with `slide()` transitions at 15 frames each — scene durations: AppIntro 75, StreamingTextDemo 165, FormatVariations 165, TextInputDemo 75, EndCard 30
- [x] T008 Add placeholder stub exports for all 5 scene files (`src/scenes/AppIntro.tsx`, `StreamingTextDemo.tsx`, `FormatVariations.tsx`, `TextInputDemo.tsx`, `EndCard.tsx`) — each returns `<AbsoluteFill style={{background: BG_GRADIENT}} />` so Root.tsx compiles and Studio opens

**Checkpoint**: `npm start` opens Remotion Studio showing `StreamReaderPromo` composition at 450 frames with 5 empty dark scenes. Foundation ready.

---

## Phase 3: User Story 1 — Viewer Experiences the Full Promo (Priority: P1) 🎯 MVP

**Goal**: All 5 scenes are fully implemented and play correctly in sequence. A cold viewer can identify the app name, core feature (streaming text reading), configurable settings, and platform (iOS App Store).

**Independent Test**: Play the rendered `.mp4` from start to finish. Verify: (a) 5 distinct scenes play in sequence, (b) no blank frames or abrupt cuts, (c) "Stream Reader" appears in Scene 1 and Scene 5, (d) scrolling Anchor-formatted text appears in Scene 2, (e) screenshots cycle in Scene 3, (f) text input screenshot appears in Scene 4, (g) "Available on the App Store" appears in Scene 5.

### Implementation for User Story 1

- [x] T009 [US1] Implement `src/scenes/AppIntro.tsx`: `<AbsoluteFill>` with `BG_GRADIENT`; centered glass card (600×300px) using `GLASS_BG`, `GLASS_BORDER`, `GLASS_SHADOW`, `backdropFilter: BLUR_RADIUS`, `WebkitBackdropFilter: BLUR_RADIUS`, `borderRadius: BORDER_RADIUS_CARD`; "Stream Reader" title in `ACCENT_PEACH`, `FONT_FAMILY`, `fontWeight: 700`; card animates in with `spring({fps, frame, config: {mass: 0.8, damping: 12, stiffness: 80}})` driving both `opacity` (0→1) and `scale` (0.85→1); glow pulses via `interpolate(frame, [20, 75], [0.3, 1.0], {extrapolateRight: 'clamp'})` on `boxShadow` opacity via `GLOW_PEACH`
- [x] T010 [US1] Implement `src/scenes/StreamingTextDemo.tsx`: `<AbsoluteFill>` with `BG_GRADIENT`; centered glass panel (70% width × 200px) using glass tokens with `overflow: 'hidden'`; panel fades in via `spring({fps, frame, config: {mass: 0.8, damping: 12, stiffness: 80}})` over frames 0–15; inside panel render `STREAMING_TEXT` from `src/lib/content.ts` with Anchor formatting (each word: `<span style={{fontWeight: 700}}>{word[0]}</span>{word.slice(1)}` joined with spaces in a single `<span>` row); scrolling via `interpolate(frame, [15, 150], [width * 0.7, -4000], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})` applied as `transform: translateX(${x}px)` on inner text div; `fontFamily: FONT_FAMILY`, `color: TEXT_PRIMARY`, `fontSize: 32`
- [x] T011 [US1] Implement `src/scenes/FormatVariations.tsx`: `<AbsoluteFill>` with `BG_GRADIENT`; centered glass frame (800×500px) using glass tokens; define `SCREENSHOTS` array of up to 8 `staticFile('assets/screenshot-N.png')` paths; if `SCREENSHOTS.length === 0` render empty frame with `TEXT_MUTED` text "Screenshots will appear here"; otherwise: per-image hold duration = `Math.floor(135 / SCREENSHOTS.length)` frames, transition duration = 15 frames; for each image pair compute current index from `frame`; render current image and next image side by side, sliding left via `interpolate(transitionFrame, [0, 15], [0, -800])` on current and `interpolate(transitionFrame, [0, 15], [800, 0])` on next; use `<Img src={path} style={{width: '100%', height: '100%', objectFit: 'cover'}} />` via Remotion `<Img>` component — `cover` ensures landscape shots fill the portrait frame without letterbox bars
- [x] T012 [US1] Implement `src/scenes/TextInputDemo.tsx`: `<AbsoluteFill>` with `BG_GRADIENT`; centered glass card (700×450px) using glass tokens; `<Img src={staticFile('assets/text-input.png')} style={{width: '100%', height: '100%', objectFit: 'contain'}} />`; if no screenshot render empty card with `TEXT_MUTED` placeholder; card fades in via `spring({fps, frame, config: {mass: 0.8, damping: 12, stiffness: 80}})` driving opacity 0→1 over frames 0–20; holds frames 20–55; fades out via `interpolate(frame, [55, 75], [1, 0], {extrapolateRight: 'clamp'})`
- [x] T013 [US1] Implement `src/scenes/EndCard.tsx`: `<AbsoluteFill>` with `BG_GRADIENT`; centered glass card (700×320px) using `GLASS_BG`, `GLASS_BORDER`, `boxShadow: GLOW_PEACH`, `borderRadius: BORDER_RADIUS_CARD`; "Stream Reader" in `ACCENT_PEACH`, `fontSize: 56`, `fontWeight: 700`, `FONT_FAMILY`; "Available on the App Store" in `TEXT_MUTED`, `fontSize: 24`, below; entire card animates in via `spring({fps, frame, config: {mass: 1.0, damping: 8, stiffness: 90}})` driving opacity 0→1 and scale 0.9→1 (slight bounce)
- [ ] T014 [US1] Preview all 5 scenes in Remotion Studio (`npm start`): verify each scene is visible and animates correctly; confirm composition is exactly 450 frames; check no TypeScript errors; verify glass card visual appearance is consistent across all scenes

**Checkpoint**: All 5 scenes are functional in Studio. Composition plays end-to-end at 450 frames with no errors. US1 is independently verifiable.

---

## Phase 4: User Story 2 — Developer Previews and Renders Locally (Priority: P2)

**Goal**: `npm start` opens Studio with all scenes, `npm run build` produces a valid `.mp4`, screenshot assets load correctly.

**Independent Test**: On a fresh clone with screenshots in `public/assets/`, run `npm install && npm start` — Studio opens with all 5 scenes. Run `npm run build` — `out/StreamReaderPromo.mp4` is produced with no errors. Verify `.mp4` is 15s (±0.1s) at 1920×1080.

### Implementation for User Story 2

- [ ] T015 [US2] Place placeholder screenshot assets in `public/assets/` for local development: copy or symlink actual app screenshots as `screenshot-01.png` through `screenshot-08.png` and `text-input.png`; if real screenshots not yet available create 800×500px solid-color placeholder PNGs
- [ ] T016 [US2] Run `npm run build` for the first render pass; verify `.mp4` output exists and plays; check `backdropFilter` blur renders correctly in the output — if blur is missing/broken in rendered video, remove `backdropFilter` and `WebkitBackdropFilter` from all 5 scene glass panels (replace with increased `GLASS_SHADOW` depth for equivalent depth effect)
- [ ] T017 [US2] Verify rendered `.mp4`: open in QuickTime/VLC, confirm duration is 15.0s (±0.1s), resolution is 1920×1080, all 5 scenes play in sequence, no blank frames, no render artifacts

**Checkpoint**: `npm run build` produces a clean `.mp4`. US2 fully verified.

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Final quality pass across all scenes.

- [ ] T018 [P] Audit all scene files for constitution compliance: confirm no hard-coded hex values (only token imports), no CSS transitions, no `<img>` tags, no scene-to-scene imports, all `spring()` calls have explicit `mass`/`damping`/`stiffness`
- [ ] T019 [P] Tune scroll speed in `src/scenes/StreamingTextDemo.tsx`: verify `STREAMING_TEXT` renders at a pace where individual words are readable as they pass (SC-004); adjust `interpolate` output range if scroll is too fast or too slow; target ~13–20px/frame visible travel
- [ ] T020 [P] Verify Anchor formatting in Scene 2 (SC-005): bold first letters must be visually distinguishable from the rest of each word; increase `fontWeight` contrast if needed (bold: 700, normal: 400)
- [ ] T021 [P] Verify glass morphism consistency across all scenes (SC-006): backdrop blur, semi-transparent overlay, and soft border must be present on every card/panel; check in both Studio preview and rendered `.mp4`
- [ ] T022 Verify Scene 3 transition timing (SC-008): each screenshot slide transition must complete in under 0.5 seconds (15 frames at 30fps = 0.5s ✓); confirm visually that transitions feel like a user swiping
- [ ] T023 Update `specs/promo-video/spec.md` Clarifications section to resolve the deferred Scene 2 panel width item once app screenshots have been reviewed; adjust panel width in `src/scenes/StreamingTextDemo.tsx` if needed

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — start immediately
- **Foundational (Phase 2)**: Depends on Phase 1 — BLOCKS all scenes
- **US1 (Phase 3)**: Depends on Phase 2 — scenes can be implemented in parallel (T009–T013 are all different files)
- **US2 (Phase 4)**: Depends on Phase 3 (scenes must exist to render)
- **Polish (Phase 5)**: Depends on Phase 4

### User Story Dependencies

- **US1**: Unblocked after Phase 2 — no dependency on US2
- **US2**: Depends on US1 (needs working scenes to render)

### Within Phase 3 (Parallel Opportunities)

T009, T010, T011, T012, T013 are all separate files with no inter-dependencies — all 5 can be implemented in parallel once Phase 2 is complete.

```bash
# Parallel implementation of all 5 scenes (once T005–T008 are done):
Task A: T009 — src/scenes/AppIntro.tsx
Task B: T010 — src/scenes/StreamingTextDemo.tsx
Task C: T011 — src/scenes/FormatVariations.tsx
Task D: T012 — src/scenes/TextInputDemo.tsx
Task E: T013 — src/scenes/EndCard.tsx
```

---

## Implementation Strategy

### MVP First (US1 — Viewer Story)

1. Complete Phase 1: Setup (T001–T004)
2. Complete Phase 2: Foundational (T005–T008) — **CRITICAL, blocks everything**
3. Complete Phase 3: US1 scenes (T009–T014)
4. **STOP and VALIDATE**: Preview in Studio, confirm all 5 scenes play correctly
5. Proceed to Phase 4 (render) if scenes look good

### Incremental Delivery

1. Setup + Foundational → Studio opens with 5 empty scenes ✓
2. Implement scenes one at a time → preview each in Studio after each task
3. All scenes complete → first full render pass
4. Polish → final `.mp4` delivery

---

## Notes

- No automated tests — visual validation in Remotion Studio is the test suite
- `backdropFilter` must be tested in rendered output (not just Studio preview) — see research.md Decision 2
- Scene 2 panel width is deferred — default to 70% centered; adjust after app screenshots are reviewed
- All scene files are independent — implement and preview each one in Studio before moving to the next
- Commit after T008 (Foundation checkpoint) and after T014 (US1 checkpoint) at minimum
