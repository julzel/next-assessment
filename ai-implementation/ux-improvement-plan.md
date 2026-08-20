# Guided Capture and Live Preview UX Improvement Plan

**Status:** Decision-ready remediation plan

**Sequence:** Complete after Slice 5 and before the original Slice 6

**Execution rule:** Implement one remediation slice per focused Codex turn. Keep the app runnable, run the slice-specific checks before the repository-wide checks, and append the result, exactly one next logical step, and the recommended next model to `ai-implementation/changelog.md` only after the slice completion check passes.

## 1. Outcome

Turn the current working editor into a guided brand-design experience where a user can:

1. understand the purpose of each step and each decision;
2. see which required decisions remain and deliberately finish the capture flow;
3. see each answer change the relevant content and the actual visual system immediately;
4. understand why the rendered Blueprint looks the way it does; and
5. review, save, and reopen the same result without changing the existing persistence contract.

This is a quality correction to Slices 4–5, not new product scope. It directly supports the assessment's live-editing and UX-polish criteria in `README.md`, the immediate-preview acceptance criteria in `ai-implementation/product-scope.md`, and the responsive/accessibility contract in `ai-implementation/solution-design.md`.

## 2. Evidence-backed diagnosis

| Observed problem | Current cause | Required correction |
| --- | --- | --- |
| The user reaches Voice but cannot complete the flow. | The last button is rendered as `Next: Complete` while also being unconditionally disabled on the final step in `src/components/blueprint/guided-editor.tsx`. There is no review or completion transition. | Replace the dead end with an actionable **Review blueprint** transition. If required answers are missing, show a concise summary and move focus to the first incomplete step; if complete, open the current full preview. Saving an incomplete draft remains allowed. |
| The user cannot tell what “complete” means. | `isBlueprintComplete` already defines the requirements in `src/lib/blueprint/validation.ts`, but the editor does not expose step completion, missing fields, or overall progress. | Derive a four-step progress model from the same requirements, show `n of 4 complete`, mark each step, and distinguish **Save draft** from **Review blueprint**. |
| The step navigation is cramped and unclear. | Four verbose cards are forced into four columns at the editor's `sm` breakpoint in `src/components/blueprint/guided-editor.tsx`. The supplied screenshot shows clipped descriptions and a visually weak current/completed distinction. | Use a compact responsive stepper: one column on narrow editor widths, two columns where useful, or compact numbered controls with a separate current-step purpose panel. Never truncate the purpose text. |
| Users see labels but not the consequence of a choice. | Most options in `src/lib/blueprint/options.ts` contain only `id` and `label`; the step components render those labels without definitions or effect descriptions. | Add trusted display metadata describing what each option means and what it changes. Show this information directly in option cards or adjacent helper text, not only in tooltips. |
| Visual decisions mostly change prose. | `src/lib/blueprint/content.ts` turns visual, color, and typography answers into the sentence in `content.visualDirection`. `src/components/blueprint/templates/blueprint-sections.tsx` adds three small swatches, but the selected answers do not control the canvas palette, typography, spacing, geometry, or emphasis. | Resolve the closed answer values into trusted presentation tokens and apply those tokens across the entire rendered Blueprint. |
| The three templates are shells around essentially the same stack. | Editorial, Studio, and Warm have different outer headers in `src/components/blueprint/templates/`, but all delegate their content layout to the same linear `BlueprintSections`. Existing tests check renderer labels and section presence, not composition. | Keep one semantic content contract but give each template a genuinely different macro composition: editorial narrative, studio modular grid, and warm conversational/story layout. |
| The preview does not explain causality. | The active step is local `useState` inside `GuidedEditor`; `BlueprintWorkspace` and `BlueprintPreview` do not know what the user is editing. | Make the active step controlled ephemeral workspace state. Focus or highlight the affected preview region and name the relationship, such as “Color direction applies this palette to surfaces and accents.” |
| Mobile breaks the edit/feedback loop. | Mobile shows either Questions or Preview in `src/components/blueprint/blueprint-workspace.tsx`; changing a field gives no local visual confirmation beyond text the user cannot currently see. | Keep state-preserving tabs, add a compact step-specific live-impact panel in Questions mode, and provide a clear **View this change** action that opens Preview focused on the affected region. |
| The final artifact does not explain how inputs became design. | The preview lists the selected visual labels but offers no design rationale. | Add a derived **Why this direction works** section that maps each selected decision to the actual treatment visible in the artifact. |
| The editor's base typography is not reliably using Geist. | `src/app/globals.css` defines `--font-sans: var(--font-sans)`, a cyclic self-reference, even though `src/app/layout.tsx` exposes Geist as `--font-geist-sans`. The serif-looking controls in the supplied screenshot are consistent with fallback behavior. | Correct the global token before judging or implementing typography directions, and use explicit trusted font stacks for the Blueprint presentation. |
| Existing validation detail is discarded in the UI. | `src/app/blueprints/actions.ts` returns structured `issues`, but `src/components/blueprint/blueprint-workspace.tsx` reduces a failed save to one header message. | Retain the returned issues in ephemeral state and associate relevant messages with fields using `aria-invalid` and `aria-describedby`. |

The current implementation technically updates state immediately, but it does not satisfy the intended product bar that the result should feel like “a coherent brand artifact” (`ai-implementation/product-scope.md`) or the assessment expectation that design controls visibly affect the preview (`README.md`).

## 3. Target interaction

### Setup

- The user sees three template cards with small structural thumbnails and the existing descriptions.
- Copy clarifies that the template chooses the composition, while later answers choose palette, typography, shape, and tone.
- The selected template immediately changes the preview composition without clearing any answers.

### Guided capture

- The header shows progress, for example **2 of 4 steps complete**.
- Each step control shows current, complete, or incomplete state without relying on color alone.
- The current step starts with two short statements:
  - **Why this matters** — the brand decision being captured.
  - **You will see this change** — the exact preview areas affected.
- Choice cards contain a plain-language definition and a short visual consequence. Free-text fields include an example and explain where the answer appears.
- Navigation never traps the user. Back and Next preserve values; direct step navigation remains available.

### Immediate preview

- Desktop keeps the preview visible and highlights the region affected by the active step.
- Mobile keeps a compact impact sample below the current controls and offers **View this change** to switch to Preview without losing the active step or form state.
- Selected values visibly affect the artifact according to this ownership model:

| Decision | Visible responsibility |
| --- | --- |
| Template | Macro composition and information hierarchy only. |
| Foundation | Prominent audience/promise content and its placement in the composition. |
| Personality traits | Accent emphasis and small decorative cues, plus the existing essence/personality copy. |
| Visual direction | Density, spacing, border weight, corner treatment, and decorative geometry. |
| Color direction | Canvas, surface, text, border, and accent palette—not only swatches. |
| Typography direction | Actual display/body family treatment, scale, weight, and tracking. |
| Voice traits | Visible voice-trait treatment and hierarchy in the messaging section. |
| Always communicate / Avoid | A clear “message / guardrail” pair in the Voice section. |

### Review and save

- On the last step, **Review blueprint** is always actionable.
- If incomplete, the editor announces the missing decisions and moves to the first incomplete step.
- If complete, it opens the current unsaved Blueprint in full preview.
- The full artifact includes a concise **Why this direction works** rationale derived from the selected template and answers.
- Save remains explicit. Before completion it is labeled **Save draft**; after completion it is labeled **Save blueprint**. Reopening produces the same content, presentation, and rationale because all three derive from the persisted canonical answers.

## 4. Technical decisions

### Preserve the data contract

Do not change `BrandBlueprintConfig`, `schemaVersion`, the Drizzle schema, seed data, repository functions, or Server Action payloads. The current persisted answers already contain all necessary inputs.

Add a pure, non-persisted `BlueprintPresentationProfile` derived from `BlueprintDraft`:

```text
BlueprintDraft
  ├─ template ───────────▶ macro composition
  └─ config.answers
       ├─ visualDirection ─▶ spacing / shape / border tokens
       ├─ colorDirection ──▶ palette tokens
       ├─ typographyDirection ▶ type tokens
       ├─ personalityTraits ▶ accent modifiers
       └─ voice fields ─────▶ voice presentation
                         └──▶ rationale entries
```

The resolver must use exhaustive local registries with literal, trusted classes or code-owned CSS custom-property values. It must never accept stored CSS, arbitrary class names, HTML, or AI-generated layout instructions. This preserves the security boundary in `ai-implementation/solution-design.md` and ensures future AI answer changes use the same renderer as manual edits.

### Deterministic precedence

- Template owns structure and may not override the chosen palette or typography.
- Color direction owns all semantic colors.
- Typography direction owns display/body type treatment.
- Visual direction owns spacing, geometry, and border treatment.
- Personality traits add bounded accent modifiers; they may not replace the palette, typography, or macro layout.
- Voice decisions affect the messaging module, not unrelated visual tokens.
- Missing decisions use a documented neutral fallback and are identified as incomplete in the rationale; the preview must not invent a user choice.

### Explainability

Rationale text comes from the same trusted metadata as the applied tokens. It is derived at render time and is not another editable or persisted copy source. This prevents the explanation from drifting from the visual result.

## 5. Ordered remediation slices

## Slice 5A — Make guided capture understandable and finishable

**Recommended model:** GPT-5.6 Terra, medium reasoning.

### User-visible outcome

The user understands every step, sees progress and missing requirements, can navigate without clipped labels, and can use a real Review action at the end. Incomplete drafts remain saveable and are labeled as drafts.

### Files

Add:

- `src/lib/blueprint/progress.ts`
- `src/lib/blueprint/progress.test.ts`

Modify:

- `src/lib/blueprint/options.ts`
- `src/lib/blueprint/validation.ts`
- `src/lib/blueprint/validation.test.ts`
- `src/lib/blueprint/reducer.ts`
- `src/lib/blueprint/reducer.test.ts`
- `src/components/blueprint/guided-editor.tsx`
- `src/components/blueprint/guided-editor.test.tsx`
- `src/components/blueprint/foundation-step.tsx`
- `src/components/blueprint/personality-step.tsx`
- `src/components/blueprint/visual-system-step.tsx`
- `src/components/blueprint/voice-step.tsx`
- `src/components/blueprint/blueprint-workspace.tsx`
- `src/components/blueprint/blueprint-workspace.test.tsx`
- `src/components/blueprint/workspace-header.tsx`
- `src/app/globals.css`

### State and contract impact

- No persistence or schema change.
- Add only ephemeral `currentStep`, review-feedback, and field-issue state.
- Make `progress.ts` the single source for per-step requirements and overall completion; preserve the public `isBlueprintComplete` API so later AI slices do not need a contract change.
- Extend code-owned option metadata with descriptions and effect labels; stored enum IDs remain unchanged.

### Tests

- Every required answer maps to exactly one step and missing-field message.
- Overall completion stays consistent with `isBlueprintComplete`.
- Step controls expose current/complete/incomplete state and do not truncate their accessible names.
- Each step explains its purpose and affected preview area.
- Voice explains that one trait is required and three is the maximum.
- Final Review with missing answers announces the missing fields and focuses the first incomplete step.
- Final Review with a complete draft calls the full-preview transition.
- Save copy is **Save draft** while incomplete and **Save blueprint** when complete.
- Structured save issues are shown beside the relevant field without discarding the local draft.
- The global `font-sans` token resolves to Geist instead of referring to itself.
- Keyboard navigation and entered values survive Back, Next, and direct-step navigation.

### Validation

```text
npx vitest run src/lib/blueprint/progress.test.ts src/lib/blueprint/validation.test.ts src/components/blueprint/guided-editor.test.tsx src/components/blueprint/blueprint-workspace.test.tsx
npx tsc --noEmit
npm run lint
npm test
npm run build
```

### Dependencies

Completed Slices 1–5. This slice must land first because later preview focus and AI gating need one shared completion/progress model.

### Completion check

- [ ] The final step has a working Review action rather than a disabled “Complete” button.
- [ ] A user can identify why every step exists and what it changes.
- [ ] Current, complete, and incomplete states are visible and accessible.
- [ ] Incomplete drafts remain saveable and no persisted contract changes.
- [ ] Field-level validation feedback and the base font token behave correctly.
- [ ] Focused and repository-wide validation passes.

## Slice 5B — Establish the trusted visual resolver and prove one live path

**Recommended model:** GPT-5.6 Terra, medium reasoning.

### User-visible outcome

The Editorial preview becomes the thin end-to-end proof: changing visual direction, palette, typography, or personality visibly changes the rendered artifact—not just its descriptive sentence. Template cards also show their structural differences before selection.

### Files

Add:

- `src/lib/blueprint/presentation.ts`
- `src/lib/blueprint/presentation.test.ts`
- `src/components/blueprint/template-option-card.tsx`
- `src/components/blueprint/template-option-card.test.tsx`

Modify:

- `src/lib/blueprint/options.ts`
- `src/components/blueprint/blueprint-workspace.tsx`
- `src/components/blueprint/blueprint-workspace.test.tsx`
- `src/components/blueprint/blueprint-preview.tsx`
- `src/components/blueprint/blueprint-preview.test.tsx`
- `src/components/blueprint/templates/blueprint-sections.tsx`
- `src/components/blueprint/templates/editorial-template.tsx`
- `src/app/globals.css`

### State and contract impact

- No database, schema, or Server Action change.
- Add a pure `resolveBlueprintPresentation(draft)` result with palette, typography, geometry, personality modifiers, and matching rationale metadata.
- Use stable `data-template`, `data-visual-direction`, `data-color-direction`, and `data-typography-direction` attributes as observable renderer semantics; do not persist them.
- Use literal trusted token registries so Tailwind can discover classes and no user-authored style enters the DOM.

### Tests

- Every closed template, visual, color, typography, and personality enum has a resolver entry; missing registry coverage fails at compile/test time.
- Neutral fallbacks are returned for incomplete answers and are described as fallbacks.
- Representative answer changes produce different palette, type, shape, and emphasis tokens.
- Editorial applies the selected palette to major surfaces/accents, selected typography to visible headings/body, and selected visual direction to geometry/spacing.
- The same field change still updates deterministic content.
- Template choice cards contain a structural thumbnail, selected state, description, and keyboard-operable radio behavior.

### Validation

```text
npx vitest run src/lib/blueprint/presentation.test.ts src/components/blueprint/template-option-card.test.tsx src/components/blueprint/blueprint-preview.test.tsx src/components/blueprint/blueprint-workspace.test.tsx
npx tsc --noEmit
npm run lint
npm test
npm run build
```

Manual proof before replication:

```text
In Editorial, switch color Neutral → Vibrant, type Modern sans → Editorial serif,
and visual Minimal → Playful. Confirm the canvas, accents, visible type treatment,
and geometry change independently while the entered content remains unchanged.
```

### Dependencies

Slice 5A, so the resolver can reuse accepted metadata and future focus state.

### Completion check

- [ ] Each visual-system decision has an actual visible effect in Editorial.
- [ ] The color change affects the artifact, not only the swatch row.
- [ ] Token resolution is exhaustive, deterministic, and contains no arbitrary stored style.
- [ ] Template selection communicates composition before the user commits to it.
- [ ] Focused, repository-wide, and manual thin-path validation passes.

## Slice 5C — Make all templates realistic and explain the result

**Recommended model:** GPT-5.6 Terra, medium reasoning.

### User-visible outcome

Editorial, Studio, and Warm become genuinely different brand documents while honoring the same selected palette, typography, visual direction, personality, and content. The Blueprint explicitly explains how those decisions produced the rendered design.

### Files

Add:

- `src/components/blueprint/design-rationale.tsx`
- `src/components/blueprint/design-rationale.test.tsx`

Modify:

- `src/components/blueprint/blueprint-preview.tsx`
- `src/components/blueprint/blueprint-preview.test.tsx`
- `src/components/blueprint/templates/blueprint-sections.tsx`
- `src/components/blueprint/templates/editorial-template.tsx`
- `src/components/blueprint/templates/studio-template.tsx`
- `src/components/blueprint/templates/warm-template.tsx`
- `src/components/blueprint/full-preview-overlay.test.tsx`
- `src/app/globals.css`

### Presentation rules

- **Editorial:** narrative hierarchy, generous whitespace, pull-quote essence, fine rules, asymmetric editorial grid.
- **Studio:** modular system board, visible grid, compact labels, card-based evidence, stronger information density.
- **Warm:** conversational story flow, soft layered surfaces, generous curves, approachable callouts.
- All three render the same six semantic Blueprint areas, but they may reorder or group them to create a different composition while preserving semantic heading order.
- Foundation becomes a prominent audience/promise module.
- Personality appears as both brand essence and visible trait accents.
- Voice becomes a clear voice-traits / always communicate / avoid module rather than one instruction paragraph.
- **Why this direction works** lists the selected template, visual, color, type, personality, and voice decisions with the exact effects applied by the trusted resolver.

### State and contract impact

- No stored data change.
- Refactor the current shared linear `BlueprintSections` into reusable semantic section primitives or a typed presentation view model that each template composes differently.
- Rationale is derived from current answers/profile and updates immediately after manual or future AI changes.

### Tests

- Every template renders all six semantic areas and the same current content.
- Each template has a distinct stable composition marker and meaningful structural difference, not just a label or outer background.
- Every selected design answer has a corresponding rationale item and applied presentation token.
- Incomplete answers show a neutral fallback explanation rather than claiming an unselected direction.
- Voice traits and always/avoid values are visibly represented.
- Blank optional guardrail remains omitted in full presentation mode.
- Full preview uses the current unsaved presentation profile and rationale.

### Validation

```text
npx vitest run src/lib/blueprint/presentation.test.ts src/components/blueprint/design-rationale.test.tsx src/components/blueprint/blueprint-preview.test.tsx src/components/blueprint/full-preview-overlay.test.tsx
npx tsc --noEmit
npm run lint
npm test
npm run build
```

### Dependencies

Slice 5B's trusted resolver and proven Editorial path.

### Completion check

- [ ] Editorial, Studio, and Warm are recognizably different compositions before reading their labels.
- [ ] Every chosen visual-system value affects a major visible treatment in all three templates.
- [ ] Foundation, personality, and voice decisions are represented as artifact content, not only configuration prose.
- [ ] The rationale accurately names the selected decisions and their observable effects.
- [ ] Existing saved records render without migration.
- [ ] Focused and repository-wide validation passes.

## Slice 5D — Keep feedback in context and close responsive/accessibility gaps

**Recommended model:** GPT-5.6 Terra, medium reasoning.

### User-visible outcome

While answering each step, the user can immediately identify the affected preview region on desktop and see a compact impact sample on mobile. The complete capture → review → save → reopen flow is polished and verified at assessment viewports.

### Files

Add:

- `src/components/blueprint/live-impact-summary.tsx`
- `src/components/blueprint/live-impact-summary.test.tsx`

Modify:

- `src/lib/blueprint/reducer.ts`
- `src/lib/blueprint/reducer.test.ts`
- `src/components/blueprint/guided-editor.tsx`
- `src/components/blueprint/guided-editor.test.tsx`
- `src/components/blueprint/blueprint-workspace.tsx`
- `src/components/blueprint/blueprint-workspace.test.tsx`
- `src/components/blueprint/blueprint-preview.tsx`
- `src/components/blueprint/blueprint-preview.test.tsx`
- `src/components/blueprint/templates/blueprint-sections.tsx`
- `src/components/blueprint/full-preview-overlay.tsx`
- `src/app/globals.css`
- `README.md` or `NOTES.md` for final UX decisions and known limitations

### Interaction rules

- The current guided step controls the edit-preview focus only; it is not persisted.
- Desktop marks the relevant preview module with a clear **Editing now** treatment and names which answers feed it. Non-active content remains readable.
- Mobile Questions mode contains a compact, non-duplicated impact summary from the same presentation profile plus **View this change**. The action switches to Preview and focuses the relevant semantic region; returning to Questions preserves step and values.
- Full preview removes editor-only focus treatments but retains the design rationale.
- Focus changes are announced without excessive live-region chatter; reduced-motion users receive no required animated transition.

### Tests

- Each step maps to the correct preview region(s): Foundation → audience/promise, Personality → essence/personality and accent cues, Visual → canvas system, Voice → voice/guardrail.
- Changing an answer updates the impact summary and full preview in the same interaction cycle.
- Mobile **View this change** preserves active step and all unsaved values.
- Review, Full preview, Escape/back, focus restoration, and Save continue to work.
- Current/completed/error/progress information does not depend on color alone.
- No duplicate IDs, broken heading hierarchy, horizontal overflow classes, or inaccessible disabled dead ends are introduced.

### Validation

```text
npx vitest run src/components/blueprint/live-impact-summary.test.tsx src/components/blueprint/guided-editor.test.tsx src/components/blueprint/blueprint-preview.test.tsx src/components/blueprint/blueprint-workspace.test.tsx src/components/blueprint/full-preview-overlay.test.tsx
npx tsc --noEmit
npm run lint
npm test
npm run build
git diff --check
```

Required manual matrix:

```text
1280 px:
- editor and sticky preview are visible without horizontal scrolling;
- step labels and explanations are not clipped;
- change every supported field and verify the named preview effect;
- complete → Review → Save → reopen preserves content and presentation.

375 px:
- every step, option, helper, Save draft/blueprint action, and Review action is reachable;
- Questions → View this change → Preview → Questions preserves values and active step;
- no horizontal scrolling or trapped dialog focus;
- all three templates remain legible.

User-reported intermediate viewport:
- the current step, Preview switch/impact summary, progress, and Save remain reachable;
- step descriptions wrap without clipping and the preview is reachable in one action.

Keyboard-only:
- direct step navigation, option selection, Review, Save, mobile mode switching,
  Full preview, Escape/back, and focus return work in a logical order.
```

### Dependencies

Slices 5A–5C. Do not polish the focus behavior until the completion model, presentation resolver, and three compositions are stable.

### Completion check

- [ ] The user sees an immediate, named visual consequence while working through every step.
- [ ] Desktop and mobile preserve the edit/preview feedback loop without losing draft state.
- [ ] The guided flow is finishable with pointer and keyboard input.
- [ ] The full manual matrix and all automated checks pass with no browser/server console errors.
- [ ] Delivery notes explain the canonical-state, trusted-token, and derived-rationale decisions.

## 6. Acceptance matrix

| Requirement | Observable acceptance check |
| --- | --- |
| Finishable capture | On Voice, Review is actionable. A complete draft opens full preview; an incomplete draft identifies and focuses the first missing step. |
| Clear expectations | Every step and choice states why it matters and what visible result it controls. |
| Visual causality | Color recolors major surfaces; typography changes visible type treatment; visual direction changes shape/density; personality changes bounded accents; voice changes the messaging presentation. |
| Real templates | Without template labels, Editorial reads as editorial, Studio as modular/systematic, and Warm as conversational/soft. |
| Explainable output | Rationale text names every selected decision and matches the treatment visibly applied. |
| Immediate feedback | A supported input updates content, presentation tokens, impact summary, and rationale without Generate or Save. |
| Incomplete safety | Partial drafts remain structurally valid, use neutral visual fallbacks, and can be saved/reopened without fake selections. |
| Persistence | Save/reopen restores answers and therefore reproduces identical content, style profile, composition, and rationale. |
| Future AI consistency | A later AI patch to supported answers automatically flows through the same presentation resolver; no AI-specific renderer exists. |
| Responsive UX | 1280 px split view and 375 px Questions/Preview flow remain usable without horizontal scrolling. |
| Accessibility | Step state, selection, progress, errors, and focus are programmatically available; keyboard-only completion and reduced-motion behavior pass. |

## 7. Risk-first rationale

1. Fix completion and expectation-setting first because the current final action is a hard workflow defect, independent of visual polish.
2. Build one exhaustive presentation resolver and prove it in Editorial before multiplying the behavior across three templates. This catches token-precedence and Tailwind-discovery problems early.
3. Recompose Studio and Warm only after the resolver is stable, preventing three divergent style systems.
4. Add focused/mobile feedback and final polish last, when the semantic sections and presentation effects are stable enough to validate end to end.

Highest risks:

- **Combinatorial styling:** Bound it with one precedence model and semantic tokens rather than per-answer ad hoc classes.
- **Claimed versus actual effect:** Generate rationale from the same token metadata used by the renderer and test both together.
- **Tailwind class omission:** Keep full literal class strings in source or use code-owned CSS variables with static utility references; verify production build output.
- **Template drift:** Share typed semantic section data and profile tokens, but allow each template to own macro composition.
- **Scope growth:** Do not add uploads, arbitrary colors/fonts, freeform layout, new stored fields, animation-heavy effects, or AI behavior in these remediation slices.

## 8. Sequence after approval

```text
Completed Slice 5
  → Slice 5A: finishable/explainable capture
  → Slice 5B: trusted resolver + Editorial proof
  → Slice 5C: all compositions + rationale
  → Slice 5D: contextual feedback + responsive/accessibility validation
  → Resume original Slice 6: server-side AI refinement boundary
```

Do not begin the original Slice 6 until Slice 5D passes. Otherwise AI would amplify the same weak visual feedback: the model could change an answer successfully while the user still could not see or understand its effect.

## 9. Definition of done

- [ ] The dead-end final-step control is gone and Review behaves correctly for complete and incomplete drafts.
- [ ] The user can explain what each step and field controls before selecting it.
- [ ] Each design answer visibly changes the rendered artifact, not merely descriptive text or a swatch row.
- [ ] All three templates are structurally distinct and honor the same selected presentation profile.
- [ ] The preview identifies the active impact and explains the completed design rationale.
- [ ] Existing records require no migration and preserve save/reopen behavior.
- [ ] Future manual and AI changes use one canonical state and one renderer.
- [ ] Focused tests, `npx tsc --noEmit`, `npm run lint`, `npm test`, and `npm run build` pass after every slice as listed.
- [ ] The final 1280 px, 375 px, keyboard, focus, persistence, and console-health manual matrix passes.
- [ ] Every completed remediation slice has an append-only changelog entry with exactly one next action and a workflow-aligned model recommendation.

## Next logical step

Implement **Slice 5A — Make guided capture understandable and finishable**. Use **GPT-5.6 Terra, medium reasoning** because the product decisions and completion rules are explicit, while the work still spans shared domain progress, controlled client state, accessibility, and focused component tests.
