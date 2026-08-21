# Continuous validation matrix — 2026-08-20

**Scope:** Completed Slices 1–8 in `ai-implementation/implementation-plan.md`  
**Method:** Required repository checks, browser interaction at desktop/mobile widths, and an
isolated temporary SQLite database. The Docker-served library data was not reset or changed.

| Area | Result | Evidence |
| --- | --- | --- |
| Type safety | Pass | `npx tsc --noEmit` completed successfully. |
| Lint | Pass | `npm run lint` completed successfully. |
| Automated regression suite | Pass | `npm test` completed: 24 files, 123 tests. |
| Production build | Pass | `npm run build` completed with a network-enabled retry. The sandbox-only first attempt could not fetch the existing Google-hosted Geist fonts. |
| Empty library | Pass | A blank temporary SQLite database rendered the product explanation and the single **Create your first blueprint** action. |
| Desktop capture and live preview | Pass | At 1280 px, a new **Harbor & Hue** Blueprint began **Not saved yet**, completed all four steps, and owner-entered Foundation content appeared in the current preview and channel proofs without a generate action. No horizontal overflow. |
| Templates and cross-channel artifact | Pass | The desktop saved workspace rendered the selected presentation and the derived website, social, and print proofs from the same current Blueprint state. Existing focused presentation/application tests cover all three closed templates. |
| Save, library, and revisit | Pass | Explicit Save created only `/blueprints/1`; reload restored salon identity, answers, template, deterministic content, and AI-adjusted voice. Direct temporary-DB read confirmed one record only and `warm`, `thoughtful`, `optimistic` voice traits. |
| AI success and explicit persistence | Pass | A live request changed the current voice toward optimism while retaining name, Foundation, visual direction, and the local save boundary. The edit showed **Unsaved changes** and persisted only after Save. |
| AI unavailable failure | Pass | A restart of the isolated app with `OPENAI_API_KEY` absent showed the accessible setup message, preserved the current optimized Blueprint, left the action retryable, and generated no browser console errors. |
| Other AI failures | Pass (automated) | Focused Server Action and workspace tests cover malformed output, refusal, rate limit, timeout/network failure, and non-destructive retry behavior. |
| Invalid save | Pass | An empty new draft showed the accessible validation message and `aria-invalid="true"` on the salon name. The temporary database still held exactly the one previously saved record. |
| Missing record | Pass | `/blueprints/99999` rendered **This saved blueprint no longer exists.** with a **Return to library** action and no console errors. |
| Mobile, keyboard, and full preview | Pass | At 375 px, neither Questions nor Preview overflowed horizontally; ArrowRight selected Preview; full preview opened; Escape returned focus to **Full preview**; browser warnings/errors were empty. |
| Loading UI | Not independently observed | Fast local route responses completed before the loading boundary could be captured. This is an evidence gap, not a confirmed product defect; do not claim a manual pass without latency-controlled or E2E coverage. |
| Server/browser health | Pass | The isolated server logged successful requests only; browser error/warning logs were empty throughout the tested flows. |

## Changes made during this pass

None. The current implementation required no completed-scope regression fix.

## Unresolved validation item

The loading-state criterion needs a latency-controlled browser or E2E check before it can be called
manually verified. Existing local responses are too fast to expose the boundary reliably.
