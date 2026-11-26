# Implementation roadmap and backlog: Geary - Unofficial BulSU Student Information Portal

## 1. Document control and contributor workflow *(ISO/IEC/IEEE 12207 Clauses 6.3.1 and 6.3.2)*

### 1.1 Document metadata

| Attribute | Details |
| :--- | :--- |
| Document title | Implementation Roadmap and Backlog: Geary - Unofficial BulSU Student Information Portal |
| Version | `2.0 (SvelteKit SSR Migration Plan)` |
| Date | `2026-11-24` |
| Standard reference | ISO/IEC/IEEE 12207:2017 - *Systems and software engineering - Software life cycle processes* (Clause 6.3.1 *Project Planning*, Clause 6.3.2 *Project Assessment and Control*, Clause 6.3.4 *Risk Management*, and Clauses 6.4.5, 6.4.7, 6.4.9, and 6.4.11 *Implementation, Integration, Verification and Validation*) |
| Related baselines | [AGENTS.md](../AGENTS.md), [PROJECT_CHARTER.md](./PROJECT_CHARTER.md), [PRD.md](./PRD.md), [SRS.md](./SRS.md), [USER_FLOWS.md](./USER_FLOWS.md), [ARCHITECTURE.md](./ARCHITECTURE.md), [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md), [TESTING.md](./TESTING.md), [REQUIREMENTS.md](./REQUIREMENTS.md) |
| Status | MVP Complete (`M1`–`M6`); SvelteKit SSR baseline (`M7`), Ask-the-Handbook Q&A (`M8`), and the document-request wizard (`BL-34`) implemented and verified |

### 1.2 Shared backlog and milestone workflow *(ISO 12207 Clause 6.3.2)*

Contributors share ownership of milestones and backlog items (`BL-*`) through pull requests:

1. Documentation-first PRs: Read the relevant specification files before writing code. When a PR changes scope, requirements, architecture, design tokens, or tests, update the corresponding `.md` specification file first per [AGENTS.md](../AGENTS.md).
2. Task readiness and milestone gates: Pick up a backlog item only after its prerequisite milestone exit gate is green. Do not close a milestone until every exit criterion passes.
3. PR verification gates: `.github/workflows/ci.yml` runs `bun run check`, `bun test`, and `bun run build` on every pull request. Contributors touching UI, routes, themes, or schemas also run `bun run test:e2e` locally before merging.
4. Traceability and risk updates: In the same PR that completes a `BL-*` task, check off its `[x]` box here, update its row in [REQUIREMENTS.md](./REQUIREMENTS.md) (`[~] Implemented` or `[x] Verified`), and record new defects or mitigations in Section 5.

## 2. Completed work *(ISO/IEC/IEEE 12207 Clause 6.3.2 - Project Assessment)*

### `M0.1`: Specification and governance baseline (`[x]` Completed)
- [x] Defined MVP scope, stakeholders (`ACT-01` to `ACT-04`), and constraints in [PROJECT_CHARTER.md](./PROJECT_CHARTER.md) (`ISO 12207`).
- [x] Defined the initial MVP features (`F-01` to `F-04`), later extended through `F-06` (campus map and academic calendar), with priorities (`P0`/`P1`) and acceptance criteria in [PRD.md](./PRD.md) (`ISO 29148`).
- [x] Defined formal software constraints, contracts, functional specs, and NFRs in [SRS.md](./SRS.md) (`ISO 29148 Clause 9.6` and `ISO 25010`).
- [x] Defined operational modes (`MODE-01` to `MODE-04`), journeys (`UJ-01` to `UJ-06`), use cases (`UC-01` to `UC-06`), and error scenarios (`ERR-01` to `ERR-09`) in [USER_FLOWS.md](./USER_FLOWS.md) (`ISO 29148 Clause 9.3`).
- [x] Defined the original Bun + Astro + Tailwind CSS + React islands architecture and contracts in [ARCHITECTURE.md](./ARCHITECTURE.md) (`ISO 42010` and `ISO 12207 Clause 6.4.3`); superseded by the SvelteKit SSR baseline in `M7`.
- [x] Defined BulSUan tokens, WCAG 2.1 AA contrast ratios, typography, spacing, and component states in [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md) (`ISO 25010`).
- [x] Defined the 4-layer test cases (`TC-*`) and execution pipeline in [TESTING.md](./TESTING.md) (`ISO 25010` and `ISO 29148 Clause 6.6`).
- [x] Defined the bidirectional Requirements Traceability Matrix (`RTM-*`) in [REQUIREMENTS.md](./REQUIREMENTS.md) (`ISO 29148 Clauses 6.5 and 9.6.4`).
- [x] Configured documentation-first workflow rules in [AGENTS.md](../AGENTS.md).

### `M0.2`: Minimal workspace initialization (`[x]` Completed)
- [x] Initialized the Astro (`^7.4.12`) starter project on Bun (`package.json`, `bun.lock`, `astro.config.mjs`, `tsconfig.json`, `src/pages/index.astro`, `public/favicon.svg`, `public/favicon.ico`); replaced by SvelteKit in `M7`.

### `M5.1`: Campus map delivery (`[x]` Completed)
- [x] Implemented the static `/map` route, campus-map dataset, literal building and location search, SVG pan/zoom/reset controls, accessible building selection, and building inspector (`REQ-MAP-01` to `REQ-MAP-04`, `SRS-FUNC-MAP-01`, `SRS-FUNC-MAP-02`).
- [x] Added map unit and browser verification (`TC-UNIT-06`, `TC-E2E-07`) and recorded traceability in [REQUIREMENTS.md](./REQUIREMENTS.md) (`RTM-21`).

### `M7`: SvelteKit SSR migration (`[x]` Completed)
- [x] Migrated the full site to SvelteKit 3, Svelte 5 runes, and `@sveltejs/adapter-vercel` SSR with the Vite `?raw` content pipeline, CDN edge caching, and a Svelte-native interactive widget suite (`BL-23` to `BL-27`, [ARCHITECTURE.md](./ARCHITECTURE.md) v2.0).

## 3. Implementation milestones and life-cycle gates (`M1` to `M8`) *(ISO 12207 Clauses 6.3.1 and 6.4)*

Milestones `M1`–`M6` were delivered on the original Astro + React islands stack and are retained as historical audit records. Milestone `M7` replaced that stack with SvelteKit SSR; the current baseline and all active architecture references are the SvelteKit descriptions in [ARCHITECTURE.md](./ARCHITECTURE.md).

| Milestone | ISO 12207 Life-Cycle Process | Scope Summary | Verifiable Exit Gate |
| :--- | :--- | :--- | :--- |
| **`M1`: Toolchain, integrations, and design foundation** | Clause 6.4.5 *Implementation* | Install React, Tailwind v4 Vite plugin, typecheck, and test tooling; configure `astro.config.mjs`, `package.json` scripts, `src/styles/global.css`, and the Geary gear favicon. | `bun run check` and `bun run build` pass on the starter shell; design tokens compile. |
| **`M2`: Taxonomy, content schema, and seed articles** | Clause 6.4.5 *Implementation* and 6.4.9 *Verification* | Implement `categories.ts`, Content Layer `glob()` + Zod schema (`content.config.ts`), `articles.ts` helpers, and initial seed `.md` articles across all 7 categories. | `TC-BLD-01` and `TC-BLD-02` pass (valid articles compile; invalid schema rejects build). |
| **`M3`: Static layouts, components, and core routes** | Clause 6.4.5 *Implementation* and 6.4.7 *Integration* | Build `BaseLayout`, `ArticleLayout`, static UI components (`Header`, `Footer`, `Breadcrumbs`, `CategoryCard`, `ArticleCard`, `TableOfContents`, `VerificationBanner`), `/`, `/categories/[slug]`, `/articles/[slug]`, and `404.astro`. | All static HTML routes generate in `dist/` with `0 KB` React JS on static views; responsive TOC and prose render properly. |
| **`M4`: Static search index and `<SearchBar />` island** | Clause 6.4.5 *Implementation* and 6.4.7 *Integration* | Build `/search-index.json` (`< 100 KB`), pure weighted scorer (`src/lib/search.ts`), and `<SearchBar />` React island (`hero` and `header` variants) wired into Home, Header, and 404. | `TC-BLD-03` passes; client search, keyboard shortcuts, zero-match pills, and offline fallback work end-to-end. |
| **`M5`: Verification suite and release gate** | Clauses 6.4.9 *Verification* and 6.4.11 *Validation* | Implement `tests/unit/*.test.ts` and `tests/e2e/smoke.spec.ts` (Playwright + Axe); run the 4-stage pipeline (`bun run check`, `bun run build`, `bun test`, `bun run test:e2e`) and `bun audit`. | All `TC-BLD-*`, `TC-UNIT-*`, `TC-E2E-*`, `TC-A11Y-*`, and `TC-SEC-*` checks pass with zero violations. |
| **`M6`: Dark mode (post-MVP)** | Clauses 6.4.5, 6.4.9, and 6.4.11 | Implement Obsidian Slate and Luminous Crimson theme tokens, accessible theme preference menu, persisted preference, and no-flash bootstrap behavior. | Complete: `TC-E2E-08` and `TC-A11Y-03` pass in light and dark themes across representative routes. |
| **`M7`: SvelteKit SSR architecture migration** | Clauses 6.4.3, 6.4.5, 6.4.7, 6.4.9, and 6.4.11 | Migrate from Astro + React islands to SvelteKit (Svelte 5 runes) + `@sveltejs/adapter-vercel` dynamic SSR with Vite `?raw` glob + `gray-matter` + `marked` + `zod` content loader and CDN `Cache-Control` headers while preserving 100% functional and visual parity. | `bun run check` (`svelte-check`), `bun test`, `bun run build` (`vite build`), and `bun run test:e2e` (Playwright + Axe) pass with `0` failures. |
| **`M8`: Ask-the-Handbook Q&A (SvelteKit port of #8)** | Clauses 6.4.5, 6.4.7, 6.4.9, and 6.4.11 | Citation-grounded `/ask` Q&A in Svelte 5: chunked corpus endpoint, client-side retrieval, stateless `/api/ask` server route on Workers AI, and not-covered fallbacks — supersedes the unmerged Astro/React PR #8. | `TC-BLD-03`, `TC-UNIT-09`, and `TC-E2E-09` pass; `AI` binding configured on the deployment target before production answers work (`KI-08`). |

## 4. Prioritized implementation backlog (`BL-01` to `BL-34`) *(ISO 12207 Clauses 6.3.1 and 6.4.5)*

`BL-01`–`BL-22` describe the completed pre-migration Astro implementation and remain as historical records. `BL-23`–`BL-27` are the current SvelteKit SSR baseline, and `BL-28`–`BL-34` cover the post-MVP MCP server, Ask-the-Handbook Q&A, and document-request wizard.

### Milestone `M1`: Toolchain, integrations, and design foundation
- [x] **`BL-01` (`P0`):** Install project dependencies via Bun (`@astrojs/react`, `react`, `react-dom`, `@types/react`, `@types/react-dom`, `tailwindcss`, `@tailwindcss/vite`, `@astrojs/check`, `typescript`, `@playwright/test`, `@axe-core/playwright`) and verify Chromium Playwright setup ([ARCHITECTURE.md](./ARCHITECTURE.md) §2, `KI-01`).
- [x] **`BL-02` (`P0`):** Configure `astro.config.mjs` with `output: 'static'`, `@astrojs/react`, and `@tailwindcss/vite` (`CON-TECH-01` to `CON-TECH-03`, [ARCHITECTURE.md](./ARCHITECTURE.md) §5.1).
- [x] **`BL-03` (`P0`):** Update `package.json` scripts (`dev`, `build`, `preview`, `check`, `test:unit`, `test:e2e`) aligned with [TESTING.md](./TESTING.md) §4.
- [x] **`BL-04` (`P0`):** Create `src/styles/global.css` defining Tailwind imports, BulSUan color and typography tokens, `:focus-visible` ring, `prefers-reduced-motion` support, and scoped `~65ch` prose and table overflow rules ([DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md) §2-4, §5.7, §6).
- [x] **`BL-05` (`P1`):** Replace starter `public/favicon.svg` with the 8-tooth Geary geometric gear icon ([DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md) §5.1).

### Milestone `M2`: Taxonomy, content schema, and seed articles
- [x] **`BL-06` (`P0`):** Implement `src/data/categories.ts` exporting `CATEGORY_SLUGS`, `CategorySlug`, `CategoryMeta`, `CATEGORIES` (ordered 7-category registry), and `getCategoryBySlug()` (`SW-INT-01`, `SRS-NFR-MAINT-01`).
- [x] **`BL-07` (`P0`):** Implement `src/content.config.ts` using `glob()` from `'astro/loaders'` and `z` from `'astro/zod'` enforcing `SW-INT-02` (`SRS-FUNC-CNT-01`, `SRS-FUNC-CNT-02`, `KI-02`).
- [x] **`BL-08` (`P0`):** Implement `src/lib/articles.ts` with deterministic `groupArticlesBySubcategory()`, preview sorting, and `getRelatedArticles()` helpers (`SRS-FUNC-RND-01`, `SRS-FUNC-RND-03`, `SRS-FUNC-RND-06`).
- [x] **`BL-09` (`P0`):** Author initial MVP seed Markdown articles across all 7 categories, including featured entries, multi-heading structures, ordered procedures, callouts, and Markdown tables (`REQ-ART-01`, `REQ-ART-02`, `REQ-CAT-01`, `REQ-CAT-05`).

### Milestone `M3`: Static layouts, components, and core routes
- [x] **`BL-10` (`P0`):** Implement `src/layouts/BaseLayout.astro`, `src/components/Header.astro` (brand gear mark, 7 category links, `< 1 KB` accessible mobile menu drawer), and `src/components/Footer.astro` (unofficial BulSU disclaimer and category links) (`REQ-UI-03`, `SRS-FUNC-UI-01`, `SRS-FUNC-UI-03`).
- [x] **`BL-11` (`P0`):** Implement `Breadcrumbs.astro`, `CategoryCard.astro`, `ArticleCard.astro`, `TableOfContents.astro` (conditional `h2`/`h3` sticky desktop rail and mobile `<details>` panel), and `VerificationBanner.astro` (`REQ-ART-03` to `REQ-ART-05`, `REQ-CAT-02`, `REQ-CAT-04`, `SRS-FUNC-RND-05`, [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md) §5.3-5.8).
- [x] **`BL-12` (`P0`):** Implement `src/layouts/ArticleLayout.astro` and `src/pages/articles/[slug].astro` combining metadata header, responsive TOC, prose layout, disclaimer banner, and up to 3 sibling articles (`SRS-FUNC-CNT-03`, `SRS-FUNC-CNT-04`, `SRS-FUNC-RND-04` to `SRS-FUNC-RND-06`, `SRS-FUNC-UI-04`).
- [x] **`BL-13` (`P0`):** Implement `src/pages/index.astro` (Hero, Featured Articles, 7-Category Directory) and `src/pages/categories/[slug].astro` (subcategory-grouped views and empty-category fallback) (`SRS-FUNC-RND-01` to `SRS-FUNC-RND-03`, `ERR-04`).
- [x] **`BL-14` (`P1`):** Implement `src/pages/404.astro` branded recovery page with category links and Home CTA (`REQ-UI-05`, `SRS-FUNC-RND-06`, `ERR-08`).

### Milestone `M4`: Static search index and `<SearchBar />` React island
- [x] **`BL-15` (`P0`):** Implement `src/pages/search-index.json.ts` serializing published articles and `h2`/`h3` headings into `/search-index.json` (`< 100 KB`) (`SW-INT-03`, `SRS-FUNC-SRCH-01`, `SRS-NFR-PERF-03`).
- [x] **`BL-16` (`P0`):** Implement pure search logic in `src/lib/search.ts` (`filterAndRankArticles` with literal substring matching and weighted `title > headings/subcategory > description/categoryLabel` ranking, capped at `8`) (`SRS-FUNC-SRCH-03`, `ERR-03`).
- [x] **`BL-17` (`P0`):** Implement `src/components/SearchBar.tsx` React island (`hero` and `header` variants, single-instance global shortcut scope, in-memory JSON caching, `ArrowUp`/`ArrowDown`/`Enter`/`Escape`, outside-click dismissal, zero-match 7-category pills, and offline fetch-error fallback) and wire it into `index.astro`, `Header.astro`, and `404.astro` (`SRS-FUNC-SRCH-02` to `SRS-FUNC-SRCH-06`, `KI-03`).

### Milestone `M5`: Verification suite and release readiness gate
- [x] **`BL-18` (`P0`):** Implement `tests/unit/search.test.ts` and `tests/unit/articles.test.ts` validating `TC-UNIT-01` to `TC-UNIT-05` under `bun test`.
- [x] **`BL-19` (`P0`):** Configure `playwright.config.ts` (`webServer` targeting `astro preview`) and implement `tests/e2e/smoke.spec.ts` covering `TC-BLD-04`, `TC-E2E-01` to `TC-E2E-05`, `TC-A11Y-01`, `TC-A11Y-02`, and `TC-SEC-01` (`KI-05`).
- [x] **`BL-20` (`P0`):** Run the full verification pipeline (`bun run check`, `bun run build`, `bun test`, `bun run test:e2e`, `bun audit`), resolve discovered issues, verify `0` failures across all `TC-*` gates ([TESTING.md](./TESTING.md) §4), and mark all rows in [REQUIREMENTS.md](./REQUIREMENTS.md) as `[x] Verified`.
- [x] **`BL-21` (`P0`):** Implement and verify the interactive 2D campus map (`/map`), including the static data contract, location and building search, accessible SVG selection, inspector, viewport controls, `TC-UNIT-06`, and `TC-E2E-07` (`REQ-MAP-01` to `REQ-MAP-04`, `RTM-21`).

### Milestone `M6`: Dark mode (post-MVP)
- [x] **`BL-22` (`P1`, Post-MVP):** Implement the approved dark-mode design contract in [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md) §2.2, including a Header theme menu with Light, Dark, and System default choices, persisted preference, no-flash bootstrap, tokenized surfaces, and light/dark accessibility verification (`TC-E2E-08`, `TC-A11Y-03`).

### Milestone `M7`: SvelteKit SSR architecture migration
- [x] **`BL-23` (`P0`):** Replace Astro/React toolchain with SvelteKit 3, Svelte 5, `@sveltejs/adapter-vercel`, `svelte-check`, `@tailwindcss/vite`, `gray-matter`, `marked`, and `zod`; configure `vite.config.ts`, `tsconfig.json`, `src/app.html`, `static/` assets, and `.github/workflows/ci.yml` (`CON-TECH-01` to `CON-TECH-04`, `KI-07`).
- [x] **`BL-24` (`P0`):** Implement `src/lib/content-schema.ts`, `src/lib/server/markdown.ts`, `src/lib/server/content.ts` (Vite `?raw` glob + `gray-matter` + `zod` + `marked` + pure `buildSearchIndex()`), `src/lib/server/cache.ts`, and edge-cached `/search-index.json`, `/sitemap.xml`, and `/robots.txt` `+server.ts` endpoints; update `TC-UNIT-05` and add `tests/unit/content.test.ts` (`SRS-FUNC-CNT-01` to `SRS-FUNC-CNT-04`, `SRS-FUNC-SRCH-01`).
- [x] **`BL-25` (`P0`):** Port root layout (`+layout.svelte`), error page (`+error.svelte`), static UI components (`Header`, `ThemeToggle`, `Footer`, `Breadcrumbs`, `CategoryCard`, `ArticleCard`, `TableOfContents`, `ArticleLayout`, `SeoHead`), and all SSR routes (`/`, `/articles`, `/articles/[slug]`, `/categories/[slug]`, `/calendar`, `/map`, `/contribute`, `/privacy`, `/terms`) (`SRS-FUNC-RND-01` to `SRS-FUNC-RND-06`, `SRS-FUNC-UI-01` to `SRS-FUNC-UI-04`).
- [x] **`BL-26` (`P0`):** Port interactive widgets to Svelte 5 runes (`SearchBar.svelte`, `ExploreSpotlight.svelte`, `AcademicCalendar.svelte`, `CampusMap.svelte` + `campus-map/*`) with SPA-safe `$effect` cleanup (`SRS-FUNC-SRCH-02` to `SRS-FUNC-SRCH-06`, `SRS-FUNC-MAP-01`, `SRS-FUNC-MAP-02`, `RTM-22`, `RTM-23`).
- [x] **`BL-27` (`P0`):** Run full verification gate (`bun run check`, `bun test`, `bun run build`, `bun run test:e2e`, `bun audit`), confirm zero regressions and valid CDN `Cache-Control` headers, and mark `M7` and all `RTM-*` rows as `[x] Verified`.
- [x] **`BL-28` (`P1`, Post-MVP):** Implement the read-only MCP server (`F-07`): `src/routes/corpus.json/+server.ts` corpus endpoint (`SW-INT-05`), `mcp/` Cloudflare Worker with Streamable HTTP JSON-RPC and `search_articles`/`get_article`/`list_categories`/`get_freshness` tools (`SW-INT-06`, `SRS-FUNC-MCP-01` to `SRS-FUNC-MCP-04`), and `TC-UNIT-08`/`TC-BLD-03` verification (`REQ-MCP-01` to `REQ-MCP-04`, `RTM-24`).
- [x] **`BL-34` (`P0`/`P1`, Post-MVP):** Implement the interactive document-request wizard (`/wizard`, `F-09`): `wizard` article frontmatter schema (`SW-INT-09`), `src/lib/wizard.ts` aggregation + hash/storage helpers, `ClearanceWizard.svelte` Svelte 5 island, category entry cards, article "check off your requirements" links, `TC-UNIT-10`, and `TC-E2E-10` (`REQ-WIZ-01` to `REQ-WIZ-05`, `RTM-26`, `RTM-NFR-17`).

### Milestone `M8`: Ask-the-Handbook Q&A (SvelteKit port of PR #8)
- [x] **`BL-29` (`P0`):** Update specification docs first per the documentation-first rule — [PROJECT_CHARTER.md](./PROJECT_CHARTER.md), [PRD.md](./PRD.md) `F-08`/`REQ-ASK-*`, [SRS.md](./SRS.md) `CON-*`/`SW-INT-07`-`08`/`SRS-FUNC-ASK-*`, [USER_FLOWS.md](./USER_FLOWS.md) `MODE-05`/`UJ-07`/`UC-07`/`ERR-10`-`12`, [ARCHITECTURE.md](./ARCHITECTURE.md), [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md) §5.11, [TESTING.md](./TESTING.md), and [REQUIREMENTS.md](./REQUIREMENTS.md) `RTM-25`/`RTM-NFR-15`-`16`.
- [x] **`BL-30` (`P0`):** Implement `src/lib/ask.ts` (`buildAskChunks`, `retrieveAskSources`, `hasAnswerableEvidence`, `buildAskMessages`, `parseCitedAnswer`) and `src/routes/ask-index.json/+server.ts` emitting `/ask-index.json` (`SW-INT-07`, `CON-DATA-03`, `SRS-FUNC-ASK-01`, `SRS-FUNC-ASK-02`).
- [x] **`BL-31` (`P0`):** Implement `src/routes/ask/+page.svelte` + `src/lib/components/AskPanel.svelte` (lazy corpus fetch, client-side retrieval, cited answer rendering, not-covered/service fallbacks) and add the `Ask` Header nav link (`REQ-ASK-02`, `REQ-ASK-04`, `REQ-ASK-05`, `SRS-FUNC-ASK-04`, `SRS-FUNC-ASK-05`, `DESIGN_SYSTEM.md` §5.11).
- [x] **`BL-32` (`P0`):** Implement `src/routes/api/ask/+server.ts` SvelteKit server route proxying validated `{ query, sources }` payloads to Workers AI via `platform.env.AI` with the grounded citation prompt; stateless, no storage, no cookies (`SW-INT-08`, `SRS-FUNC-ASK-03`, `CON-TECH-01`, `CON-FIN-02`).
- [ ] **`BL-33` (`P0`):** Add `tests/unit/ask.test.ts` (`TC-UNIT-09`) and the `/ask` flow in `tests/e2e/smoke.spec.ts` (`TC-E2E-09`, `/ask` added to `TC-E2E-04`/`TC-BLD-03` coverage); run `bun run check`, `bun test`, `bun run build`, `bun run test:e2e`.

## 5. Known issues and technical risks *(ISO/IEC/IEEE 12207 Clause 6.3.4 - Risk Management)*

| Risk / Issue ID | Status | Description | Mitigation / Resolution |
| :--- | :--- | :--- | :--- |
| **`KI-01`** | Resolved | Initialized `package.json` contained only `"astro": "^7.4.12"`; React, Tailwind CSS, TypeScript check, and test packages were not yet installed. | Installed required runtime and dev packages via Bun (`BL-01`) and configured Playwright to use system Google Chrome (`channel: 'chrome'`). |
| **`KI-02`** | Resolved | Installed `astro@7.4.12` marks `import { z } from 'astro:content'` as `@deprecated` (to be removed in Astro 8) and uses Content Layer loaders. | Imported `z` from `'astro/zod'` and `glob` from `'astro/loaders'` inside `src/content.config.ts` (`BL-07`). |
| **`KI-03`** | Resolved | On `/` (and the branded 404 page when header search is visible), mounting two `<SearchBar />` islands can create competing global `/` and `Ctrl+K` listeners. | Scoped global hotkey registration behind `enableGlobalShortcut?: boolean` (`true` on Hero/404 primary search; `false` on Header) and added `data-search-ready` hydration signaling (`BL-17`). |
| **`KI-04`** | Resolved | Gear Gold (`#D4A017`) yields `2.2:1` contrast on light surfaces and fails WCAG 2.1 AA (`TC-A11Y-01`) if used for text. | Restricted `#D4A017` to borders and icons, paired `#FEF9E7` backgrounds with `#785300` text, and added `tabindex="0"` for horizontally scrollable Markdown tables (`BL-04`, `TC-A11Y-01`). |
| **`KI-05`** | Resolved | On Windows environments, background servers started in separate commands can be unreachable across subsequent shell sessions. | Configured Playwright `webServer` to launch and tear down `astro preview` inside the same test command (`BL-19`). |
| **`KI-06`** | Resolved | `@astrojs/check@0.9.12` rejects `typescript@7.0.2`, and bare `bun test` attempts to execute Playwright `.spec.ts` files. | Pinned `typescript@6.0.3`, added `/// <reference types="bun" />` to `tests/unit/*.test.ts`, and added `bunfig.toml` (`root = "tests/unit"`). |
| **`KI-08`** | **Open** | `/api/ask` requires a Workers AI `AI` binding on the deployment target (Cloudflare `wrangler.toml`/dashboard binding or equivalent platform env), and local `vite dev`/`vite preview` do not provide the binding, so the endpoint only answers in deployed environments with Workers AI configured. | Document the binding requirement in the PR; `<AskPanel />` degrades to the service-unavailable fallback (with retrieved-source links) when `/api/ask` is unreachable. Reassess if Workers AI free allocation proves insufficient (`CON-FIN-01`/`CON-FIN-02`). |
| **`KI-07`** | Mitigated | `@sveltejs/adapter-vercel` calls `fs.symlinkSync()` for per-route Vercel observability aliases, which fails with `EPERM` on local Windows machines without Developer Mode enabled. | Wrapped `@sveltejs/adapter-vercel` (`runtime: 'nodejs22.x'`) in `vite.config.ts` to skip only the `win32` non-CI/non-Vercel `EPERM` symlink step after `.svelte-kit/output` builds; Vercel and Linux CI emit `.vercel/output` cleanly (`BL-23`). |
