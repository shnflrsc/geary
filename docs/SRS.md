# Software requirements specification (SRS): Geary (Unofficial BulSU Student Information Portal)

## 1. Introduction *(ISO 29148 Clauses 9.6.1 and 9.6.2)*

### 1.1 Document control and identification

| Attribute | Details |
| :--- | :--- |
| Document title | Software Requirements Specification (SRS): Geary - Unofficial BulSU Student Information Portal |
| Version | `1.0 (MVP Baseline)` |
| Date | `2026-11-17` |
| Standard reference | ISO/IEC/IEEE 29148:2018 Clause 9.6 (*Software Requirements Specification [SRS]*) and ISO/IEC 25010 (*Quality Attributes*) |
| Related baselines | [PROJECT_CHARTER.md](./PROJECT_CHARTER.md), [PRD.md](./PRD.md) |
| Specification directory | `docs/` |
| Status | Approved for Implementation |

### 1.2 Purpose and operating environment

This SRS defines the software-level constraints, external interface contracts, functional requirements, and non-functional quality requirements for Geary (`Astro SSG + Tailwind CSS + isolated React islands`). Contributors use this document as the technical reference when building features, updating schemas, or reviewing pull requests.

- Client environment: evergreen mobile and desktop browsers (Chrome, Safari, Firefox, Edge) across Android, iOS, Windows, and macOS over campus cellular (3G/4G/5G) and Wi-Fi networks.
- Build and contributor environment: Bun (and Node.js-compatible) toolchain running Astro static compilation (`bun run check`, `bun run build`) against Git-versioned UTF-8 Markdown sources.

### 1.3 Definitions, acronyms, and abbreviations

| Term or acronym | Definition |
| :--- | :--- |
| `SSG` | Static Site Generation: compiling templates and Markdown into static HTML, CSS, and JSON artifacts at build time. |
| Astro Content Collection | Astro's schema-validated static content registry for structured Markdown files. |
| React Island | An isolated interactive React component hydrated selectively inside static Astro HTML. |
| `Zod` | Schema validation library enforcing build-time frontmatter and payload constraints. |
| `JSON` | JavaScript Object Notation: static interchange format for `/search-index.json`. |
| `DOM` | Document Object Model: browser HTML tree rendered statically or updated declaratively by React. |
| `WCAG` | Web Content Accessibility Guidelines (Level AA under WCAG 2.1). |
| `BulSU` / `COR` / `TOR` / `INC` / `GWA` / `LOA` / `OSAS` | Bulacan State University domain terms: Certificate of Registration, Transcript of Records, Incomplete grade, General Weighted Average, Leave of Absence, Office of Student Affairs and Services. |

## 2. System constraints (`CON-*`)

### 2.1 Technical and architectural constraints

| ID | Constraint statement |
| :--- | :--- |
| `CON-TECH-01` | The software shall build in Astro static output mode (`output: 'static'`) with zero server-side rendering (SSR) adapters or runtime edge functions. |
| `CON-TECH-02` | Layout and component presentation shall be styled using Tailwind CSS utility classes and design tokens. |
| `CON-TECH-03` | React shall be hydrated strictly via Astro island directives (`client:load` or `client:idle`) and limited to stateful client interactivity (`<SearchBar />`, `<ExploreSpotlight />`, and `<CampusMap />`). |
| `CON-TECH-04` | TypeScript and Zod shall enforce compile-time type checking and build-time frontmatter schema validation across all content and data modules. |

### 2.2 Financial and operational constraints

| ID | Constraint statement |
| :--- | :--- |
| `CON-FIN-01` | Total recurring operational, hosting, storage, and third-party service cost shall remain strictly `$0.00/month`. |
| `CON-FIN-02` | The software shall not depend on runtime backend servers, managed databases, headless CMS subscriptions, or paid third-party APIs (including LLM or hosted search endpoints). |

### 2.3 Data and content constraints

| ID | Constraint statement |
| :--- | :--- |
| `CON-DATA-01` | All student article content shall reside as UTF-8 Markdown (`.md`) files under Git version control so multiple contributors can author and review changes through pull requests. |
| `CON-DATA-02` | Searchable article metadata and section headings shall be compiled at build time into a single static JSON file (`/search-index.json`). |

### 2.4 Scope, legal, and governance constraints

| ID | Constraint statement |
| :--- | :--- |
| `CON-GOV-01` | Software capabilities are locked strictly to the five MVP capabilities (Articles/Markdown, 7-Category Hierarchy, Client-Side Search Bar, Low-Cognitive-Load BulSUan UI/UX, and Interactive 2D Campus Map); AI/RAG chatbots, authentication, user submissions, and BulSU SIS integrations are prohibited. The existing embedded contribution form is a documented governance exception pending a dedicated scope decision. |
| `CON-GOV-02` | The software shall display an explicit unofficial disclaimer across the global footer and article views stating that Geary is student-maintained and unaffiliated with Bulacan State University administration. |

## 3. External interface requirements *(ISO 29148 Clause 9.6.3.2)*

### 3.1 User interfaces (`UI-INT-*`)

#### `UI-INT-01`: Logical route interface map

| Route pattern | Purpose |
| :--- | :--- |
| `/` | Home portal rendering the hero search bar, Featured articles, and the 7-Category Directory. |
| `/categories/[slug]` | Category directory listing articles grouped by `subcategory` with breadcrumb navigation. |
| `/articles/[slug]` | Distraction-free reading view with metadata header, responsive TOC, Markdown prose, disclaimer, and related articles. |
| `/calendar` | Interactive BulSU Academic Calendar (AY 2026–2027) with real-time search and category filtering. |
| `/map` | Interactive 2D SVG schematic of BulSU Malolos Main Campus with building inspector and location search. |
| `/404.html` | Branded recovery page embedding the search bar and links to all seven categories. |
| `/search-index.json` | Static JSON search payload consumed by `<SearchBar />`. |

#### `UI-INT-02`: Responsive viewport breakpoints

- Mobile (`< 768px`): single-column layout, collapsed header navigation toggle, collapsible `<details>` TOC above article prose, and horizontally scrollable table containers.
- Tablet (`768px - 1023px`): two-column directory grids, visible top navigation links, and collapsible `<details>` TOC above prose.
- Desktop (`>= 1024px`): multi-column directory grids and a two-column article layout pairing constrained prose with a sticky `"On this page"` TOC sidebar.

#### `UI-INT-03`: Visual and typographic design contract

All user interface surfaces, color contrasts, font stacks, spatial scales, and component interactive states shall conform strictly to the design tokens specified in [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md).

### 3.2 Software and data interfaces (`SW-INT-*`)

#### `SW-INT-01`: Canonical category registry contract

The system shall maintain a single canonical registry defining the 7 permitted category slugs (`enrollment`, `academics`, `documents`, `scholarships`, `policies`, `organizations`, `campus`) and their metadata fields:

| Field | Type / constraint | Description |
| :--- | :--- | :--- |
| `slug` | Canonical enum string | URL route identifier and foreign key referenced by articles. |
| `title` | Non-empty string | Human-readable category display name. |
| `description` | Non-empty string | Concise 1-line summary shown on directory cards and category headers. |
| `icon` | String identifier | Visual category icon key. |
| `order` | Positive integer (`1`-`7`) | Deterministic display order across navigation and directory views. |

#### `SW-INT-02`: Article frontmatter schema contract

| Field | Type / constraint | Required | Default |
| :--- | :--- | :--- | :--- |
| `title` | `string` (`min >= 1`) | Yes | None |
| `category` | `enum` matching `SW-INT-01` `slug` values | Yes | None |
| `subcategory` | `string` (`min >= 1`) | Yes | None |
| `updatedDate` | Coercible ISO date (`Date`) | Yes | None |
| `source` | `string` (`min >= 1`) | No | None |
| `sourceUrl` | Valid URL `string` | No | None |
| `sources` | `Array<{ label: string; url?: string }>` (`min >= 1`) | No | None |

#### `SW-INT-03`: Static search index payload contract (`GET /search-index.json`)

| Field | Type | Description |
| :--- | :--- | :--- |
| `slug` | `string` | URL segment for `/articles/[slug]`. |
| `title` | `string` | Article display title. |
| `preview` | `string` | Plain-text article preview extracted from the Markdown body. |
| `category` | `CategorySlug` | Canonical category slug. |
| `categoryLabel` | `string` | Human-readable category title resolved from `SW-INT-01`. |
| `subcategory` | `string` | Sub-topic grouping label. |
| `headings` | `string[]` | Extracted plain-text `h2` and `h3` headings. |

### 3.3 Communications interfaces (`COM-INT-01`)

- All HTML, CSS, JavaScript, and JSON assets shall be delivered over standard HTTPS (`GET` requests) from static hosting.
- Client-side search shall fetch `/search-index.json` asynchronously via same-origin `fetch('/search-index.json')` with zero authentication headers or cross-origin dependencies.

## 4. System functional requirements *(ISO 29148 Clause 9.6.3.1)*

### 4.1 Content ingestion and schema validation subsystem

#### `SRS-FUNC-CNT-01`: Markdown article discovery

- Inputs: UTF-8 `.md` files inside the articles content collection directory.
- Processing logic: enumerate all `.md` files at build time, separate YAML frontmatter from Markdown body text, and derive URL `slug` deterministically from filenames.
- Outputs: parsed collection entries passed to schema validation and static route builders.
- Error handling: malformed YAML syntax halts compilation immediately with file path and line diagnostics.

#### `SRS-FUNC-CNT-02`: Strict Zod frontmatter validation

- Inputs: raw YAML frontmatter dictionary per Markdown file.
- Processing logic: validate all fields against `SW-INT-02` (`title`, `category` enum, `subcategory`, coerced `updatedDate`, and optional `source`, `sourceUrl`, `sources`).
- Outputs: strongly typed metadata object attached to each collection entry.
- Error handling: missing fields, invalid dates, or unrecognized `category` values abort `astro build` / `astro check` with descriptive Zod diagnostics.

#### `SRS-FUNC-CNT-03`: Semantic Markdown compilation

- Inputs: validated Markdown body text.
- Processing logic: compile Markdown (including GFM tables, ordered/unordered lists, blockquotes, inline code, and links) to semantic HTML with unique URL-safe `id` attributes injected on `h2`-`h4` headings.
- Outputs: rendered HTML component injected inside the article prose container.
- Error handling: safe escaping of literal markup with zero raw script injection.

#### `SRS-FUNC-CNT-04`: Heading metadata extraction

- Inputs: parsed Markdown AST headings list.
- Processing logic: extract each heading's `depth` (`1`-`6`), anchor `slug`, and plain `text`.
- Outputs: structured headings list consumed by TOC generation (`SRS-FUNC-RND-05`) and search indexing (`SRS-FUNC-SRCH-01`).
- Error handling: articles without subheadings yield an empty array `[]` without throwing.

### 4.2 Static route and page generation subsystem

#### `SRS-FUNC-RND-01`: Home page directory and Featured aggregation (`/`)

- Inputs: validated article collection.
- Processing logic: sort all published articles deterministically by title and pass the pool into `<ExploreSpotlight />` (`client:load`), which deterministically shuffles and partitions 3 non-overlapping groups of 6 articles seeded by local calendar date (`YYYY-MM-DD`).
- Outputs: static `index.html` containing the hero search island and daily rotating 3x6 Featured section.
- Error handling: if the article collection is empty, omit the Featured section cleanly.

#### `SRS-FUNC-RND-02`: Category static path generation (`/categories/[slug]`)

- Inputs: canonical 7-category registry (`SW-INT-01`).
- Processing logic: emit one static route per canonical category slug via `getStaticPaths()`, ensuring all seven category URLs exist even when empty.
- Outputs: seven static HTML category pages.
- Error handling: unmatched `/categories/*` paths resolve to `/404.html` (`SRS-FUNC-RND-06`).

#### `SRS-FUNC-RND-03`: Deterministic subcategory grouping

- Inputs: articles belonging to the active category `slug`.
- Processing logic: group articles by `subcategory`, sort subcategory headers deterministically in alphabetical order, and sort articles alphabetically by `title` within each group.
- Outputs: subcategory sections containing scannable article cards (`title`, body `preview`).
- Error handling: when a category has `0` articles, render a simple empty-state icon and notice (e.g., *"No articles here yet."*).

#### `SRS-FUNC-RND-04`: Article static path generation (`/articles/[slug]`)

- Inputs: validated articles collection.
- Processing logic: emit one static route per article entry, binding metadata header (breadcrumb, `<h1>` title, formatted `Last Updated` date), social/JSON-LD meta derived from the article body preview, Markdown body, TOC, and optional source card.
- Outputs: static HTML file at `/articles/<slug>/index.html`.
- Error handling: duplicate file slugs fail compilation deterministically.

#### `SRS-FUNC-RND-05`: Conditional table of contents generation

- Inputs: extracted `headings` array for the active article.
- Processing logic: filter headings where `depth === 2 || depth === 3` and evaluate `tocHeadings.length >= 2`.
- Outputs:
  - If `>= 2`: render a sticky desktop `<aside>` TOC (`>= 1024px`) and a collapsed `<details>` mobile TOC (`< 1024px`) linking to `#${heading.slug}` with indented `h3` items.
  - If `< 2`: suppress TOC rendering entirely on all viewports.
- Error handling: ensure no empty `<aside>` column or blank disclosure box renders when suppressed.

#### `SRS-FUNC-RND-06`: Related articles resolution and custom `404` page

- Inputs: active article (`slug`, `category`), article collection, and category registry.
- Processing logic: filter articles matching `a.category === current.category && a.slug !== current.slug`, sort deterministically, and cap at `3` entries. Independently generate `/404.html` embedding `<SearchBar />` and links to all 7 categories.
- Outputs: up to 3 sibling article cards below the verification notice (omitted if `0` siblings exist), plus static `404.html`.
- Error handling: never display the active article inside its own related articles list.

### 4.3 Static search index and client-side search subsystem

#### `SRS-FUNC-SRCH-01`: Build-time search index serialization

- Inputs: validated articles collection and `SW-INT-01` category registry.
- Processing logic: serialize every published article into a `SearchIndexItem` (`SW-INT-03`) containing `slug`, `title`, body `preview`, `category`, `categoryLabel`, `subcategory`, and plain-text `h2`/`h3` `headings`.
- Outputs: static `search-index.json` artifact served with `application/json` content type.
- Error handling: type-checked category mapping prevents missing labels at build time.

#### `SRS-FUNC-SRCH-02`: Lazy client-side index fetching and caching

- Inputs: first focus or input interaction on `<SearchBar />`.
- Processing logic: check in-memory cache; if empty, set loading state, execute `fetch('/search-index.json')`, parse JSON, and cache in memory for the browser session.
- Outputs: cached `SearchIndexItem[]` ready for synchronous filtering.
- Error handling: catch network or non-200 HTTP failures without uncaught exceptions, rendering an inline retry/offline notice with direct category links (`SRS-NFR-REL-01`).

#### `SRS-FUNC-SRCH-03`: Multi-term query normalization and weighted scoring

- Inputs: raw user query string and cached `SearchIndexItem[]`.
- Processing logic:
  1. Trim and lowercase query, splitting whitespace into search tokens. Return an empty array `[]` when empty.
  2. Match tokens using safe literal substring checks (`String.includes`), applying weighted scores: `title` (`+10`/token, `+20` exact phrase) > `headings`/`subcategory` (`+5`/token) > `preview` (`description`)/`categoryLabel` (`+2`/token).
  3. Filter scores `> 0`, sort descending by score (breaking ties alphabetically by `title`), and slice the top `8` matches.
- Outputs: ranked list of up to 8 matching `SearchIndexItem` results.
- Error handling: special punctuation (`[`, `(`, `*`, `?`, `\`) is evaluated literally without `RegExp` construction crashes.

#### `SRS-FUNC-SRCH-04`: Global and local keyboard navigation

- Inputs: document `keydown` events and search input `keydown` events.
- Processing logic:
  - Global listener: pressing `/` or `Ctrl+K` (`Cmd+K`) when focus is outside `<input>`, `<textarea>`, or `[contenteditable]` prevents default behavior and focuses the designated primary `<SearchBar />`.
  - Local listener (overlay active): `ArrowDown` / `ArrowUp` cycles `activeIndex`, `Enter` navigates to `/articles/${selected.slug}`, and `Escape` closes the overlay.
- Outputs: full mouseless search-to-article workflow.
- Error handling: designate a single instance to register global hotkeys when both Hero and Header search bars mount on `/`.

#### `SRS-FUNC-SRCH-05`: Dismissal and zero-match fallback UI

- Inputs: outside pointer clicks and `results.length === 0` with non-empty query.
- Processing logic: close the results overlay on outside click or tap (`mousedown`). When a non-empty query yields `0` results after index load, render an escaped no-match notice plus 7 clickable category quick-jump pills.
- Outputs: predictable popover lifecycle and dead-end recovery.
- Error handling: clean up document event listeners on component unmount.

#### `SRS-FUNC-SRCH-06`: Dual placement modes (Hero vs. Header)

- Inputs: component props (`variant: 'hero' | 'header'`, `enableGlobalShortcut?: boolean`).
- Processing logic: render a prominent hero search input when `variant === 'hero'` and a compact navbar search control when `variant === 'header'`, sharing identical scoring and keyboard behavior.
- Outputs: consistent search capability across Home, Category, Article, and 404 pages.
- Error handling: prevent header overflow on `375px` mobile viewports.

### 4.4 Layout, navigation, and disclaimers subsystem

#### `SRS-FUNC-UI-01`: Responsive global header and mobile navigation

- Inputs: navigation links (`Home`, `Categories`, `Campus Map`, `Contribute`) and active route path.
- Processing logic: render the Geary brand link (`/`), top-level navigation links (`Home`, `Categories`, `Campus Map`, `Contribute`) on `>= 768px`, compact Header `<SearchBar />`, and an accessible hamburger toggle (`aria-expanded`, `aria-controls`) revealing navigation links below `768px`.
- Outputs: single-row responsive `<header>` landmark across all pages.
- Error handling: lightweight progressive-enhancement menu toggle works without blocking static page render.

#### `SRS-FUNC-UI-02`: Hierarchical breadcrumb trail

- Inputs: route hierarchy context (`Home`, active category, optional article title).
- Processing logic: render `<nav aria-label="Breadcrumb">` linking `Home` > `[Category Name]` > active item (`aria-current="page"`).
- Outputs: spatial orientation trail on Category and Article views.
- Error handling: long titles wrap cleanly inside narrow mobile containers.

#### `SRS-FUNC-UI-03`: Unofficial disclaimers and global footer

- Inputs: static disclaimer text and `SW-INT-01` category registry.
- Processing logic: render a verification notice banner at the bottom of every article referencing official BulSU offices (Registrar, Admissions, OSAS), and render a global `<footer>` with Geary's unofficial disclaimer and 7 category links.
- Outputs: consistent transparency on every entry page.
- Error handling: none (pure static HTML).

#### `SRS-FUNC-UI-04`: Low-cognitive-load prose container

- Inputs: compiled Markdown HTML inside `<article>`.
- Processing logic: enforce constrained prose line measure (`~65ch`), generous line spacing, styled ordered steps and callouts, horizontal overflow wrapping (`overflow-x-auto`) around tables, and safe word wrapping (`break-words`) on long strings.
- Outputs: readable prose across all target breakpoints without horizontal document overflow.
- Error handling: long unbroken URLs or inline code never push mobile viewport width beyond `100%`.

### 4.5 Interactive 2D campus map subsystem (`/map`)

#### `SW-INT-04`: Static campus map dataset contract (`src/data/campus-map.ts`)

Defines `CampusBuilding` (`id`, `name`, `shortLabel?`, `kind`, `floors?`, `svgPath`, `center`, `summary`, `locations: CampusLocation[]`), `CampusLocation` (`id`, `name`, `floor?`, `category`, `keywords?`, `notes?`, `articleSlug?`), and campus contextual geometry (`perimeterPath`, `roads`, `parks`, `gates`).

#### `SRS-FUNC-MAP-01`: Client-side location and building search

- Inputs: user query string and `CampusBuilding[]`.
- Processing logic: perform literal case-insensitive substring matching across `location.name`, `location.keywords`, `location.floor`, `building.name`, and `building.shortLabel`, prioritizing location matches (`label` + `parentBuildingName`) and building matches.
- Outputs: ranked list of matching locations and buildings indicating which building houses each match.

#### `SRS-FUNC-MAP-02`: Interactive 2D SVG map and building inspector

- Inputs: selected building ID, highlighted location ID, zoom scale (`1` to `3`), and SVG viewBox pan offsets.
- Processing logic: highlight the selected building footprint (`#8B1538` fill, `#D4A017` ring), smoothly zoom and pan the viewBox onto the building center when selected from search, and populate the side or bottom inspector panel with the building name and contained location names.
- Outputs: synchronized 2D vector map, building detail panel, and accessible keyboard building index.

## 5. Non-functional requirements *(ISO 29148 Clause 9.6.3.3 and ISO/IEC 25010)*

### 5.1 Performance efficiency

| ID | Quality requirement | Target / metric |
| :--- | :--- | :--- |
| `SRS-NFR-PERF-01` | All routes shall pre-render as static HTML at build time with zero server compute per request. | `0 ms` origin compute time; 100% static output. |
| `SRS-NFR-PERF-02` | Content pages shall ship zero client-side UI framework JS outside `<SearchBar />` and minimal menu toggles. | `0` unnecessary React roots on static prose. |
| `SRS-NFR-PERF-03` | The static `/search-index.json` file shall remain compact for cellular networks. | `< 100 KB` uncompressed JSON for MVP dataset. |
| `SRS-NFR-PERF-04` | Synchronous client search filtering shall complete within one animation frame. | `< 16 ms` filtering time on up to `200` articles. |

### 5.2 Usability and accessibility

| ID | Quality requirement | Target / metric |
| :--- | :--- | :--- |
| `SRS-NFR-USAB-01` | Rendered foreground/background pairs shall satisfy WCAG 2.1 Level AA contrast. | `>= 4.5:1` for normal text; `>= 3.0:1` for large text and UI borders. |
| `SRS-NFR-USAB-02` | Pages shall use semantic HTML5 landmarks (`<header>`, `<nav>`, `<main>`, `<article>`, `<aside>`, `<footer>`) and strict heading hierarchy. | Exactly `1` `<h1>` per route; sequential `<h2>`-`<h4>` nesting. |
| `SRS-NFR-USAB-03` | All interactive controls shall be keyboard operable with visible `:focus-visible` rings and valid ARIA states (`aria-expanded`, `role="listbox"`, `role="option"`). | 100% keyboard-navigable user flows. |
| `SRS-NFR-USAB-04` | Pages shall maintain zero horizontal document overflow across target mobile, tablet, and desktop viewports. | `document.documentElement.scrollWidth <= window.innerWidth` at `375px`, `768px`, and `1280px`. |

### 5.3 Reliability and fault tolerance

| ID | Quality requirement | Target / metric |
| :--- | :--- | :--- |
| `SRS-NFR-REL-01` | On `/search-index.json` fetch failure, `<SearchBar />` shall handle rejections safely and provide working category fallback links. | `0` uncaught runtime promise rejections. |
| `SRS-NFR-REL-02` | All internal links and TOC anchors across generated static routes shall resolve without dead targets. | `0` broken internal routes across build output. |

### 5.4 Maintainability and portability

| ID | Quality requirement | Target / metric |
| :--- | :--- | :--- |
| `SRS-NFR-MAINT-01` | Category taxonomy metadata (`SW-INT-01`) shall exist in one canonical module shared across schemas, routes, breadcrumbs, and search indexing so contributors never edit duplicate lists. | Single source of truth; zero duplicate category lists. |
| `SRS-NFR-MAINT-02` | Compiled static artifacts (`dist/`) shall contain zero vendor-locked runtime adapters. | Portable across Cloudflare Pages, Vercel, Netlify, and GitHub Pages. |

### 5.5 Security

| ID | Quality requirement | Target / metric |
| :--- | :--- | :--- |
| `SRS-NFR-SEC-01` | User search input echoed in UI states shall rely strictly on React JSX escaping with zero raw HTML injection (`dangerouslySetInnerHTML`). | Resistant to DOM-based XSS via search queries. |
| `SRS-NFR-SEC-02` | Static deployment shall store or transmit zero user PII, cookies, credentials, or server secrets. | Zero runtime PII or credential attack surface. |
