# Release evidence — Brand Blueprint Builder

**Date:** 2026-08-20  
**Scope:** Slice 8 — harden, document, and prepare release evidence

## Release result

The assessment is ready for review as a local, single-user salon Brand Blueprint Builder. The
primary loop is demonstrated without manual database editing:

```text
Empty library → new Blueprint → guided capture → live preview → AI refinement
→ explicit Save → saved library → reopen with the same refined Blueprint
```

No data contract or schema change was needed in this slice. The only behavior correction is that a
new, never-saved Blueprint now announces **Not saved yet**, rather than **Saved**.

## Acceptance trace

| Must-have outcome | Direct implementation and release evidence |
| --- | --- |
| Empty and populated library | `BlueprintLibrary` renders a dedicated empty state and native create link; `blueprint-library.test.tsx` covers both. Browser check confirmed the empty state against a fresh temporary SQLite database. |
| Guided capture and immediate preview | `BlueprintWorkspace`, `GuidedEditor`, and `BlueprintPreview` share one reducer draft; `blueprint-workspace.test.tsx` covers input/template/answer changes. Browser check completed all four steps and confirmed current content in the preview. |
| Three distinct presentation templates | `EditorialTemplate`, `StudioTemplate`, and `WarmTemplate` consume the trusted resolver; presentation, template-card, and preview tests cover the closed presentation contract. |
| Website, social, and print proof | `BrandApplications` derives three representative channel artifacts from the same draft and profile; focused application tests cover their semantics. |
| Desktop, mobile, full preview, and keyboard use | Browser checks at 1280 px and 375 px confirmed no horizontal overflow, Questions/Preview tab operation with ArrowRight, full-preview enter/exit, and focus restoration. Workspace and overlay tests cover equivalent state/focus behavior. |
| Explicit persistence and reopening | Repository and action tests cover insert/update/validation. In a temporary database, a complete Blueprint was saved at `/blueprints/1`, then reloaded with its AI-refined voice intact. |
| Safe AI refinement | `actions.test.ts`, `ai-contract.test.ts`, and workspace tests cover missing-key, malformed output, refusal, rate-limit, network failure, local-only application, Undo, and explicit-save behavior. Browser check confirmed a successful constrained refinement stayed unsaved until Save. |
| Accessible state feedback | Semantic labels, keyboard controls, aria-live/status/alert feedback, disabled pending controls, focus restoration, and route error states are covered by focused component tests and the browser check. |

## Manual verification record

The browser was connected to the Docker-served app for responsive checks and to an isolated
temporary SQLite instance for the clean-data flow. Existing application data was not reset or
modified.

- **1280 px:** saved Blueprint workspace, live preview, full-preview dialog, Escape return, and
  focus restoration passed.
- **375 px:** Questions/Preview mode switched with keyboard navigation; full preview entered and
  exited; `documentElement.scrollWidth <= innerWidth`; no console warnings or errors.
- **Clean database:** empty state appeared; a new **Harbor & Hue** Blueprint reached 4/4 completed
  steps; its preview updated as choices were made; a live AI voice refinement applied locally;
  explicit Save created `/blueprints/1`; reload preserved the refined content and saved state.
- **AI failure paths:** focused server-action and client-workspace tests cover unavailable key,
  refusal, malformed structured output, rate limit, and request failure without altering the draft
  or persistence.

## Release commands

Run from the repository root:

```bash
npx tsc --noEmit
npm run lint
npm test
npm run build
```

The clean setup path is `npm run db:reset`. It deletes and recreates only the configured SQLite
database path, then seeds the salon-specific **Marigold Salon** example. Do not run it against data
you need to retain.

## Known limitations

The implemented limitations match the approved deferred scope: local single-user use only; no
authentication, authorization, production rate limiting, concurrency handling, publishing, export,
uploads, collaboration, version history, or arbitrary visual customization. AI remains a
server-side, tool-free, structured patch boundary and is not a general-purpose chat interface.

## Recommended next review

Perform an adversarial review of the server actions and AI boundary: malformed action payloads,
prompt-injection attempts, unexpected OpenAI statuses, production environment configuration, and
the planned authentication/ownership/rate-limit design before any deployment work.
