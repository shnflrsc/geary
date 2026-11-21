# Requirements Traceability Matrix (REQUIREMENTS.md): Geary — Unofficial BulSU Student Information Hub

---

## 1. Document Control & Life-Cycle Traceability Protocol *(ISO/IEC/IEEE 29148 Clauses 6.5 & 9.6.4)*

### 1.1 Document Metadata

| Attribute | Details |
| :--- | :--- |
| **Document Title** | Requirements Traceability Matrix (RTM): Geary — Unofficial BulSU Student Information Hub |
| **Version** | `1.0 (MVP Baseline)` |
| **Date** | `2026-11-17` |
| **Standard Reference** | ISO/IEC/IEEE 29148:2018 — *Systems and software engineering — Life cycle processes — Requirements engineering* (Clause 6.5 *Requirements Traceability* & Clause 9.6.4 *Verification & Traceability*) |
| **Related Baselines** | [PROJECT_CHARTER.md](./PROJECT_CHARTER.md), [PRD.md](./PRD.md), [SRS.md](./SRS.md), [USER_FLOWS.md](./USER_FLOWS.md), [ARCHITECTURE.md](./ARCHITECTURE.md), [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md), [TESTING.md](./TESTING.md), [ROADMAP.md](./ROADMAP.md) |
| **Status** | Active Governance Matrix (Verified MVP Baseline) |

### 1.2 Bidirectional Traceability & Status Protocol
This document serves as the single authoritative traceability ledger across Geary's build phase (`/goal`) and ongoing Academic Year maintenance:

1. **Forward Traceability:** Every business objective (`OBJ-*`), product requirement (`REQ-*`), software requirement (`SRS-*`), system constraint (`CON-*`), and off-nominal error (`ERR-*`) must trace to concrete source artifacts, a backlog item (`BL-*`), and at least one verification gate (`TC-*`).
2. **Backward Traceability (Scope-Lock Gate):** Every implemented file, component, or feature must trace back to an approved `REQ-*` / `SRS-*` / `CON-*` identifier. Unlinked features (such as AI/RAG chatbots, authentication, or backend APIs) are prohibited by `CON-GOV-01`.
3. **Live Status Tracking:**
   - `[ ] Pending` — Not yet implemented or verified.
   - `[~] Implemented` — Code/content written in workspace; awaiting full verification gate pass.
   - `[x] Verified` — Implemented and confirmed passing via all linked `TC-*` checks.

---

## 2. Functional & Product Requirements Traceability Matrix (`RTM-01` to `RTM-20`) *(ISO 29148 Clauses 6.5 & 9.6.4)*

| RTM ID | Charter Obj | PRD Req & AC (Priority) | SRS Functional & Interface IDs | User Flows & Error IDs | Target Source & Design Artifacts | Backlog ID | Test Case IDs | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **RTM-01** | `OBJ-01`, `OBJ-05` | `REQ-ART-01` / `AC-ART-01` (`P0`) | `SRS-FUNC-CNT-01`, `SRS-FUNC-CNT-02`, `SW-INT-02` | `UJ-05`, `UC-05`, `EF-05A`–`B`, `ERR-09` | `src/content.config.ts`, `src/content/articles/*.md` | `BL-07`, `BL-09` | `TC-BLD-01`, `TC-BLD-02` | `[x] Verified` |
| **RTM-02** | `OBJ-01`, `OBJ-02` | `REQ-ART-02` / `AC-ART-02` (`P0`) | `SRS-FUNC-CNT-03`, `SRS-FUNC-UI-04` | `UJ-03`, `UC-03`, `EF-03C`, `ERR-07` | `src/styles/global.css`, `ArticleLayout.astro`, `DESIGN_SYSTEM.md` §5.7 | `BL-04`, `BL-09`, `BL-12` | `TC-BLD-03`, `TC-E2E-04`, `TC-A11Y-02` | `[x] Verified` |
| **RTM-03** | `OBJ-02` | `REQ-ART-03` / `AC-ART-03` (`P0`) | `SRS-FUNC-RND-04`, `SRS-FUNC-UI-02` | `UJ-03`, `UC-03` | `ArticleLayout.astro`, `Breadcrumbs.astro`, `DESIGN_SYSTEM.md` §3, §5.5 | `BL-11`, `BL-12` | `TC-BLD-03`, `TC-A11Y-02` | `[x] Verified` |
| **RTM-04** | `OBJ-02`, `OBJ-03` | `REQ-ART-04` / `AC-ART-04` (`P1`) | `SRS-FUNC-CNT-04`, `SRS-FUNC-RND-05`, `UI-INT-02` | `UJ-03`, `UC-03`, `AF-03A`, `EF-03A`, `ERR-05` | `TableOfContents.astro`, `ArticleLayout.astro`, `DESIGN_SYSTEM.md` §5.6 | `BL-11`, `BL-12` | `TC-BLD-04`, `TC-E2E-03` | `[x] Verified` |
| **RTM-05** | `OBJ-02`, `OBJ-03` | `REQ-ART-05` / `AC-ART-05` (`P1`) | `SRS-FUNC-RND-06`, `SRS-FUNC-UI-03` | `UJ-03`, `UC-03`, `EF-03B`, `ERR-06` | `src/lib/articles.ts`, `VerificationBanner.astro`, `ArticleCard.astro`, `DESIGN_SYSTEM.md` §5.8 | `BL-08`, `BL-11`, `BL-12` | `TC-BLD-03`, `TC-BLD-04`, `TC-E2E-04` | `[x] Verified` |
| **RTM-06** | `OBJ-01`, `OBJ-03` | `REQ-CAT-01` / `AC-CAT-01` (`P0`) | `SRS-FUNC-RND-02`, `SW-INT-01`, `UI-INT-01` | `UJ-02`, `UC-02` | `src/data/categories.ts`, `src/pages/categories/[slug].astro` | `BL-06`, `BL-13` | `TC-BLD-01`, `TC-BLD-03` | `[x] Verified` |
| **RTM-07** | `OBJ-01`, `OBJ-03` | `REQ-CAT-02` / `AC-CAT-02` (`P0`) | `SRS-FUNC-RND-01`, `UI-INT-01` | `UJ-02`, `UC-02`, `AF-02A` | `src/pages/index.astro`, `CategoryCard.astro`, `DESIGN_SYSTEM.md` §5.3 | `BL-08`, `BL-11`, `BL-13` | `TC-BLD-03`, `TC-BLD-04`, `TC-E2E-04` | `[x] Verified` |
| **RTM-08** | `OBJ-01`, `OBJ-03` | `REQ-CAT-03` / `AC-CAT-03` (`P0`) | `SRS-FUNC-RND-03` | `UJ-02`, `UC-02`, `EF-02A`, `ERR-04` | `src/lib/articles.ts`, `src/pages/categories/[slug].astro`, `ArticleCard.astro` | `BL-08`, `BL-13` | `TC-BLD-03`, `TC-UNIT-04` | `[x] Verified` |
| **RTM-09** | `OBJ-02`, `OBJ-03` | `REQ-CAT-04` / `AC-CAT-04` (`P1`) | `SRS-FUNC-UI-02` | `UJ-03`, `UJ-04`, `UC-03`, `AF-03B` | `Breadcrumbs.astro`, `DESIGN_SYSTEM.md` §5.5 | `BL-11`, `BL-12`, `BL-13` | `TC-BLD-04`, `TC-A11Y-02` | `[x] Verified` |
| **RTM-10** | `OBJ-03` | `REQ-CAT-05` / `AC-CAT-05` (`P1`) | `SRS-FUNC-RND-01` | `UC-02`, `AF-02B`, `EF-02B` | `src/pages/index.astro`, `src/lib/articles.ts`, `ArticleCard.astro` | `BL-08`, `BL-09`, `BL-13` | `TC-BLD-03`, `TC-BLD-04` | `[x] Verified` |
| **RTM-11** | `OBJ-03`, `OBJ-05` | `REQ-SRCH-01` / `AC-SRCH-01` (`P0`) | `SRS-FUNC-SRCH-01`, `SW-INT-03`, `UI-INT-01` | `UJ-01`, `UJ-05`, `UC-01` | `src/pages/search-index.json.ts` | `BL-15` | `TC-BLD-03`, `TC-UNIT-05` | `[x] Verified` |
| **RTM-12** | `OBJ-03` | `REQ-SRCH-02` / `AC-SRCH-02` (`P0`) | `SRS-FUNC-SRCH-02`, `SRS-FUNC-SRCH-06`, `COM-INT-01` | `UJ-01`, `UJ-04`, `UC-01`, `AF-01B` | `SearchBar.tsx`, `index.astro`, `Header.astro`, `404.astro` | `BL-17` | `TC-E2E-01` | `[x] Verified` |
| **RTM-13** | `OBJ-03` | `REQ-SRCH-03` / `AC-SRCH-03` (`P0`) | `SRS-FUNC-SRCH-03` | `UJ-01`, `UC-01`, `EF-01C`, `ERR-03` | `src/lib/search.ts`, `SearchBar.tsx`, `DESIGN_SYSTEM.md` §5.2 | `BL-16`, `BL-17` | `TC-UNIT-01`–`03`, `TC-E2E-01` | `[x] Verified` |
| **RTM-14** | `OBJ-02`, `OBJ-03` | `REQ-SRCH-04` / `AC-SRCH-04` (`P1`) | `SRS-FUNC-SRCH-04` | `UC-01`, `AF-01A`, `AF-01C` | `SearchBar.tsx` (`enableGlobalShortcut`, key handlers) | `BL-17` | `TC-E2E-01`, `TC-A11Y-02` | `[x] Verified` |
| **RTM-15** | `OBJ-03` | `REQ-SRCH-05` / `AC-SRCH-05` (`P1`) | `SRS-FUNC-SRCH-02`, `SRS-FUNC-SRCH-05` | `UC-01`, `EF-01A`, `EF-01B`, `ERR-01`, `ERR-02` | `SearchBar.tsx`, `DESIGN_SYSTEM.md` §5.2 | `BL-17` | `TC-E2E-02` | `[x] Verified` |
| **RTM-16** | `OBJ-04` | `REQ-UI-01` / `AC-UI-01` (`P0`) | `UI-INT-03` | `UJ-02` | `src/styles/global.css`, `DESIGN_SYSTEM.md` §2 | `BL-04` | `TC-A11Y-01` | `[x] Verified` |
| **RTM-17** | `OBJ-02` | `REQ-UI-02` / `AC-UI-02` (`P0`) | `SRS-FUNC-UI-04`, `UI-INT-02`, `UI-INT-03` | `UJ-03`, `UC-03`, `EF-03C`, `ERR-07` | `src/styles/global.css`, `ArticleLayout.astro`, `DESIGN_SYSTEM.md` §3–4 | `BL-04`, `BL-12` | `TC-E2E-04`, `TC-A11Y-01` | `[x] Verified` |
| **RTM-18** | `OBJ-02`, `OBJ-04` | `REQ-UI-03` / `AC-UI-03` (`P0`) | `SRS-FUNC-UI-01`, `SRS-FUNC-UI-03` | `UJ-04`, `UC-02`, `AF-02C` | `BaseLayout.astro`, `Header.astro`, `Footer.astro`, `DESIGN_SYSTEM.md` §5.1, §5.8 | `BL-10` | `TC-BLD-04`, `TC-E2E-04`, `TC-A11Y-02` | `[x] Verified` |
| **RTM-19** | `OBJ-04` | `REQ-UI-04` / `AC-UI-04` (`P1`) | `UI-INT-03` | `UJ-02`, `UJ-03` | `public/favicon.svg`, `Header.astro`, `index.astro`, `DESIGN_SYSTEM.md` §5.1, §6 | `BL-05`, `BL-10`, `BL-13` | `TC-A11Y-01`, `TC-E2E-04` | `[x] Verified` |
| **RTM-20** | `OBJ-03`, `OBJ-04` | `REQ-UI-05` / `AC-UI-05` (`P1`) | `SRS-FUNC-RND-06`, `UI-INT-01` | `UC-04`, `ERR-08` | `src/pages/404.astro`, `SearchBar.tsx` | `BL-14`, `BL-17` | `TC-BLD-03`, `TC-E2E-05`, `TC-A11Y-01` | `[x] Verified` |
| **RTM-21** | `OBJ-01`, `OBJ-03`, `OBJ-05` | `REQ-MAP-01`–`04` / `AC-MAP-01`–`04` (`P0`) | `SW-INT-04`, `SRS-FUNC-MAP-01`, `SRS-FUNC-MAP-02`, `SRS-FUNC-UI-01` | `UC-06` | `src/data/campus-map.ts`, `src/lib/map-search.ts`, `CampusMap.tsx`, `src/pages/map.astro`, `Header.astro` | `BL-21` | `TC-BLD-03`, `TC-UNIT-06`, `TC-E2E-04`, `TC-E2E-07`, `TC-A11Y-01` | `[x] Verified` |

### 2.1 Planned Post-MVP Enhancement Traceability

| RTM ID | Charter Obj | Requirement & Priority | Target Source & Design Artifacts | Backlog ID | Planned Verification | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **RTM-22** | `OBJ-02`, `OBJ-04` | Dark Mode design contract (`P1`, post-MVP) | `DESIGN_SYSTEM.md` §2.2; `ThemeToggle.astro`, `BaseLayout.astro` bootstrap, tokenized surfaces & `CampusMap.tsx` | `BL-22` | `TC-E2E-08`, `TC-A11Y-03` | `[x] Verified` |

---

## 3. Non-Functional Quality Requirements Traceability Matrix (`RTM-NFR-01` to `RTM-NFR-14`) *(ISO 29148 Clause 9.6.3.3 & ISO 25010)*

| RTM NFR ID | Charter Obj | SRS NFR ID | ISO 25010 Quality Characteristic | Target Implementation / Artifact | Backlog ID | Test Case IDs | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **RTM-NFR-01** | `OBJ-05` | `SRS-NFR-PERF-01` | Performance Efficiency (*Time Behaviour*) | `astro.config.mjs` (`output: 'static'`) | `BL-02`, `BL-20` | `TC-BLD-03` | `[x] Verified` |
| **RTM-NFR-02** | `OBJ-02`, `OBJ-05` | `SRS-NFR-PERF-02` | Performance Efficiency (*Resource Utilization*) | Static `.astro` layouts/components; React strictly on `SearchBar.tsx` | `BL-10`–`BL-13`, `BL-17` | `TC-BLD-03`, `TC-E2E-01` | `[x] Verified` |
| **RTM-NFR-03** | `OBJ-03`, `OBJ-05` | `SRS-NFR-PERF-03` | Performance Efficiency (*Resource Utilization*) | `src/pages/search-index.json.ts` (`< 100 KB`) | `BL-15` | `TC-BLD-03` | `[x] Verified` |
| **RTM-NFR-04** | `OBJ-03` | `SRS-NFR-PERF-04` | Performance Efficiency (*Time Behaviour*) | `src/lib/search.ts` (`< 16 ms` on 200 items) | `BL-16` | `TC-UNIT-01` | `[x] Verified` |
| **RTM-NFR-05** | `OBJ-02`, `OBJ-04` | `SRS-NFR-USAB-01` | Usability (*Accessibility & Aesthetics*) | `src/styles/global.css` (`DESIGN_SYSTEM.md` §2 contrast pairs) | `BL-04` | `TC-A11Y-01` | `[x] Verified` |
| **RTM-NFR-06** | `OBJ-02` | `SRS-NFR-USAB-02` | Usability (*Accessibility*) | `BaseLayout.astro`, `ArticleLayout.astro`, semantic landmarks & `<h1>` | `BL-10`, `BL-12`, `BL-13` | `TC-A11Y-01`, `TC-A11Y-02` | `[x] Verified` |
| **RTM-NFR-07** | `OBJ-02`, `OBJ-03` | `SRS-NFR-USAB-03` | Usability (*Operability & Accessibility*) | `:focus-visible` rules, ARIA roles in `Header.astro` & `SearchBar.tsx` | `BL-04`, `BL-10`, `BL-17` | `TC-E2E-01`, `TC-A11Y-01`, `TC-A11Y-02` | `[x] Verified` |
| **RTM-NFR-08** | `OBJ-02` | `SRS-NFR-USAB-04` | Usability (*Operability*) | Responsive grids (`DESIGN_SYSTEM.md` §4), `overflow-x-auto` tables | `BL-04`, `BL-10`–`BL-14` | `TC-E2E-04` | `[x] Verified` |
| **RTM-NFR-09** | `OBJ-03` | `SRS-NFR-REL-01` | Reliability (*Fault Tolerance*) | `SearchBar.tsx` fetch catch & fallback category links | `BL-17` | `TC-E2E-02` | `[x] Verified` |
| **RTM-NFR-10** | `OBJ-01`, `OBJ-03` | `SRS-NFR-REL-02` | Reliability (*Availability*) | `astro build` static routes, `Breadcrumbs.astro`, `TableOfContents.astro` | `BL-11`–`BL-15` | `TC-BLD-04` | `[x] Verified` |
| **RTM-NFR-11** | `OBJ-01` | `SRS-NFR-MAINT-01` | Maintainability (*Modularity*) | `src/data/categories.ts` imported across Zod, routes, UI & search | `BL-06`–`BL-07`, `BL-15` | `TC-BLD-01`, `TC-UNIT-05` | `[x] Verified` |
| **RTM-NFR-12** | `OBJ-05` | `SRS-NFR-MAINT-02` | Portability (*Adaptability*) | Pure static `dist/` output without vendor-locked runtime adapters | `BL-02`, `BL-20` | `TC-BLD-03` | `[x] Verified` |
| **RTM-NFR-13** | `OBJ-03` | `SRS-NFR-SEC-01` | Security (*Integrity*) | Standard JSX text rendering inside `SearchBar.tsx` | `BL-17` | `TC-SEC-01`, `TC-UNIT-02` | `[x] Verified` |
| **RTM-NFR-14** | `OBJ-05` | `SRS-NFR-SEC-02` | Security (*Confidentiality & Integrity*) | Zero secrets/PII, dependency audit hygiene (`bun.lock`) | `BL-01`, `BL-20` | `TC-SEC-02` | `[x] Verified` |

---

## 4. System Constraints & Off-Nominal Error Traceability Matrix *(ISO 29148 Clauses 9.3.5 & 9.6.2)*

### 4.1 System Constraints (`CON-TECH-*`, `CON-FIN-*`, `CON-DATA-*`, `CON-GOV-*`)

| Constraint ID | Charter Ref | Architectural Enforcement Mechanism | Backlog ID | Verification Gate | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **`CON-TECH-01`** | §7.2 | `astro.config.mjs` configured for static SSG (`output: 'static'`, zero SSR adapters). | `BL-02` | `TC-BLD-03` | `[x] Verified` |
| **`CON-TECH-02`** | §7.2 | Styling via `@tailwindcss/vite` and `src/styles/global.css`. | `BL-01`, `BL-02`, `BL-04` | `TC-BLD-03`, `TC-A11Y-01` | `[x] Verified` |
| **`CON-TECH-03`** | §7.2 | `@astrojs/react` hydrated strictly via `client:load` on `<SearchBar />` only. | `BL-02`, `BL-17` | `TC-BLD-01`, `TC-E2E-01` | `[x] Verified` |
| **`CON-TECH-04`** | §7.2 | `tsconfig.json` strict TS + `astro/zod` frontmatter validation in `src/content.config.ts`. | `BL-06`, `BL-07` | `TC-BLD-01`, `TC-BLD-02` | `[x] Verified` |
| **`CON-FIN-01`** | `OBJ-05`, §7.1 | 100% static `dist/` compatible with free-tier CDN hosting (`$0.00/month`). | `BL-02`, `BL-20` | `TC-BLD-03` | `[x] Verified` |
| **`CON-FIN-02`** | `OBJ-05`, §7.1 | Zero runtime servers, managed databases, CMS subscriptions, or paid APIs. | `BL-02`, `BL-15` | `TC-BLD-03` | `[x] Verified` |
| **`CON-DATA-01`** | `OBJ-01` | UTF-8 Markdown guides managed under `src/content/articles/` in Git. | `BL-07`, `BL-09` | `TC-BLD-02` | `[x] Verified` |
| **`CON-DATA-02`** | `OBJ-03`, `OBJ-05` | Build-time static JSON index emitted at `dist/search-index.json`. | `BL-15` | `TC-BLD-03`, `TC-UNIT-05` | `[x] Verified` |
| **`CON-GOV-01`** | §6.2, §7.3 | Strict MVP feature lock (zero AI/RAG chatbot, user accounts, comments, or SIS integrations). | `BL-01`–`BL-20` | Scope Audit (§5) | `[x] Verified` |
| **`CON-GOV-02`** | §7.4 | Unofficial BulSU student hub disclaimers in `VerificationBanner.astro` and `Footer.astro`. | `BL-10`, `BL-11` | `TC-BLD-03`, `TC-A11Y-02` | `[x] Verified` |

### 4.2 Off-Nominal & Error Scenarios (`ERR-01` to `ERR-09`)

| Error ID | Linked PRD / SRS IDs | Handling Component / Module | Backlog ID | Verification Gate | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **`ERR-01`** | `REQ-SRCH-05`, `SRS-FUNC-SRCH-05` | `src/components/SearchBar.tsx` | `BL-17` | `TC-E2E-02` | `[x] Verified` |
| **`ERR-02`** | `SRS-FUNC-SRCH-02`, `SRS-NFR-REL-01` | `src/components/SearchBar.tsx` | `BL-17` | `TC-E2E-02` | `[x] Verified` |
| **`ERR-03`** | `SRS-FUNC-SRCH-03`, `SRS-NFR-SEC-01` | `src/lib/search.ts`, `src/components/SearchBar.tsx` | `BL-16`, `BL-17` | `TC-UNIT-02`, `TC-SEC-01` | `[x] Verified` |
| **`ERR-04`** | `SRS-FUNC-RND-02`, `SRS-FUNC-RND-03` | `src/pages/categories/[slug].astro` | `BL-13` | `TC-BLD-03` | `[x] Verified` |
| **`ERR-05`** | `REQ-ART-04`, `SRS-FUNC-RND-05` | `src/components/TableOfContents.astro`, `ArticleLayout.astro` | `BL-11`, `BL-12` | `TC-E2E-03` | `[x] Verified` |
| **`ERR-06`** | `REQ-ART-05`, `SRS-FUNC-RND-06` | `src/lib/articles.ts`, `ArticleLayout.astro` | `BL-08`, `BL-12` | `TC-BLD-03` | `[x] Verified` |
| **`ERR-07`** | `SRS-FUNC-UI-04`, `SRS-NFR-USAB-04` | `src/styles/global.css`, `ArticleLayout.astro` | `BL-04`, `BL-12` | `TC-E2E-04` | `[x] Verified` |
| **`ERR-08`** | `REQ-UI-05`, `SRS-FUNC-RND-06` | `src/pages/404.astro` | `BL-14` | `TC-E2E-05`, `TC-A11Y-01` | `[x] Verified` |
| **`ERR-09`** | `REQ-ART-01`, `SRS-FUNC-CNT-01`, `SRS-FUNC-CNT-02` | `src/content.config.ts` | `BL-07` | `TC-BLD-02` | `[x] Verified` |

---

## 5. Lifetime Traceability Audit Checklist

Run this audit at the completion of Milestone `M5` (and after every post-MVP content or feature update):

1. **Zero Orphan Requirements:** Verify every row across Sections 2, 3, and 4 shows `[x] Verified` with passing `TC-*` runs.
2. **Zero Unapproved Features (`CON-GOV-01`):** Inspect `src/` and `package.json` to confirm no code exists outside an approved `RTM-*` / `CON-*` row.
3. **Design & Accessibility Integrity:** Confirm all color tokens, `~65ch` prose constraints, and responsive grids trace cleanly to [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md) and pass `TC-A11Y-01` and `TC-E2E-04`.
4. **Content Update Check:** After adding or modifying any `.md` guide per Academic Year, re-run `bun run check`, `bun test`, `bun run build`, and `bun run test:e2e` to keep `RTM-01`, `RTM-11`, and `RTM-NFR-03` verified.
5. **Documentation-First Sync:** Confirm any modified requirement in `PROJECT_CHARTER.md`, `PRD.md`, `SRS.md`, `USER_FLOWS.md`, `ARCHITECTURE.md`, `DESIGN_SYSTEM.md`, or `TESTING.md` is reflected here and in [ROADMAP.md](./ROADMAP.md).
