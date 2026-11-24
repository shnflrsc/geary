# Verification and testing specification (TESTING.md): Geary - Unofficial BulSU Student Information Portal

## 1. Document control and verification approach *(ISO/IEC/IEEE 29148 Clause 6.6)*

### 1.1 Document metadata

| Attribute | Details |
| :--- | :--- |
| Document title | Verification and testing specification (TESTING.md): Geary - Unofficial BulSU Student Information Portal |
| Version | `1.0 (MVP Baseline)` |
| Date | `2026-11-17` |
| Standard reference | ISO/IEC 25010:2011/2023 (*Systems and software Quality Requirements and Evaluation [SQuaRE]*) and ISO/IEC/IEEE 29148:2018 Clauses 6.6 and 9.6.4 (*Verification, Validation and Traceability*) |
| Related baseline documents | [PROJECT_CHARTER.md](./PROJECT_CHARTER.md), [PRD.md](./PRD.md), [SRS.md](./SRS.md), [USER_FLOWS.md](./USER_FLOWS.md), [ARCHITECTURE.md](./ARCHITECTURE.md), [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md), [REQUIREMENTS.md](./REQUIREMENTS.md) |
| Status | Approved Verification Baseline |

### 1.2 Verification layers

Geary compiles to static HTML with Tailwind CSS and isolated React islands (`<SearchBar />`, `<CampusMap />`). Verification covers the four layers that match that architecture:

| Layer | Tooling | Scope and purpose |
| :--- | :--- | :--- |
| Layer 1: Build and schema integrity | `astro check`, `astro build`, Zod | Enforces TypeScript safety, Markdown frontmatter schema rules, 7-category static route generation, and `/search-index.json` size and validity. |
| Layer 2: Unit tests | `Bun Test` (`bun test`) | Tests pure TypeScript logic: search query normalization, weighted scoring, literal special-character handling, subcategory grouping, campus-map search and viewport math, and the `/search-index.json` contract. |
| Layer 3: Browser E2E smoke and responsive layout | `Playwright` | Checks real-browser behavior: `<SearchBar />` hydration, keyboard shortcuts, zero-match and offline fallbacks, desktop vs. mobile TOC, `375px` overflow, `404` recovery, SEO metadata, `/map` interaction, and dark mode persistence. |
| Layer 4: Accessibility and static security | `@axe-core/playwright`, `bun audit` | Checks WCAG 2.1 Level AA contrast and landmarks in light and dark themes, XSS escaping in search inputs, and dependency hygiene. |

## 2. ISO/IEC 25010 quality model mapping

| ISO/IEC 25010 characteristic | Sub-characteristics | Application to Geary | Verification layer and test IDs |
| :--- | :--- | :--- | :--- |
| Functional Suitability | Functional Completeness, Functional Correctness | Validated Markdown ingestion, 7-category grouping, weighted search ranking, conditional TOC, campus map, SEO metadata, and `404` recovery. | Layer 1 (`TC-BLD-02`, `TC-BLD-03`), Layer 2 (`TC-UNIT-01`, `TC-UNIT-04` to `TC-UNIT-06`), Layer 3 (`TC-E2E-01`, `TC-E2E-03`, `TC-E2E-05` to `TC-E2E-07`) |
| Performance Efficiency | Time Behaviour, Resource Utilization | 100% static HTML output, `< 100 KB` `/search-index.json` payload, and `< 16 ms` synchronous client filtering. | Layer 1 (`TC-BLD-03`), Layer 2 (`TC-UNIT-01`) |
| Usability / Interaction Capability | Appropriateness Recognizability, Operability, Accessibility | Low-cognitive-load layout, `~65ch` prose, keyboard-only search (`/` and `Ctrl+K`), WCAG 2.1 AA contrast in light and dark themes, and zero `375px` horizontal scroll. | Layer 3 (`TC-E2E-01`, `TC-E2E-03`, `TC-E2E-04`, `TC-E2E-08`), Layer 4 (`TC-A11Y-01` to `TC-A11Y-03`) |
| Reliability | Fault Tolerance, Availability | Non-crashing UI when search returns 0 matches or `/search-index.json` fails over mobile data; zero broken internal links. | Layer 1 (`TC-BLD-04`), Layer 3 (`TC-E2E-02`, `TC-E2E-05`) |
| Security | Integrity (XSS Resistance) | React JSX escaping prevents DOM XSS from search inputs; zero unresolved high or critical runtime dependency flaws. | Layer 2 (`TC-UNIT-02`), Layer 4 (`TC-SEC-01`, `TC-SEC-02`) |
| Maintainability and Portability | Analysability, Modularity, Adaptability | Single-source `categories.ts` enum enforced across Zod, UI, and search; host-agnostic static `dist/` output. | Layer 1 (`TC-BLD-01`, `TC-BLD-02`, `TC-BLD-03`) |

## 3. Test suites and test case specifications (`TC-*`)

### 3.1 Layer 1: Build-time, schema, and static artifact gate

#### `TC-BLD-01`: TypeScript and Astro component typecheck
- ISO 25010 characteristic: Maintainability (*Analysability, Modularity*)
- Linked requirements: `CON-TECH-04`, `SRS-NFR-MAINT-01`
- Inputs: Complete source tree (`src/`, `tsconfig.json`, `astro.config.mjs`).
- Procedure: Run `bun run check` (`astro check`).
- Pass criteria: Exits with code `0` and reports `0` TypeScript or Astro template errors across layouts, components, pages, and `SearchBar.tsx`.

#### `TC-BLD-02`: Zod frontmatter schema enforcement (positive and negative)
- ISO 25010 characteristic: Functional Suitability (*Functional Correctness*)
- Linked requirements: `REQ-ART-01`, `AC-ART-01`, `CON-TECH-04`, `SRS-FUNC-CNT-01`, `SRS-FUNC-CNT-02`, `ERR-09`
- Inputs: Valid `.md` articles in `src/content/articles/` plus a temporary negative fixture (missing `title` or invalid `category: "unknown"`).
- Procedure:
  1. Run `bun run build` (`astro build`) against repository articles.
  2. Test an invalid frontmatter fixture locally and run `astro build`.
- Pass criteria:
  - Valid articles build with exit code `0`.
  - Invalid frontmatter stops `astro build` with a non-zero exit code and a Zod error naming the file and field.

#### `TC-BLD-03`: Static route and search index artifact verification
- ISO 25010 characteristic: Functional Suitability (*Completeness*) and Performance Efficiency (*Resource Utilization*)
- Linked requirements: `REQ-CAT-01`, `REQ-SRCH-01`, `CON-TECH-01`, `SRS-FUNC-RND-01` to `SRS-FUNC-RND-04`, `SRS-FUNC-SRCH-01`, `SRS-NFR-PERF-01`, `SRS-NFR-PERF-03`
- Inputs: Output of `bun run build`.
- Procedure: Inspect generated files in `dist/` and check the byte size of `dist/search-index.json`.
- Pass criteria:
  - `dist/index.html`, `dist/map/index.html`, `dist/contribute/index.html`, `dist/terms/index.html`, `dist/privacy/index.html`, `dist/404.html`, all `dist/categories/<slug>/index.html` routes, and all `dist/articles/<slug>/index.html` routes exist.
  - `dist/search-index.json` is valid JSON, stays `< 100 KB`, and matches the published article count.

#### `TC-BLD-04`: Internal link and anchor integrity
- ISO 25010 characteristic: Reliability (*Availability*)
- Linked requirements: `SRS-NFR-REL-02`, `REQ-CAT-04`
- Inputs: Built static output in `dist/`.
- Procedure: Crawl `/`, category pages, and article pages in Playwright and verify that every internal `<a href="/...">` and TOC `#...` anchor resolves to an existing route or DOM element ID.
- Pass criteria: `0` broken internal routes (`404` responses on internal links) and `0` orphaned TOC heading anchors.

### 3.2 Layer 2: Unit test suite - pure logic and contracts (`Bun Test`)

#### `TC-UNIT-01`: Multi-term query normalization and weighted relevance scoring
- ISO 25010 characteristic: Functional Suitability (*Functional Correctness*) and Performance Efficiency (*Time Behaviour*)
- Linked requirements: `REQ-SRCH-03`, `SRS-FUNC-SRCH-03`, `SRS-NFR-PERF-04`, `UC-01`
- Inputs: Pure search helper (`filterAndRankArticles(items, query)`) and a fixture corpus of `SearchIndexItem[]`.
- Procedure: Run assertions for multi-word queries (`"latin honors"`, `"  TOR  "`, `"inc completion"`), verifying that title matches outrank heading and subcategory matches, which outrank body preview matches, with output capped at `<= 8` items. Time execution against `200` synthetic items.
- Pass criteria: Ranking follows field weights (`title > headings/subcategory > preview/categoryLabel`), results never exceed `8`, and execution completes in `< 16 ms`.

#### `TC-UNIT-02`: Literal substring safety for regex and special characters
- ISO 25010 characteristic: Reliability (*Fault Tolerance*) and Security (*Integrity*)
- Linked requirements: `SRS-FUNC-SRCH-03`, `ERR-03`, `EF-01C`
- Inputs: Queries containing regex metacharacters (`"[INC] (2026)*?\\+"`, `"GWA > 1.75"`).
- Procedure: Pass special-character strings directly to the search scoring helper.
- Pass criteria: Zero `SyntaxError` exceptions; special characters match literally when present or return `[]`.

#### `TC-UNIT-03`: Whitespace-only and empty query handling
- ISO 25010 characteristic: Functional Suitability (*Correctness*)
- Linked requirements: `SRS-FUNC-SRCH-03`, `EF-01C`
- Inputs: Queries `""`, `"   "`, and `"\t\n"`.
- Procedure: Invoke the search scoring helper with empty and whitespace inputs.
- Pass criteria: Returns `[]` without matching all articles.

#### `TC-UNIT-04`: Subcategory grouping and deterministic sorting helper
- ISO 25010 characteristic: Functional Suitability (*Correctness*)
- Linked requirements: `REQ-CAT-03`, `AC-CAT-03`, `SRS-FUNC-RND-03`, `UC-02`
- Inputs: Unsorted mock article array spanning multiple `subcategory` strings plus an empty array `[]`.
- Procedure: Run the category grouping helper used by `category/[slug].astro`.
- Pass criteria: Articles group under unique `subcategory` keys in deterministic alphabetical order; empty input returns `[]` without throwing.

#### `TC-UNIT-05`: `/search-index.json` payload schema contract
- ISO 25010 characteristic: Functional Suitability (*Completeness*) and Maintainability
- Linked requirements: `REQ-SRCH-01`, `SW-INT-03`, `SRS-FUNC-SRCH-01`
- Inputs: Built `dist/search-index.json` artifact (requires `bun run build` first on a clean checkout).
- Procedure: Validate every array entry against a Zod contract requiring `slug`, `title`, `preview`, `category` (in `CATEGORY_SLUGS`), `categoryLabel`, `subcategory`, and `headings` (`string[]`).
- Pass criteria: 100% of serialized entries satisfy the `SearchIndexItem` Zod schema.

#### `TC-UNIT-06`: Campus map search and viewport math
- ISO 25010 characteristic: Functional Suitability (*Functional Correctness*) and Usability (*Operability*)
- Linked requirements: `REQ-MAP-01` to `REQ-MAP-04`, `SRS-FUNC-MAP-01`, `SRS-FUNC-MAP-02`
- Inputs: Pure campus-map search and viewport helpers with representative building and location data.
- Procedure: Run `tests/unit/map-search.test.ts` to verify location-first matching, parent-building labels, literal query safety, and bounded pan, zoom, and reset viewBox calculations.
- Pass criteria: Office and building queries resolve to the expected parent building, viewport bounds hold, and empty or unmatched queries return without throwing.

### 3.3 Layer 3: Browser E2E smoke and responsive layout suite (`Playwright`)

#### `TC-E2E-01`: `<SearchBar />` React island hydration and keyboard flow
- ISO 25010 characteristic: Usability (*Operability*) and Functional Suitability
- Linked requirements: `REQ-SRCH-02` to `REQ-SRCH-04`, `AC-SRCH-02` to `AC-SRCH-04`, `SRS-FUNC-SRCH-02` to `SRS-FUNC-SRCH-04`, `UJ-01`, `UC-01`, `AF-01A`, `AF-01B`
- Inputs: Built site served locally via `astro preview`.
- Procedure:
  1. Load `/`; confirm zero console or page errors and confirm `/search-index.json` fetches lazily once on focus or input.
  2. Press `/` or `Ctrl+K` while the body is focused to focus `<SearchBar />`; type `"TOR"` (or another sample article keyword); press `ArrowDown` and `Enter` to open the top result.
  3. On `/articles/[slug]`, verify the Header `<SearchBar />` opens with `Ctrl+K` or `/` and closes on `Escape`.
- Pass criteria: Search results render with category badges, keyboard navigation navigates to `/articles/<slug>`, and `Escape` closes the dropdown.

#### `TC-E2E-02`: Off-nominal search recovery (zero-match and fetch failure)
- ISO 25010 characteristic: Reliability (*Fault Tolerance*)
- Linked requirements: `REQ-SRCH-05`, `SRS-FUNC-SRCH-05`, `SRS-NFR-REL-01`, `EF-01A`, `EF-01B`, `ERR-01`, `ERR-02`
- Inputs: Preview server running under Playwright.
- Procedure:
  1. Type `"zzzznonexistent"` into `<SearchBar />` and inspect the dropdown.
  2. In a fresh page context, intercept `/search-index.json` via `page.route()` to return HTTP `500` or abort the request, focus `<SearchBar />`, and type a query.
- Pass criteria:
  - Zero-match state displays an empty message and 7 clickable links pointing to `/categories/<slug>`.
  - Fetch failure logs zero uncaught exceptions and renders fallback links to all 7 categories.

#### `TC-E2E-03`: Responsive table of contents behavior
- ISO 25010 characteristic: Usability (*Operability, Appropriateness Recognizability*)
- Linked requirements: `REQ-ART-04`, `AC-ART-04`, `SRS-FUNC-RND-05`, `UJ-03`, `AF-03A`, `EF-03A`, `ERR-05`
- Inputs: Sample article with `>= 2` `h2`/`h3` headings (plus coverage for `< 2` headings when present).
- Procedure:
  1. Visit `/articles/<slug>` at `1280x800`: assert the desktop `<aside>` TOC is visible (`position: sticky` or visible sidebar) and the mobile `<details>` TOC is hidden.
  2. Visit `/articles/<slug>` at `375x812`: assert the desktop sidebar is hidden and the collapsed `<details>` TOC expands on tap to show section links.
- Pass criteria: TOC switches at the `1024px` breakpoint, clicking a TOC link updates the URL hash to `#heading-slug`, and articles with `< 2` headings render no TOC container.

#### `TC-E2E-04`: Cross-viewport horizontal overflow gate
- ISO 25010 characteristic: Usability (*Operability*)
- Linked requirements: `REQ-UI-02`, `SRS-FUNC-UI-04`, `SRS-NFR-USAB-04`, `EF-03C`, `ERR-07`
- Inputs: Routes `/`, `/categories/<slug>`, `/articles/<slug>` (including a Markdown table), `/map`, and `/404.html`.
- Procedure: Evaluate `document.documentElement.scrollWidth <= window.innerWidth` in Playwright at `375x812` (mobile), `768x1024` (tablet), and `1280x800` (desktop).
- Pass criteria: `scrollWidth <= innerWidth` is `true` for every tested route and viewport.

#### `TC-E2E-05`: Custom `404` page recovery
- ISO 25010 characteristic: Reliability (*Fault Tolerance*) and Usability
- Linked requirements: `REQ-UI-05`, `AC-UI-05`, `SRS-FUNC-RND-06`, `UC-04`, `ERR-08`
- Inputs: Preview server serving `dist/`.
- Procedure: Navigate to `/this-route-does-not-exist` and inspect the rendered UI.
- Pass criteria: Styled BulSUan `404` view renders with a hydrated `<SearchBar />`, links to all 7 categories, and a working `"Back to Home"` link to `/`.

#### `TC-E2E-06`: SEO metadata, sitemap, `robots.txt`, JSON-LD, and `404` `noindex`
- ISO 25010 characteristic: Functional Suitability (*Completeness*) and Compatibility
- Linked requirements: `UI-INT-01`, `SW-INT-01`
- Inputs: Built `dist/` served via `astro preview`.
- Procedure: Check `<link rel="canonical">`, Open Graph (`og:title`, `og:description`, `og:type`, `og:url`, `og:image`), and Twitter `summary_large_image` tags across `/`, `/categories/academics`, and `/articles/latin-honors-and-gwa`; parse JSON-LD blocks (`WebSite`, `Article`, `BreadcrumbList`); fetch `/robots.txt`, `/sitemap-index.xml`, and `/og-image.png`; verify `/404.html` includes `<meta name="robots" content="noindex, follow">` and `/404` is excluded from the sitemap.
- Pass criteria: Every checked page has an absolute canonical URL matching `Astro.site`, valid Open Graph and Twitter metadata, parseable JSON-LD matching the page type, reachable `og-image.png` and `sitemap-index.xml`, and `noindex` on `/404.html`.

#### `TC-E2E-07`: Interactive 2D campus map (`/map`)
- ISO 25010 characteristic: Functional Suitability and Operability
- Linked requirements: `REQ-MAP-01` to `REQ-MAP-04`, `SRS-FUNC-MAP-01`, `SRS-FUNC-MAP-02`
- Procedure: Visit `/map`, search `"Registrar"` in the map search input, verify a match appears showing `Flores Hall`, select it, verify `Flores Hall` becomes active on the SVG map and displays `Office of the University Registrar` in the inspector, click `Roxas Hall` directly on the map, and exercise zoom and reset controls.
- Pass criteria: Location search maps matches to parent buildings, clicking a building or choosing a search result updates the inspector without runtime errors, and `/map` passes `TC-E2E-04` and `TC-A11Y-01` with `0` violations.

### 3.4 Layer 4: Accessibility and static security suite

#### `TC-A11Y-01`: Automated WCAG 2.1 Level AA scan (`@axe-core/playwright`)
- ISO 25010 characteristic: Usability (*Accessibility*)
- Linked requirements: `REQ-UI-01`, `SRS-NFR-USAB-01`, `SRS-NFR-USAB-03`
- Inputs: Built pages `/`, `/categories/<slug>`, `/articles/<slug>`, `/map`, and `/404.html`.
- Procedure: Run `new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze()` on each representative page template, including the open `<SearchBar />` dropdown state.
- Pass criteria: `violations.length === 0`, confirming WCAG 2.1 Level AA contrast across all [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md) tokens.

#### `TC-A11Y-02`: Semantic landmarks, single `<h1>`, and keyboard focus visibility
- ISO 25010 characteristic: Usability (*Accessibility, Operability*)
- Linked requirements: `SRS-NFR-USAB-02`, `SRS-NFR-USAB-03`
- Inputs: Rendered DOM of `/`, `/categories/<slug>`, and `/articles/<slug>`.
- Procedure: Assert landmark presence (`header`, `nav`, `main`, `footer`, plus `article` on article pages), count `<h1>` elements (`=== 1`), and verify `Tab` navigation moves through interactive controls in order.
- Pass criteria: Exactly `1` `<h1>` per page, all required HTML5 landmarks present, and focusable controls maintain accessible labels and ARIA states (`aria-expanded`, `role="listbox"`).

#### `TC-SEC-01`: DOM-based XSS resistance in `<SearchBar />`
- ISO 25010 characteristic: Security (*Integrity*)
- Linked requirements: `SRS-NFR-SEC-01`, `ERR-03`
- Inputs: `<SearchBar />` rendered on `/` in Playwright.
- Procedure: Attach a `page.on('dialog')` listener, type `<script>alert('xss')</script>` and `<img src=x onerror=alert(1)>` into `<SearchBar />`, and inspect rendered DOM text.
- Pass criteria: Zero JavaScript dialogs execute; raw input renders as escaped text inside the zero-match message.

#### `TC-SEC-02`: Dependency vulnerability hygiene
- ISO 25010 characteristic: Security (*Integrity*)
- Linked requirements: `SRS-NFR-SEC-02`
- Inputs: `bun.lock` and installed dependencies.
- Procedure: Run `bun audit` before merging dependency updates or cutting a release.
- Pass criteria: Zero unresolved `high` or `critical` runtime vulnerabilities in client-shipped dependencies (`react`, `react-dom`, island helpers).

### 3.5 Dark mode verification

Automated verification gates for `BL-22` (`RTM-22`), executed in `tests/e2e/smoke.spec.ts`:

#### `TC-E2E-08`: Theme preference, persistence, and no-flash rendering
- Linked requirements: `RTM-22`, [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md) §2.2
- Procedure: Select Light, Dark, and System default on representative routes, reload the page, and emulate both light and dark system schemes while System default is active. Confirm the chosen preference persists and applies before the first visible paint.
- Pass criteria: The keyboard-operable menu exposes Light, Dark, and System default with sun, moon, and monitor semantics; the chosen preference persists; System default follows the emulated scheme; and neither theme flashes the opposite canvas on initial load.

#### `TC-A11Y-03`: Dark mode WCAG 2.1 AA audit
- Linked requirements: `RTM-22`, [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md) §2.2
- Procedure: Run Axe against representative Home, Category, Article, Map, and 404 pages with the dark theme active.
- Pass criteria: `violations.length === 0` across contrast, landmark, focus, and control-name checks.

## 4. Test execution pipeline and PR verification gates

Tests run in four stages. Run `bun run build` before `bun test` in clean checkouts and CI so `dist/search-index.json` exists for `TC-UNIT-05`:

```text
[1. Type and schema check] -> [2. Static build] -> [3. Unit tests] -> [4. E2E and Axe smoke]
       bun run check            bun run build         bun test           bun run test:e2e
```

| Script command | Tool | Target verification | Where it runs |
| :--- | :--- | :--- | :--- |
| `bun run check` | `astro check` | `TC-BLD-01` (TypeScript and Astro diagnostics) | CI (`.github/workflows/ci.yml`) and local PR prep |
| `bun run build` | `astro build` | `TC-BLD-02`, `TC-BLD-03` (Zod validation and `dist/` generation) | CI (`.github/workflows/ci.yml`) and local PR prep |
| `bun test` (`bun run test:unit`) | `bun test` | `TC-UNIT-01` to `TC-UNIT-06` (search scorer, special chars, grouping, JSON contract, map search) | CI (`.github/workflows/ci.yml`) and local PR prep |
| `bun run test:e2e` | `playwright test` | `TC-BLD-04`, `TC-E2E-01` to `TC-E2E-08`, `TC-A11Y-01` to `TC-A11Y-03`, `TC-SEC-01` | Local before opening or merging UI, route, or theme PRs |
| `bun audit` | `bun audit` | `TC-SEC-02` (dependency vulnerability check) | Local before merging dependency changes or releases |

`.github/workflows/ci.yml` runs `bun run check`, `bun run build`, and `bun test` automatically on every pull request. Contributors changing layouts, styles, interactive islands, routes, or content schemas should also run `bun run test:e2e` locally before requesting review.

Full bidirectional mapping between requirements, source artifacts, and `TC-*` test cases lives in [REQUIREMENTS.md](./REQUIREMENTS.md).
