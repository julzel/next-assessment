# Codebase Map

**Workflow stage:** 2 — Explore the existing codebase  
**Purpose:** Factual inventory of the current repository against the approved [challenge brief](./challenge-brief.md). This is not a solution design or implementation plan.

## Repository snapshot

The repository is a starter scaffold rather than a partial Brand Blueprint Builder. It contains one App Router page, one example builder element, one generic SQLite table, seed/reset scripts, and a small shadcn/ui component set. No client-specific blueprint workflow, server mutation boundary, AI integration, or saved-blueprint retrieval UI currently exists.

| Area | Current state | Evidence |
| --- | --- | --- |
| Application route | One root route at `/`; it renders a static assessment orientation page. | [`src/app/page.tsx`](../src/app/page.tsx) |
| App shell | Root layout supplies Geist fonts, global styles, and generic Page Builder metadata. | [`src/app/layout.tsx`](../src/app/layout.tsx) |
| Builder model | One text-only, serializable element example. | [`src/components/builder/text-element.tsx`](../src/components/builder/text-element.tsx) |
| Persistence | One generic `pages` table with name, template, arbitrary JSON config, and timestamps. | [`src/db/schema.ts`](../src/db/schema.ts) |
| Data access | A shared `better-sqlite3`/Drizzle client uses WAL mode and a configurable DB path. | [`src/db/index.ts`](../src/db/index.ts), [`src/db/path.ts`](../src/db/path.ts) |
| Test coverage | Two tests cover text rendering, semantic level, alignment class, and inline color. | [`src/components/builder/text-element.test.tsx`](../src/components/builder/text-element.test.tsx) |
| UI foundations | Button, Badge, Card, and Separator primitives; Lucide is installed. | [`src/components/ui/`](../src/components/ui/), [`package.json`](../package.json) |

## Routes and Server/Client boundaries

| Location | Current boundary | Observed behavior |
| --- | --- | --- |
| [`src/app/layout.tsx`](../src/app/layout.tsx) | Server Component by default; no `"use client"` directive. | Provides document shell and static metadata. |
| [`src/app/page.tsx`](../src/app/page.tsx) | Server Component by default; no `"use client"` directive. | Renders static content and the text-element example; it does not query the database or own interactive state. |
| [`src/components/builder/text-element.tsx`](../src/components/builder/text-element.tsx) | Server-compatible component; no `"use client"` directive. | Receives a JSON-like config and renders semantic text. |
| [`src/components/ui/separator.tsx`](../src/components/ui/separator.tsx) | Client Component. | The file declares `"use client"` because it wraps a Base UI primitive. |
| [`src/components/ui/button.tsx`](../src/components/ui/button.tsx), [`badge.tsx`](../src/components/ui/badge.tsx), [`card.tsx`](../src/components/ui/card.tsx) | No local client directive. | These are reusable visual primitives; the current root page imports Badge and Card only. |
| `src/app/api/` | Absent. | No Route Handlers exist. |
| Server Actions | Absent. | No `"use server"` directive or action configuration is present. |

Next.js 16 documents that pages and layouts are Server Components by default, Client Components are for state/event handlers/browser APIs, and props crossing into a Client Component must be serializable. [`node_modules/next/dist/docs/01-app/01-getting-started/05-server-and-client-components.md`](../node_modules/next/dist/docs/01-app/01-getting-started/05-server-and-client-components.md) also states that `"use client"` establishes a client module-graph boundary; its use should therefore remain limited to interactive surfaces.

## Current builder and configuration pattern

[`TextElement`](../src/components/builder/text-element.tsx) is the only builder element. Its `TextElementConfig` type is plain data:

- `type: "text"`
- `text`
- semantic `level` (`h1`, `h2`, `h3`, or `p`)
- `align` (`left`, `center`, or `right`)
- optional CSS `color`

The component derives Tailwind classes from `level` and `align`, then renders the selected semantic HTML tag. Its header comment explicitly identifies the intended extension point: serializable configuration can be stored in the database, edited in a form, or rewritten by AI. The existing test file verifies this contract without depending on a database or route.

There are no other builder elements, no template registry, no question/field model, no blueprint-specific configuration type, and no preview-mode state in the source tree. Evidence: [`src/components/builder/`](../src/components/builder/) contains only `text-element.tsx` and `text-element.test.tsx`; [`src/app/page.tsx`](../src/app/page.tsx) contains no form controls or client-state hooks.

## Database and persistence flow

| Concern | Current behavior | Evidence |
| --- | --- | --- |
| Schema source of truth | Drizzle table declarations live in one file. | [`src/db/schema.ts`](../src/db/schema.ts) |
| Existing model | `pages`: integer ID, name, template string, JSON-mode text config, created/updated timestamps. | [`src/db/schema.ts`](../src/db/schema.ts) |
| DB client | `better-sqlite3` is wrapped by `drizzle-orm/better-sqlite3`; journal mode is WAL. | [`src/db/index.ts`](../src/db/index.ts) |
| DB location | `DATABASE_PATH` environment variable or `local.db` at the repository root. | [`src/db/path.ts`](../src/db/path.ts) |
| Schema sync | `npm run db:push` runs `drizzle-kit push`. | [`package.json`](../package.json) |
| Seed behavior | Inserts one generic `starter` page only when the table is empty. | [`scripts/seed.ts`](../scripts/seed.ts) |
| Reset behavior | Deletes the DB, WAL, and SHM files before schema push and seeding. | [`scripts/reset.ts`](../scripts/reset.ts), [`package.json`](../package.json) |
| Current local state | `local.db` is present in this workspace. | Repository-root filesystem inspection |

Only [`scripts/seed.ts`](../scripts/seed.ts) currently imports and queries `db`; no route or component reads or writes application data. `AGENTS.md` requires that this server-only client never be imported into Client Components.

### Next.js 16 data-access constraint

The installed Next.js caching guide notes that synchronous embedded-database queries, including `better-sqlite3`, can run during prerendering. When per-request data is needed from such a source, the guide calls for `connection()` before the query. See [`node_modules/next/dist/docs/01-app/01-getting-started/08-caching.md`](../node_modules/next/dist/docs/01-app/01-getting-started/08-caching.md). The current [`next.config.ts`](../next.config.ts) has no `cacheComponents` setting, so no cache-component configuration has been enabled in this repository.

## UI, styling, and assets

| Area | Current state | Evidence |
| --- | --- | --- |
| CSS | Tailwind CSS v4, `tw-animate-css`, and shadcn’s Tailwind layer are imported globally. | [`src/app/globals.css`](../src/app/globals.css) |
| Theme | Neutral light/dark CSS variables and shared radii/tokens are already defined. | [`src/app/globals.css`](../src/app/globals.css) |
| shadcn config | `base-nova` style, RSC enabled, CSS variables enabled, and `@/*` aliases configured. | [`components.json`](../components.json) |
| UI components | Button, Badge, Card, and Separator are available; form, dialog, tabs, select, textarea, toast, and sheet primitives are absent. | [`src/components/ui/`](../src/components/ui/) |
| Icons | `lucide-react` is installed and used on the starter page. | [`package.json`](../package.json), [`src/app/page.tsx`](../src/app/page.tsx) |
| Static assets | Only Next/Vercel starter SVGs are present. | [`public/`](../public/) |

The supplied components already include visual states relevant to the current primitives: Button has disabled, active, focus-visible, and invalid styles; Badge and Card expose variants; Separator is accessible through its Base UI primitive. See the individual files in [`src/components/ui/`](../src/components/ui/).

## Tests, tooling, and validation

| Check | Command/configuration | Current coverage or behavior |
| --- | --- | --- |
| Type checking | `npx tsc --noEmit` | Required by `AGENTS.md` and pre-commit. |
| Lint | `npm run lint` | Runs ESLint with Next core-web-vitals and TypeScript configurations. [`eslint.config.mjs`](../eslint.config.mjs) |
| Unit/component tests | `npm test` | Runs Vitest once with jsdom and React plugin. [`package.json`](../package.json), [`vitest.config.mts`](../vitest.config.mts) |
| Focused test loop | `npm run test:watch` | Vitest watch mode. [`package.json`](../package.json) |
| Build | `npm run build` | Runs `next build`; not included in the pre-commit hook. [`package.json`](../package.json) |
| Pre-commit | `npx tsc --noEmit`, then `npx lint-staged` | Staged TypeScript files receive ESLint and related Vitest tests. [`.husky/pre-commit`](../.husky/pre-commit), [`package.json`](../package.json) |
| Database | `npm run db:push`, `npm run db:seed`, `npm run db:reset`, `npm run db:studio` | Commands are defined and documented; reset is destructive to `local.db`. [`package.json`](../package.json), [`AGENTS.md`](../AGENTS.md) |

No E2E framework, browser test configuration, test utility setup file, or test for persistence, forms, responsive behavior, preview modes, or AI behavior exists in the repository inventory.

## Reusable foundations versus documented gaps

| Reusable foundation | Evidence | Documented gap |
| --- | --- | --- |
| App Router root page and layout | [`src/app/`](../src/app/) | Brand Blueprint routes and UI do not exist. |
| Serializable rendering contract | [`src/components/builder/text-element.tsx`](../src/components/builder/text-element.tsx) | No domain configuration model, template definitions, or blueprint renderer exists. |
| SQLite/Drizzle infrastructure | [`src/db/`](../src/db/) | No blueprint-specific schema usage, read path, write path, or retrieval experience exists. |
| Generic JSON config persistence column | [`src/db/schema.ts`](../src/db/schema.ts) | Existing generic seed data and page terminology do not represent client discovery inputs or a structured blueprint. |
| Tailwind, theme tokens, and four UI primitives | [`src/app/globals.css`](../src/app/globals.css), [`src/components/ui/`](../src/components/ui/) | The form and feedback primitives required for the challenge are not yet present. |
| Vitest/RTL baseline | [`vitest.config.mts`](../vitest.config.mts), [`text-element.test.tsx`](../src/components/builder/text-element.test.tsx) | No tests cover the required challenge workflow. |
| Environment-variable convention | [`AGENTS.md`](../AGENTS.md), [`src/db/path.ts`](../src/db/path.ts) | No OpenAI integration or server-side AI boundary exists. |

## Requirement-to-codebase mapping

Every major requirement in the challenge brief maps below to an existing extension point or a documented gap. “Extension point” identifies evidence already in the repository; it does not prescribe a design.

| Challenge requirement | Current extension point or documented gap | Evidence |
| --- | --- | --- |
| Create/identify a client blueprint | **Gap:** no client or blueprint UI/model exists. **Extension point:** generic persisted record has a `name` field. | [`src/app/page.tsx`](../src/app/page.tsx), [`src/db/schema.ts`](../src/db/schema.ts) |
| Capture visual style, color, typography, tone, and personality | **Gap:** no fields, question definitions, or forms exist. | [`src/app/page.tsx`](../src/app/page.tsx), [`src/components/ui/`](../src/components/ui/) |
| Choose three blueprint templates | **Gap:** no template selector or definitions exist. **Extension point:** the generic schema and seed both contain a template string. | [`src/db/schema.ts`](../src/db/schema.ts), [`scripts/seed.ts`](../scripts/seed.ts) |
| Produce a structured, presentable blueprint | **Gap:** only text rendering exists. **Extension point:** serializable render configuration is demonstrated by `TextElement`. | [`src/components/builder/text-element.tsx`](../src/components/builder/text-element.tsx) |
| Avoid a raw-answer dump | **Gap:** no generated or curated blueprint output exists. | [`src/app/page.tsx`](../src/app/page.tsx) |
| Update preview immediately | **Gap:** no interactive state or form controls exist. **Constraint:** interactive code requires a Client Component boundary. | [`src/app/page.tsx`](../src/app/page.tsx), [`node_modules/next/dist/docs/01-app/01-getting-started/05-server-and-client-components.md`](../node_modules/next/dist/docs/01-app/01-getting-started/05-server-and-client-components.md) |
| Provide side-by-side and full-screen preview | **Gap:** no preview component, view state, or responsive editor layout exists. **Extension point:** global Tailwind setup is available. | [`src/app/page.tsx`](../src/app/page.tsx), [`src/app/globals.css`](../src/app/globals.css) |
| Save blueprint state locally | **Gap:** no application save operation exists. **Extension point:** Drizzle client, JSON config column, and DB commands are ready. | [`src/db/index.ts`](../src/db/index.ts), [`src/db/schema.ts`](../src/db/schema.ts), [`package.json`](../package.json) |
| Revisit saved blueprints and restore state | **Gap:** no database read path or saved-record UI exists. **Extension point:** `pages` has an ID and timestamps. | [`src/db/schema.ts`](../src/db/schema.ts), [`src/app/`](../src/app/) |
| AI-assisted edits | **Gap:** no OpenAI SDK/dependency, API route, Server Action, prompt, validation, or AI UI exists. **Constraint:** API key must remain server-side. | [`package.json`](../package.json), [`AGENTS.md`](../AGENTS.md) |
| Preserve current blueprint on AI failure | **Gap:** no AI operation, error state, or recovery behavior exists. | [`src/app/page.tsx`](../src/app/page.tsx) |
| Mobile and desktop operation | **Gap:** the static starter page uses a responsive grid but has no workflow UI to verify. **Extension point:** Tailwind responsive classes are in use. | [`src/app/page.tsx`](../src/app/page.tsx) |
| Accessible interactive controls | **Gap:** no user input controls currently exist. **Extension point:** supplied Button and Separator primitives expose focus/state support. | [`src/components/ui/button.tsx`](../src/components/ui/button.tsx), [`src/components/ui/separator.tsx`](../src/components/ui/separator.tsx) |
| Server-only database and secret access | **Extension point/constraint:** documented explicitly; database module is currently only used in a script. | [`AGENTS.md`](../AGENTS.md), [`src/db/index.ts`](../src/db/index.ts), [`scripts/seed.ts`](../scripts/seed.ts) |
| Automated validation | **Extension point:** TypeScript, ESLint, Vitest, and component-test pattern are configured. **Gap:** challenge-flow tests do not exist. | [`package.json`](../package.json), [`vitest.config.mts`](../vitest.config.mts), [`src/components/builder/text-element.test.tsx`](../src/components/builder/text-element.test.tsx) |

## Technical risks and version-specific constraints

1. **Next.js 16 rendering/data timing:** The installed documentation notes that synchronous `better-sqlite3` reads can occur during prerendering. Any future route that needs fresh per-request SQLite data must account for the documented `connection()` behavior. Evidence: [`node_modules/next/dist/docs/01-app/01-getting-started/08-caching.md`](../node_modules/next/dist/docs/01-app/01-getting-started/08-caching.md).
2. **Client bundle boundaries:** Marking a module `"use client"` includes its imports and directly rendered components in the client module graph. The existing `db` client must remain outside that graph, as required by [`AGENTS.md`](../AGENTS.md) and the installed Server/Client Components guide.
3. **Serialization boundary:** Data passed from server-rendered UI into Client Components must be serializable; the existing plain-object builder configuration is compatible with that constraint, while the Drizzle client itself is not. Evidence: [`text-element.tsx`](../src/components/builder/text-element.tsx) and the installed Server/Client Components guide.
4. **Route-handler placement:** If Route Handlers are later used, Next.js 16 requires them inside `src/app/` and forbids a `route.ts` at the same route segment as a `page.tsx`. Evidence: [`node_modules/next/dist/docs/01-app/01-getting-started/15-route-handlers.md`](../node_modules/next/dist/docs/01-app/01-getting-started/15-route-handlers.md).
5. **Server Action defaults:** Server Actions are stable/enabled by default in the installed documentation; same-origin checking is default and request bodies default to a 1 MB limit. Evidence: [`node_modules/next/dist/docs/01-app/03-api-reference/05-config/01-next-config-js/serverActions.md`](../node_modules/next/dist/docs/01-app/03-api-reference/05-config/01-next-config-js/serverActions.md).
6. **Runtime version:** `.nvmrc` pins Node `22.22.0`; the Docker development image uses the same Node 22.22.0 version. Evidence: [`.nvmrc`](../.nvmrc), [`Dockerfile`](../Dockerfile).
7. **Database reset is destructive:** `npm run db:reset` deletes the SQLite database and its WAL/SHM files before recreating and seeding it. Evidence: [`scripts/reset.ts`](../scripts/reset.ts), [`package.json`](../package.json).

## Stage 2 completion check

- [x] `ai-implementation/codebase-map.md` exists.
- [x] Routes and Server/Client boundaries are mapped.
- [x] Builder/config, database, UI, tests, tooling, and Next.js 16 documentation were inspected.
- [x] Reusable foundations and current gaps are separated.
- [x] Every major challenge requirement maps to an existing extension point or an identified gap.
- [x] No application code was changed during this stage.
