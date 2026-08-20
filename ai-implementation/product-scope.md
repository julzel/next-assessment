# Product Scope: Brand Blueprint Builder

**Workflow stage:** 3 — Define the product scope  
**Inputs:** [Challenge brief](./challenge-brief.md) and [codebase map](./codebase-map.md)  
**Scope principle:** Ship one complete, polished brand-discovery loop rather than a general-purpose page builder.

## Product promise

A client or facilitator can turn a short guided conversation into a credible, presentation-ready Brand Blueprint, see it take shape live, save and revisit it, then refine it with one plain-language AI instruction at a time.

The product has two primary surfaces:

1. **Blueprint library:** start a blueprint or reopen an existing one.
2. **Blueprint workspace:** guided inputs and live preview in one continuous editing experience.

There is no separate generic website-builder mode.

## 1. Exact happy path, screen by screen

### Screen 1 — Blueprint library

1. The user lands on a branded “Brand Blueprints” page.
2. If records exist, the page shows compact blueprint cards with client/brand name, template name, last-updated time, and an “Open” action.
3. The user selects **New blueprint**.

The empty state uses the same screen: it explains the outcome in one sentence and presents one clear **Create your first blueprint** action. Search, sorting, folders, deletion, and pagination are not required.

### Screen 2 — New blueprint setup

1. The user enters the brand/client name.
2. They choose one of three presentation templates:
   - **Editorial:** refined, high-contrast, typography-led presentation.
   - **Studio:** clean, modular, contemporary presentation.
   - **Warm:** approachable, expressive, softly styled presentation.
3. Each template card includes a small visual preview; the three choices must be visibly different, not merely renamed color themes.
4. The user selects **Start blueprint** and enters the workspace.

The brand/client name and template are required. No account, client contact record, logo upload, or separate project setup is required.

### Screen 3 — Guided workspace

The workspace is one continuous screen rather than a sequence of separate routes.

On desktop:

- The left side contains the guided editor.
- The right side contains the live Brand Blueprint preview.
- A persistent top bar shows the blueprint name, unsaved/saved status, **Save**, and **Full preview**.

On mobile:

- The editor and preview occupy separate tabs or modes on the same screen.
- Progress and save status remain visible.
- The user can move between **Questions** and **Preview** without losing values or scroll-independent state.

The guided editor has four short steps:

1. **Foundation** — what the brand does and for whom.
2. **Personality** — defining traits and visual style.
3. **Visual system** — color and typography direction.
4. **Voice** — tone and communication guardrail.

The user can move forward and backward freely. Every valid input change updates the preview immediately; there is no “Generate” button and no AI dependency for the first draft. Incomplete sections display polished placeholder guidance rather than disappearing or showing raw empty fields.

### Screen 4 — Full preview

1. The user selects **Full preview** from the workspace.
2. The editor chrome is hidden and the blueprint fills the available viewport using the selected template.
3. The preview includes a clear **Back to editor** action.
4. The same current unsaved state appears in full preview; entering and leaving preview does not implicitly save or discard changes.

Full preview is an in-app presentation mode. Print, PDF, public sharing, and export are deferred.

### Screen 5 — Save and revisit

1. The user selects **Save**.
2. The interface prevents duplicate submission, indicates saving, and then confirms success with a visible saved state.
3. The user returns to the library.
4. The saved blueprint appears with its correct name, template, and updated time.
5. The user reopens it and sees the same answers, blueprint content, presentation template, and any saved AI changes.

Saving is explicit. Autosave, drafts across anonymous devices, version history, and conflict resolution are deferred.

### Screen 6 — AI refinement in the workspace

1. Once a first draft contains the required answers, a **Refine with AI** panel is available beneath the guided controls or in a compact workspace panel.
2. The user enters one instruction, such as “make the voice more playful” or “use a warmer color direction.”
3. The current blueprint remains visible while the request is processing.
4. On success, the relevant manual controls and blueprint preview update together. Identity fields and unrelated directions remain unchanged.
5. The workspace becomes unsaved and identifies that an AI change was applied.
6. The user reviews the live result and selects **Save** to persist it.
7. After leaving and reopening the record, the AI-adjusted controls and preview are restored.

AI is a constrained editor of the existing Brand Blueprint, not a chatbot and not a second document generator.

## 2. Minimum question set and blueprint sections

### Required inputs

| Step | Question/control | Response shape | Purpose |
| --- | --- | --- | --- |
| Setup | What is the brand or client name? | Short text | Identifies the blueprint and presentation. |
| Foundation | What does the brand offer, and who is it for? | One concise textarea | Supplies the audience and value context without a long intake form. |
| Personality | Choose three traits that should define the brand. | Exactly three from a curated set | Produces a focused personality rather than an unbounded adjective list. |
| Personality | Which visual direction feels most like the brand? | One choice: Minimal, Bold, Elegant, Playful, or Organic | Establishes the dominant aesthetic. |
| Visual system | Choose a color direction. | One curated palette direction with visible swatches: Neutral, Cool, Warm, Earthy, or Vibrant | Gives the preview usable colors without requiring design expertise. |
| Visual system | Choose a typography direction. | One choice: Modern sans, Editorial serif, Friendly rounded, or Expressive contrast | Establishes typographic personality. |
| Voice | Choose up to three voice traits. | One to three from a curated set | Defines how the brand should sound. |
| Voice | What should the brand always communicate? | One concise sentence | Creates a useful messaging anchor rather than a raw tone label. |

### Optional input

| Step | Question/control | Response shape | Purpose |
| --- | --- | --- | --- |
| Voice | What should the brand avoid? | One concise sentence | Adds a practical communication guardrail without blocking completion. |

The curated trait sets should be intentionally small—approximately eight to twelve useful options per set. Custom trait creation, long questionnaires, per-question AI coaching, image moodboards, and competitor analysis are deferred.

### Blueprint output sections

The preview presents the same six sections in every template; templates alter visual hierarchy and layout, not the information model.

1. **Brand header** — brand name and a concise essence line derived deterministically from the selected personality and visual direction.
2. **Audience & promise** — a concise presentation of what the brand offers, who it serves, and the “always communicate” statement.
3. **Personality** — the three defining traits with short, useful interpretation rather than just chips copied from the form.
4. **Visual direction** — dominant visual style, palette swatches with labels/values, and typography direction.
5. **Voice & tone** — selected voice traits plus a short “sounds like” summary.
6. **Brand guardrail** — the optional “avoid” statement; when empty, the section shows a restrained prompt in edit preview and is omitted from full presentation mode.

Phase 1 copy is assembled deterministically from normalized answers and concise authored sentence patterns. It must read as a curated one-pager, but it does not need generative AI to exist.

## 3. Manual versus AI editing

### Manually editable

- Brand/client name
- Template selection
- Offer and audience statement
- Three personality traits
- Visual direction
- Color direction
- Typography direction
- Voice traits
- “Always communicate” statement
- Optional “Avoid” statement

Manual edits update the normalized blueprint state and preview immediately.

### AI editable

AI may update:

- Personality traits
- Visual direction
- Color direction
- Typography direction
- Voice traits
- “Always communicate” statement
- Optional “Avoid” statement
- The concise derived summaries displayed in the blueprint, within the supported blueprint sections

AI must not change the brand/client name. It must preserve unrelated fields unless the instruction explicitly targets them. It must return changes that fit the same supported configuration used by the manual editor; AI cannot add arbitrary sections, HTML, CSS, fonts, layouts, or media.

After a successful AI edit, the manual controls display the new canonical values. The AI result is an unsaved local change until the user selects **Save**. Full chat history, multi-turn conversation memory, tracked changes, and permanent revision history are deferred.

## 4. Prioritized scope

### Must-have

- Blueprint library with useful empty and populated states
- New-blueprint setup with required name and three distinct templates
- Four-step guided editor containing the minimum required question set
- Deterministic six-section Brand Blueprint output
- Immediate live preview for all supported manual changes
- Desktop split view and a usable mobile Questions/Preview mode
- Full-screen/focused preview and return-to-editor behavior
- Explicit save with progress, success, and error feedback
- Revisit and exact restoration of answers, template, blueprint content, and saved AI changes
- One-instruction-at-a-time AI refinement
- AI changes constrained to the supported canonical blueprint configuration
- Safe missing-key, invalid-response, and request-failure behavior that preserves current state
- Semantic labels, keyboard access, visible focus, and disabled/loading states
- Focused automated coverage for configuration transformation, interactive editing, persistence boundaries, and AI response validation where the chosen test layer supports them
- Passing type-check, lint, tests, and production build before submission

### Should-have

- One-session **Undo AI change** action for the most recently applied AI edit
- Small visual completion indicator for the four guided steps
- A handful of example AI prompts as clickable suggestions
- Polished skeletons for library/workspace loads instead of simple textual loading states
- Friendly inline descriptions explaining why each brand question matters
- Last-updated metadata on the saved blueprint card and workspace

### Explicitly deferred

- Authentication, accounts, teams, roles, and permissions
- Multi-user or real-time collaboration
- Public share links, client invitations, or approvals
- Print layout, PDF/image export, or presentation download
- Logo/image upload, asset library, or AI image generation
- Drag-and-drop/freeform canvas editing
- Arbitrary component creation, custom sections, or section reordering
- Custom fonts, font uploads, unrestricted CSS, or a full color picker
- More than three presentation templates
- Autosave, offline mode, conflict handling, revision history, and multi-level undo
- Deleting, duplicating, searching, sorting, tagging, or organizing blueprints
- AI chat history, streaming prose, multiple candidates, or autonomous redesign
- Competitor research, website crawling, moodboard generation, and long-form strategy documents
- User analytics, telemetry, billing, or production deployment infrastructure

## 5. Acceptance criteria

### Core desktop experience

- At a desktop viewport of 1280 px or wider, the guided controls and live preview are simultaneously visible without horizontal page scrolling.
- Completing or changing any supported input updates the corresponding preview content in the same interaction cycle without a Generate action.
- The current step, save state, Save action, and Full preview action remain discoverable while editing.
- Each of the three templates produces a visibly different composition and typographic hierarchy while displaying the same blueprint information.
- Full preview hides editing controls, uses the current saved or unsaved state, and returns to the editor without losing changes.

### Mobile experience

- At a 375 px viewport, every required field, template choice, save action, AI instruction, and preview section is reachable without horizontal scrolling.
- The user can switch between Questions and Preview without values resetting.
- Long brand names and answer text wrap without overlapping controls or escaping containers.
- Touch targets, focus states, labels, validation messages, and disabled states remain usable.
- Full preview can be entered and exited on mobile without trapping focus or navigation.

### Persistence

- Saving a valid new blueprint creates exactly one retrievable record and confirms success.
- Saving an existing blueprint updates that record rather than creating a duplicate.
- Reopening a saved record restores the brand name, all answers, selected template, derived blueprint content, and saved AI changes.
- The displayed updated time changes after a successful save.
- Navigating away after a failed save does not falsely report that the changes were saved.

### Loading and pending states

- Library/workspace loading shows a stable placeholder or progress message rather than an empty flash.
- Save and AI-submit controls indicate pending work and prevent duplicate submission.
- Existing editor values and preview content remain visible during save and AI requests whenever possible.
- Success or failure feedback is announced visually and accessibly.

### Empty and incomplete states

- With no saved records, the library explains the product outcome and provides one primary create action.
- A new blueprint cannot proceed without a non-blank brand/client name and a template choice.
- Required unanswered questions show concise inline guidance.
- The live preview displays intentional placeholders for incomplete required sections; it does not render `undefined`, empty headings, or raw field keys.
- The optional guardrail is omitted from full presentation mode when blank.
- AI refinement is disabled until the minimum required first draft is complete, with the reason stated.

### General error states

- A missing or invalid blueprint ID produces a clear not-found state with a route back to the library.
- A save failure preserves all current in-memory inputs and identifies that the blueprint remains unsaved.
- Invalid user input is reported next to the relevant control without clearing other answers.
- Unexpected errors do not expose environment variables, stack traces, database paths, or sensitive server details to the user.

### AI success and failure states

- A valid instruction such as “make the tone more playful” changes the relevant supported voice/personality state and preview while preserving the brand name and unrelated visual choices.
- A valid instruction such as “make the color direction warmer” changes the color direction and visible swatches without rewriting unrelated content.
- A blank instruction is rejected locally with concise guidance.
- A missing API key presents a setup-oriented message and leaves the current blueprint unchanged.
- A network/API error, timeout, refusal, or rate limit presents a retryable message and leaves the current blueprint unchanged.
- Malformed or unsupported AI output is rejected before it reaches the canonical editor state.
- An AI success marks the workspace unsaved; it does not persist until the user selects Save.
- Reopening after Save restores the AI-adjusted values and matching preview.

### Quality and handoff

- The core loop can be demonstrated from an empty database through saved AI refinement without manual database editing.
- Keyboard-only use can complete the primary flow.
- Automated checks required by `AGENTS.md` pass, and a production build succeeds.
- Submission documentation identifies implemented scope, decisions, trade-offs, deferred work, setup, and known limitations.

## 6. Scope-cut order if time runs short

Cut or simplify in this order while preserving the required end-to-end loop:

1. Remove all **should-have** items, starting with AI undo, example prompts, completion animation/detail, skeleton polish, and explanatory microcopy.
2. Remove the optional “What should the brand avoid?” question and guardrail section.
3. Reduce template-specific decoration while retaining three unmistakably different layouts and typographic hierarchies.
4. Reduce each curated trait set to the strongest six to eight choices; do not remove any required direction category.
5. Shorten the deterministic interpretation copy while preserving all six required information categories in a presentable hierarchy.
6. Restrict AI to the highest-value supported intents—tone/personality, color, typography, and visual direction—while retaining validated output, safe failure, preview, and save behavior.
7. Simplify loading visuals to accessible text/spinners and simplify library cards to name, template, updated time, and Open.

Do **not** cut the three-template requirement, immediate preview, save/revisit, mobile usability, full preview, safe AI edit, or persistence of AI changes. Those are the observable core of the assessment.

## 7. Rationale against the evaluation criteria

| Evaluation criterion | Why this scope is the right minimum |
| --- | --- |
| Speed to working software | Two primary surfaces and four guided steps create a short implementation path while still demonstrating the entire create → edit → preview → save → revisit → AI-edit loop. |
| Decision quality | One normalized blueprint model serves manual controls, deterministic output, persistence, and AI edits. Three templates vary presentation without multiplying content models. |
| UX polish | The scope concentrates polish on live feedback, clear progress, responsive editor/preview behavior, focused preview, and trustworthy save/AI states. |
| Code clarity | A finite question set, six stable output sections, three named templates, and explicit deferred features make responsibilities and tests understandable to another engineer. |

The differentiating quality is not the number of builder controls. It is whether the result feels like a coherent brand artifact and whether every transition—editing, previewing, saving, reopening, and AI refinement—feels reliable.

## Material scope decisions for Stage 4

These product choices materially constrain the later data model or architecture and must be honored or explicitly superseded in the solution design:

1. **One canonical blueprint state:** Manual controls, preview, persistence, and AI edits represent the same normalized values. The implementation must not maintain an unrelated AI document that can drift from the editor.
2. **Source and derived content both matter:** The record must restore the source answers and the resulting presentation content exactly, including saved AI refinements.
3. **Templates share content:** The three templates use the same blueprint sections and differ only in presentation. Template selection is persistent.
4. **Explicit save boundary:** Manual and AI edits can be previewed locally before the user commits them; success and dirty/saved state must be distinguishable.
5. **AI is server-side and constrained:** AI receives the existing supported configuration and returns validated changes within that configuration. Secrets and model calls remain outside the client boundary.
6. **Saved records are addressable:** The library can reopen a specific blueprint and surface a clear not-found state.
7. **No authentication or collaboration:** The product is local and single-user; the data model does not need ownership, tenancy, permissions, or merge semantics.

## Stage 3 completion check

- [x] The happy path is specified screen by screen.
- [x] The minimum question set and output sections are fixed.
- [x] Manual and AI editing boundaries are explicit.
- [x] Must-have, should-have, and deferred scope are separated.
- [x] Desktop, mobile, persistence, loading, empty, general-error, and AI-state acceptance criteria are testable.
- [x] A risk-aware scope-cut order protects the assessment's core loop.
- [x] Material data-model and architecture implications are flagged without selecting an implementation.
- [x] No application code was changed.
