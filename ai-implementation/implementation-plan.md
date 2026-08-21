# Implementation Plan: Brand Blueprint Builder

**Workflow stage:** 5 — Create the implementation plan  
**Inputs:** [Product scope](./product-scope.md), [solution design](./solution-design.md), and [changelog](./changelog.md)  
**Execution rule:** Complete one slice per focused Codex turn. Do not begin the next slice until the current slice meets its completion check and its outcome, validation evidence, one next logical step, and recommended next model are appended to `ai-implementation/changelog.md`.

## Plan at a glance

| Slice | User-visible milestone | Why it comes now |
| --- | --- | --- |
| 1 | Reliable blueprint content rules exist behind the scenes. | Prevents UI, database, and AI layers from inventing incompatible shapes. |
| 2 | The application has a validated, persistent blueprint repository. | Resolves schema and read/write risk before UI complexity. |
| 3 | A user can create a minimal blueprint, save it, and reopen it. | Establishes an early thin end-to-end loop. |
| 4 | The complete guided capture flow drives a live structured preview. | Delivers the core Phase 1 experience on top of proven persistence. |
| 5 | Three distinct presentations, full preview, and mobile modes work. | Adds the major visual/responsive assessment requirements without changing data behavior. |
| 6 | AI safely refines a complete blueprint and returns an unsaved result. | Builds and tests the server-side risk before exposing it to the user. |
| 7 | The AI UI, resilient states, and accessibility polish complete the user journey. | Integrates the final Phase 2 behavior and closes workflow gaps. |
| 8 | The submission is verified, documented, and ready for adversarial review. | Makes release quality and handoff explicit. |

## Execution conventions for every slice

1. Read `AGENTS.md`, this plan, the relevant design section, and only the affected source files.
2. Before changing a Next.js API or file convention, read the corresponding guide under `node_modules/next/dist/docs/`.
3. Inspect `git status` and preserve unrelated changes.
4. Use existing shadcn primitives where available. Add missing primitives with `npx shadcn@latest add …`; do not hand-maintain copied shadcn code.
5. Keep `db`, `better-sqlite3`, OpenAI, and environment-secret imports out of the Client module graph.
6. Run the slice’s narrowest tests first, then the required repository checks. Fix failures caused by the slice before moving on.
7. Append the result to [`changelog.md`](./changelog.md) only after the completion check passes.

## Slice 1 — Establish the serializable blueprint domain kernel

**Recommended model:** GPT-5.6 Terra, medium reasoning.

### User-visible outcome

No new UI yet. The application has one tested, serializable definition of a blueprint and deterministic content generation that every later surface will use.

### Files

Add:

- `src/lib/blueprint/types.ts`
- `src/lib/blueprint/options.ts`
- `src/lib/blueprint/defaults.ts`
- `src/lib/blueprint/content.ts`
- `src/lib/blueprint/validation.ts`
- `src/lib/blueprint/content.test.ts`
- `src/lib/blueprint/validation.test.ts`

Do not modify routes, database schema, or the example `TextElement` in this slice.

### Data-contract impact

Implement the accepted Stage 4 contracts:

- Closed unions and display metadata for templates, traits, visual directions, color directions, typography directions, and voice traits.
- `BrandAnswers`, `BrandBlueprintContent`, `BrandBlueprintConfig`, `BlueprintDraft`, and `BlueprintSummary` types.
- An empty, incomplete config factory with `schemaVersion: 1`.
- Deterministic content construction and dependency-based section recomputation for manual changes.
- Structural validation, completion validation, field length limits, enum/trait constraints, and serializable DTO validation.

Use runtime validators built from the same closed option constants as the TypeScript unions. Do not add a form framework or persistence dependency.

### Tests

Add pure unit tests for:

- Empty defaults being serializable and structurally valid but incomplete.
- Representative deterministic content output.
- Each answer-to-content dependency mapping.
- Preservation of unrelated content when one answer changes.
- Trait uniqueness/count, enum, string-limit, schema-version, and unknown-key rejection.
- `isBlueprintComplete` for complete and incomplete records.

### Validation commands

```text
npx vitest run src/lib/blueprint/content.test.ts src/lib/blueprint/validation.test.ts
npx tsc --noEmit
npm run lint
npm test
```

### Dependencies

None. This slice is intentionally independent of the database and UI.

### Completion check

- [ ] Every accepted Stage 4 domain type exists in one importable location.
- [ ] The default config and all derived content are plain JSON-compatible values.
- [ ] Invalid client- or AI-shaped payloads can be rejected at runtime.
- [ ] Dependency-based recomputation is covered by tests.
- [ ] All listed validation commands pass.

## Slice 2 — Create the durable blueprint repository

**Recommended model:** GPT-5.6 Terra, medium reasoning.

### User-visible outcome

No new editor interaction yet, but the application can persist and retrieve domain-shaped blueprints through one server-only repository.

### Files

Modify:

- `src/db/schema.ts`
- `scripts/seed.ts`

Add:

- `src/db/blueprints.ts`
- `src/db/blueprints.test.ts`

Review, but only modify if required by the implementation:

- `src/db/index.ts`
- `drizzle.config.ts`
- `scripts/reset.ts`

### Data-contract impact

- Replace the starter `pages` model with the accepted `blueprints` table: ID, `brandName`, typed `template`, typed/versioned JSON `config`, and timestamps.
- Implement server-only list, get, insert, and update query functions that map database rows to serializable DTOs.
- Explicitly set `updatedAt` on updates and return `null` for a missing update target.
- Update the seed to create one valid domain blueprint or leave the database empty intentionally; choose one and document it in the slice changelog.
- Do not expose the Drizzle client from a Client Component or use raw SQL string concatenation.

Before resetting the local DB, verify it contains only disposable starter/assessment data. If it contains user work that must be preserved, stop and request direction rather than deleting it.

### Tests

Add repository tests using an isolated temporary SQLite path for:

- Insert and library-summary retrieval.
- Get-by-ID DTO serialization.
- Existing-record update and timestamp change.
- Missing-record update returning `null`.
- JSON config round-trip without loss of supported fields.

Keep test setup local to this file or a narrowly scoped test helper; do not create a global test database dependency.

### Validation commands

```text
npx vitest run src/db/blueprints.test.ts
npm run db:push
# If confirmed safe for the current local DB:
npm run db:reset
npx tsc --noEmit
npm run lint
npm test
npm run build
```

### Dependencies

Slice 1. The table’s JSON contract imports only the tested domain types.

### Completion check

- [ ] The starter page data model is replaced by the `blueprints` model.
- [ ] Insert, list, get, update, and not-found behavior work against SQLite.
- [ ] Config JSON round-trips through the database without drift.
- [ ] The current local database has been migrated/reset only after its target was verified.
- [ ] The build and all listed validation commands pass.

## Slice 3 — Deliver the thin saved-blueprint loop

**Recommended model:** GPT-5.6 Terra, medium reasoning.

### User-visible outcome

A user can visit an empty Brand Blueprints library, start a new blueprint, enter a name and choose a template, preview a minimal header, explicitly save, return to the library, and reopen the persisted record. This is the first complete create → save → revisit loop.

### Files

Modify:

- `src/app/page.tsx`
- `src/app/layout.tsx`
- `src/app/globals.css`

Add:

- `src/app/loading.tsx`
- `src/app/error.tsx`
- `src/app/not-found.tsx`
- `src/app/blueprints/actions.ts`
- `src/app/blueprints/new/page.tsx`
- `src/app/blueprints/[id]/page.tsx`
- `src/app/blueprints/[id]/loading.tsx`
- `src/app/blueprints/[id]/not-found.tsx`
- `src/components/blueprint/blueprint-library.tsx`
- `src/components/blueprint/blueprint-card.tsx`
- `src/components/blueprint/blueprint-workspace.tsx`
- `src/components/blueprint/workspace-header.tsx`
- `src/components/blueprint/blueprint-preview.tsx`
- `src/components/blueprint/blueprint-workspace.test.tsx`
- `src/lib/blueprint/reducer.ts`
- `src/lib/blueprint/reducer.test.ts`

Add with the shadcn CLI if absent:

```text
npx shadcn@latest add input label radio-group
```

### Data-contract impact

- Implement `saveBlueprint(input)` as a Server Action returning the accepted `ActionResult<BlueprintDraft>` contract.
- Validate the entire incoming draft server-side, even though this first UI edits only name and template.
- Introduce reducer `baseline`/`draft` state and derived dirty state; all later fields use this same reducer.
- Existing-record pages call `connection()` before DB reads, serialize dates, and use `notFound()` for absent IDs.
- First save returns a canonical DTO, updates the baseline, and replaces `/blueprints/new` with `/blueprints/{id}`.

### Tests

Add tests for:

- Reducer dirty-state behavior and save success/failure transitions.
- Name/template changes updating the minimal preview immediately.
- Save pending state and a returned save failure preserving local values.
- Server Action validation and not-found update result, using an isolated/mocked repository boundary.

Async Server page rendering is covered by types, build, and a manual browser check—not Vitest.

### Validation commands

```text
npx vitest run src/lib/blueprint/reducer.test.ts src/components/blueprint/blueprint-workspace.test.tsx
npx tsc --noEmit
npm run lint
npm test
npm run build
```

Manual check:

```text
Empty library → New blueprint → name + template → Save → library card → Open → same name/template
```

### Dependencies

Slices 1–2.

### Completion check

- [ ] The generic assessment landing page has been replaced by an empty/populated Brand Blueprints library.
- [ ] A user can save one new named/template-selected record and reopen it by ID.
- [ ] Save failure does not discard local state.
- [ ] Dynamic reads use the documented request-time behavior and missing IDs show a useful not-found state.
- [ ] The thin flow passes its manual check, build, and all listed automated checks.

## Slice 4 — Complete guided capture and live structured preview

**Recommended model:** GPT-5.6 Terra, medium reasoning.

### User-visible outcome

The saved workspace becomes the complete Phase 1 editor: users move through Foundation, Personality, Visual System, and Voice questions while a six-section Blueprint updates immediately in the same screen.

### Files

Modify:

- `src/components/blueprint/blueprint-workspace.tsx`
- `src/components/blueprint/workspace-header.tsx`
- `src/components/blueprint/blueprint-preview.tsx`
- `src/components/blueprint/blueprint-workspace.test.tsx`
- `src/app/globals.css`

Add:

- `src/components/blueprint/guided-editor.tsx`
- `src/components/blueprint/foundation-step.tsx`
- `src/components/blueprint/personality-step.tsx`
- `src/components/blueprint/visual-system-step.tsx`
- `src/components/blueprint/voice-step.tsx`
- `src/components/blueprint/guided-editor.test.tsx`
- `src/components/blueprint/blueprint-preview.test.tsx`

Add with the shadcn CLI if absent:

```text
npx shadcn@latest add textarea toggle-group
```

### Data-contract impact

- Wire every required answer and the optional guardrail through the existing reducer and `applyManualAnswer` function.
- Preserve incomplete drafts as saveable, while exposing `isBlueprintComplete` only for AI gating later.
- Render all six accepted output sections from `draft.config.content`; use intentional placeholders in edit preview for incomplete data.
- Resolve palette and typography presentation only from trusted `options.ts` metadata.
- Keep template state saved in the record and keep all field values serializable.

### Tests

Add/update RTL coverage for:

- Required questions, labels, and step navigation.
- Trait-selection limits and validation guidance.
- Every representative input changing its dependent preview section immediately.
- Optional guardrail appearing in edit preview and not producing empty/raw output.
- Save of an incomplete but structurally valid draft.

### Validation commands

```text
npx vitest run src/components/blueprint/guided-editor.test.tsx src/components/blueprint/blueprint-preview.test.tsx src/components/blueprint/blueprint-workspace.test.tsx
npx tsc --noEmit
npm run lint
npm test
npm run build
```

Manual check:

```text
Complete all four guided steps; change each direction control; verify the corresponding preview section updates without a Generate action; save and reopen.
```

### Dependencies

Slices 1–3. The thin save/revisit route and reducer must be stable before adding all inputs.

### Completion check

- [ ] All required questions and the optional guardrail are present, labeled, and keyboard usable.
- [ ] The preview presents all six sections as a curated artifact, not raw form output.
- [ ] Manual changes update the preview instantly and persist/reload correctly.
- [ ] Incomplete states remain intentional and safe to save.
- [ ] Manual and automated validation passes.

## Slice 5 — Add three presentation templates and responsive preview modes

**Recommended model:** GPT-5.6 Terra, medium reasoning.

### User-visible outcome

The same Blueprint can be viewed in three genuinely different presentation styles, side-by-side with the editor on desktop, as Questions/Preview modes on mobile, and in a full-preview overlay without losing unsaved changes.

### Files

Modify:

- `src/components/blueprint/blueprint-workspace.tsx`
- `src/components/blueprint/blueprint-preview.tsx`
- `src/components/blueprint/workspace-header.tsx`
- `src/components/blueprint/blueprint-workspace.test.tsx`
- `src/components/blueprint/blueprint-preview.test.tsx`
- `src/app/globals.css`

Add:

- `src/components/blueprint/templates/editorial-template.tsx`
- `src/components/blueprint/templates/studio-template.tsx`
- `src/components/blueprint/templates/warm-template.tsx`
- `src/components/blueprint/full-preview-overlay.tsx`
- `src/components/blueprint/full-preview-overlay.test.tsx`

Add with the shadcn CLI if absent:

```text
npx shadcn@latest add tabs dialog
```

### Data-contract impact

- No schema change. The closed `TemplateId` selects a trusted renderer; it never stores arbitrary layout data.
- Add only ephemeral reducer state: mobile mode and full-preview open/closed state.
- Preserve current draft values while switching template, mobile mode, or full preview.

### Tests

Add/update tests for:

- All three template IDs selecting a renderer with the same content contract.
- Template switching preserving answers/content and marking the workspace dirty.
- Mobile Questions/Preview mode preserving local form state.
- Full preview using current unsaved values, closing by control/Escape, and restoring focus.
- Blank optional guardrail being omitted in full presentation mode.

### Validation commands

```text
npx vitest run src/components/blueprint/blueprint-preview.test.tsx src/components/blueprint/full-preview-overlay.test.tsx src/components/blueprint/blueprint-workspace.test.tsx
npx tsc --noEmit
npm run lint
npm test
npm run build
```

Manual check:

```text
At 1280 px: verify editor + preview are visible without horizontal scrolling.
At 375 px: verify Questions/Preview mode, template choice, Save, and full preview remain usable without horizontal scrolling.
```

### Dependencies

Slice 4. The shared six-section preview must exist before alternate presentations are meaningful.

### Completion check

- [ ] Editorial, Studio, and Warm are visibly distinct while rendering the same document contract.
- [ ] Desktop split view and mobile mode switching satisfy the scope acceptance criteria.
- [ ] Full preview is accessible and never saves or discards unsaved data.
- [ ] Manual viewport checks and all listed validation pass.

## Slice 6 — Build the server-side AI refinement boundary

**Recommended model:** GPT-5.6 Terra, medium reasoning.

### User-visible outcome

No new visible AI panel yet, but a complete blueprint can be safely sent to a server-only refinement action that returns either a validated unsaved updated draft or a stable, actionable error.

### Files

Modify:

- `package.json`
- `package-lock.json`
- `src/app/blueprints/actions.ts`

Add:

- `src/lib/blueprint/ai-contract.ts`
- `src/lib/blueprint/ai-contract.test.ts`
- `src/lib/blueprint/ai-merge.test.ts`
- `src/lib/openai.ts`
- `src/app/blueprints/actions.test.ts`

Install the official client when this slice begins:

```text
npm install openai
```

### Data-contract impact

- Define the strict JSON Schema and runtime validator for the accepted nullable `AiBlueprintPatch` contract.
- Add `applyAiPatch` to the domain kernel: non-null supported changes only, dependency-based recomputation, optional content overrides, full post-merge validation, and identity/template preservation.
- Add `refineBlueprint({ draft, instruction })` Server Action using the official Responses API, `OPENAI_MODEL` server configuration with the design’s default, low reasoning, no tools, `store: false`, and strict Structured Outputs.
- Map missing key, blank/incomplete input, refusal, rate limit, network/API failure, and malformed response to the accepted `ActionResult` error codes.
- Confirm `refineBlueprint` never invokes a database write function.

### Tests

Add tests using a mocked OpenAI client for:

- Missing key before any client call.
- Incomplete draft and blank instruction rejection.
- Valid response patching only requested/allowed fields.
- Identity/template/offer-audience/unrelated content preservation.
- Invalid enum, unknown key, oversized copy, and malformed structured output rejection.
- Refusal, rate limit, timeout/network, and generic API error mapping.
- No persistence call from the refine action.

### Validation commands

```text
npx vitest run src/lib/blueprint/ai-contract.test.ts src/lib/blueprint/ai-merge.test.ts src/app/blueprints/actions.test.ts
npx tsc --noEmit
npm run lint
npm test
npm run build
```

### Dependencies

Slices 1 and 3–4. The full config, completion predicate, validation contract, and Server Action result type must exist. This slice may be implemented before or after Slice 5 because it does not depend on responsive presentation.

### Completion check

- [ ] The OpenAI client and API key are only reachable from server-only code.
- [ ] Every model response passes strict schema and local runtime validation before merge.
- [ ] AI never writes to SQLite and never returns arbitrary HTML/CSS/layout changes.
- [ ] All modeled AI failures leave the input draft unchanged and return safe messages.
- [ ] No real key or network call is required for automated tests; all listed checks pass.

## Slice 7 — Integrate AI refinement and complete resilient interaction states

**Recommended model:** GPT-5.6 Terra, medium reasoning.

### User-visible outcome

Users with a complete first draft can submit one AI refinement instruction, see the relevant controls and preview update together, undo that latest local AI change once, and explicitly save it. The library/workspace also has clear loading, not-found, expected-error, and unexpected-error experiences.

### Files

Modify:

- `src/components/blueprint/blueprint-workspace.tsx`
- `src/components/blueprint/workspace-header.tsx`
- `src/components/blueprint/blueprint-workspace.test.tsx`
- `src/lib/blueprint/reducer.ts`
- `src/lib/blueprint/reducer.test.ts`
- `src/app/error.tsx`
- `src/app/blueprints/[id]/error.tsx`

Add:

- `src/components/blueprint/ai-refinement-panel.tsx`
- `src/components/blueprint/ai-refinement-panel.test.tsx`
- `src/app/blueprints/[id]/error.tsx` if not created in Slice 3

Review/modify as needed:

- `src/app/loading.tsx`
- `src/app/blueprints/[id]/loading.tsx`
- `src/app/not-found.tsx`
- `src/app/blueprints/[id]/not-found.tsx`
- `src/app/globals.css`

### Data-contract impact

- No database schema change.
- Add ephemeral `aiStatus`, message, and `lastAiSnapshot` reducer state.
- Gate AI by `isBlueprintComplete` and instruction validation.
- On AI success replace only the local draft, mark it dirty, and retain one-session undo snapshot.
- On AI failure retain the exact prior draft and expose an accessible error.
- Keep save as the only persistence boundary for AI changes.

### Tests

Add/update RTL and reducer coverage for:

- Disabled AI panel with an incomplete-draft explanation.
- Pending state and duplicate-submit prevention.
- Successful AI response updating both controls and preview, then marking dirty.
- One-session undo restoring the exact pre-AI draft.
- Missing-key, refusal, malformed-output, and network-error messages leaving state untouched.
- Saving an AI change and reopening the saved record.
- `aria-live` status/error behavior and focusable retry/save controls.

### Validation commands

```text
npx vitest run src/components/blueprint/ai-refinement-panel.test.tsx src/components/blueprint/blueprint-workspace.test.tsx src/lib/blueprint/reducer.test.ts
npx tsc --noEmit
npm run lint
npm test
npm run build
```

Manual check:

```text
Complete a draft → “make the tone more playful” → verify controls/preview change → Undo → apply again → Save → reopen → verify persisted AI result.
Force missing-key/error behavior → verify no changes are applied and retry remains usable.
```

### Dependencies

Slices 3–6. The workspace/reducer, complete guided draft, and tested server AI action must exist.

### Completion check

- [ ] AI is available only for a complete draft and one request is pending at a time.
- [ ] Valid AI edits remain local until explicit save, then survive reopen.
- [ ] Every expected AI failure is safe, visible, and non-destructive.
- [ ] One-session AI undo works without creating version history.
- [ ] Loading/not-found/unexpected error states are clear and all checks pass.

## Slice 8 — Harden, document, and prepare release evidence

**Recommended model:** GPT-5.6 Terra, medium reasoning; use Luna, low only for a bounded copy or documentation correction after behavior is locked.

### User-visible outcome

The complete application feels submission-ready on desktop and mobile, communicates state clearly, and can be set up and evaluated by another engineer without hidden knowledge.

### Files

Modify as findings require:

- `README.md` or add `NOTES.md`
- `src/app/layout.tsx`
- `src/app/globals.css`
- `src/components/blueprint/**/*.tsx`
- relevant colocated `*.test.ts` and `*.test.tsx`

Add only if a concrete uncovered failure requires it:

- `src/app/blueprints/new/loading.tsx`
- narrowly scoped regression test files

Do not add scope-expanding features.

### Data-contract impact

None expected. If an acceptance failure requires a contract change, stop the slice, record the conflict, and return to Stage 4 reasoning rather than silently redesigning.

### Tests and validation

- Add regression tests for every issue fixed in this slice.
- Exercise the full primary flow from an empty database, including AI success and failure.
- Verify desktop at 1280 px, mobile at 375 px, keyboard-only use, loading/pending states, full preview, save/reopen, and browser/server console health.

Run:

```text
npx tsc --noEmit
npm run lint
npm test
npm run build
```

If the schema changed in an earlier slice, also verify the documented DB setup/reset path from a clean local state.

### Dependencies

All previous slices.

### Completion check

- [ ] Every must-have acceptance criterion in `product-scope.md` has direct implementation evidence.
- [ ] Known limitations match the approved deferred list.
- [ ] README/NOTES documents setup, decisions, trade-offs, limitations, and next steps without exposing secrets.
- [ ] Full manual flow and all release commands pass.
- [ ] The project is ready for Stage 7 continuous validation and Stage 8 adversarial review.

## Risk-first ordering rationale

The riskiest decisions are not decorative: they are the document shape, SQLite round-trip, Server/Client boundary, save semantics, and AI patch safety. Slices 1–2 establish those contracts independently of UI. Slice 3 then proves an actual persisted loop while the product is still small; a schema/action problem is therefore found before four guided steps and template work are built on it.

The complete deterministic editor arrives before AI, so the assessment remains demonstrable without a working key. The AI server boundary is built and tested before its user interface, preventing the common failure mode where a polished prompt box mutates unvalidated client state. Responsive presentation, full preview, resilience, and final documentation come after the data path is stable, where their validation has real end-to-end value.

## Cross-slice acceptance traceability

| Scope requirement | First slice that delivers it | Final proving slice |
| --- | --- | --- |
| Typed canonical blueprint state | 1 | 7 |
| SQLite save/revisit | 2–3 | 8 |
| Library empty/populated states | 3 | 8 |
| Guided capture and live blueprint | 4 | 8 |
| Three templates | 5 | 8 |
| Desktop/mobile + full preview | 5 | 8 |
| Validated AI refinement | 6 | 7–8 |
| AI persistence and safe failure | 7 | 8 |
| Accessibility/pending/error states | 3–5 | 7–8 |
| Submission note and release evidence | 8 | 8 |

## Final release checklist

Before moving to adversarial review, verify all of the following from the repository root:

- [ ] `npx tsc --noEmit`
- [ ] `npm run lint`
- [ ] `npm test`
- [ ] `npm run build`
- [ ] The database schema and seed/reset setup work from a clean, verified-safe local DB.
- [ ] Empty library → new setup → guided capture → live preview → save → library → reopen works.
- [ ] AI refinement → unsaved state → Save → reopen works.
- [ ] Missing-key, malformed-AI-response, request failure, save failure, and missing-record paths preserve usable state and show safe messages.
- [ ] 1280 px desktop and 375 px mobile checks pass without horizontal workflow breakage.
- [ ] Keyboard-only navigation, focus management, status announcements, and full-preview escape/back behavior pass.
- [ ] No server or browser console errors occur during the primary flow.
- [ ] README/NOTES explains setup, implementation decisions, trade-offs, known limitations, and next steps.
- [ ] Every completed slice has a matching append-only changelog entry with validation evidence and one recommended next action/model.

## Stage 5 completion check

- [x] Work is divided into eight ordered, runnable vertical slices.
- [x] Each slice has user-visible outcome, exact files, contract impact, tests, validation, dependencies, and completion check.
- [x] Typed configuration and persistence are sequenced before the earliest thin end-to-end loop.
- [x] Guided capture, templates/preview, AI, responsiveness, documentation, and release validation each have an explicit slice.
- [x] Risk-first rationale, traceability, and final release checks are included.
- [x] No application code was changed.
