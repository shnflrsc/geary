# Verification & Testing Specification (TESTING.md): Geary — Unofficial BulSU Student Information Hub

---

## 1. Document Control & Verification Philosophy *(ISO 29148 Clause 6.6)*

### 1.1 Document Metadata

| Attribute | Details |
| :--- | :--- |
| **Document Title** | Verification & Testing Specification (TESTING.md): Geary — Unofficial BulSU Student Information Hub |
| **Version** | `1.0 (MVP Baseline)` |
| **Date** | `2026-11-17` |
| **Standard Reference** | ISO/IEC 25010:2011/2023 (*Systems and software Quality Requirements and Evaluation [SQuaRE]*) & ISO/IEC/IEEE 29148:2018 Clauses 6.6 & 9.6.4 (*Verification, Validation & Traceability*) |
| **Related Baseline Documents** | [PROJECT_CHARTER.md](./PROJECT_CHARTER.md), [PRD.md](./PRD.md), [SRS.md](./SRS.md), [USER_FLOWS.md](./USER_FLOWS.md), [ARCHITECTURE.md](./ARCHITECTURE.md), [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md), [REQUIREMENTS.md](./REQUIREMENTS.md) |
| **Status** | Approved Verification Baseline |

### 1.2 Applicable Verification Layers (Static Architecture Focus)
Verification focuses strictly on the four high-value testing layers applicable to Geary's static `Astro SSG + Tailwind CSS + isolated <SearchBar /> React island` architecture:

| Layer | Tooling | Scope & Purpose |
| :--- | :--- | :--- |
| **Layer 1: Build & Schema Integrity Gate** | `astro check` + `astro build` + Zod | Enforces TypeScript safety, Markdown frontmatter schema compliance, 7-category static route generation, and `/search-index.json` size/validity. |
| **Layer 2: Focused Unit Tests** | `Bun Test` (`bun test` / Vitest-compatible) | Tests pure TypeScript logic only: search query normalization, weighted scoring, literal special-character handling, subcategory grouping, and `/search-index.json` contract. |
| **Layer 3: Lean E2E Smoke & Responsive Layout** | `Playwright` | Verifies real-browser behaviors: `<SearchBar />` React island hydration, keyboard shortcuts, zero-match/offline fallbacks, desktop vs. mobile TOC, `375px` overflow checks, and `404` recovery. |
| **Layer 4: Accessibility & Minimal Static Security** | `@axe-core/playwright` + `bun audit` | Verifies WCAG 2.1 Level AA contrast/landmarks, XSS escaping in search queries, and dependency hygiene. |

---

## 2. ISO/IEC 25010 Quality Model Mapping

Maps the applicable **ISO/IEC 25010** product quality characteristics and sub-characteristics to Geary's verification layers:

| ISO/IEC 25010 Characteristic | Sub-Characteristics | Application to Geary MVP | Primary Verification Layer & Test IDs |
| :--- | :--- | :--- | :--- |
| **Functional Suitability** | Functional Completeness, Functional Correctness | Validated Markdown ingestion, 7-category grouping, weighted search ranking, conditional TOC, campus map, and `404` recovery. | Layer 1 (`TC-BLD-02`, `TC-BLD-03`), Layer 2 (`TC-UNIT-01`, `TC-UNIT-04`–`06`), Layer 3 (`TC-E2E-01`, `TC-E2E-03`, `TC-E2E-05`, `TC-E2E-07`) |
| **Performance Efficiency** | Time Behaviour, Resource Utilization | 100% static HTML output, `< 100 KB` `/search-index.json` payload, and `< 16 ms` synchronous client filtering. | Layer 1 (`TC-BLD-03`), Layer 2 (`TC-UNIT-01`) |
| **Usability / Interaction Capability** | Appropriateness Recognizability, Operability, Accessibility | Low-cognitive-load layout, `~65ch` prose, keyboard-only search (`/` / `Ctrl+K`), WCAG 2.1 AA contrast, and zero `375px` horizontal scroll. | Layer 3 (`TC-E2E-01`, `TC-E2E-03`, `TC-E2E-04`), Layer 4 (`TC-A11Y-01`, `TC-A11Y-02`) |
| **Reliability** | Fault Tolerance, Availability | Non-crashing UI when search yields 0 matches or `/search-index.json` fails over mobile data; zero broken internal links. | Layer 1 (`TC-BLD-04`), Layer 3 (`TC-E2E-02`, `TC-E2E-05`) |
| **Security** | Integrity (XSS Resistance) | React JSX escaping prevents DOM XSS from search inputs; zero high/critical production dependency flaws. | Layer 2 (`TC-UNIT-02`), Layer 4 (`TC-SEC-01`, `TC-SEC-02`) |
| **Maintainability & Portability** | Analysability, Modularity, Adaptability | Single-source `categories.ts` enum enforced across Zod/UI/search; host-agnostic static `dist/` output. | Layer 1 (`TC-BLD-01`, `TC-BLD-02`, `TC-BLD-03`) |

---

## 3. Detailed Test Suites & Test Case Specifications (`TC-*`)

---

### 3.1 Layer 1: Build-Time, Schema & Static Artifact Gate

#### `TC-BLD-01`: TypeScript & Astro Component Typecheck
- **ISO 25010 Characteristic:** Maintainability (*Analysability, Modularity*)
- **Linked Requirements:** `CON-TECH-04`, `SRS-NFR-MAINT-01`
- **Preconditions / Inputs:** Complete source tree (`src/`, `tsconfig.json`, `astro.config.mjs`).
- **Verification Procedure:** Run `bun run check` (`astro check`).
- **Pass/Fail Acceptance Criteria:** Command exits with code `0` and reports `0` TypeScript/Astro template errors across layouts, components, pages, and `SearchBar.tsx`.

#### `TC-BLD-02`: Zod Frontmatter Schema Enforcement (Positive & Negative)
- **ISO 25010 Characteristic:** Functional Suitability (*Functional Correctness*)
- **Linked Requirements:** `REQ-ART-01`, `AC-ART-01`, `CON-TECH-04`, `SRS-FUNC-CNT-01`, `SRS-FUNC-CNT-02`, `ERR-09`
- **Preconditions / Inputs:** Valid `.md` articles in `src/content/articles/` plus a temporary negative test fixture (missing `title` or invalid `category: "unknown"`).
- **Verification Procedure:**
  1. Run `bun run build` (`astro build`) against repository articles.
  2. Temporarily test an invalid frontmatter fixture in local/CI validation and run `astro build`.
- **Pass/Fail Acceptance Criteria:**
  - Valid collection builds with exit code `0`.
  - Invalid frontmatter causes `astro build` to fail fast (non-zero exit code) with an explicit Zod validation error identifying the invalid file and field.

#### `TC-BLD-03`: Static Route & Search Index Artifact Verification
- **ISO 25010 Characteristic:** Functional Suitability (*Completeness*) & Performance Efficiency (*Resource Utilization*)
- **Linked Requirements:** `REQ-CAT-01`, `REQ-SRCH-01`, `CON-TECH-01`, `SRS-FUNC-RND-01`–`04`, `SRS-FUNC-SRCH-01`, `SRS-NFR-PERF-01`, `SRS-NFR-PERF-03`
- **Preconditions / Inputs:** Successful execution of `bun run build`.
- **Verification Procedure:** Inspect generated `dist/` output files and byte size of `dist/search-index.json`.
- **Pass/Fail Acceptance Criteria:**
  - `dist/index.html`, `dist/map/index.html`, `dist/contribute/index.html`, `dist/terms/index.html`, `dist/privacy/index.html`, `dist/404.html`, all `dist/categories/<slug>/index.html` routes, and all `dist/articles/<slug>/index.html` routes exist.
  - `dist/search-index.json` is valid JSON, size is `< 100 KB`, and item count matches the published article collection count.

#### `TC-BLD-04`: Internal Link & Anchor Integrity
- **ISO 25010 Characteristic:** Reliability (*Availability*)
- **Linked Requirements:** `SRS-NFR-REL-02`, `REQ-CAT-04`
- **Preconditions / Inputs:** Built static output in `dist/`.
- **Verification Procedure:** Verify via automated link-check script or Playwright crawl across `/`, category pages, and article pages that every internal `<a href="/...">` and TOC anchor `#...` resolves to an existing route or DOM element ID.
- **Pass/Fail Acceptance Criteria:** `0` broken internal routes (`404` responses on internal links) and `0` orphaned TOC heading anchors.

---

### 3.2 Layer 2: Unit Test Suite — Pure Logic & Contract (`Bun Test`)

#### `TC-UNIT-01`: Multi-Term Query Normalization & Weighted Relevance Scoring
- **ISO 25010 Characteristic:** Functional Suitability (*Functional Correctness*) & Performance Efficiency (*Time Behaviour*)
- **Linked Requirements:** `REQ-SRCH-03`, `SRS-FUNC-SRCH-03`, `SRS-NFR-PERF-04`, `UC-01`
- **Preconditions / Inputs:** Pure search helper (e.g., `filterAndRankArticles(items, query)`) and a fixture corpus of `SearchIndexItem[]`.
- **Verification Procedure:** Execute unit assertions comparing multi-word queries (`"latin honors"`, `"  TOR  "`, `"inc completion"`), verifying that title matches outrank heading/subcategory matches, which outrank body preview matches, and capped output length `<= 8`. Measure execution time against `200` synthetic items.
- **Pass/Fail Acceptance Criteria:** Ranking order strictly reflects field weights (`title > headings/subcategory > preview/categoryLabel`), result list never exceeds `8` items, and execution takes `< 16 ms`.

#### `TC-UNIT-02`: Literal Substring Safety for Regex & Special Characters
- **ISO 25010 Characteristic:** Reliability (*Fault Tolerance*) & Security (*Integrity*)
- **Linked Requirements:** `SRS-FUNC-SRCH-03`, `ERR-03`, `EF-01C`
- **Preconditions / Inputs:** Queries containing regex metacharacters (`"[INC] (2026)*?\\+"`, `"GWA > 1.75"`).
- **Verification Procedure:** Pass special-character strings directly to the search scoring helper.
- **Pass/Fail Acceptance Criteria:** Zero thrown `SyntaxError` exceptions; special characters match literally when present in indexed text or safely return `[]`.

#### `TC-UNIT-03`: Whitespace-Only & Empty Query Handling
- **ISO 25010 Characteristic:** Functional Suitability (*Correctness*)
- **Linked Requirements:** `SRS-FUNC-SRCH-03`, `EF-01C`
- **Preconditions / Inputs:** Queries `""`, `"   "`, `"\t\n"`.
- **Verification Procedure:** Invoke search scoring helper with empty/whitespace inputs.
- **Pass/Fail Acceptance Criteria:** Returns `[]` cleanly without matching all articles.

#### `TC-UNIT-04`: Subcategory Grouping & Deterministic Sorting Helper
- **ISO 25010 Characteristic:** Functional Suitability (*Correctness*)
- **Linked Requirements:** `REQ-CAT-03`, `AC-CAT-03`, `SRS-FUNC-RND-03`, `UC-02`
- **Preconditions / Inputs:** Unsorted mock article array spanning multiple `subcategory` strings (and an empty array `[]` edge case).
- **Verification Procedure:** Run the category grouping helper used by `category/[slug].astro`.
- **Pass/Fail Acceptance Criteria:** Articles group accurately under unique `subcategory` keys in deterministic alphabetical order; empty input returns `[]` without throwing.

#### `TC-UNIT-05`: `/search-index.json` Payload Schema Contract
- **ISO 25010 Characteristic:** Functional Suitability (*Completeness*) & Maintainability
- **Linked Requirements:** `REQ-SRCH-01`, `SW-INT-03`, `SRS-FUNC-SRCH-01`
- **Preconditions / Inputs:** Built `dist/search-index.json` artifact (or generator function output).
- **Verification Procedure:** Validate every array entry using a Zod contract check requiring `slug`, `title`, `preview`, `category` (in `CATEGORY_SLUGS`), `categoryLabel`, `subcategory`, and `headings` (`string[]`).
- **Pass/Fail Acceptance Criteria:** 100% of serialized entries satisfy the `SearchIndexItem` Zod schema.

#### `TC-UNIT-06`: Campus Map Search and Viewport Math
- **ISO 25010 Characteristic:** Functional Suitability (*Functional Correctness*) & Usability (*Operability*)
- **Linked Requirements:** `REQ-MAP-01`–`04`, `SRS-FUNC-MAP-01`, `SRS-FUNC-MAP-02`
- **Preconditions / Inputs:** The pure campus-map search and viewport helpers with representative building and location data.
- **Verification Procedure:** Execute `tests/unit/map-search.test.ts` to verify location-first matching, parent-building labels, literal query safety, and bounded pan/zoom/reset viewBox calculations.
- **Pass/Fail Acceptance Criteria:** Office and building queries resolve to the expected parent building; viewport calculations remain within their supported bounds; empty or unmatched queries return safely without throwing.

---

### 3.3 Layer 3: Lean E2E Smoke & Responsive Layout Suite (`Playwright`)

#### `TC-E2E-01`: `<SearchBar />` React Island Hydration & Keyboard Flow
- **ISO 25010 Characteristic:** Usability (*Operability*) & Functional Suitability
- **Linked Requirements:** `REQ-SRCH-02`–`04`, `AC-SRCH-02`–`04`, `SRS-FUNC-SRCH-02`–`04`, `UJ-01`, `UC-01`, `AF-01A`, `AF-01B`
- **Preconditions / Inputs:** Built site served locally via `astro preview`.
- **Verification Procedure:**
  1. Load `/`; confirm zero console/page errors and verify `/search-index.json` is fetched lazily once on focus/input.
  2. Press `/` or `Ctrl+K` (when body focused) to focus `<SearchBar />`; type `"TOR"` (or sample guide keyword); use `ArrowDown` and `Enter` to open the top result.
  3. On `/articles/[slug]`, verify Header `<SearchBar />` opens with `Ctrl+K`/`/` and dismisses cleanly on `Escape`.
- **Pass/Fail Acceptance Criteria:** Search results render dynamically with category badges, keyboard navigation transitions browser URL to `/articles/<slug>`, and `Escape` closes the dropdown.

#### `TC-E2E-02`: Off-Nominal Search Recovery (Zero-Match & Fetch Failure)
- **ISO 25010 Characteristic:** Reliability (*Fault Tolerance*)
- **Linked Requirements:** `REQ-SRCH-05`, `SRS-FUNC-SRCH-05`, `SRS-NFR-REL-01`, `EF-01A`, `EF-01B`, `ERR-01`, `ERR-02`
- **Preconditions / Inputs:** Running preview server in Playwright.
- **Verification Procedure:**
  1. Type `"zzzznonexistent"` into `<SearchBar />` and inspect dropdown content.
  2. In a fresh page context, intercept `/search-index.json` via `page.route()` to return HTTP `500` / network abort, focus `<SearchBar />`, and type a query.
- **Pass/Fail Acceptance Criteria:**
  - Zero-match state displays a clear empty message and 7 clickable links pointing to `/categories/<slug>`.
  - Fetch failure logs zero uncaught page exceptions and renders fallback navigation links to the 7 categories.

#### `TC-E2E-03`: Responsive Table of Contents Behavior
- **ISO 25010 Characteristic:** Usability (*Operability, Appropriateness Recognizability*)
- **Linked Requirements:** `REQ-ART-04`, `AC-ART-04`, `SRS-FUNC-RND-05`, `UJ-03`, `AF-03A`, `EF-03A`, `ERR-05`
- **Preconditions / Inputs:** Sample article with `>= 2` `h2`/`h3` headings (and test verification for `< 2` headings if present).
- **Verification Procedure:**
  1. Visit `/articles/<slug>` at `1280x800`: assert desktop `<aside>` TOC is visible (`position: sticky` or visible sidebar) and mobile `<details>` TOC is hidden.
  2. Visit `/articles/<slug>` at `375x812`: assert desktop sidebar is hidden and collapsed `<details>` TOC expands on tap to reveal section anchor links.
- **Pass/Fail Acceptance Criteria:** Responsive TOC switches cleanly at the `1024px` breakpoint; clicking a TOC link updates URL hash to `#heading-slug`; articles with `< 2` headings render zero TOC containers.

#### `TC-E2E-04`: Cross-Viewport Horizontal Overflow Gate
- **ISO 25010 Characteristic:** Usability (*Operability*)
- **Linked Requirements:** `REQ-UI-02`, `SRS-FUNC-UI-04`, `SRS-NFR-USAB-04`, `EF-03C`, `ERR-07`
- **Preconditions / Inputs:** Routes `/`, `/categories/<slug>`, `/articles/<slug>` (containing a Markdown table), and `/404.html`.
- **Verification Procedure:** Evaluate `document.documentElement.scrollWidth <= window.innerWidth` in Playwright across `375x812` (mobile), `768x1024` (tablet), and `1280x800` (desktop).
- **Pass/Fail Acceptance Criteria:** Zero horizontal document overflow on any tested route or viewport (`scrollWidth <= innerWidth` is `true` for 100% of checks).

#### `TC-E2E-05`: Custom `404` Page Recovery
- **ISO 25010 Characteristic:** Reliability (*Fault Tolerance*) & Usability
- **Linked Requirements:** `REQ-UI-05`, `AC-UI-05`, `SRS-FUNC-RND-06`, `UC-04`, `ERR-08`
- **Preconditions / Inputs:** Preview server serving `dist/`.
- **Verification Procedure:** Navigate to `/this-route-does-not-exist` and inspect rendered UI.
- **Pass/Fail Acceptance Criteria:** Styled BulSUan `404` view renders with a hydrated `<SearchBar />`, links to all 7 categories, and a working `"Back to Home"` link to `/`.

#### `TC-E2E-06`: SEO Metadata, Sitemap, `robots.txt`, JSON-LD & `404` `noindex`
- **ISO 25010 Characteristic:** Functional Suitability (*Completeness*) & Compatibility
- **Linked Requirements:** `UI-INT-01`, `SW-INT-01`
- **Preconditions / Inputs:** Built `dist/` served via `astro preview`.
- **Verification Procedure:** Check `<link rel="canonical">`, Open Graph (`og:title`, `og:description`, `og:type`, `og:url`, `og:image`) and Twitter `summary_large_image` tags across `/`, `/categories/academics`, and `/articles/latin-honors-and-gwa`; parse JSON-LD blocks (`WebSite`, `Article`, `BreadcrumbList`); fetch `/robots.txt`, `/sitemap-index.xml`, and `/og-image.png`; verify `/404.html` carries `<meta name="robots" content="noindex, follow">` and `/404` is excluded from sitemap.
- **Pass/Fail Acceptance Criteria:** Every checked page has an absolute canonical URL matching `Astro.site`, valid Open Graph/Twitter metadata, parseable JSON-LD matching page type, reachable `og-image.png` and `sitemap-index.xml`, and `noindex` on `/404.html`.

#### `TC-E2E-07`: Interactive 2D Campus Map (`/map`)
- **ISO 25010 Characteristic:** Functional Suitability & Operability
- **Linked Requirements:** `REQ-MAP-01`–`04`, `SRS-FUNC-MAP-01`–`02`
- **Verification Procedure:** Visit `/map`, search `"Registrar"` in the map search input, verify a match appears showing `Flores Hall`, select it, verify `Flores Hall` becomes active on the SVG map and displays `Office of the University Registrar` in the inspector, click another building directly on the map (`Roxas Hall`), and exercise zoom/reset controls.
- **Pass/Fail Acceptance Criteria:** Location search maps matches to parent buildings, clicking a building or selecting a search result updates the inspector panel without runtime errors, and `/map` passes `TC-E2E-04` and `TC-A11Y-01` with `0` violations.

---

### 3.4 Layer 4: Accessibility & Minimal Static Security Suite

#### `TC-A11Y-01`: Automated WCAG 2.1 Level AA Scan (`@axe-core/playwright`)
- **ISO 25010 Characteristic:** Usability (*Accessibility*)
- **Linked Requirements:** `REQ-UI-01`, `SRS-NFR-USAB-01`, `SRS-NFR-USAB-03`
- **Preconditions / Inputs:** Built pages `/`, `/categories/<slug>`, `/articles/<slug>`, `/404.html`.
- **Verification Procedure:** Run `new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze()` on each representative page template (including active `<SearchBar />` dropdown state).
- **Pass/Fail Acceptance Criteria:** `violations.length === 0` (confirming WCAG 2.1 Level AA color contrast across all [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md) tokens).

#### `TC-A11Y-02`: Semantic Landmarks, Single `<h1>` & Keyboard Focus Visibility
- **ISO 25010 Characteristic:** Usability (*Accessibility, Operability*)
- **Linked Requirements:** `SRS-NFR-USAB-02`, `SRS-NFR-USAB-03`
- **Preconditions / Inputs:** Rendered DOM of `/`, `/categories/<slug>`, `/articles/<slug>`.
- **Verification Procedure:** Assert landmark presence (`header`, `nav`, `main`, `footer`; plus `article` on article pages), count `<h1>` elements (`=== 1`), and verify `Tab` navigation traverses interactive controls cleanly.
- **Pass/Fail Acceptance Criteria:** Exactly `1` `<h1>` per page, required HTML5 landmarks present, and focusable controls maintain accessible labels/ARIA states (`aria-expanded`, `role="listbox"`).

#### `TC-SEC-01`: DOM-Based XSS Resistance in `<SearchBar />`
- **ISO 25010 Characteristic:** Security (*Integrity*)
- **Linked Requirements:** `SRS-NFR-SEC-01`, `ERR-03`
- **Preconditions / Inputs:** `<SearchBar />` rendered on `/` in Playwright.
- **Verification Procedure:** Attach a `page.on('dialog')` listener, type `<script>alert('xss')</script>` and `<img src=x onerror=alert(1)>` into `<SearchBar />`, and verify DOM text rendering.
- **Pass/Fail Acceptance Criteria:** Zero JavaScript dialogs execute; raw input displays safely as escaped text inside the zero-match message.

#### `TC-SEC-02`: Dependency Vulnerability Hygiene
- **ISO 25010 Characteristic:** Security (*Integrity*)
- **Linked Requirements:** `SRS-NFR-SEC-02`
- **Preconditions / Inputs:** `bun.lock` / installed dependencies.
- **Verification Procedure:** Run `bun audit` (or check audit report before release).
- **Pass/Fail Acceptance Criteria:** Zero unresolved `high` or `critical` runtime vulnerabilities in client-shipped dependencies (`react`, `react-dom`, island helpers).

### 3.5 Dark Mode Verification

Automated verification gates for `BL-22` (`RTM-22`), executed in `tests/e2e/smoke.spec.ts`:

#### `TC-E2E-08`: Theme Preference, Persistence, and No-Flash Rendering
- **Linked Requirement:** `RTM-22`, `DESIGN_SYSTEM.md` §2.2.
- **Verification Procedure:** Select Light, Dark, and System default on representative routes; reload the page; and emulate each system scheme while System default is selected. Verify the selected preference persists and is applied before the first visible render.
- **Pass/Fail Acceptance Criteria:** The keyboard-operable menu exposes all three choices with correct sun, moon, and monitor semantics; the selected preference persists; System default follows the emulated system scheme; and neither light nor dark mode flashes the opposite canvas during initial render.

#### `TC-A11Y-03`: Dark Mode WCAG 2.1 AA Audit
- **Linked Requirement:** `RTM-22`, `DESIGN_SYSTEM.md` §2.2.
- **Verification Procedure:** Run Axe against representative Home, Category, Article, Map, and 404 pages with the dark theme active.
- **Pass/Fail Acceptance Criteria:** `violations.length === 0`, including contrast, landmark, focus, and control-name checks.

---

## 4. Test Execution Pipeline & Commands

To keep developer feedback fast during MVP implementation, tests execute in four lightweight stages:

```text
[1. Type & Schema Check]  ──▶  [2. Unit Tests]  ──▶  [3. Static Build]  ──▶  [4. E2E + Axe Smoke]
     bun run check             bun test               bun run build           bun run test:e2e
```

| Script Command | Tool | Target Verification |
| :--- | :--- | :--- |
| `bun run check` | `astro check` | `TC-BLD-01` (TypeScript & Astro diagnostics) |
| `bun test` (`bun run test:unit`) | `bun test` | `TC-UNIT-01`–`05` (Search scorer, special chars, grouping, JSON contract) |
| `bun run build` | `astro build` | `TC-BLD-02`, `TC-BLD-03` (Zod validation + `dist/` generation) |
| `bun run test:e2e` | `playwright test` | `TC-BLD-04`, `TC-E2E-01`–`05`, `TC-A11Y-01`–`02`, `TC-SEC-01` |

*(Full bidirectional mapping between requirements, source artifacts, and `TC-*` test cases is maintained in [REQUIREMENTS.md](./REQUIREMENTS.md).)*
