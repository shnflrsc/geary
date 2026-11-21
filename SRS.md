# Software Requirements Specification (SRS): Geary — Unofficial BulSU Student Information Hub

---

## 1. Introduction *(ISO 29148 Clause 9.6.1 & Clause 9.6.2)*

### 1.1 Document Control & Identification

| Attribute | Details |
| :--- | :--- |
| **Document Title** | Software Requirements Specification (SRS): Geary — Unofficial BulSU Student Information Hub |
| **Version** | `1.0 (MVP Baseline)` |
| **Date** | `2026-11-17` |
| **Standard Reference** | ISO/IEC/IEEE 29148:2018 Clause 9.6 (*Software Requirements Specification [SRS]*) & ISO/IEC 25010 (*Quality Attributes*) |
| **Related Baselines** | [PROJECT_CHARTER.md](./PROJECT_CHARTER.md), [PRD.md](./PRD.md) |
| **Status** | Approved for Implementation |

### 1.2 Purpose & Operating Environment
This Software Requirements Specification (SRS) defines the formal software-level constraints, external interface contracts, functional requirements, and non-functional quality requirements for **Geary** (`Astro SSG + Tailwind CSS + isolated React islands`).

- **Client Environment:** Evergreen mobile and desktop web browsers (Chrome, Safari, Firefox, Edge) across Android, iOS, Windows, and macOS operating over campus cellular (3G/4G/5G) and Wi-Fi networks.
- **Build Environment:** Bun (and Node.js-compatible) toolchain running Astro static compilation (`bun run check`, `bun run build`) against UTF-8 Markdown sources.

### 1.3 Definitions, Acronyms, and Abbreviations

| Term / Acronym | Definition |
| :--- | :--- |
| **SSG** | Static Site Generation — compiling templates and Markdown into static HTML, CSS, and JSON artifacts at build time. |
| **Astro Content Collection** | Astro's schema-validated static content registry for structured Markdown files. |
| **React Island** | An isolated interactive React component hydrated selectively inside static Astro HTML. |
| **Zod** | Schema validation library enforcing build-time frontmatter and payload constraints. |
| **JSON** | JavaScript Object Notation — static interchange format for `/search-index.json`. |
| **DOM** | Document Object Model — browser HTML tree rendered statically or updated declaratively by React. |
| **WCAG** | Web Content Accessibility Guidelines (Level AA under WCAG 2.1). |
| **BulSU / COR / TOR / INC / GWA / LOA / OSAS** | Bulacan State University domain terms: Certificate of Registration, Transcript of Records, Incomplete grade, General Weighted Average, Leave of Absence, Office of Student Affairs and Services. |

---

## 2. System Constraints (`CON-*`)

### 2.1 Technical & Architectural Constraints

| ID | Constraint Statement |
| :--- | :--- |
| **CON-TECH-01** | The software shall build in Astro static output mode (`output: 'static'`) with zero server-side rendering (SSR) adapters or runtime edge functions. |
| **CON-TECH-02** | Layout and component presentation shall be styled using **Tailwind CSS** utility classes and design tokens. |
| **CON-TECH-03** | **React** shall be hydrated strictly via Astro island directives (`client:load` or `client:idle`) and limited to stateful client interactivity (`<SearchBar />`, `<ExploreSpotlight />`, and `<CampusMap />`). |
| **CON-TECH-04** | **TypeScript** and **Zod** shall enforce compile-time type checking and build-time frontmatter schema validation across all content and data modules. |

### 2.2 Financial & Operational Constraints

| ID | Constraint Statement |
| :--- | :--- |
| **CON-FIN-01** | Total recurring operational, hosting, storage, and third-party service cost shall remain strictly **$0.00/month**. |
| **CON-FIN-02** | The software shall not depend on runtime backend servers, managed databases, headless CMS subscriptions, or paid third-party APIs (including LLM or hosted search endpoints). |

### 2.3 Data & Content Constraints

| ID | Constraint Statement |
| :--- | :--- |
| **CON-DATA-01** | All student guide content shall reside as UTF-8 Markdown (`.md`) files under Git version control. |
| **CON-DATA-02** | Searchable guide metadata and section headings shall be compiled at build time into a single static JSON file (`/search-index.json`). |

### 2.4 Scope, Legal & Governance Constraints

| ID | Constraint Statement |
| :--- | :--- |
| **CON-GOV-01** | Software capabilities are locked strictly to the five MVP capabilities (Articles/Markdown, 7-Category Hierarchy, Client-Side Search Bar, Low-Cognitive-Load BulSUan UI/UX, and Interactive 2D Campus Map); AI/RAG chatbots, authentication, user submissions, and BulSU SIS integrations are prohibited. The existing embedded contribution form is a documented governance exception pending a dedicated scope decision. |
| **CON-GOV-02** | The software shall display an explicit unofficial disclaimer across the global footer and article views stating that Geary is student-maintained and unaffiliated with Bulacan State University administration. |

---

## 3. External Interface Requirements *(ISO 29148 Clause 9.6.3.2)*

### 3.1 User Interfaces (`UI-INT-*`)

#### `UI-INT-01`: Logical Route Interface Map

| Route Pattern | Purpose |
| :--- | :--- |
| `/` | Home hub rendering hero search bar, Featured Articles, and the 7-Category Directory. |
| `/categories/[slug]` | Category directory listing guides grouped by `subcategory` with breadcrumb navigation. |
| `/articles/[slug]` | Distraction-free reading view with metadata header, responsive TOC, Markdown prose, disclaimer, and related guides. |
| `/404.html` | Branded recovery page embedding the search bar and links to all seven categories. |
| `/search-index.json` | Static JSON search payload consumed by `<SearchBar />`. |

#### `UI-INT-02`: Responsive Viewport Breakpoints
- **Mobile (`< 768px`):** Single-column layout, collapsed header navigation toggle, collapsible `<details>` TOC above article prose, and horizontally scrollable table containers.
- **Tablet (`768px – 1023px`):** Two-column directory grids, visible top navigation links, and collapsible `<details>` TOC above prose.
- **Desktop (`>= 1024px`):** Multi-column directory grids and a two-column article layout pairing constrained prose with a sticky `"On this page"` TOC sidebar.

#### `UI-INT-03`: Visual & Typographic Design Contract
- All user interface surfaces, color contrasts, font stacks, spatial scales, and component interactive states shall conform strictly to the design tokens specified in [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md).

### 3.2 Software & Data Interfaces (`SW-INT-*`)

#### `SW-INT-01`: Canonical Category Registry Contract
The system shall maintain a single canonical registry defining the 7 permitted category slugs (`enrollment`, `academics`, `documents`, `scholarships`, `policies`, `organizations`, `campus`) and their metadata fields:

| Field | Type / Constraint | Description |
| :--- | :--- | :--- |
| `slug` | Canonical enum string | URL route identifier and foreign key referenced by articles. |
| `title` | Non-empty string | Human-readable category display name. |
| `description` | Non-empty string | Concise 1-line summary shown on directory cards and category headers. |
| `icon` | String identifier | Visual category icon key. |
| `order` | Positive integer (`1`–`7`) | Deterministic display order across navigation and directory views. |

#### `SW-INT-02`: Article Frontmatter Schema Contract

| Field | Type / Constraint | Required | Default |
| :--- | :--- | :--- | :--- |
| `title` | `string` (`min >= 1`) | Yes | — |
| `category` | `enum` matching `SW-INT-01` `slug` values | Yes | — |
| `subcategory` | `string` (`min >= 1`) | Yes | — |
| `updatedDate` | Coercible ISO date (`Date`) | Yes | — |
| `source` | `string` (`min >= 1`) | No | `—` |
| `sourceUrl` | Valid URL `string` | No | `—` |
| `sources` | `Array<{ label: string; url?: string }>` (`min >= 1`) | No | `—` |

#### `SW-INT-03`: Static Search Index Payload Contract (`GET /search-index.json`)

| Field | Type | Description |
| :--- | :--- | :--- |
| `slug` | `string` | URL segment for `/articles/[slug]`. |
| `title` | `string` | Article display title. |
| `preview` | `string` | Plain-text article preview extracted from the Markdown body. |
| `category` | `CategorySlug` | Canonical category slug. |
| `categoryLabel` | `string` | Human-readable category title resolved from `SW-INT-01`. |
| `subcategory` | `string` | Sub-topic grouping label. |
| `headings` | `string[]` | Extracted plain-text `h2` and `h3` headings. |

### 3.3 Communications Interfaces (`COM-INT-01`)
- All HTML, CSS, JavaScript, and JSON assets shall be delivered via standard **HTTPS** (`GET` requests) from static hosting.
- Client-side search shall fetch `/search-index.json` asynchronously via same-origin `fetch('/search-index.json')` with zero authentication headers or cross-origin dependencies.

---

## 4. System Functional Requirements *(ISO 29148 Clause 9.6.3.1)*

### 4.1 Content Ingestion & Schema Validation Subsystem

#### `SRS-FUNC-CNT-01`: Markdown Article Discovery
- **Inputs:** UTF-8 `.md` files inside the articles content collection directory.
- **Processing Logic:** Enumerate all `.md` files at build time, separate YAML frontmatter from Markdown body text, and derive URL `slug` deterministically from filenames.
- **Outputs:** Parsed collection entries passed to schema validation and static route builders.
- **Error Handling:** Malformed YAML syntax halts compilation immediately with file path and line diagnostics.

#### `SRS-FUNC-CNT-02`: Strict Zod Frontmatter Validation
- **Inputs:** Raw YAML frontmatter dictionary per Markdown file.
- **Processing Logic:** Validate all fields against `SW-INT-02` (`title`, `category` enum, `subcategory`, coerced `updatedDate`).
- **Outputs:** Strongly typed metadata object attached to each collection entry.
- **Error Handling:** Missing fields, invalid dates, or unrecognized `category` values abort `astro build` / `astro check` with descriptive Zod diagnostics.

#### `SRS-FUNC-CNT-03`: Semantic Markdown Compilation
- **Inputs:** Validated Markdown body text.
- **Processing Logic:** Compile Markdown (including GFM tables, ordered/unordered lists, blockquotes, inline code, links) to semantic HTML with unique URL-safe `id` attributes injected on `h2`–`h4` headings.
- **Outputs:** Rendered HTML component injected inside the article prose container.
- **Error Handling:** Safe escaping of literal markup; zero raw script injection.

#### `SRS-FUNC-CNT-04`: Heading Metadata Extraction
- **Inputs:** Parsed Markdown AST headings list.
- **Processing Logic:** Extract each heading's `depth` (`1`–`6`), anchor `slug`, and plain `text`.
- **Outputs:** Structured headings list consumed by TOC generation (`SRS-FUNC-RND-05`) and search indexing (`SRS-FUNC-SRCH-01`).
- **Error Handling:** Articles without subheadings yield an empty array `[]` without throwing.

---

### 4.2 Static Route & Page Generation Subsystem

#### `SRS-FUNC-RND-01`: Home Page Directory & Featured Aggregation (`/`)
- **Inputs:** Validated article collection.
- **Processing Logic:**
  1. Sort all published articles deterministically by title and pass the pool into `ExploreSpotlight` (`client:load`), which deterministically shuffles and partitions 3 non-overlapping groups of 6 articles seeded by local calendar date (`YYYY-MM-DD`).
- **Outputs:** Static `index.html` containing hero search island and daily rotating 3×6 Featured section.
- **Error Handling:** If the article collection is empty, omit the Featured section cleanly.

#### `SRS-FUNC-RND-02`: Category Static Path Generation (`/categories/[slug]`)
- **Inputs:** Canonical 7-category registry (`SW-INT-01`).
- **Processing Logic:** Emit one static route per canonical category slug via `getStaticPaths()`, ensuring all seven category URLs exist even when empty.
- **Outputs:** Seven static HTML category pages.
- **Error Handling:** Unmatched `/categories/*` paths resolve to `/404.html` (`SRS-FUNC-RND-06`).

#### `SRS-FUNC-RND-03`: Deterministic Subcategory Grouping
- **Inputs:** Articles belonging to the active category `slug`.
- **Processing Logic:** Group articles by `subcategory`, sort subcategory headers deterministically in alphabetical order, and sort articles alphabetically by `title` within each group.
- **Outputs:** Subcategory sections containing scannable article cards (`title`, body `preview`).
- **Error Handling:** When a category has `0` articles, render a simple empty-state icon and notice (*"No guides here yet."*).

#### `SRS-FUNC-RND-04`: Article Static Path Generation (`/articles/[slug]`)
- **Inputs:** Validated articles collection.
- **Processing Logic:** Emit one static route per article entry, binding metadata header (breadcrumb, `<h1>` title, formatted `Last Updated` date), social/JSON-LD meta derived from the article body preview, Markdown body, TOC, and optional source card.
- **Outputs:** Static HTML file at `/articles/<slug>/index.html`.
- **Error Handling:** Duplicate file slugs fail compilation deterministically.

#### `SRS-FUNC-RND-05`: Conditional Table of Contents Generation
- **Inputs:** Extracted `headings` array for the active article.
- **Processing Logic:** Filter headings where `depth === 2 || depth === 3`. Evaluate `tocHeadings.length >= 2`.
- **Outputs:**
  - If `>= 2`: Render a sticky desktop `<aside>` TOC (`>= 1024px`) and a collapsed `<details>` mobile TOC (`< 1024px`) linking to `#${heading.slug}` with indented `h3` items.
  - If `< 2`: Suppress TOC rendering entirely on all viewports.
- **Error Handling:** Ensure no empty `<aside>` column or blank disclosure box renders when suppressed.

#### `SRS-FUNC-RND-06`: Related Guides Resolution & Custom `404` Page
- **Inputs:** Active article (`slug`, `category`), article collection, and category registry.
- **Processing Logic:** Filter articles matching `a.category === current.category && a.slug !== current.slug`, sort deterministically, and cap at `3` entries. Independently generate `/404.html` embedding `<SearchBar />` and links to all 7 categories.
- **Outputs:** Up to 3 sibling article cards below the verification notice (omitted if `0` siblings exist), plus static `404.html`.
- **Error Handling:** Never display the active article inside its own Related Guides list.

---

### 4.3 Static Search Index & Client-Side Search Subsystem

#### `SRS-FUNC-SRCH-01`: Build-Time Search Index Serialization
- **Inputs:** Validated articles collection and `SW-INT-01` category registry.
- **Processing Logic:** Serialize every published article into a `SearchIndexItem` (`SW-INT-03`) containing `slug`, `title`, body `preview`, `category`, `categoryLabel`, `subcategory`, and plain-text `h2`/`h3` `headings`.
- **Outputs:** Static `search-index.json` artifact served with `application/json` content type.
- **Error Handling:** Type-checked category mapping prevents missing labels at build time.

#### `SRS-FUNC-SRCH-02`: Lazy Client-Side Index Fetching & Caching
- **Inputs:** First focus or input interaction on `<SearchBar />`.
- **Processing Logic:** Check in-memory cache; if empty, set loading state, execute `fetch('/search-index.json')`, parse JSON, and cache in memory for the browser session.
- **Outputs:** Cached `SearchIndexItem[]` ready for synchronous filtering.
- **Error Handling:** Catch network or non-200 HTTP failures cleanly without uncaught exceptions, rendering an inline retry/offline notice with direct category links (`SRS-NFR-REL-01`).

#### `SRS-FUNC-SRCH-03`: Multi-Term Query Normalization & Weighted Scoring
- **Inputs:** Raw user query string and cached `SearchIndexItem[]`.
- **Processing Logic:**
  1. Trim and lowercase query, splitting whitespace into search tokens. Return empty array `[]` when empty.
  2. Match tokens using safe literal substring checks (`String.includes`), applying weighted scores: `title` (`+10`/token, `+20` exact phrase) > `headings`/`subcategory` (`+5`/token) > `description`/`categoryLabel` (`+2`/token).
  3. Filter scores `> 0`, sort descending by score (breaking ties alphabetically by `title`), and slice top `8` matches.
- **Outputs:** Ranked list of up to 8 matching `SearchIndexItem` results.
- **Error Handling:** Special punctuation (`[`, `(`, `*`, `?`, `\`) is evaluated literally without `RegExp` construction crashes.

#### `SRS-FUNC-SRCH-04`: Global & Local Keyboard Navigation
- **Inputs:** Document `keydown` events and search input `keydown` events.
- **Processing Logic:**
  - Global listener: Pressing `/` or `Ctrl+K` (`Cmd+K`) when focus is outside `<input>`, `<textarea>`, or `[contenteditable]` prevents default behavior and focuses the designated primary `<SearchBar />`.
  - Local listener (overlay active): `ArrowDown` / `ArrowUp` cycles `activeIndex`, `Enter` navigates to `/articles/${selected.slug}`, and `Escape` closes/dismisses the overlay.
- **Outputs:** Full mouseless search-to-article workflow.
- **Error Handling:** Designate a single instance to register global hotkeys when both Hero and Header search bars mount on `/`.

#### `SRS-FUNC-SRCH-05`: Dismissal & Zero-Match Fallback UI
- **Inputs:** Outside pointer clicks and `results.length === 0` with non-empty query.
- **Processing Logic:** Close results overlay on outside click/tap (`mousedown`). When a non-empty query yields `0` results after index load, render an escaped no-match notice plus 7 clickable category quick-jump pills.
- **Outputs:** Predictable popover lifecycle and dead-end recovery.
- **Error Handling:** Clean up document event listeners on component unmount.

#### `SRS-FUNC-SRCH-06`: Dual Placement Modes (Hero vs. Header)
- **Inputs:** Component props (`variant: 'hero' | 'header'`, `enableGlobalShortcut?: boolean`).
- **Processing Logic:** Render prominent hero search input when `variant === 'hero'` and compact navbar search control when `variant === 'header'`, sharing identical scoring and keyboard behavior.
- **Outputs:** Consistent search capability across Home, Category, Article, and 404 pages.
- **Error Handling:** Prevent header overflow on `375px` mobile viewports.

---

### 4.4 Layout, Navigation & Disclaimers Subsystem

#### `SRS-FUNC-UI-01`: Responsive Global Header & Mobile Navigation
- **Inputs:** Navigation links (`Home`, `Categories`, `Campus Map`, `Contribute`) and active route path.
- **Processing Logic:** Render Geary brand link (`/`), top-level navigation links (`Home`, `Categories`, `Campus Map`, `Contribute`) on `>= 768px`, compact Header `<SearchBar />`, and an accessible hamburger toggle (`aria-expanded`, `aria-controls`) revealing navigation links below `768px`.
- **Outputs:** Single-row responsive `<header>` landmark across all pages.
- **Error Handling:** Lightweight progressive-enhancement menu toggle functions cleanly without blocking static page render.

#### `SRS-FUNC-UI-02`: Hierarchical Breadcrumb Trail
- **Inputs:** Route hierarchy context (`Home`, active category, optional article title).
- **Processing Logic:** Render `<nav aria-label="Breadcrumb">` linking `Home` → `[Category Name]` → active item (`aria-current="page"`).
- **Outputs:** Spatial orientation trail on Category and Article views.
- **Error Handling:** Long titles wrap cleanly inside narrow mobile containers.

#### `SRS-FUNC-UI-03`: Unofficial Disclaimers & Global Footer
- **Inputs:** Static disclaimer text and `SW-INT-01` category registry.
- **Processing Logic:** Render a verification notice banner at the bottom of every article referencing official BulSU offices (Registrar, Admissions, OSAS), and render a global `<footer>` with Geary's unofficial disclaimer and 7 category links.
- **Outputs:** Consistent transparency on every entry page.
- **Error Handling:** None (pure static HTML).

#### `SRS-FUNC-UI-04`: Low-Cognitive-Load Prose Container
- **Inputs:** Compiled Markdown HTML inside `<article>`.
- **Processing Logic:** Enforce constrained prose line measure (`~65ch`), generous line spacing, styled ordered steps and callouts, horizontal overflow wrapping (`overflow-x-auto`) around tables, and safe word wrapping (`break-words`) on long strings.
- **Outputs:** Readable prose across all target breakpoints without horizontal document overflow.
- **Error Handling:** Long unbroken URLs or inline code never push mobile viewport width beyond `100%`.

---

### 4.5 Interactive 2D Campus Map Subsystem (`/map`)

#### `SW-INT-04`: Static Campus Map Dataset Contract (`src/data/campus-map.ts`)
- Defines `CampusBuilding` (`id`, `name`, `shortLabel?`, `kind`, `floors?`, `svgPath`, `center`, `summary`, `locations: CampusLocation[]`), `CampusLocation` (`id`, `name`, `floor?`, `category`, `keywords?`, `notes?`, `articleSlug?`), and campus contextual geometry (`perimeterPath`, `roads`, `parks`, `gates`).

#### `SRS-FUNC-MAP-01`: Client-Side Location & Building Search
- **Inputs:** User query string and `CampusBuilding[]`.
- **Processing Logic:** Perform literal case-insensitive substring matching across `location.name`, `location.keywords`, `location.floor`, `building.name`, and `building.shortLabel`, prioritizing location matches (`label` + `parentBuildingName`) and building matches.
- **Outputs:** Ranked list of matching locations/buildings indicating which building houses each match.

#### `SRS-FUNC-MAP-02`: Interactive 2D SVG Map & Building Inspector
- **Inputs:** Selected building ID, highlighted location ID, zoom scale (`1` to `3`), and SVG viewBox pan offsets.
- **Processing Logic:** Highlight selected building footprint (`#8B1538` fill, `#D4A017` ring), smoothly zoom/pan viewBox onto building center when selected from search, and populate the side/bottom inspector panel with the building name and contained location names.
- **Outputs:** Synchronized 2D vector map + building detail panel plus accessible keyboard building index.

---

## 5. Non-Functional Requirements *(ISO 29148 Clause 9.6.3.3 & ISO/IEC 25010)*

### 5.1 Performance Efficiency

| ID | Quality Requirement | Target / Metric |
| :--- | :--- | :--- |
| **SRS-NFR-PERF-01** | All routes shall pre-render as static HTML at build time with zero server compute per request. | `0 ms` origin compute time; 100% static output. |
| **SRS-NFR-PERF-02** | Content pages shall ship zero client-side UI framework JS outside `<SearchBar />` and minimal menu toggles. | `0` unnecessary React roots on static prose. |
| **SRS-NFR-PERF-03** | The static `/search-index.json` file shall remain compact for cellular networks. | `< 100 KB` uncompressed JSON for MVP dataset. |
| **SRS-NFR-PERF-04** | Synchronous client search filtering shall complete within one animation frame. | `< 16 ms` filtering time on up to `200` articles. |

### 5.2 Usability & Accessibility

| ID | Quality Requirement | Target / Metric |
| :--- | :--- | :--- |
| **SRS-NFR-USAB-01** | Rendered foreground/background pairs shall satisfy WCAG 2.1 Level AA contrast. | `>= 4.5:1` for normal text; `>= 3.0:1` for large text and UI borders. |
| **SRS-NFR-USAB-02** | Pages shall use semantic HTML5 landmarks (`<header>`, `<nav>`, `<main>`, `<article>`, `<aside>`, `<footer>`) and strict heading hierarchy. | Exactly `1` `<h1>` per route; sequential `<h2>`–`<h4>` nesting. |
| **SRS-NFR-USAB-03** | All interactive controls shall be keyboard operable with visible `:focus-visible` rings and valid ARIA states (`aria-expanded`, `role="listbox"`, `role="option"`). | 100% keyboard-navigable user flows. |
| **SRS-NFR-USAB-04** | Pages shall maintain zero horizontal document overflow across target mobile, tablet, and desktop viewports. | `document.documentElement.scrollWidth <= window.innerWidth` at `375px`, `768px`, and `1280px`. |

### 5.3 Reliability & Fault Tolerance

| ID | Quality Requirement | Target / Metric |
| :--- | :--- | :--- |
| **SRS-NFR-REL-01** | On `/search-index.json` fetch failure, `<SearchBar />` shall handle rejections safely and provide working category fallback links. | `0` uncaught runtime promise rejections. |
| **SRS-NFR-REL-02** | All internal links and TOC anchors across generated static routes shall resolve without dead targets. | `0` broken internal routes across build output. |

### 5.4 Maintainability & Portability

| ID | Quality Requirement | Target / Metric |
| :--- | :--- | :--- |
| **SRS-NFR-MAINT-01** | Category taxonomy metadata (`SW-INT-01`) shall exist in one canonical module shared across schemas, routes, breadcrumbs, and search indexing. | Single source of truth; zero duplicate category lists. |
| **SRS-NFR-MAINT-02** | Compiled static artifacts (`dist/`) shall contain zero vendor-locked runtime adapters. | Portable across Cloudflare Pages, Vercel, Netlify, and GitHub Pages. |

### 5.5 Security

| ID | Quality Requirement | Target / Metric |
| :--- | :--- | :--- |
| **SRS-NFR-SEC-01** | User search input echoed in UI states shall rely strictly on React JSX escaping with zero raw HTML injection (`dangerouslySetInnerHTML`). | Resistant to DOM-based XSS via search queries. |
| **SRS-NFR-SEC-02** | Static deployment shall store or transmit zero user PII, cookies, credentials, or server secrets. | Zero runtime PII or credential attack surface. |
