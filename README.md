# Page Builder Assessment

Welcome! This assessment asks you to build a small **website page builder** — think a stripped-down Squarespace. A user picks a template, tweaks the design, previews the result live, and saves their work.

We are testing your ability to **build quickly and well**. Use whatever AI tools, editors, and workflows make you fastest — Cursor, Copilot, Claude, ChatGPT, or none at all. There are no restrictions on tooling. We care about the result and the decisions you made along the way.

## Getting started

```bash
git clone <this-repo>
cd next_assesment
npm install
npm run db:reset   # creates and seeds local.db
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The home page summarizes this brief and is yours to replace as the app takes shape.

### Docker (development)

Requires [Docker](https://docs.docker.com/get-docker/) and a `.env.local` file (same as the non-Docker workflow above).

```bash
npm run docker
```

This starts the app in the background, waits for it to respond, and opens [http://localhost:3000](http://localhost:3000) in your default browser. The published port is bound to `127.0.0.1`, so the unauthenticated local assessment is not exposed to other network devices. Logs stream in the terminal until you press Ctrl+C (containers keep running).

To start without opening browsers: `DOCKER_OPEN_BROWSER=0 npm run docker`

To run in the foreground without the browser helper: `npm run docker:up`

Drizzle Studio is opt-in because it can directly edit the local assessment database. Start the app and Studio together with `DOCKER_STUDIO=1 npm run docker`, or run the foreground stack with `npm run docker:studio`. Its proxy is also bound to `127.0.0.1` on port 4983.

On first run, the `db-init` service creates and seeds the database if it does not exist yet.

When enabled, an nginx proxy on port 4983 forwards local traffic to the Studio container and adds the browser headers Docker requires.

- The SQLite database persists in the `sqlite_data` named volume across restarts.
- Rebuild after dependency changes: `npm run docker`
- Stop: `docker compose down` (add `-v` to also wipe the database volume)

## What you're building

An interactive page builder where a user can:

1. **Choose one of three templates** — three distinct page layouts to start from.
2. **Adjust design elements** — each element on the page exposes configuration (e.g. text content, colors, alignment). What is configurable, and how it's exposed in the editor, is up to you.
3. **See changes immediately** — the preview updates live as the user edits.
4. **Toggle preview size** — support a partial (editor side-by-side) view and a full-screen preview of the page.
5. **Save their work** — selections persist to the local SQLite database and reload on revisit.

The app must work on **mobile and desktop**.

## Your decisions

This is intentionally open-ended. You will need to decide:

- **Templating** — how templates are defined, stored, and rendered.
- **Configuration** — how each element declares what is configurable, and how the editor exposes those controls.
- **Component model** — build the base components a page is composed of. An example `TextElement` component is provided in `src/components/builder/` as a rendering reference; the rest are yours to design.
- **Editor UX** — how editing, previewing, and saving fit together.

We'd rather see a small set of elements done well than many done poorly.

## AI editor

Add an **AI-assisted editing** feature: the user describes a change in natural language (e.g. "make the hero darker and the headline bigger") and the page configuration updates accordingly.

We will provide an OpenAI API key with your invite. Put it in `.env.local`:

```bash
OPENAI_API_KEY=<provided-key>
```

> The key is temporary and will be revoked after the assessment. Never commit it.

## What's provided

| Provided | Where |
|----------|-------|
| Next.js (App Router) + TypeScript | `src/app/` |
| Tailwind CSS v4 + shadcn/ui | `src/components/ui/`, `components.json` |
| Example builder component | `src/components/builder/` |
| SQLite + Drizzle ORM, wired and seeded | `src/db/`, `drizzle.config.ts` |
| Vitest + React Testing Library, example test | `src/components/builder/text-element.test.tsx` |
| Pre-commit hook (type-check, lint, related tests) | `.husky/pre-commit` |

### Database

Everything stays local — SQLite (`local.db`) with [Drizzle ORM](https://orm.drizzle.team), no external services. The client is ready to import from server code:

```ts
import { db } from "@/db"
import { pages } from "@/db/schema"

const allPages = db.select().from(pages).all()
```

| Command | What it does |
|---------|--------------|
| `npm run db:push` | Sync `src/db/schema.ts` to `local.db` (run after schema changes) |
| `npm run db:studio` | Open a browser GUI to inspect and edit the database |
| `npm run db:seed` | Insert the example page (skips if data already exists) |
| `npm run db:reset` | Delete the database, recreate it from the schema, and re-seed |

An example `pages` table is provided in `src/db/schema.ts` to show the pattern — extend or replace it freely. The data model is yours to design.

### Testing & pre-commit

Vitest with React Testing Library is set up, with an example test next to the example component. Test files are colocated as `*.test.tsx`.

```bash
npm test            # run once
npm run test:watch  # watch mode
```

Every commit runs a pre-commit hook (Husky): `tsc --noEmit`, then ESLint and any tests related to your staged files (lint-staged). If the hook fails, fix the issue — don't bypass it.

## What we evaluate

- **Speed to working software** — does the core loop (pick template → edit → preview → save) work?
- **Decision quality** — sensible data model, component boundaries, and editor architecture.
- **UX polish** — immediate preview, mobile + desktop, full-screen toggle.
- **Code clarity** — could another engineer pick this up tomorrow?

## Submitting

1. Push your work to a fork or a fresh repo and send us the link.
2. Include a short note (in the README or a `NOTES.md`) covering the decisions you made, trade-offs, and what you'd do next with more time.

## Brand Blueprint implementation notes

### Implemented features

- Salon-specific four-step guided capture with immediate, deterministic preview feedback.
- Three presentation templates with distinct composition and shared website, social, and print proofs.
- Explicit save/revisit through SQLite, including dirty, pending, success, and failure feedback.
- Focused full-preview mode plus responsive Questions/Preview modes for narrow screens.
- Server-only, target-scoped AI refinement with strict output validation, safe failure recovery, and one-step local Undo.
- Runtime validation of saved records before they reach rendering, with route-level recovery for unsupported data.

### Reviewer setup and validation

The app is a local Brand Blueprint Builder for salon owners. It translates one guided direction
into representative website, social, and printed-touchpoint applications.

```bash
npm install
npm run db:reset   # creates a salon-specific Marigold Salon example
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). To demonstrate the full AI path, add an
`OPENAI_API_KEY` to `.env.local`; it is optional for the deterministic capture, preview, save, and
reopen loop. `OPENAI_MODEL` is optional and defaults to `gpt-5.6-luna`.

Before submission, run:

```bash
npx tsc --noEmit
npm run lint
npm test
npm run build
```

### Decisions, trade-offs, and next steps

- The persisted, serializable `BrandBlueprintConfig` is the single source of truth. Guided inputs,
  deterministic copy, all three templates, cross-channel proofs, and validated AI patches use it.
- Styling is resolved exclusively from closed enums and code-owned presentation tokens. This keeps
  user and AI-authored content out of CSS and layout decisions.
- AI is a constrained local refinement step, not a chat or publishing agent: it has no tools,
  returns a strict whitelist patch, supports one-session Undo, and never persists until **Save**.
- The assessment intentionally omits authentication, authorization, production rate limiting,
  multi-user conflict handling, publishing, social posting, print-ready export, uploads, arbitrary
  layouts, arbitrary fonts/colors, collaboration, and version history. Those are the next
  production investments, along with durable ownership checks and AI abuse controls.

The next production step would be authentication and record ownership, followed by durable
rate limiting for AI requests. Those concerns are intentionally outside this local, single-user
assessment and should be introduced together rather than implied by the current UI.

- The primary user is a salon owner defining one coherent brand direction for a website, social media, and printed client touchpoints.
- The saved `BrandBlueprintConfig` is the canonical state. Guided answers update deterministic content immediately, and save/reopen reproduces the same artifact without storing editor-only progress or focus state.
- Presentation styling is resolved from closed answer enums through code-owned token registries. Saved or future AI-authored text can never inject CSS classes or arbitrary styles.
- Editorial Luxe, Modern Studio, and Neighborhood Welcome share semantic Blueprint modules but own different macro compositions. The live rationale is derived from the same presentation profile used by the renderers, so its explanation cannot drift into a separate stored narrative.
- **Brand in use** derives representative website, square social, and printed-card proofs from that same canonical draft and presentation profile. The proofs explain what stays consistent and what adapts by channel; they are illustrative previews, not production assets.
- AI refinement is available only after the guided Blueprint is complete. The user selects a voice, personality, visual, color, typography, or copy target; the server rejects structurally valid patches that escape that target. The server-only OpenAI Responses API call updates only the local draft, offers one-step Undo, and persists only through the existing explicit Save action. `OPENAI_MODEL` is optional and defaults to `gpt-5.6-luna`.
- Desktop keeps questions beside a focused live preview. Mobile keeps one compact impact sample in Questions mode and moves focus to the affected preview module through **View this change**; no duplicate preview content is added to the form.
- Current limitations: this is a local single-user assessment without authentication, authorization, production rate limiting, or collaborative conflict handling. It intentionally defers production website publishing, social posting, print-ready export/bleed files, image generation, arbitrary fonts/colors/layouts, uploads, collaboration, and version history.
