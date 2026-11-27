# Product requirements document (PRD): Geary (Unofficial BulSU Student Information Portal)

## 1. Document control and purpose

### 1.1 Document metadata

| Attribute | Details |
| :--- | :--- |
| Document title | Product Requirements Document: Geary - Unofficial BulSU Student Information Portal |
| Version | `1.0 (MVP Baseline)` |
| Date | `2026-11-17` |
| Standard reference | Adapted from ISO/IEC/IEEE 29148:2018 (*Systems and software engineering - Life cycle processes - Requirements engineering*, Clauses 9.4 [StRS] and 9.5 [SRS]) |
| Related baseline | [PROJECT_CHARTER.md](./PROJECT_CHARTER.md) (`v1.0 MVP Baseline`) |
| Specification directory | `docs/` (companion technical spec: [SRS.md](./SRS.md)) |
| Status | Approved for Implementation |

### 1.2 Purpose

This PRD defines the MVP feature set, expected product behavior, release priorities, and acceptance criteria for Geary so contributors across engineering, design, and writing work from the same contract. Scope is bounded to nine confirmed capabilities:

1. Articles and Markdown content (`F-01`)
2. Categories and purposeful organization (`F-02`)
3. Instant client-side search bar (`F-03`)
4. Low-cognitive-load UI/UX and BulSUan identity (`F-04`)
5. Interactive 2D campus map (`F-05`)
6. Interactive Academic Calendar (`F-06`)
7. Read-only MCP server for AI assistants (`F-07`)
8. Ask-the-Handbook Q&A (`F-08`)
9. Interactive Document Request Wizard (`F-09`) *(approved post-MVP enhancement)*

## 2. Prioritization framework

Every requirement in this PRD carries a release priority:

| Priority level | Meaning | Release gate |
| :--- | :--- | :--- |
| `P0` (Must-Have / Core MVP) | Required for Geary to work as a centralized, searchable student information portal. | Mandatory for MVP launch; release is blocked if any `P0` acceptance criterion fails. |
| `P1` (Should-Have / MVP UX Polish) | Usability, orientation, and skimming features included in the MVP baseline. | Included in the MVP target release to keep cognitive load low and discovery fast. |
| `Won't Have` (Out of Scope) | Capabilities excluded under [PROJECT_CHARTER.md](./PROJECT_CHARTER.md) (general-purpose AI chatbot, user accounts, databases, official SIS integration). | Excluded from the MVP. |

## 3. Features, product behavior, and acceptance criteria

### 3.1 Feature 1: Articles and Markdown content (`F-01`)

#### Requirements specification

| Req ID | Priority | Requirement statement |
| :--- | :--- | :--- |
| `REQ-ART-01` | `P0` | The system shall publish student articles authored in Markdown and validate required metadata fields (`title`, `category`, `subcategory`, and `updatedDate`) during site compilation. |
| `REQ-ART-02` | `P0` | The system shall render standard and tabular Markdown elements (headings, numbered procedures, bulleted lists, tables, callout blockquotes, and links) into clear, readable HTML pages. |
| `REQ-ART-03` | `P0` | Every article view shall display an informative header containing breadcrumbs, article title, and a formatted *Last Updated* date. |
| `REQ-ART-04` | `P1` | The system shall automatically generate an "On this page" Table of Contents from an article's major and minor section headings, displayed as a sticky sidebar on desktop and a collapsible disclosure panel above the article on mobile, and hide it completely when fewer than 2 headings exist. |
| `REQ-ART-05` | `P1` | The system shall display a related articles section showing up to 3 sibling articles from the same category alongside an unofficial verification notice at the bottom of each article. |

#### Product behavior

Every article needs valid metadata matching one of the seven approved category identifiers. Missing fields, invalid dates, or unknown categories fail the build with a clear error message so broken articles never go live or pass pull request checks.

When a student opens an article, the header immediately shows the breadcrumb trail, title, and *Last Updated* date. On articles with 2 or more section headings, mobile readers get a collapsed-by-default `"On this page"` panel near the top so the text starts right away, while desktop readers get a sticky sidebar to jump between sections. At the bottom of the article, a verification notice reminds students to confirm time-sensitive fees and deadlines with official BulSU offices, followed by up to 3 sibling articles from the same category (omitted if no sibling articles exist yet).

#### Acceptance criteria

- `AC-ART-01` (`REQ-ART-01`):
  - *Given* a Markdown article with complete, valid metadata, *When* the site builds, *Then* a dedicated static article page is generated without errors.
  - *Given* an article missing required metadata or using an unrecognized category identifier, *When* the site builds, *Then* compilation fails with a clear message identifying the offending file and field.
- `AC-ART-02` (`REQ-ART-02`):
  - *Given* an article containing headings, numbered steps, bullet lists, tables, blockquotes, and links, *When* viewed on mobile and desktop screens, *Then* all elements render cleanly and tables do not push the page wider than the viewport.
- `AC-ART-03` (`REQ-ART-03`):
  - *Given* any published article page, *When* opened by a student, *Then* the breadcrumb, main title, and formatted *Last Updated* date appear clearly above the body text.
- `AC-ART-04` (`REQ-ART-04`):
  - *Given* an article with 2 or more section headings, *When* viewed on desktop, *Then* the "On this page" navigation appears as a sticky side rail; *When* viewed on mobile, *Then* it appears as a collapsible toggle above the prose.
  - *Given* an article with fewer than 2 section headings, *When* viewed on any screen size, *Then* no Table of Contents box or empty column is rendered.
- `AC-ART-05` (`REQ-ART-05`):
  - *Given* an article in a category containing multiple articles, *When* scrolling to the end of the article, *Then* up to 3 different sibling articles from the same category appear beneath the verification notice without duplicating the active article.

### 3.2 Feature 2: Categories and purposeful organization (`F-02`)

#### Requirements specification

| Req ID | Priority | Requirement statement |
| :--- | :--- | :--- |
| `REQ-CAT-01` | `P0` | The system shall organize all content under seven student-intent categories: `enrollment` (*Enrollment*), `academics` (*Academics*), `documents` (*Documents*), `scholarships` (*Scholarships*), `policies` (*Policies*), `organizations` (*Organizations*), and `campus` (*Campus*). |
| `REQ-CAT-02` | `P0` | The Home page shall present a Category Directory showing all seven categories with each category's summary description, live article count, and direct preview links to top articles. |
| `REQ-CAT-03` | `P0` | Each category page shall group its articles visually under `subcategory` headings instead of a chronological blog timeline. |
| `REQ-CAT-04` | `P1` | Category and article pages shall display clickable breadcrumb navigation (`Home › [Category Name]` and `Home › [Category Name] › [Article Title]`) for spatial orientation. |
| `REQ-CAT-05` | `P1` | Removed from MVP: the Home hero no longer displays a daily article spotlight. |

#### Product behavior

Geary organizes articles around what a student needs to get done, not when a post was published. The Home hero provides search and links to the academic calendar, campus map, and contribution page.

Opening any category page shows breadcrumbs, a short category summary, and articles grouped under sub-topic headings (such as *Shifting & Transferring*, *Document Requests*, or *Food & Dining*). If a category has zero articles yet, the page renders a clear empty-state message with a link back to Home.

#### Acceptance criteria

- `AC-CAT-01` (`REQ-CAT-01`):
  - *Given* the seven defined categories, *When* the site builds, *Then* dedicated directory pages exist for all seven category slugs.
- `AC-CAT-02` (`REQ-CAT-02`):
  - *Given* the Home page, *When* loaded, *Then* all seven category cards appear with accurate article counts, descriptions, category links, and up to 3 direct article preview links each.
- `AC-CAT-03` (`REQ-CAT-03`):
  - *Given* a category with articles across multiple subcategories, *When* visiting that category page, *Then* articles appear grouped under their respective subcategory headings.
- `AC-CAT-04` (`REQ-CAT-04`):
  - *Given* any category or article page, *When* clicking `Home` or `[Category Name]` in the breadcrumb trail, *Then* the browser navigates cleanly to the corresponding parent page.
- `AC-CAT-05` (`REQ-CAT-05`): Retired with the spotlight feature.

### 3.3 Feature 3: Instant client-side search bar (`F-03`)

#### Requirements specification

| Req ID | Priority | Requirement statement |
| :--- | :--- | :--- |
| `REQ-SRCH-01` | `P0` | The system shall generate a static client-side search index at build time containing each published article's route identifier, title, body preview, category label, subcategory, and section headings. |
| `REQ-SRCH-02` | `P0` | The system shall provide an interactive search bar prominently in the Home hero and accessibly inside the global header across all pages. |
| `REQ-SRCH-03` | `P0` | The search bar shall match user queries instantaneously in the browser against titles, section headings, subcategories, category labels, and body previews, presenting ranked results. |
| `REQ-SRCH-04` | `P1` | The search bar shall support complete keyboard operation: `/` or `Ctrl+K` (`Cmd+K`) to focus, `ArrowUp`/`ArrowDown` to move through results, `Enter` to open the selected article, and `Escape` to close. |
| `REQ-SRCH-05` | `P1` | When a query produces zero matching articles (or when the search index cannot load), the search overlay shall display a clear fallback message with clickable quick-jump links to all seven categories. |

#### Product behavior

Focusing or typing in the search bar fetches the static search index once and caches it in browser memory for the session. Multi-word queries (such as `"tor request"` or `"latin honors"`) rank title matches highest, followed by heading and subcategory matches, then body preview and category matches, showing up to 8 top results.

Clicking outside the search box, pressing `Escape`, or clearing the input dismisses the overlay. Special punctuation in queries is matched as literal plain text.

#### Acceptance criteria

- `AC-SRCH-01` (`REQ-SRCH-01`):
  - *Given* a completed build, *When* inspecting the generated search index, *Then* every published article is present with its slug, title, body preview, category metadata, subcategory, and extracted headings.
- `AC-SRCH-02` (`REQ-SRCH-02`):
  - *Given* any page on the site (Home, Category, Article, or 404), *When* a user interacts with the hero or header search bar, *Then* the search interface activates with no runtime errors.
- `AC-SRCH-03` (`REQ-SRCH-03`):
  - *Given* an article titled `"How to Request a Transcript of Records (TOR)"` or containing a section heading `"INC Grade Completion"`, *When* a student types `"TOR"` or `"INC"`, *Then* the article appears immediately in the ranked dropdown with its category badge and opens upon selection.
- `AC-SRCH-04` (`REQ-SRCH-04`):
  - *Given* a user pressing `/` or `Ctrl+K` (`Cmd+K`) outside text inputs, *Then* the search input focuses; *When* cycling results with `ArrowDown`/`ArrowUp` and pressing `Enter`, *Then* the browser navigates to the highlighted article; *When* pressing `Escape`, *Then* the results overlay closes.
- `AC-SRCH-05` (`REQ-SRCH-05`):
  - *Given* a query matching zero articles, *When* typed into the search bar, *Then* a no-results notice appears alongside clickable links to all seven categories.

### 3.4 Feature 4: Low-cognitive-load UI/UX and BulSUan identity (`F-04`)

#### Requirements specification

| Req ID | Priority | Requirement statement |
| :--- | :--- | :--- |
| `REQ-UI-01` | `P0` | The system shall present a BulSUan visual identity built around BulSU Crimson primary accents, Gear Gold secondary highlights, a warm low-glare reading background, clean white card surfaces, and high-contrast dark typography. |
| `REQ-UI-02` | `P0` | Article views shall maintain a comfortable reading width, generous line spacing, and clear visual distinction between steps, callouts, and tables to keep cognitive load low on mobile and desktop screens. |
| `REQ-UI-03` | `P0` | Every page shall include a responsive global Header (Geary gear brand mark, category navigation, and search access), and all standard content pages shall include the global Footer (unofficial student information portal disclaimer and category directory links; `/map` omits the Footer to preserve a non-scrolling full-viewport map canvas). |
| `REQ-UI-04` | `P1` | Subtle "Geary" geometric gear motifs and BulSU accents shall reinforce brand identity in navigation and hero areas while keeping article reading containers distraction-free. |
| `REQ-UI-05` | `P1` | The system shall provide a custom `404` recovery page styled in the Geary theme containing the search bar and direct links to all seven categories and Home. |

#### Product behavior

Long university articles sit on a warm paper-toned canvas inside a focused reading column to reduce glare and eye fatigue. Below tablet width, header navigation collapses into an accessible menu toggle.

Visiting an outdated bookmark or broken URL loads the branded `404` page with a search bar and direct links to Home and all seven categories so students can recover immediately.

#### Acceptance criteria

- `AC-UI-01` (`REQ-UI-01`):
  - *Given* any rendered page, *When* inspected visually, *Then* the interface consistently displays the warm paper canvas, crisp card surfaces, dark high-contrast body text, BulSU Crimson links and accents, and restrained Gear Gold highlights.
- `AC-UI-02` (`REQ-UI-02`):
  - *Given* any article page on mobile or desktop, *When* reading prose and tables, *Then* text stays comfortably constrained in width with generous spacing and zero horizontal page scrolling.
- `AC-UI-03` (`REQ-UI-03`):
  - *Given* any page on mobile or desktop, *When* checking top and bottom navigation, *Then* the Header (brand mark, responsive category menu, search) and Footer (unofficial disclaimer and category links) render without overlap or clipping.
- `AC-UI-04` (`REQ-UI-04`):
  - *Given* the main article reading area, *When* scrolling through content, *Then* no background watermarks, animations, or promotional popups interfere with reading comprehension.
- `AC-UI-05` (`REQ-UI-05`):
  - *Given* an invalid URL path, *When* the `404` page displays, *Then* students see a clear recovery message, an interactive search bar, and links to Home and all seven categories.

### 3.5 Feature 5: Interactive 2D campus map (`/map`) (`F-05`)

#### Requirements specification

| Req ID | Priority | Requirement statement |
| :--- | :--- | :--- |
| `REQ-MAP-01` | `P0` | The system shall render a 2D interactive SVG schematic of BulSU Malolos Main Campus derived from OpenStreetMap building footprints, walkways, gates, and landmarks without external tile servers. |
| `REQ-MAP-02` | `P0` | Clicking or selecting any campus building shall highlight it and display its name and contained locations and offices inside a floating locations card on desktop or a collapsible bottom sheet on mobile (collapsed by default when no building is selected). |
| `REQ-MAP-03` | `P0` | A dedicated campus search bar shall search across both buildings and indoor locations (such as Registrar, Clinic, Cashier, OSFAS, Library, and Canteen) and indicate which building contains each match; selecting a match highlights and centers that building on the map. |
| `REQ-MAP-04` | `P1` | The map canvas shall support pan, zoom-in, zoom-out, and reset controls alongside keyboard-accessible building elements. |

#### Acceptance criteria

- `AC-MAP-01` (`REQ-MAP-01`): *Given* `/map`, *When* loaded, *Then* the 2D BulSU Malolos SVG schematic renders with zero external map tile requests and zero horizontal overflow on mobile or desktop.
- `AC-MAP-02` (`REQ-MAP-02`): *Given* any clickable building on the map, *When* clicked, *Then* the building highlights in BulSU Crimson (`#8B1538`) and the inspector displays its name and contained locations and offices.
- `AC-MAP-03` (`REQ-MAP-03`): *Given* a query such as `"Registrar"` or `"Scholarship"` typed into the campus map search bar, *When* matching locations appear, *Then* each result shows its parent building name (`Flores Hall`, `College of Law Annex / Near College of Law`, etc.), and selecting it focuses that building on the map and shows the matched location in the inspector.
- `AC-MAP-04` (`REQ-MAP-04`): *Given* pan/zoom buttons and reset control, *When* triggered by mouse or keyboard, *Then* the SVG viewport zooms cleanly and resets back to full campus view.

### 3.6 Feature 6: Interactive Academic Calendar (`/calendar`) (`F-06`)

#### Requirements specification

| Req ID | Priority | Requirement statement |
| :--- | :--- | :--- |
| `REQ-CAL-01` | `P1` | The system shall render the official BulSU Academic Calendar (sourced from BulSU Office of the Student Regent advisories) grouped chronologically by month on `/calendar` with zero external runtime APIs. |
| `REQ-CAL-02` | `P1` | Each calendar event shall be categorized using the OSR legend (`Undergraduate`, `Graduate School`, `Laboratory High School`, `College of Law`, `College of Medicine`, `Holiday`) plus `Universal` for general university-wide events. |
| `REQ-CAL-03` | `P1` | Visitors shall be able to search calendar events by keyword or month/date and filter by category chips instantaneously on the client. |
| `REQ-CAL-04` | `P1` | The global Header navigation shall link directly to `/calendar` (`Calendar`) between `Articles` and `Campus Map`. |

#### Acceptance criteria

- `AC-CAL-01` (`REQ-CAL-01`, `REQ-CAL-02`): *Given* `/calendar`, *When* loaded, *Then* AY 2026–2027 events appear chronologically grouped by month with category badges and OSR source attribution.
- `AC-CAL-02` (`REQ-CAL-03`): *Given* a search query (e.g., `"Mid-term"` or `"Graduation"`) or a category filter selection (e.g., `Holiday` or `College of Law`), *When* applied, *Then* matching events update instantaneously without page reload, and clearing filters restores the full schedule.

### 3.7 Feature 7: Read-only MCP server for AI assistants (`F-07`)

#### Requirements specification

| Req ID | Priority | Requirement statement |
| :--- | :--- | :--- |
| `REQ-MCP-01` | `P1` | The system shall expose a public, unauthenticated Cloudflare Worker MCP endpoint speaking JSON-RPC 2.0 over Streamable HTTP (`tools/list` and `tools/call`) with no write tools. |
| `REQ-MCP-02` | `P1` | The `search_articles` tool shall accept a `query` string and optional `category` filter drawn from the 7 canonical category slugs (`SW-INT-01`) and return ranked matches across article title, subcategory, preview, and Markdown body. |
| `REQ-MCP-03` | `P1` | The `get_article` tool shall return the complete source Markdown of one article (frontmatter plus body) byte-identical to `src/content/articles/` for a valid `slug`, and shall return a clean tool-level error for unknown slugs. |
| `REQ-MCP-04` | `P1` | The `list_categories` and `get_freshness` tools shall expose the category/subcategory article tree and the oldest `updatedDate` per category so agents can discover scope and warn about stale content. |

#### Product behavior

- Build-time corpus: the Worker serves a corpus JSON emitted at request time by `src/routes/corpus.json/+server.ts` (SSR endpoint backed by the same validated articles collection), containing every published article's slug, metadata, resolved sources, preview, and raw Markdown. The Worker fetches and caches this dump; it never reads the content collection at runtime.
- Read-only public surface: all four tools are pure lookups over the static corpus. Unknown slugs, invalid categories, and malformed JSON-RPC payloads return protocol or tool-level errors without crashing the Worker.

#### Acceptance criteria

- `AC-MCP-01` (`REQ-MCP-01`): *Given* an MCP client, *When* it POSTs `initialize`, `tools/list`, and `tools/call` JSON-RPC messages to the Worker endpoint, *Then* it receives spec-shaped responses listing `search_articles`, `get_article`, `list_categories`, and `get_freshness`.
- `AC-MCP-02` (`REQ-MCP-02`): *Given* a query such as `"TOR request"` with or without a `category` filter, *When* `search_articles` runs, *Then* matching articles rank by title/body relevance and out-of-enum categories are rejected.
- `AC-MCP-03` (`REQ-MCP-03`): *Given* a published slug, *When* `get_article` runs, *Then* the returned Markdown equals the source file verbatim; *Given* an unknown slug, *Then* a clean error is returned.
- `AC-MCP-04` (`REQ-MCP-04`): *Given* the corpus, *When* `list_categories` or `get_freshness` runs, *Then* the full 7-category tree with subcategory groupings and per-category oldest `updatedDate` values is returned.

### 3.8 Feature 8: Ask-the-Handbook Q&A (`/ask`) (`F-08`)

#### Requirements specification

| Req ID | Priority | Requirement statement |
| :--- | :--- | :--- |
| `REQ-ASK-01` | `P0` | The system shall compile a static ask corpus (`/ask-index.json`) containing every published article's slug, title, excerpt, category metadata, subcategory, section headings, `updatedDate`, article URL, and body text chunked into retrievable passages. |
| `REQ-ASK-02` | `P0` | The `/ask` page shall provide an interactive question input that retrieves the top-k most relevant corpus chunks client-side before any network answer call, ranking by weighted literal token matching consistent with site search. |
| `REQ-ASK-03` | `P0` | When sufficient retrieved evidence exists, the system shall send only the question and retrieved chunks to a single stateless `/api/ask` endpoint backed by Cloudflare Workers AI, and render the answer with inline `[n]` citations linking to the cited article URLs plus a sources list showing each article's title, category, and last-updated date. |
| `REQ-ASK-04` | `P0` | The system shall answer strictly from retrieved chunks: questions below the evidence threshold, or answers the model marks as not covered, shall return the guides index (category links and article directory) instead of invented content. |
| `REQ-ASK-05` | `P1` | Answers shall surface `updatedDate` freshness for time-sensitive topics (fees, schedules, deadlines), and the feature shall keep queries ephemeral: retrieval runs in the browser and only the answer request leaves the client, with nothing stored server-side. |

#### Product behavior

- Question-first answers: a student types a natural-language question (e.g., "how do I apply for a scholarship") on `/ask`. The browser downloads the static ask corpus once, retrieves the best-matching passages locally, and only then calls the answer endpoint.
- Grounded, cited responses: the model sees only the retrieved passages plus their metadata. Every factual claim carries an inline `[n]` citation that links to the matching `/articles/[slug]` page; a "Sources" list beneath the answer repeats each article title with its *Last updated* date so students can judge freshness before trusting fees or deadlines.
- Honest fallbacks: when retrieval finds too little evidence, or the model reports the corpus does not cover the question, the page shows a calm not-covered notice with links to all seven categories and the article directory — never a fabricated answer.
- Privacy posture: search-style retrieval stays client-side; the only data transmitted is the single answer request containing the question and public article text. Geary stores nothing.

#### Acceptance criteria

- `AC-ASK-01` (`REQ-ASK-01`): *Given* a completed build, *When* fetching `/ask-index.json`, *Then* every published article appears with slug, title, excerpt, category, subcategory, headings, ISO `updatedDate`, URL, and at least one non-empty text chunk.
- `AC-ASK-02` (`REQ-ASK-02`): *Given* the `/ask` page, *When* a student submits "how do I apply for a scholarship", *Then* the client retrieves chunks locally (the answer endpoint is not called when evidence is insufficient) and ranked sources correspond to real indexed articles.
- `AC-ASK-03` (`REQ-ASK-03`): *Given* a covered question, *When* the answer returns, *Then* the response renders as text with inline `[n]` markers converted to links pointing at `/articles/<slug>` URLs, followed by a sources list showing title, category, and formatted last-updated date for each cited article.
- `AC-ASK-04` (`REQ-ASK-04`): *Given* a question with no corpus coverage (e.g., unrelated trivia) *or* a model `NOT_COVERED` response, *When* rendered, *Then* the page shows the not-covered state with links to all seven categories and `/articles`, and contains no invented procedural claims.
- `AC-ASK-05` (`REQ-ASK-05`): *Given* a time-sensitive question about fees, schedules, or deadlines, *When* the answer and sources render, *Then* each listed source displays its `updatedDate` and the answer prompt contract requires freshness cues; *Given* network inspection, *Then* no request other than `POST /api/ask` transmits the question text.

### 3.9 Feature 9: Interactive Document Request Wizard (`/wizard`) (`F-09`)

#### Requirements specification

| Req ID | Priority | Requirement statement |
| :--- | :--- | :--- |
| `REQ-WIZ-01` | `P0` | The system shall publish a `/wizard` page presenting a picker of document-request types (TOR, Certificate of Grades, CAV, CTC, duplicate diploma, Good Moral Character, student ID replacement, transfer credentials, and other requests declared by articles). |
| `REQ-WIZ-02` | `P0` | Each wizard request shall display a step-by-step requirements checklist plus published fee, issuing office, and processing time where the source guide records them, and shall link back to the full source guide. |
| `REQ-WIZ-03` | `P0` | Wizard request content shall be single-sourced: requirements data shall live in validated article frontmatter and compile at request time, never in a parallel hand-maintained copy. |
| `REQ-WIZ-04` | `P1` | Checked checklist state shall persist in the visitor's `localStorage` and shall be shareable through the page URL hash (`#<request-id>` plus checked item indices) without any backend. |
| `REQ-WIZ-05` | `P1` | Category pages containing wizard-backed guides shall surface a wizard entry card, and article bodies shall link readers to the matching wizard checklist ("check off your requirements"). |

#### Product behavior

- **Single-Source Content:** Maintainers declare each request's requirements inside the relevant article's frontmatter (`wizard` field). The content loader validates the schema, the wizard page serializes every declared request, and the article remains the canonical prose guide. Content drift between guide and wizard is impossible by construction.
- **Checklist Workflow:** A student picks a request type, sees office/fee/processing-time summary rows, and checks off each requirement as they gather documents. Progress ("3 of 7") stays visible, a reset control clears the list, and the hash updates so the current request and checked items can be shared in a group chat.
- **Verification Discipline:** Fees and processing times carry the same unofficial-tool caveats as article prose, with a persistent "verify with the office" note and a link to the full guide for context.

#### Acceptance criteria

- `AC-WIZ-01` (`REQ-WIZ-01`): *Given* articles declaring `wizard` frontmatter, *When* the site serves `/wizard`, *Then* the picker lists every declared request type.
- `AC-WIZ-02` (`REQ-WIZ-02`): *Given* a selected request, *When* the checklist renders, *Then* it shows every declared requirement, the published fee/office/processing time where present, and a working link to the source article.
- `AC-WIZ-03` (`REQ-WIZ-03`): *Given* a malformed `wizard` frontmatter block (missing label, bad id, empty requirements), *When* the site builds or loads, *Then* validation fails with a clear diagnostic identifying the offending file and field.
- `AC-WIZ-04` (`REQ-WIZ-04`): *Given* checked items on one request, *When* the student reloads or revisits `/wizard`, *Then* prior checks restore from `localStorage`; *When* the URL contains a valid hash, *Then* the matching request opens with its shared checked items applied.
- `AC-WIZ-05` (`REQ-WIZ-05`): *Given* the `documents` category page and a wizard-backed article, *When* rendered, *Then* the category page shows a wizard entry card and the article body contains a "check off your requirements" link resolving to the matching wizard checklist.
