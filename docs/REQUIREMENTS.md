# Requirements traceability matrix (REQUIREMENTS.md): Geary - Unofficial BulSU Student Information Portal

## 1. Document control and traceability protocol *(ISO/IEC/IEEE 29148 Clauses 6.5 and 9.6.4)*

### 1.1 Document metadata

| Attribute | Details |
| :--- | :--- |
| Document title | Requirements Traceability Matrix (RTM): Geary - Unofficial BulSU Student Information Portal |
| Version | `2.0 (SvelteKit SSR Migration Target)` |
| Date | `2026-11-24` |
| Standard reference | ISO/IEC/IEEE 29148:2018 - *Systems and software engineering - Life cycle processes - Requirements engineering* (Clause 6.5 *Requirements Traceability* and Clause 9.6.4 *Verification and Traceability*) |
| Related baselines | [PROJECT_CHARTER.md](./PROJECT_CHARTER.md), [PRD.md](./PRD.md), [SRS.md](./SRS.md), [USER_FLOWS.md](./USER_FLOWS.md), [ARCHITECTURE.md](./ARCHITECTURE.md), [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md), [TESTING.md](./TESTING.md), [ROADMAP.md](./ROADMAP.md) |
| Status | Active Governance Matrix (Verified SvelteKit SSR Baseline `M7`) |

### 1.2 Bidirectional traceability and PR status rules

This matrix is the shared traceability ledger for all contributors working on Geary features, fixes, and Academic Year content updates:

1. Forward traceability: Every business objective (`OBJ-*`), product requirement (`REQ-*`), software requirement (`SRS-*`), system constraint (`CON-*`), and error scenario (`ERR-*`) must map to source artifacts, a backlog item (`BL-*`), and at least one verification gate (`TC-*`).
2. Backward traceability (scope lock): Every component, route, or feature added in a pull request must trace back to an approved `REQ-*`, `SRS-*`, or `CON-*` identifier. Unlinked features such as AI/RAG chatbots, user accounts, comments, or database-backed write APIs are out of scope under `CON-GOV-01`.
3. Status values updated in PRs as work progresses:
   - `[ ] Pending` - Not yet implemented or verified on target baseline.
   - `[~] Implemented` - Code or content exists on a branch or workspace; awaiting full verification pass.
   - `[x] Verified` - Implemented and passing all linked `TC-*` checks.

## 2. Functional and product requirements traceability matrix (`RTM-01` to `RTM-21`) *(ISO 29148 Clauses 6.5 and 9.6.4)*

| RTM ID | Charter Obj | PRD Req and AC (Priority) | SRS Functional and Interface IDs | User Flows and Error IDs | Target Source and Design Artifacts | Backlog ID | Test Case IDs | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **RTM-01** | `OBJ-01`, `OBJ-05` | `REQ-ART-01` / `AC-ART-01` (`P0`) | `SRS-FUNC-CNT-01`, `SRS-FUNC-CNT-02`, `SW-INT-02` | `UJ-05`, `UC-05`, `EF-05A`-`B`, `ERR-09` | `src/lib/content-schema.ts`, `src/lib/server/content.ts`, `src/content/articles/*.md` | `BL-07`, `BL-09`, `BL-24` | `TC-BLD-01`, `TC-BLD-02` | `[x] Verified` |
| **RTM-02** | `OBJ-01`, `OBJ-02` | `REQ-ART-02` / `AC-ART-02` (`P0`) | `SRS-FUNC-CNT-03`, `SRS-FUNC-UI-04` | `UJ-03`, `UC-03`, `EF-03C`, `ERR-07` | `src/styles/global.css`, `src/lib/server/markdown.ts`, `ArticleLayout.svelte`, `DESIGN_SYSTEM.md` §5.7 | `BL-04`, `BL-09`, `BL-12`, `BL-25` | `TC-BLD-03`, `TC-E2E-04`, `TC-A11Y-02` | `[x] Verified` |
| **RTM-03** | `OBJ-02` | `REQ-ART-03` / `AC-ART-03` (`P0`) | `SRS-FUNC-RND-04`, `SRS-FUNC-UI-02` | `UJ-03`, `UC-03` | `ArticleLayout.svelte`, `Breadcrumbs.svelte`, `DESIGN_SYSTEM.md` §3, §5.5 | `BL-11`, `BL-12`, `BL-25` | `TC-BLD-03`, `TC-A11Y-02` | `[x] Verified` |
| **RTM-04** | `OBJ-02`, `OBJ-03` | `REQ-ART-04` / `AC-ART-04` (`P1`) | `SRS-FUNC-CNT-04`, `SRS-FUNC-RND-05`, `UI-INT-02` | `UJ-03`, `UC-03`, `AF-03A`, `EF-03A`, `ERR-05` | `TableOfContents.svelte`, `ArticleLayout.svelte`, `DESIGN_SYSTEM.md` §5.6 | `BL-11`, `BL-12`, `BL-25` | `TC-BLD-04`, `TC-E2E-03` | `[x] Verified` |
| **RTM-05** | `OBJ-02`, `OBJ-03` | `REQ-ART-05` / `AC-ART-05` (`P1`) | `SRS-FUNC-RND-06`, `SRS-FUNC-UI-03` | `UJ-03`, `UC-03`, `EF-03B`, `ERR-06` | `src/lib/articles.ts`, `ArticleLayout.svelte`, `ArticleCard.svelte`, `DESIGN_SYSTEM.md` §5.8 | `BL-08`, `BL-11`, `BL-12`, `BL-25` | `TC-BLD-03`, `TC-BLD-04`, `TC-E2E-04` | `[x] Verified` |
| **RTM-06** | `OBJ-01`, `OBJ-03` | `REQ-CAT-01` / `AC-CAT-01` (`P0`) | `SRS-FUNC-RND-02`, `SW-INT-01`, `UI-INT-01` | `UJ-02`, `UC-02` | `src/data/categories.ts`, `src/routes/categories/[slug]/+page.server.ts`, `+page.svelte` | `BL-06`, `BL-13`, `BL-25` | `TC-BLD-01`, `TC-BLD-03` | `[x] Verified` |
| **RTM-07** | `OBJ-01`, `OBJ-03` | `REQ-CAT-02` / `AC-CAT-02` (`P0`) | `SRS-FUNC-RND-01`, `UI-INT-01` | `UJ-02`, `UC-02`, `AF-02A` | `src/routes/articles/+page.svelte`, `CategoryCard.svelte`, `DESIGN_SYSTEM.md` §5.3 | `BL-08`, `BL-11`, `BL-13`, `BL-25` | `TC-BLD-03`, `TC-BLD-04`, `TC-E2E-04` | `[x] Verified` |
| **RTM-08** | `OBJ-01`, `OBJ-03` | `REQ-CAT-03` / `AC-CAT-03` (`P0`) | `SRS-FUNC-RND-03` | `UJ-02`, `UC-02`, `EF-02A`, `ERR-04` | `src/lib/articles.ts`, `src/routes/categories/[slug]/+page.svelte`, `ArticleCard.svelte` | `BL-08`, `BL-13`, `BL-25` | `TC-BLD-03`, `TC-UNIT-04` | `[x] Verified` |
| **RTM-09** | `OBJ-02`, `OBJ-03` | `REQ-CAT-04` / `AC-CAT-04` (`P1`) | `SRS-FUNC-UI-02` | `UJ-03`, `UJ-04`, `UC-03`, `AF-03B` | `Breadcrumbs.svelte`, `DESIGN_SYSTEM.md` §5.5 | `BL-11`, `BL-12`, `BL-13`, `BL-25` | `TC-BLD-04`, `TC-A11Y-02` | `[x] Verified` |
| **RTM-10** | `OBJ-03` | `REQ-CAT-05` / `AC-CAT-05` (`P1`) | `SRS-FUNC-RND-01` | `UC-02`, `AF-02B`, `EF-02B` | — | `BL-08`, `BL-09`, `BL-13`, `BL-26` | — | Retired from MVP |
| **RTM-11** | `OBJ-03`, `OBJ-05` | `REQ-SRCH-01` / `AC-SRCH-01` (`P0`) | `SRS-FUNC-SRCH-01`, `SW-INT-03`, `UI-INT-01` | `UJ-01`, `UJ-05`, `UC-01` | `src/lib/server/content.ts` (`buildSearchIndex`), `src/routes/search-index.json/+server.ts` | `BL-15`, `BL-24` | `TC-BLD-03`, `TC-UNIT-05` | `[x] Verified` |
| **RTM-12** | `OBJ-03` | `REQ-SRCH-02` / `AC-SRCH-02` (`P0`) | `SRS-FUNC-SRCH-02`, `SRS-FUNC-SRCH-06`, `COM-INT-01` | `UJ-01`, `UJ-04`, `UC-01`, `AF-01B` | `SearchBar.svelte`, `+page.svelte`, `Header.svelte`, `+error.svelte` | `BL-17`, `BL-26` | `TC-E2E-01` | `[x] Verified` |
| **RTM-13** | `OBJ-03` | `REQ-SRCH-03` / `AC-SRCH-03` (`P0`) | `SRS-FUNC-SRCH-03` | `UJ-01`, `UC-01`, `EF-01C`, `ERR-03` | `src/lib/search.ts`, `SearchBar.svelte`, `DESIGN_SYSTEM.md` §5.2 | `BL-16`, `BL-17`, `BL-26` | `TC-UNIT-01` to `TC-UNIT-03`, `TC-E2E-01` | `[x] Verified` |
| **RTM-14** | `OBJ-02`, `OBJ-03` | `REQ-SRCH-04` / `AC-SRCH-04` (`P1`) | `SRS-FUNC-SRCH-04` | `UC-01`, `AF-01A`, `AF-01C` | `SearchBar.svelte` (`enableGlobalShortcut`, `src/lib/search-shortcut.ts`) | `BL-17`, `BL-26` | `TC-E2E-01`, `TC-A11Y-02` | `[x] Verified` |
| **RTM-15** | `OBJ-03` | `REQ-SRCH-05` / `AC-SRCH-05` (`P1`) | `SRS-FUNC-SRCH-02`, `SRS-FUNC-SRCH-05` | `UC-01`, `EF-01A`, `EF-01B`, `ERR-01`, `ERR-02` | `SearchBar.svelte`, `DESIGN_SYSTEM.md` §5.2 | `BL-17`, `BL-26` | `TC-E2E-02` | `[x] Verified` |
| **RTM-16** | `OBJ-04` | `REQ-UI-01` / `AC-UI-01` (`P0`) | `UI-INT-03` | `UJ-02` | `src/styles/global.css`, `DESIGN_SYSTEM.md` §2 | `BL-04` | `TC-A11Y-01` | `[x] Verified` |
| **RTM-17** | `OBJ-02` | `REQ-UI-02` / `AC-UI-02` (`P0`) | `SRS-FUNC-UI-04`, `UI-INT-02`, `UI-INT-03` | `UJ-03`, `UC-03`, `EF-03C`, `ERR-07` | `src/styles/global.css`, `ArticleLayout.svelte`, `DESIGN_SYSTEM.md` §3-4 | `BL-04`, `BL-12`, `BL-25` | `TC-E2E-04`, `TC-A11Y-01` | `[x] Verified` |
| **RTM-18** | `OBJ-02`, `OBJ-04` | `REQ-UI-03` / `AC-UI-03` (`P0`) | `SRS-FUNC-UI-01`, `SRS-FUNC-UI-03` | `UJ-04`, `UC-02`, `AF-02C` | `src/routes/+layout.svelte`, `Header.svelte`, `Footer.svelte`, `DESIGN_SYSTEM.md` §5.1, §5.8 | `BL-10`, `BL-25` | `TC-BLD-04`, `TC-E2E-04`, `TC-A11Y-02` | `[x] Verified` |
| **RTM-19** | `OBJ-04` | `REQ-UI-04` / `AC-UI-04` (`P1`) | `UI-INT-03` | `UJ-02`, `UJ-03` | `static/favicon.svg`, `Header.svelte`, `+page.svelte`, `DESIGN_SYSTEM.md` §5.1, §6 | `BL-05`, `BL-10`, `BL-13`, `BL-25` | `TC-A11Y-01`, `TC-E2E-04` | `[x] Verified` |
| **RTM-20** | `OBJ-03`, `OBJ-04` | `REQ-UI-05` / `AC-UI-05` (`P1`) | `SRS-FUNC-RND-06`, `UI-INT-01` | `UC-04`, `ERR-08` | `src/routes/+error.svelte`, `SearchBar.svelte` | `BL-14`, `BL-17`, `BL-25` | `TC-BLD-03`, `TC-E2E-05`, `TC-A11Y-01` | `[x] Verified` |
| **RTM-21** | `OBJ-01`, `OBJ-03`, `OBJ-05` | `REQ-MAP-01` to `REQ-MAP-04` / `AC-MAP-01` to `AC-MAP-04` (`P0`) | `SW-INT-04`, `SRS-FUNC-MAP-01`, `SRS-FUNC-MAP-02`, `SRS-FUNC-UI-01` | `UC-06` | `src/data/campus-map.ts`, `src/lib/map-search.ts`, `CampusMap.svelte`, `src/routes/map/+page.svelte`, `Header.svelte` | `BL-21`, `BL-26` | `TC-BLD-03`, `TC-UNIT-06`, `TC-E2E-04`, `TC-E2E-07`, `TC-A11Y-01` | `[x] Verified` |

### 2.1 Post-MVP enhancement traceability

| RTM ID | Charter Obj | Requirement and Priority | Target Source and Design Artifacts | Backlog ID | Verification | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **RTM-22** | `OBJ-02`, `OBJ-04` | Dark mode design contract (`P1`, post-MVP) | `DESIGN_SYSTEM.md` §2.2; `ThemeToggle.svelte`, `src/app.html` bootstrap, tokenized surfaces and `CampusMap.svelte` | `BL-22`, `BL-25`, `BL-26` | `TC-E2E-08`, `TC-A11Y-03` | `[x] Verified` |
| **RTM-23** | `OBJ-01`, `OBJ-03` | Interactive Academic Calendar (`P1`, post-MVP) | `src/data/academic-calendar.ts`, `src/lib/calendar.ts`, `AcademicCalendar.svelte`, `src/routes/calendar/+page.svelte`, `DESIGN_SYSTEM.md` §5.10 | `BL-26` | `TC-UNIT-07`, `TC-E2E-04`, `TC-A11Y-01` | `[x] Verified` |
| **RTM-24** | `OBJ-03`, `OBJ-05` | `REQ-MCP-01` to `REQ-MCP-04` / `AC-MCP-01` to `AC-MCP-04` (`P1`, post-MVP) | `SW-INT-05`, `SW-INT-06`, `SRS-FUNC-MCP-01` to `SRS-FUNC-MCP-04`; `src/routes/corpus.json/+server.ts`, `mcp/worker.ts`, `mcp/corpus.ts` | `BL-28` | `TC-BLD-03`, `TC-UNIT-08` | `[x] Verified` |
| **RTM-25** | `OBJ-01`, `OBJ-03`, `OBJ-05` | `REQ-ASK-01` to `REQ-ASK-05` / `AC-ASK-01` to `AC-ASK-05` (`P0`/`P1`) | `CON-DATA-03`, `SW-INT-07`, `SW-INT-08`, `SRS-FUNC-ASK-01` to `SRS-FUNC-ASK-05`, `SRS-FUNC-UI-01` | `UJ-07`, `UC-07`, `EF-07A` to `EF-07D`, `ERR-10` to `ERR-12` | `src/lib/ask.ts`, `src/routes/ask-index.json/+server.ts`, `src/routes/ask/+page.svelte`, `src/lib/components/AskPanel.svelte`, `src/routes/api/ask/+server.ts`, `Header.svelte`, `DESIGN_SYSTEM.md` §5.11 | `BL-29` to `BL-33` | `TC-BLD-03`, `TC-UNIT-09`, `TC-E2E-09` | `[~] Implemented` |
| **RTM-26** | `OBJ-02`, `OBJ-03` | `REQ-WIZ-01` to `REQ-WIZ-05` / `AC-WIZ-01` to `AC-WIZ-05` (`P0`/`P1`, post-MVP) | `SW-INT-02`, `SW-INT-09`, `UI-INT-01`, `SRS-FUNC-WIZ-01` to `SRS-FUNC-WIZ-05`, `SRS-NFR-SEC-04`; `src/lib/content-schema.ts` (`wizard` schema), `src/lib/wizard.ts`, `ClearanceWizard.svelte`, `src/routes/wizard/+page.server.ts` + `+page.svelte`, `src/routes/categories/[slug]/+page.server.ts` + `+page.svelte`, `src/content/articles/*.md`, `DESIGN_SYSTEM.md` §5.12; `UJ-08`, `UC-08`, `AF-08A` to `AF-08C`, `EF-08A` to `EF-08B`, `ERR-09`, `ERR-13`, `MODE-06` | `BL-34` | `TC-UNIT-10`, `TC-E2E-10`, `TC-BLD-03` | `[x] Verified` |

## 3. Non-functional quality requirements traceability matrix (`RTM-NFR-01` to `RTM-NFR-17`) *(ISO 29148 Clause 9.6.3.3 and ISO 25010)*

| RTM NFR ID | Charter Obj | SRS NFR ID | ISO 25010 Quality Characteristic | Target Implementation / Artifact | Backlog ID | Test Case IDs | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **RTM-NFR-01** | `OBJ-05` | `SRS-NFR-PERF-01` | Performance Efficiency (*Time Behaviour*) | `vite.config.ts` (`@sveltejs/adapter-vercel`), `src/lib/server/cache.ts` (`s-maxage` + `stale-while-revalidate`) | `BL-23`, `BL-27` | `TC-BLD-03` | `[x] Verified` |
| **RTM-NFR-02** | `OBJ-02`, `OBJ-05` | `SRS-NFR-PERF-02` | Performance Efficiency (*Resource Utilization*) | Compiled Svelte 5 components with zero React runtime dependencies | `BL-23`, `BL-25`, `BL-26` | `TC-BLD-03`, `TC-E2E-01` | `[x] Verified` |
| **RTM-NFR-03** | `OBJ-03`, `OBJ-05` | `SRS-NFR-PERF-03` | Performance Efficiency (*Resource Utilization*) | `src/lib/server/content.ts` (`buildSearchIndex`), `src/routes/search-index.json/+server.ts` (`< 100 KB`) | `BL-24` | `TC-BLD-03`, `TC-UNIT-05` | `[x] Verified` |
| **RTM-NFR-04** | `OBJ-03` | `SRS-NFR-PERF-04` | Performance Efficiency (*Time Behaviour*) | `src/lib/search.ts` (`< 16 ms` on 200 items) | `BL-16` | `TC-UNIT-01` | `[x] Verified` |
| **RTM-NFR-05** | `OBJ-02`, `OBJ-04` | `SRS-NFR-USAB-01` | Usability (*Accessibility and Aesthetics*) | `src/styles/global.css` (`DESIGN_SYSTEM.md` §2 contrast pairs) | `BL-04` | `TC-A11Y-01` | `[x] Verified` |
| **RTM-NFR-06** | `OBJ-02` | `SRS-NFR-USAB-02` | Usability (*Accessibility*) | `+layout.svelte`, `ArticleLayout.svelte`, semantic landmarks and `<h1>` | `BL-25` | `TC-A11Y-01`, `TC-A11Y-02` | `[x] Verified` |
| **RTM-NFR-07** | `OBJ-02`, `OBJ-03` | `SRS-NFR-USAB-03` | Usability (*Operability and Accessibility*) | `:focus-visible` rules, ARIA roles in `Header.svelte` and `SearchBar.svelte` | `BL-25`, `BL-26` | `TC-E2E-01`, `TC-A11Y-01`, `TC-A11Y-02` | `[x] Verified` |
| **RTM-NFR-08** | `OBJ-02` | `SRS-NFR-USAB-04` | Usability (*Operability*) | Responsive grids (`DESIGN_SYSTEM.md` §4), `overflow-x-auto` tables | `BL-25`, `BL-26` | `TC-E2E-04` | `[x] Verified` |
| **RTM-NFR-09** | `OBJ-03` | `SRS-NFR-REL-01` | Reliability (*Fault Tolerance*) | `SearchBar.svelte` fetch catch and fallback category links | `BL-26` | `TC-E2E-02` | `[x] Verified` |
| **RTM-NFR-10** | `OBJ-01`, `OBJ-03` | `SRS-NFR-REL-02` | Reliability (*Availability*) | SvelteKit SSR routes, `Breadcrumbs.svelte`, `TableOfContents.svelte` | `BL-25` | `TC-BLD-04` | `[x] Verified` |
| **RTM-NFR-11** | `OBJ-01` | `SRS-NFR-MAINT-01` | Maintainability (*Modularity*) | `src/data/categories.ts` imported across Zod, routes, UI, and search | `BL-06`, `BL-24` | `TC-BLD-01`, `TC-UNIT-05` | `[x] Verified` |
| **RTM-NFR-12** | `OBJ-05` | `SRS-NFR-MAINT-02` | Portability (*Adaptability*) | Adapter isolated strictly to `vite.config.ts` with zero vendor APIs in app logic | `BL-23`, `BL-27` | `TC-BLD-03` | `[x] Verified` |
| **RTM-NFR-13** | `OBJ-03` | `SRS-NFR-SEC-01` | Security (*Integrity*) | Standard Svelte text interpolation inside `SearchBar.svelte` | `BL-26` | `TC-SEC-01`, `TC-UNIT-02` | `[x] Verified` |
| **RTM-NFR-14** | `OBJ-05` | `SRS-NFR-SEC-02` | Security (*Confidentiality and Integrity*) | Zero secrets or PII, dependency audit hygiene (`bun.lock`) | `BL-23`, `BL-27` | `TC-SEC-02` | `[x] Verified` |
| **RTM-NFR-15** | `OBJ-03`, `OBJ-05` | `SRS-NFR-PERF-05` | Performance Efficiency (*Resource Utilization*) | `src/routes/ask-index.json/+server.ts` (`< 400 KB`, lazy-loaded on `/ask` only) | `BL-30` | `TC-BLD-03` | `[~] Implemented` |
| **RTM-NFR-16** | `OBJ-03` | `SRS-NFR-REL-03`, `SRS-NFR-SEC-03` | Reliability (*Fault Tolerance*) and Security (*Confidentiality*) | `AskPanel.svelte` fetch/error fallbacks; stateless `src/routes/api/ask/+server.ts` (no storage, no cookies) | `BL-31`, `BL-32` | `TC-E2E-09` | `[~] Implemented` |
| **RTM-NFR-17** | `OBJ-03` | `SRS-NFR-SEC-04` | Security (*Confidentiality*) | `ClearanceWizard.svelte` + `src/lib/wizard.ts` (`localStorage`/hash only, zero transmission) | `BL-34` | `TC-UNIT-10`, `TC-E2E-10` | `[x] Verified` |

## 4. System constraints and off-nominal error traceability matrix *(ISO 29148 Clauses 9.3.5 and 9.6.2)*

### 4.1 System constraints (`CON-TECH-*`, `CON-FIN-*`, `CON-DATA-*`, `CON-GOV-*`)

| Constraint ID | Charter Ref | Architectural Enforcement Mechanism | Backlog ID | Verification Gate | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **`CON-TECH-01`** | §7.2 | `vite.config.ts` configured with `@sveltejs/adapter-vercel` SSR and CDN `Cache-Control` headers; single permitted additional runtime endpoint is `src/routes/api/ask/+server.ts`. | `BL-23`, `BL-25`, `BL-32` | `TC-BLD-03` | `[~] Implemented` |
| **`CON-TECH-02`** | §7.2 | Styling via `@tailwindcss/vite` and `src/styles/global.css`. | `BL-04`, `BL-23` | `TC-BLD-03`, `TC-A11Y-01` | `[x] Verified` |
| **`CON-TECH-03`** | §7.2 | Native Svelte 5 runes components (`SearchBar`, `ExploreSpotlight`, `AcademicCalendar`, `CampusMap`, `AskPanel`, `ClearanceWizard`) with zero React runtime dependencies. | `BL-23`, `BL-25`, `BL-26`, `BL-31`, `BL-34` | `TC-BLD-01`, `TC-E2E-01`, `TC-E2E-09`, `TC-E2E-10` | `[~] Implemented` |
| **`CON-TECH-04`** | §7.2 | `tsconfig.json` strict TS (`svelte-check`) and Zod validation in `src/lib/content-schema.ts`. | `BL-23`, `BL-24` | `TC-BLD-01`, `TC-BLD-02` | `[x] Verified` |
| **`CON-FIN-01`** | `OBJ-05`, §7.1 | Vercel free-tier SSR with edge caching (`$0.00/month`). | `BL-23`, `BL-27` | `TC-BLD-03` | `[x] Verified` |
| **`CON-FIN-02`** | `OBJ-05`, §7.1 | Zero managed databases, CMS subscriptions, or paid third-party APIs; sole permitted inference call is Workers AI via `/api/ask` within the included allocation. | `BL-23`, `BL-24`, `BL-32` | `TC-BLD-03` | `[~] Implemented` |
| **`CON-DATA-01`** | `OBJ-01` | UTF-8 Markdown articles managed under `src/content/articles/` in Git. | `BL-09`, `BL-24` | `TC-BLD-02` | `[x] Verified` |
| **`CON-DATA-02`** | `OBJ-03`, `OBJ-05` | Pure `buildSearchIndex()` served via edge-cached `src/routes/search-index.json/+server.ts`. | `BL-24` | `TC-BLD-03`, `TC-UNIT-05` | `[x] Verified` |
| **`CON-DATA-03`** | `OBJ-03` | Ask corpus emitted by `src/routes/ask-index.json/+server.ts`; no server-side vector store. | `BL-30` | `TC-BLD-03`, `TC-UNIT-09` | `[~] Implemented` |
| **`CON-GOV-01`** | §6.2, §7.3 | Strict feature lock covering the nine approved capabilities (no general-purpose AI chatbot, user accounts, comments, or SIS integrations; `/ask` Q&A is the approved citation-grounded exception). | `BL-01` to `BL-34` | Scope Audit (§5) | `[~] Implemented` |
| **`CON-GOV-02`** | §7.4 | Unofficial BulSU student information portal disclaimers in `ArticleLayout.svelte` and `Footer.svelte`. | `BL-25` | `TC-BLD-03`, `TC-A11Y-02` | `[x] Verified` |

### 4.2 Off-nominal and error scenarios (`ERR-01` to `ERR-13`)

| Error ID | Linked PRD / SRS IDs | Handling Component / Module | Backlog ID | Verification Gate | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **`ERR-01`** | `REQ-SRCH-05`, `SRS-FUNC-SRCH-05` | `src/lib/components/SearchBar.svelte` | `BL-26` | `TC-E2E-02` | `[x] Verified` |
| **`ERR-02`** | `SRS-FUNC-SRCH-02`, `SRS-NFR-REL-01` | `src/lib/components/SearchBar.svelte` | `BL-26` | `TC-E2E-02` | `[x] Verified` |
| **`ERR-03`** | `SRS-FUNC-SRCH-03`, `SRS-NFR-SEC-01` | `src/lib/search.ts`, `src/lib/components/SearchBar.svelte` | `BL-16`, `BL-26` | `TC-UNIT-02`, `TC-SEC-01` | `[x] Verified` |
| **`ERR-04`** | `SRS-FUNC-RND-02`, `SRS-FUNC-RND-03` | `src/routes/categories/[slug]/+page.svelte` | `BL-25` | `TC-BLD-03` | `[x] Verified` |
| **`ERR-05`** | `REQ-ART-04`, `SRS-FUNC-RND-05` | `src/lib/components/TableOfContents.svelte`, `ArticleLayout.svelte` | `BL-25` | `TC-E2E-03` | `[x] Verified` |
| **`ERR-06`** | `REQ-ART-05`, `SRS-FUNC-RND-06` | `src/lib/articles.ts`, `ArticleLayout.svelte` | `BL-08`, `BL-25` | `TC-BLD-03` | `[x] Verified` |
| **`ERR-07`** | `SRS-FUNC-UI-04`, `SRS-NFR-USAB-04` | `src/styles/global.css`, `ArticleLayout.svelte` | `BL-04`, `BL-25` | `TC-E2E-04` | `[x] Verified` |
| **`ERR-08`** | `REQ-UI-05`, `SRS-FUNC-RND-06` | `src/routes/+error.svelte` | `BL-25` | `TC-E2E-05`, `TC-A11Y-01` | `[x] Verified` |
| **`ERR-09`** | `REQ-ART-01`, `SRS-FUNC-CNT-01`, `SRS-FUNC-CNT-02` | `src/lib/content-schema.ts`, `src/lib/server/content.ts` | `BL-24` | `TC-BLD-02` | `[x] Verified` |
| **`ERR-10`** | `REQ-ASK-04`, `SRS-FUNC-ASK-05`, `SRS-NFR-REL-03` | `src/lib/components/AskPanel.svelte` | `BL-31` | `TC-E2E-09` | `[~] Implemented` |
| **`ERR-11`** | `REQ-ASK-04`, `SRS-FUNC-ASK-02`, `SRS-FUNC-ASK-05` | `src/lib/ask.ts`, `AskPanel.svelte` | `BL-30`, `BL-31` | `TC-UNIT-09`, `TC-E2E-09` | `[~] Implemented` |
| **`ERR-12`** | `REQ-ASK-04`, `SRS-FUNC-ASK-03`, `SRS-FUNC-ASK-05`, `SRS-NFR-REL-03` | `src/routes/api/ask/+server.ts`, `AskPanel.svelte` | `BL-32`, `BL-31` | `TC-E2E-09` | `[~] Implemented` |
| **`ERR-13`** | `REQ-WIZ-04`, `SRS-FUNC-WIZ-02` to `SRS-FUNC-WIZ-04` | `src/lib/wizard.ts`, `src/lib/components/ClearanceWizard.svelte` | `BL-34` | `TC-UNIT-10`, `TC-E2E-10` | `[x] Verified` |

## 5. Release and PR traceability audit checklist

Run this checklist before closing a milestone, cutting a release, or merging a PR that changes features or architecture:

1. Zero orphan requirements: Confirm every row in Sections 2, 3, and 4 is `[x] Verified` with passing `TC-*` runs.
2. Zero unapproved features (`CON-GOV-01`): Check `src/` and `package.json` to verify no feature ships without an approved `RTM-*` or `CON-*` row.
3. Design and accessibility checks: Confirm color tokens, `~65ch` prose constraints, and responsive grids match [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md) and pass `TC-A11Y-01`, `TC-A11Y-03`, and `TC-E2E-04`.
4. Article update checks: After adding or editing any `.md` article, run `bun run check`, `bun test`, and `bun run build` (also enforced in `.github/workflows/ci.yml`), plus `bun run test:e2e` for layout or route changes, so `RTM-01`, `RTM-11`, and `RTM-NFR-03` stay verified.
5. Documentation-first sync: Confirm any requirement edit in [PROJECT_CHARTER.md](./PROJECT_CHARTER.md), [PRD.md](./PRD.md), [SRS.md](./SRS.md), [USER_FLOWS.md](./USER_FLOWS.md), [ARCHITECTURE.md](./ARCHITECTURE.md), [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md), or [TESTING.md](./TESTING.md) is reflected here and in [ROADMAP.md](./ROADMAP.md) in the same PR.
