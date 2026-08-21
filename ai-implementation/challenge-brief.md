# Challenge Brief: Brand Blueprint Builder

## Product to ship

Ship a salon-specific Brand Blueprint Builder—not a generic Squarespace clone or a generic brand questionnaire. It helps salon owners turn their business direction into a coherent look and feel for a website, social media, and printed collateral.

The generic assessment requirements remain the evaluation framework, but their domain should be translated:

- “Page” becomes a salon’s Brand Blueprint.
- “Choose a template” becomes choosing one of three presentation styles for the blueprint.
- “Adjust design elements” becomes answering guided brand questions and refining blueprint content and visual direction.
- “Live preview” becomes seeing the structured blueprint form alongside the guided inputs.
- “Save and reload” becomes persisting and revisiting a salon blueprint.
- “AI editing” becomes applying plain-language changes to the blueprint.

This interpretation satisfies the specialized task in [`ai-flow-design/challenge.md`](../ai-flow-design/challenge.md) without dropping explicit assessment requirements from [`README.md`](../README.md).

## 1. Primary user and job to be done

The primary user is a salon owner or operator defining the direction of their own business. A consultant or team member may facilitate the same flow on the owner’s behalf, but the product must be understandable without design expertise.

Their core job is:

> Turn an incomplete or loosely expressed salon vision into a clear, presentable, persistent Brand Blueprint that guides the brand’s website, social media, and printed touchpoints.

The output must be useful as a handoff/reference document—not merely a record of form responses. This distinction is explicit in [`ai-flow-design/challenge.md`](../ai-flow-design/challenge.md).

## 2. Required end-to-end user journey

1. The salon owner starts a new Brand Blueprint.
2. They choose one of three distinct blueprint presentation templates.
3. They enter the salon name.
4. They move through a guided brand-discovery flow covering at least:
   - Signature services or salon experience and ideal clients
   - Visual style
   - Color direction
   - Typography direction
   - Tone of voice
   - Brand personality
5. A structured, salon-specific blueprint updates immediately as answers change.
6. The user can view the editor and preview together.
7. The user can switch to a full-screen blueprint preview.
8. They save the salon’s inputs and resulting blueprint.
9. They leave and later revisit the saved blueprint with its answers, template, and output restored.
10. They describe a revision in plain language, such as “make the tone more playful.”
11. The application applies the AI-assisted change to the blueprint and displays the updated result.
12. The user can save the AI-edited version.

Steps 1–9 constitute the Phase 1 product. Steps 10–12 constitute Phase 2.

Evidence: the specialized flow comes from [`ai-flow-design/challenge.md`](../ai-flow-design/challenge.md); template selection, partial/full preview, persistence, AI editing, and responsive behavior are explicit in [`README.md`](../README.md).

## 3. Requirements

### Functional requirements

- Provide a guided brand-discovery flow.
- Explain every question in concrete salon-owner language and show where the answer affects the result.
- Capture the salon’s signature services or experience and ideal client without expanding into a long intake form.
- Capture visual style, colors, typography, voice, and personality.
- Offer three meaningfully distinct blueprint templates.
- Convert captured information into a structured salon Brand Blueprint.
- Demonstrate how the direction carries into representative website, social, and print applications.
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
- Keep application examples clearly representative; production export, publishing, and asset generation are not part of this assessment.

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
- Salon-specific prompts, derived content, and inclusive defaults
- Representative website, social, and print application proofs
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
| Primary-user fit | A salon owner can understand the questions and resulting guide without translating generic brand or design terminology. |
| Core loop | A reviewer can create a salon blueprint, choose a template, answer questions, see updates immediately, save, reload, and recover the same state. |
| Template support | Three visibly distinct blueprint presentations are selectable and persist after saving. |
| Structured output | The preview presents salon positioning, client promise, character, visual direction, client-facing voice, and communication guardrails instead of echoing raw fields. |
| Application guidance | Website, social, and print proofs visibly share the selected brand direction while adapting their hierarchy to the medium. |
| Inclusive defaults | No default copy or visual direction assumes gender, salon category, luxury positioning, or a pink/feminine identity. |
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

**Assumption:** “One-pager” describes presentation quality and information density. The Blueprint will include representative website, social, and print applications, but downloadable files, exact trim/bleed production, publishing, and export workflows are not required.

### Salon application inputs

The product does not currently capture booking URLs, social handles, address, prices, logos, photography, or production specifications.

**Assumption:** Application proofs derive from the salon name, owner-authored Foundation answer, and trusted visual/voice profile. They must not invent services, credentials, pricing, demographics, or performance claims. Adding editable channel assets or production exports would require a separate data-model and architecture decision.

### AI edit history and undo

Neither brief explicitly requires version history, undo, approval workflows, or diff views.

**Assumption:** The user must see the proposed result before saving, but full revision history and multi-level undo are optional.

### Implemented foundation before salon specialization

Slices 1–5D already provide the typed Blueprint contract, durable repository, saved editing loop, guided capture, trusted presentation resolver, distinct templates, rationale, and responsive edit/preview feedback. The salon requirement specializes that working foundation; it does not authorize replacing the persistence model or restarting the implementation. Current implementation evidence lives under [`src/lib/blueprint/`](../src/lib/blueprint/) and [`src/components/blueprint/`](../src/components/blueprint/), with progress recorded in [`ai-implementation/changelog.md`](./changelog.md).

### Highest-risk unknowns

1. **Salon relevance without cliché:** The experience must feel specific to salon owners without assuming gender, price point, service category, or a stereotyped beauty palette.
2. **Cross-channel coherence:** Website, social, and print examples must clearly share one system without pretending that one layout works unchanged in every medium.
3. **Persistence completeness:** Inputs, output, template choice, and AI changes can drift if the saved state is incomplete.
4. **AI update integrity:** A model response could erase unrelated fields, return malformed data, or produce configuration the renderer cannot handle.
5. **Responsive editor UX:** A side-by-side editor can become unusable on narrow screens unless the same workflow is deliberately supported there.
6. **Time allocation:** The repository provides foundations but almost no finished product functionality; overbuilding the generic builder model would threaten completion and polish.

## 7. Definition of done

- [ ] The generic starter page has been replaced by a Brand Blueprint experience.
- [ ] A salon owner can create and identify their salon blueprint.
- [ ] The product clearly states that the Blueprint guides website, social, and print work.
- [ ] Capture prompts and option consequences use inclusive salon-specific language.
- [ ] The guided flow captures all five named brand-direction categories.
- [ ] Three distinct blueprint presentation templates are available.
- [ ] The preview forms a structured salon positioning, client promise, character, visual, voice, and guardrail guide.
- [ ] Representative website, social, and print proofs apply the same selected direction without claiming to be production exports.
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
