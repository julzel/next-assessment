# Adversarial Readiness Review

## Remediation status

- Findings 1–3 were fixed and regression-tested in the Stage 8 remediation recorded in
  [`changelog.md`](./changelog.md).
- Findings 4–6 were fixed during submission preparation: persisted rows now pass an explicit
  schema-version gate and runtime validation before rendering; save/status controls remain sticky
  at desktop and mobile widths; clean records cannot be re-saved; and library timestamps include
  same-day time precision.
- The findings below remain the original evidence captured by the adversarial review, not claims
  about the final remediated state.

## Findings

### 1. High — Late server responses overwrite newer local edits and can re-enable duplicate submissions

- **Confidence:** 100%
- **Evidence:** Save and AI handlers submit a draft snapshot, then replace the entire current draft when the response arrives. Any intervening manual edit resets both pending statuses to `idle`. See [`src/components/blueprint/blueprint-workspace.tsx`](../src/components/blueprint/blueprint-workspace.tsx) and [`src/lib/blueprint/reducer.ts`](../src/lib/blueprint/reducer.ts).
- **Reproduction:** Complete a Blueprint, submit an AI refinement, and change the salon name while **Refining…** is visible. The control returns to an idle state; when the AI response arrives, the salon name reverts. This was reproduced in the running app: `Race Audit Salon` → `Changed During AI` → `Race Audit Salon`. The save path has the same state transition: an edit during a delayed first save clears `saveStatus`, re-enables Save, and permits another insert before the first response arrives.
- **Affected files:** `src/components/blueprint/blueprint-workspace.tsx`, `src/lib/blueprint/reducer.ts`, `src/components/blueprint/workspace-header.tsx`, `src/components/blueprint/ai-refinement-panel.tsx`, `src/components/blueprint/blueprint-workspace.test.tsx`.
- **User impact:** Silent loss of manual work, duplicate AI charges, and potentially duplicate SQLite records.
- **Smallest credible fix:** Track a draft revision and request ID. Manual edits must not clear pending state. Discard stale AI responses when the draft revision changes; reconcile save responses without replacing post-submit edits; prevent second submissions while either operation is active. Add deferred-promise regression tests for manual edits during save and AI requests.

### 2. High — AI validation constrains shape, but not whether changes match the instruction

- **Confidence:** 90%
- **Evidence:** The product requires unrelated fields to remain unchanged in [`ai-implementation/product-scope.md`](./product-scope.md). The system prompt asks the model to preserve them, but the server accepts every structurally valid non-null field returned by the model. See [`src/lib/blueprint/ai-contract.ts`](../src/lib/blueprint/ai-contract.ts) and [`src/app/blueprints/actions.ts`](../src/app/blueprints/actions.ts).
- **Reproduction:** Mock a valid OpenAI patch that changes color, typography, personality, voice, and content. Call `refineBlueprint` with “Make only the voice warmer.” The action returns `ok: true` and applies every unrelated change.
- **Affected files:** `src/lib/openai.ts`, `src/lib/blueprint/ai-contract.ts`, `src/app/blueprints/actions.ts`, `src/app/blueprints/actions.test.ts`, `src/lib/blueprint/ai-merge.test.ts`.
- **User impact:** A valid-looking AI response can redesign unrelated parts of the Blueprint despite the one-focused-change promise. Off-topic prompts can also consume tokens whenever the model returns a valid patch.
- **Smallest credible fix:** Introduce an explicit refinement target—voice, personality, color, typography, or copy—and enforce a server-side field allowlist for that target. Reject patches whose diff touches unrelated answer or content groups.

### 3. High — The “local single-user” Docker setup exposes the app and database administration interface beyond localhost

- **Confidence:** 100%
- **Evidence:** [`docker-compose.yml`](../docker-compose.yml) publishes ports 3000 and 4983 on all host interfaces and runs the app and Drizzle Studio on `0.0.0.0`. [`scripts/docker-dev.sh`](../scripts/docker-dev.sh) starts the entire stack by default. Runtime inspection showed listeners on `TCP *:3000` and `TCP *:4983`.
- **Reproduction:** Run `npm run docker`, then open `http://<host>:3000` or `http://<host>:4983` from another machine that can reach the host. The application has no authorization, and Studio provides direct database administration.
- **Affected files:** `docker-compose.yml`, `scripts/docker-dev.sh`, `docker/nginx-studio.conf`, `README.md`.
- **User impact:** Another reachable device can modify saved Blueprints through Studio or invoke AI requests backed by the owner’s API key.
- **Smallest credible fix:** Bind published ports to loopback—`127.0.0.1:3000:3000` and `127.0.0.1:4983:4983`—and make Studio an opt-in Compose profile rather than part of the default stack.

### 4. Medium — Persisted configuration is trusted on read without validation or schema migration

- **Confidence:** 95%
- **Evidence:** [`ai-implementation/solution-design.md`](./solution-design.md) says revisit validates or migrates `config.schemaVersion`. Instead, [`src/db/blueprints.ts`](../src/db/blueprints.ts) maps rows directly into typed DTOs, and [`src/app/blueprints/[id]/page.tsx`](../src/app/blueprints/[id]/page.tsx) passes them directly to the Client workspace. Presentation resolution then indexes trusted registries with persisted enum values in [`src/lib/blueprint/presentation.ts`](../src/lib/blueprint/presentation.ts).
- **Reproduction:** In an isolated database, insert a row with `schemaVersion: 2`, an unsupported template, or an invalid presentation enum. `getBlueprint` returns the invalid row as a typed Blueprint, and opening it can fail during presentation resolution.
- **Affected files:** `src/db/blueprints.ts`, `src/db/blueprints.test.ts`, `src/app/blueprints/[id]/page.tsx`, `src/lib/blueprint/validation.ts`, `src/lib/blueprint/presentation.ts`.
- **User impact:** A stale, manually edited, or future-version record can make revisit fail rather than producing a controlled recovery state.
- **Smallest credible fix:** Validate every full row and summary at the repository boundary. Add an explicit `schemaVersion` migration switch and return a controlled invalid-record result when migration is unavailable.

### 5. Medium — Save status and actions are not persistent while editing

- **Confidence:** 100%
- **Evidence:** [`ai-implementation/product-scope.md`](./product-scope.md) requires a persistent top bar and visible mobile save status. Only the mobile Questions/Preview tabs are sticky in [`src/components/blueprint/blueprint-workspace.tsx`](../src/components/blueprint/blueprint-workspace.tsx); the action header in [`src/components/blueprint/workspace-header.tsx`](../src/components/blueprint/workspace-header.tsx) is not sticky.
- **Reproduction:** At 1280×800 or 375×800, scroll to Voice/AI near the bottom. Browser measurements placed the desktop Save button approximately 2,536 px above the viewport and the mobile Save button approximately 2,405 px above it. Only the mobile tab switcher remained visible.
- **Affected files:** `src/components/blueprint/blueprint-workspace.tsx`, `src/components/blueprint/workspace-header.tsx`, `src/components/blueprint/blueprint-workspace.test.tsx`.
- **User impact:** Users completing the longest steps lose sight of whether work is saved and must return to the top to save or open full preview.
- **Smallest credible fix:** Make a compact header containing status, Save, and Full preview sticky at both breakpoints, accounting for the mobile tab bar’s height.

### 6. Low — Updated-time and clean-save behavior provide misleading freshness feedback

- **Confidence:** 100%
- **Evidence:** [`ai-implementation/product-scope.md`](./product-scope.md) says the displayed updated time changes after a successful save. [`src/components/blueprint/blueprint-card.tsx`](../src/components/blueprint/blueprint-card.tsx) displays only month, day, and year, so normal same-day saves show no visible change. The design says Save is enabled only when dirty, but [`src/components/blueprint/workspace-header.tsx`](../src/components/blueprint/workspace-header.tsx) does not use `isDirty` when disabling it.
- **Reproduction:** Open a saved Blueprint showing **Saved**; Save remains enabled. Save without changing anything and return to the library. The record timestamp is rewritten, but the displayed date is identical.
- **Affected files:** `src/components/blueprint/blueprint-card.tsx`, `src/components/blueprint/workspace-header.tsx`, associated component tests.
- **User impact:** Reviewers cannot verify freshness from the library, and clean saves create meaningless database updates.
- **Smallest credible fix:** Disable Save when clean and display time or a sufficiently precise relative timestamp.

## Top three release blockers

1. Stale save/AI responses silently overwrite newer edits and bypass duplicate-submit protection.
2. The AI boundary does not enforce instruction-to-diff scope.
3. Docker exposes the unauthenticated application and database Studio on all host interfaces.

## Would this pass the assessment?

No. The primary flow is demonstrable, but the reproduced state-loss bug violates the core editing and persistence guarantees. The AI scope and Docker exposure also prevent calling the submission release-ready.

## Checks that did not produce a finding

- `npx tsc --noEmit` passed.
- `npm run lint` passed.
- `npm test` passed: 24 files and 123 tests.
- `npm run build` passed when network access to Google Fonts was available.
- The Git worktree remained clean throughout the read-only review.
- Valid saved records reopened with their selected template and completed answers.
- At 375 px and 1280 px, no horizontal page overflow was observed.
- Full preview opened, closed with Escape, and restored focus.
- Template radios had keyboard-operable semantics and accessible names.
- Malformed JSON, unknown AI keys, unsupported enums, oversized copy, refusals, and API failures are rejected without persistence.
- No Client Component imported SQLite, Drizzle, OpenAI, or environment secrets.
- `.env.local` and SQLite files are ignored and untracked.
- The OpenAI request exposes no tools, disables storage, and has no mechanism for accessing application code or the database.
