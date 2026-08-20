# Codex-Specific Workflow for the Brand Blueprint Builder

This workflow turns the nine stages in `ai-challenge-planning.md` into an executable Codex process for this repository. Each stage includes the model setting to use, a copy-ready prompt, the expected artifact, and the condition for moving on.

This document is the execution source of truth. Keep the original challenge and workflow definition in `ai-flow-design/`. Save all generated briefs, maps, plans, reviews, and progress records in `ai-implementation/`.

## Model strategy

Use the model as a gear, not as a status symbol:

| Gear | Codex model and effort | Use it for |
| --- | --- | --- |
| Deep reasoning | **GPT-5.6 Sol, high** | Ambiguous product decisions, architecture, data modeling, debugging across boundaries, and adversarial review |
| Everyday implementation | **GPT-5.6 Terra, medium** | Most feature work, tests, refactors, and integration work after the design is settled |
| Fast/mechanical | **GPT-5.6 Luna, low** | Repository inventory, focused edits with explicit acceptance criteria, test reruns, formatting, and documentation cleanup |
| Escalation | **GPT-5.6 Sol, xhigh** | Only when a high-effort attempt still leaves a consequential architecture, security, data-loss, or systemic debugging question unresolved |

The default progression is **Sol → Luna → Sol → Sol → Terra → Terra/Luna → Terra → Sol → Terra**. Do not switch models in the middle of an unresolved task. End the current Codex turn with a written artifact or clean checkpoint, then start the next stage with the recommended model.

Official OpenAI guidance describes Sol as the frontier option for complex work, Terra as the intelligence/cost balance, and Luna as the cost-sensitive option. It recommends medium effort as a balanced starting point, low for latency-sensitive work, and high or xhigh only where added reasoning produces a measurable quality gain. See [OpenAI's model catalog](https://developers.openai.com/api/docs/models) and [model guidance](https://developers.openai.com/api/docs/guides/latest-model).

## Before stage 1

Start from the repository root. Keep one Codex thread through stages 1–5 so its understanding carries forward. Start a fresh thread for stage 8 so the reviewer is not anchored to the implementation conversation.

Codex must follow `AGENTS.md`, including reading the relevant Next.js 16 documentation under `node_modules/next/dist/docs/` before changing Next.js code. Never paste or expose `.env.local` or the API key.

After every workflow stage—and after every implementation slice in stage 6—append an entry to `ai-implementation/changelog.md`. Each entry must state what was completed, the evidence or validation result, unresolved issues, exactly one next logical step, and the recommended model plus reasoning effort for that next step. Choose that model using this workflow's model-switch guidance. Do not mark work complete in the changelog until its stated completion check passes.

---

## 1. Understand the challenge

**Use:** GPT-5.6 Sol, high reasoning.

**Why this gear:** This stage resolves conflicts between the repository README (generic page builder), `ai-flow-design/challenge.md` (Brand Blueprint Builder), existing code, and the evaluation criteria. A mistaken interpretation here makes every later stage expensive.

**Prompt:**

```text
We are building the assessment in this repository. Do not change any files yet.

Read AGENTS.md, README.md, ai-flow-design/challenge.md, package.json, and the current source tree. Inspect any other files needed to understand the starting point. Reconcile the generic page-builder brief with the Brand Blueprint Builder task and tell me what product we should actually ship.

Produce a concise challenge brief containing:
1. the primary user and their job to be done;
2. the required end-to-end user journey;
3. explicit functional and non-functional requirements;
4. the Phase 1 versus Phase 2 boundary;
5. evaluation criteria translated into observable acceptance checks;
6. ambiguities, conflicts, assumptions, and the highest-risk unknowns;
7. a “definition of done” checklist.

Use evidence from repository files and cite each relevant file path. Do not propose architecture or implementation yet. Ask a question only if a decision cannot safely be inferred from the repository; otherwise state the assumption.
```

**Output/checkpoint:** A challenge brief in the conversation. Save it to `ai-implementation/challenge-brief.md` only after reviewing it, then record stage 1 and the next logical step in `ai-implementation/changelog.md`.

**Switch when:** The required user loop and Phase 1/Phase 2 boundary are unambiguous. If they are not, stay on Sol and resolve them before continuing.

## 2. Explore the existing codebase

**Use:** GPT-5.6 Luna, low reasoning.

**Why this gear:** Repository discovery is mostly bounded inspection and summarization. The task is to collect facts, not redesign the application.

**Prompt:**

```text
Explore this repository without modifying files. Follow AGENTS.md. Use rg/rg --files and inspect the actual implementation, schema, seed/reset scripts, tests, styles, shadcn configuration, and relevant Next.js 16 docs in node_modules/next/dist/docs/.

Return a codebase map that covers:
- routes and Server/Client Component boundaries;
- the current builder component/config pattern;
- database schema, persistence flow, and seed data;
- installed UI primitives and styling conventions;
- existing tests and validation commands;
- reusable code versus code that likely needs replacement;
- gaps between the current repo and the challenge brief;
- technical risks or version-specific constraints.

For every conclusion, point to a concrete file path. Do not design the solution and do not edit anything.
```

**Output/checkpoint:** Save the factual codebase map to `ai-implementation/codebase-map.md`, then record stage 2 and the next logical step in `ai-implementation/changelog.md`.

**Switch when:** Every major feature can be connected to an existing extension point or an identified gap. Escalate to Terra only if the repository is large or the interaction between layers is unclear.

## 3. Define the product scope

**Use:** GPT-5.6 Sol, high reasoning.

**Why this gear:** Scope selection is the highest-leverage product decision in a timed assessment. Codex should optimize for a complete, polished core loop rather than feature count.

**Prompt:**

```text
Using the approved challenge brief and codebase map, define the smallest impressive product scope for this assessment. Do not edit application code.

Prioritize a complete flow: capture brand direction → see the blueprint form live → save → revisit → request an AI edit → see and persist the update.

Return:
1. the exact happy path, screen by screen;
2. the minimum question set and blueprint sections;
3. what is editable manually versus by AI;
4. must-have, should-have, and explicitly deferred features;
5. acceptance criteria for desktop, mobile, persistence, loading, empty, error, and AI-failure states;
6. a scope-cut order if time runs short;
7. a short rationale tied to the assessment evaluation criteria.

Make firm recommendations. Prefer a small number of coherent, well-finished interactions over broad optionality. Flag any choice that would materially affect the data model or architecture.
```

**Output/checkpoint:** Save the product-scope contract to `ai-implementation/product-scope.md`, then record stage 3 and the next logical step in `ai-implementation/changelog.md`.

**Switch when:** Every must-have has a testable acceptance criterion and every tempting extra is either prioritized or deferred.

## 4. Design the solution

**Use:** GPT-5.6 Sol, high reasoning. Escalate to xhigh only for an unresolved cross-layer design decision.

**Why this gear:** This stage establishes the data contract and Server/Client boundaries that are costly to reverse.

**Prompt:**

```text
Design the technical and UX solution for the approved product scope. Do not implement it yet.

First, read the relevant Next.js 16 guides under node_modules/next/dist/docs/ as required by AGENTS.md. Then inspect the files that the design will affect.

Produce a decision-ready design covering:
- route and component tree, with Server versus Client Components justified;
- the serializable Brand Blueprint config shape and TypeScript types;
- Drizzle schema changes and persistence lifecycle;
- server actions or route handlers, including validation and error behavior;
- live-preview state ownership and save/reload behavior;
- AI editing flow, structured-output contract, validation, and safe failure fallback;
- responsive UX and accessibility behavior;
- test strategy by layer;
- security boundaries, especially keeping OPENAI_API_KEY server-side;
- key trade-offs and rejected alternatives.

Include one compact data-flow diagram and a proposed file map. Keep the design proportional to a take-home assessment: no speculative infrastructure. End with explicit decisions that must be accepted before implementation.
```

**Output/checkpoint:** Save the approved design to `ai-implementation/solution-design.md`, then record stage 4 and the next logical step in `ai-implementation/changelog.md`.

**Switch when:** State ownership, persistence, AI validation, and component boundaries are settled. Stay on Sol if any of those remain vague.

## 5. Create the implementation plan

**Use:** GPT-5.6 Terra, medium reasoning.

**Why this gear:** The hard decisions are now made; this stage translates them into small, verifiable vertical slices.

**Prompt:**

```text
Turn the approved product scope and solution design into an implementation plan. Do not write application code yet.

Create ordered vertical slices that keep the app runnable. For each slice include:
- user-visible outcome;
- exact files to add or modify;
- schema/data-contract impact;
- tests to add or update;
- validation commands;
- dependencies on earlier slices;
- a clear completion check.

The first slices should establish the typed config and persistence foundation; later slices should complete the capture/preview loop, save/revisit flow, AI editing, responsive polish, and documentation. Include an early thin end-to-end path before expanding UI detail.

Keep each slice small enough for one focused Codex implementation turn. Add a risk-first ordering rationale and a final release checklist using: npx tsc --noEmit, npm run lint, npm test, and npm run build where appropriate.
```

**Output/checkpoint:** Save the checked-list plan to `ai-implementation/implementation-plan.md`, then record stage 5 and the next logical step in `ai-implementation/changelog.md`.

**Switch when:** Each step has concrete files, tests, and a stopping condition. Begin implementation with Terra.

## 6. Implement incrementally with AI

**Use:** GPT-5.6 Terra, medium for each vertical slice. Switch to Luna, low only for isolated mechanical follow-ups. Switch to Sol, high if a slice exposes a design flaw or a bug spanning several layers.

**Why this gear:** Terra is the default coding model; explicit, narrow prompts make it economical without sacrificing implementation judgment.

**Prompt for each slice:**

```text
Implement only slice [NUMBER: NAME] from ai-implementation/implementation-plan.md.

Before editing:
- read AGENTS.md and the slice's relevant source files;
- read the relevant Next.js 16 documentation in node_modules/next/dist/docs/ before using or changing a Next.js API;
- inspect git status and preserve unrelated user changes.

Requirements and acceptance criteria:
[PASTE THE SLICE FROM THE PLAN]

Make the complete in-scope implementation; do not stop at a proposal. Reuse existing patterns and shadcn primitives. Keep DB imports server-only and keep secrets server-side. Add or update focused tests with the code.

Validate the slice with the narrowest relevant tests first, then npx tsc --noEmit, npm run lint, and npm test. Fix failures caused by this slice. Do not bypass hooks, overwrite unrelated changes, or broaden scope.

At the end report:
1. the user-visible result;
2. files changed;
3. validation results;
4. remaining risks or follow-up explicitly left for later slices;
5. whether the slice's completion check passes;
6. after the completion check passes, append the result, exactly one next logical step, and its recommended model/reasoning effort to ai-implementation/changelog.md.
```

**Prompt for a cheap/mechanical follow-up:**

```text
Make this bounded follow-up only: [EXACT CHANGE]. The intended behavior and architecture are already settled.

Inspect the affected files, preserve unrelated changes, implement the edit, and run [EXACT RELEVANT TEST OR CHECK]. Do not refactor adjacent code or introduce new abstractions. Report the files changed and the check result.
```

**Escalation prompt for Sol:**

```text
The current implementation slice is blocked by this cross-layer issue: [SYMPTOM]. Diagnose before editing.

Trace the behavior across UI state, Server/Client boundaries, persistence, and data validation as applicable. Identify the root cause with file-and-line evidence, distinguish it from secondary symptoms, and recommend the smallest design correction. Do not implement until the diagnosis explains all observed failures and states which prior design decision must change.
```

**Output/checkpoint:** One working, tested vertical slice per turn; update the plan checkbox only after validation passes.

**Switch when:** Use Luna only when the change can be specified without judgment. Return to Terra for the next feature. Use Sol when the problem changes an earlier architectural assumption, not merely because a test failed.

## 7. Continuously validate the product

**Use:** GPT-5.6 Terra, medium. Luna, low is acceptable for rerunning a known command after a trivial correction.

**Why this gear:** Validation requires enough judgment to connect failures to user behavior, but not a fresh architecture exercise.

**Prompt after every meaningful slice:**

```text
Validate the current product against ai-implementation/product-scope.md and the completed items in ai-implementation/implementation-plan.md. Do not add new features.

Run the repository checks required by AGENTS.md: npx tsc --noEmit, npm run lint, and npm test. Also run npm run build if this checkpoint changes routing, server boundaries, database access, or production behavior.

Then exercise the implemented user flow in the local app at mobile and desktop widths. Check capture/edit interactions, live preview, save, reload/revisit, AI success and failure behavior if implemented, keyboard access, loading/empty/error states, and console/server errors. Seed or reset the local DB only if needed and safe.

Fix regressions that are clearly within completed scope, add a regression test where practical, and rerun the affected checks. Report a pass/fail matrix with evidence, changes made, and any unresolved issue. Do not mark an item complete based only on static inspection.
```

**Output/checkpoint:** A validation matrix and green automated checks. Record persistent issues in the plan rather than relying on conversation memory.

**Switch when:** All completed slices pass both automated checks and the relevant user-flow check. A repeated systemic failure triggers Sol/high diagnosis; a one-file correction remains on Terra or Luna.

## 8. Use AI for adversarial review

**Use:** Start a fresh Codex thread with GPT-5.6 Sol, high. Use xhigh only if the review reveals a credible high-impact systemic risk that needs deeper analysis.

**Why this gear:** An independent, reasoning-heavy pass is valuable for finding omissions, invalid assumptions, and failure modes that the implementation thread may normalize.

**Prompt:**

```text
Act as a skeptical senior engineer and assessment evaluator. Review this repository; do not modify files.

Read AGENTS.md, README.md, ai-flow-design/challenge.md, ai-implementation/product-scope.md, ai-implementation/solution-design.md, and ai-implementation/implementation-plan.md. Inspect the implementation and tests, and run non-destructive checks where useful.

Try to disprove that the submission is ready. Review:
- whether the actual user journey satisfies the task and evaluation criteria;
- data integrity and save/revisit edge cases;
- Client/Server boundary mistakes and secret exposure;
- AI-edit validation, malformed output, prompt abuse, and failure recovery;
- race conditions, stale state, duplicate submits, and refresh/navigation behavior;
- responsive layout, accessibility, and confusing UX states;
- missing or misleading tests;
- unnecessary complexity and code another engineer would struggle to maintain.

Return findings only when supported by evidence. For each finding include severity, confidence, reproduction steps, affected file(s), user impact, and the smallest credible fix. Sort by severity. End with:
1. the top three release blockers;
2. a “would this pass the assessment?” verdict;
3. what you checked that did not produce a finding.

Do not praise the implementation and do not invent hypothetical requirements outside the brief.
```

**Output/checkpoint:** Save the severity-ranked review to `ai-implementation/adversarial-review.md`, then record stage 8 and the next logical step in `ai-implementation/changelog.md`.

**Fix prompt (return to Terra, medium):**

```text
Address the confirmed findings [IDS] from ai-implementation/adversarial-review.md. Verify each finding against the current code before editing. Implement the smallest cohesive fixes, add regression coverage, and run the full required validation suite. Do not address low-confidence or out-of-scope suggestions. Report each finding as fixed, rejected with evidence, or still open. Append the verified result, exactly one next logical step, and its recommended model/reasoning effort to ai-implementation/changelog.md.
```

**Switch when:** Release blockers and high-severity findings are resolved or explicitly rejected with evidence. Use Terra for fixes; return to Sol only for a disputed or architectural finding.

## 9. Polish against the evaluation criteria

**Use:** GPT-5.6 Terra, medium. Use Luna, low for final copy/docs cleanup after behavior is locked.

**Why this gear:** Final polish is a bounded prioritization and execution pass, not an invitation to redesign.

**Prompt:**

```text
Prepare this project for submission. Treat the assessment criteria as the release rubric and do not add speculative features.

First inspect the current implementation, git diff/status, ai-implementation/product-scope.md, and any open findings in ai-implementation/adversarial-review.md. Build a short rubric matrix for:
- speed to working software / completeness of the core loop;
- decision quality and architecture;
- UX polish on mobile and desktop;
- code clarity and handoff readiness.

Then make only high-value polish changes that close a concrete rubric gap. Check visual hierarchy, spacing, copy, focus/hover/disabled/loading/error states, responsive behavior, empty data, save feedback, and AI-edit feedback. Preserve working architecture.

Update README.md or NOTES.md with setup, implemented features, key decisions, trade-offs, known limitations, and what would come next. Never expose secrets.

Run npx tsc --noEmit, npm run lint, npm test, and npm run build. Exercise the full primary flow once more at mobile and desktop widths. Fix in-scope failures and rerun checks.

Finish with a submission report containing:
1. the rubric matrix with evidence;
2. final validation results;
3. known limitations;
4. exact reviewer setup/run steps;
5. a concise summary suitable for the submission note.
```

**Output/checkpoint:** Submission-ready code, documentation, green checks, and a concise handoff note. Record the final status and any post-assessment next step in `ai-implementation/changelog.md`.

**Stop when:** Every rubric row has concrete evidence, the documented setup works, the main flow passes, and remaining limitations are honestly recorded. Do not use remaining time to add a new feature after this point.

## Quick model-switch checklist

Switch **up to Sol/high** when the next action requires choosing among materially different product or architecture paths, reconciling contradictory evidence, diagnosing a multi-layer failure, or independently challenging correctness.

Stay on **Terra/medium** when the desired behavior is settled but implementation still requires engineering judgment, integration work, or test design.

Switch **down to Luna/low** only when the task has one obvious interpretation, a small file set, explicit acceptance criteria, and a cheap verification command.

Use **Sol/xhigh** sparingly: only after Sol/high leaves an important, consequential question unresolved. More reasoning is not a substitute for a clearer prompt, better repository evidence, or running the relevant test.
