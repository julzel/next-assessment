# Challenge Brief: Brand Blueprint Builder

## Product to ship

Ship a specialized Brand Blueprint Builder—not a generic Squarespace clone.

The generic assessment requirements remain the evaluation framework, but their domain should be translated:

- “Page” becomes a client’s Brand Blueprint.
- “Choose a template” becomes choosing one of three presentation styles for the blueprint.
- “Adjust design elements” becomes answering guided brand questions and refining blueprint content and visual direction.
- “Live preview” becomes seeing the structured blueprint form alongside the guided inputs.
- “Save and reload” becomes persisting and revisiting a client blueprint.
- “AI editing” becomes applying plain-language changes to the blueprint.

This interpretation satisfies the specialized task in [`ai-flow-design/challenge.md`](../ai-flow-design/challenge.md) without dropping explicit assessment requirements from [`README.md`](../README.md).

## 1. Primary user and job to be done

There are two closely related users:

- A client defining their brand direction before onboarding.
- A team member facilitating that discovery session on the client’s behalf.

Their core job is:

> Turn an incomplete or loosely expressed brand vision into a clear, presentable, persistent Brand Blueprint that can guide pre-onboarding and onboarding work.

The output must be useful as a handoff/reference document—not merely a record of form responses. This distinction is explicit in [`ai-flow-design/challenge.md`](../ai-flow-design/challenge.md).

## 2. Required end-to-end user journey

1. The user starts a new client Brand Blueprint.
2. They choose one of three distinct blueprint presentation templates.
3. They enter basic identifying information for the client or blueprint.
4. They move through a guided brand-discovery flow covering at least:
   - Visual style
   - Color direction
   - Typography direction
   - Tone of voice
   - Brand personality
5. A structured, presentable blueprint updates immediately as answers change.
6. The user can view the editor and preview together.
7. The user can switch to a full-screen blueprint preview.
8. They save the client’s inputs and resulting blueprint.
9. They leave and later revisit the saved blueprint with its answers, template, and output restored.
10. They describe a revision in plain language, such as “make the tone more playful.”
11. The application applies the AI-assisted change to the blueprint and displays the updated result.
12. The user can save the AI-edited version.

Steps 1–9 constitute the Phase 1 product. Steps 10–12 constitute Phase 2.

Evidence: the specialized flow comes from [`ai-flow-design/challenge.md`](../ai-flow-design/challenge.md); template selection, partial/full preview, persistence, AI editing, and responsive behavior are explicit in [`README.md`](../README.md).

## 3. Requirements

### Functional requirements

- Provide a guided brand-discovery flow.
- Capture visual style, colors, typography, voice, and personality.
- Offer three meaningfully distinct blueprint templates.
- Convert captured information into a structured one-page-style Brand Blueprint.
- Avoid presenting the result as a raw questionnaire dump.
- Update the blueprint preview immediately as inputs change.
- Support both editor-plus-preview and full-screen preview modes.
- Save blueprint identity, selected template, answers, and resulting configuration.
- List or otherwise expose previously saved blueprints for revisiting.
- Restore saved state correctly after navigation or reload.
- Accept natural-language editing instructions.
- Use AI to update the blueprint configuration in response.
- Show the AI-updated result in the same preview.
- Allow AI changes to be persisted.
- Provide understandable feedback for save and AI operations.
- Handle missing or failed AI configuration without destroying the current blueprint.

The original requirements are stated in [`README.md`](../README.md) and specialized by [`ai-flow-design/challenge.md`](../ai-flow-design/challenge.md).

### Non-functional requirements

- Work on mobile and desktop.
- Use Next.js 16 App Router and TypeScript.
- Use Server Components by default; client components should be limited to genuinely interactive areas.
- Use Tailwind CSS v4 and the existing shadcn/ui foundation.
- Use the existing SQLite and Drizzle setup; do not introduce another ORM.
- Keep database access server-side.
- Keep `OPENAI_API_KEY` server-side and never commit it.
- Store editable blueprint configuration as serializable JSON.
- Preserve semantic, accessible HTML and keyboard-usable controls.
- Provide clear loading, saving, empty, success, and failure states.
- Keep component boundaries and data structures understandable to another engineer.
- Pass TypeScript, lint, and automated tests.

These constraints come from [`AGENTS.md`](../AGENTS.md), [`package.json`](../package.json), and [`components.json`](../components.json).

## 4. Phase boundary

### Phase 1: complete without AI

Phase 1 must provide a useful product on its own:

- Guided brand discovery
- Three blueprint presentation templates
- Structured blueprint generation from answers
- Immediate preview
- Partial and full-screen preview modes
- Save and revisit
- Mobile and desktop support

The first draft should be produced deterministically from the captured data. AI is not required to make Phase 1 usable.

### Phase 2: AI-assisted refinement

Phase 2 begins only after a first draft exists:

- Accept a plain-language change request.
- Interpret which parts of the blueprint should change.
- Update the existing blueprint rather than create an unrelated replacement.
- Preserve unaffected information.
- Show the result for review.
- Save the revised blueprint.

Although [`ai-flow-design/challenge.md`](../ai-flow-design/challenge.md) labels this separately as Phase 2, AI editing is also an explicit assessment requirement in [`README.md`](../README.md). Therefore, both phases belong in the final submission; “Phase 2” describes sequencing, not optional scope.

## 5. Observable acceptance checks

| Evaluation area | Observable acceptance check |
| --- | --- |
| Core loop | A reviewer can create a blueprint, choose a template, answer questions, see updates immediately, save, reload, and recover the same state. |
| Template support | Three visibly distinct blueprint presentations are selectable and persist after saving. |
| Structured output | The preview groups information into useful brand sections instead of echoing field labels and answers verbatim. |
| Live preview | Editing any supported field changes the visible blueprint without a manual regeneration step. |
| Preview modes | The reviewer can move between editor-plus-preview and a focused full-screen preview. |
| Persistence | Saved answers, template choice, generated content, and AI edits survive navigation or page reload. |
| AI editing | A natural-language request changes the relevant blueprint properties while preserving unrelated content. |
| AI failure safety | Missing credentials, invalid output, or request failure produces a useful message and leaves the previous blueprint intact. |
| Responsive UX | The complete primary workflow remains usable at mobile and desktop widths without clipped or unreachable controls. |
| Decision quality | The persisted data represents the Brand Blueprint domain coherently; configuration is serializable and responsibilities are clearly separated. |
| Code clarity | Types and component names describe the domain, tests cover important interactive behavior, and setup and trade-offs are documented. |
| Engineering health | `npx tsc --noEmit`, `npm run lint`, and `npm test` pass. A production build should also succeed before submission. |

The rubric originates in [`README.md`](../README.md), while the required domain behavior comes from [`ai-flow-design/challenge.md`](../ai-flow-design/challenge.md).

## 6. Ambiguities, assumptions, and risks

### Reconciled conflict: generic page builder versus Brand Blueprint Builder

The repository README asks for a generic website builder, while `ai-flow-design/challenge.md` asks for a Brand Blueprint Builder.

**Assumption:** `ai-flow-design/challenge.md` is the intended product brief, while README requirements still define the expected interaction quality and assessment rubric. Therefore, generic builder mechanics should be adapted to the Brand Blueprint domain rather than implemented as a separate product.

### Three templates are not mentioned in the specialized task

**Assumption:** Retain this explicit README requirement, but interpret templates as three blueprint presentation styles—not unrelated website templates.

### “Page configuration” versus questionnaire answers

The starter schema stores arbitrary page configuration, while the specialized product needs client inputs and a structured output.

**Assumption:** Both the source answers and the resulting blueprint state must persist. Persisting only the rendered result would make revisiting and editing incomplete.

### Meaning of “generates a first draft”

The task does not say whether Phase 1 generation itself uses AI.

**Assumption:** Phase 1 should form the initial blueprint deterministically from user inputs. AI is reserved for Phase 2 editing, making the core experience reliable without an API call.

### Identity and collaboration

The task mentions both clients and internal team members but specifies no authentication, permissions, organizations, or concurrent editing.

**Assumption:** This is a local, single-user assessment. Authentication, accounts, sharing, and real-time collaboration are out of scope.

### “One-pager”

The brief describes a structured summary/one-pager but does not require printing, PDF export, or a literal single physical page.

**Assumption:** “One-pager” describes presentation quality and information density. Export and print workflows are not required.

### AI edit history and undo

Neither brief explicitly requires version history, undo, approval workflows, or diff views.

**Assumption:** The user must see the proposed result before saving, but full revision history and multi-level undo are optional.

### Current starting point

The repository is an orientation scaffold, not a partial Brand Blueprint implementation:

- The home route still displays the generic assessment brief in [`src/app/page.tsx`](../src/app/page.tsx).
- The only builder primitive is a serializable text example in [`src/components/builder/text-element.tsx`](../src/components/builder/text-element.tsx).
- The only component tests cover that example in [`src/components/builder/text-element.test.tsx`](../src/components/builder/text-element.test.tsx).
- The database contains a generic `pages` table and arbitrary JSON configuration in [`src/db/schema.ts`](../src/db/schema.ts).
- Seed data is a generic example page in [`scripts/seed.ts`](../scripts/seed.ts).
- Only four shadcn primitives are currently present: Button, Card, Badge, and Separator under `src/components/ui/`.

### Highest-risk unknowns

1. **Scope interpretation:** Whether evaluators still expect literal generic website templates. The safest reconciliation is to preserve every observable README capability inside the Brand Blueprint product.
2. **Blueprint usefulness:** A live preview can technically work while still feeling like a decorated form dump. The output must demonstrate synthesis and clear hierarchy.
3. **Persistence completeness:** Inputs, output, template choice, and AI changes can drift if the saved state is incomplete.
4. **AI update integrity:** A model response could erase unrelated fields, return malformed data, or produce configuration the renderer cannot handle.
5. **Responsive editor UX:** A side-by-side editor can become unusable on narrow screens unless the same workflow is deliberately supported there.
6. **Time allocation:** The repository provides foundations but almost no finished product functionality; overbuilding the generic builder model would threaten completion and polish.

## 7. Definition of done

- [ ] The generic starter page has been replaced by a Brand Blueprint experience.
- [ ] A user can create and identify a client blueprint.
- [ ] The guided flow captures all five named brand-direction categories.
- [ ] Three distinct blueprint presentation templates are available.
- [ ] The preview forms a structured, presentable brand summary.
- [ ] The preview updates immediately as answers change.
- [ ] Partial/editor preview and full-screen preview both work.
- [ ] The full primary flow is usable on mobile and desktop.
- [ ] A blueprint can be saved to local SQLite.
- [ ] A saved blueprint can be found and revisited.
- [ ] Reloaded answers, template, and output match the saved state.
- [ ] A plain-language AI request can update the existing blueprint.
- [ ] Unaffected blueprint information survives an AI edit.
- [ ] AI errors do not erase or corrupt the current blueprint.
- [ ] Save, loading, empty, success, and error states are understandable.
- [ ] Database and OpenAI access remain server-side.
- [ ] No secret is exposed or committed.
- [ ] Important interactive and transformation behavior has automated coverage.
- [ ] `npx tsc --noEmit` passes.
- [ ] `npm run lint` passes.
- [ ] `npm test` passes.
- [ ] The production build succeeds.
- [ ] Submission notes explain decisions, trade-offs, limitations, and next steps as required by [`README.md`](../README.md).
