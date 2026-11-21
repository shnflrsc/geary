# Product Requirements Document (PRD): Geary — Unofficial BulSU Student Information Hub

---

## 1. Document Control & Purpose

### 1.1 Document Metadata

| Attribute | Details |
| :--- | :--- |
| **Document Title** | Product Requirements Document: Geary — Unofficial BulSU Student Information Hub |
| **Version** | `1.0 (MVP Baseline)` |
| **Date** | `2026-11-17` |
| **Standard Reference** | Adapted from ISO/IEC/IEEE 29148:2018 — *Systems and software engineering — Life cycle processes — Requirements engineering* (Clauses 9.4 [StRS] & 9.5 [SRS]) |
| **Related Baseline** | [PROJECT_CHARTER.md](./PROJECT_CHARTER.md) (`v1.0 MVP Baseline`) |
| **Status** | Approved for Implementation |

### 1.2 Purpose
This Product Requirements Document (PRD) defines the MVP feature set, product behavior, release priorities, and verifiable acceptance criteria for **Geary**, bounded strictly to its five confirmed product capabilities:
1. **Articles & Markdown Content (`F-01`)**
2. **Categories & Purposeful Organization (`F-02`)**
3. **Instant Client-Side Search Bar (`F-03`)**
4. **Low-Cognitive-Load UI/UX & BulSUan Identity (`F-04`)**
5. **Interactive 2D Campus Map (`F-05`)**

---

## 2. Prioritization Framework

Every product requirement in this PRD carries a strict release priority:

| Priority Level | Meaning | Release Gate |
| :--- | :--- | :--- |
| **P0 (Must-Have / Core MVP)** | Essential capability required for Geary to function as a centralized, searchable student hub. | Mandatory for MVP launch; release is blocked if any P0 acceptance criterion fails. |
| **P1 (Should-Have / MVP UX Polish)** | Important usability, orientation, and skimming enhancements included in the MVP baseline. | Included in MVP target release to ensure low cognitive load and smooth discovery. |
| **Won't Have (Out of Scope)** | Capabilities excluded under [PROJECT_CHARTER.md](./PROJECT_CHARTER.md) (e.g., AI chatbot, accounts, databases). | Prohibited from entering the MVP scope. |

---

## 3. Features, Product Behavior & Acceptance Criteria

---

### 3.1 Feature 1: Articles & Markdown Content (`F-01`)

#### Requirements Specification

| Req ID | Priority | Requirement Statement |
| :--- | :--- | :--- |
| **REQ-ART-01** | **P0** | The system shall publish student articles authored in Markdown and validate required metadata fields—`title`, `category`, `subcategory`, and `updatedDate`—during site compilation. |
| **REQ-ART-02** | **P0** | The system shall render standard and tabular Markdown elements—including headings, numbered procedures, bulleted lists, tables, callout blockquotes, and links—into clear, readable HTML pages. |
| **REQ-ART-03** | **P0** | Every article view shall display an informative header containing breadcrumbs, article title, and formatted *Last Updated* date. |
| **REQ-ART-04** | **P1** | The system shall automatically generate an "On this page" Table of Contents from an article's major and minor section headings—displayed as a sticky sidebar on desktop and a collapsible disclosure panel above the article on mobile—and hide it completely when fewer than 2 headings exist. |
| **REQ-ART-05** | **P1** | The system shall display a "Related Guides in This Category" section showing up to 3 sibling guides from the same category alongside an unofficial verification notice at the bottom of each article. |

#### Product Behavior
- **Metadata Integrity:** Articles require valid metadata matching one of the 5 approved category identifiers. Missing fields, invalid dates, or unknown categories prevent publishing with a clear error message so broken guides never go live.
- **Reading & Skimming Experience:**
  1. When a student opens an article, the header immediately confirms context (breadcrumb trail, title, and *Last Updated* date).
  2. For articles with 2 or more section headings, mobile readers see a collapsed-by-default `"On this page"` panel near the top so prose starts immediately without excessive scrolling, while desktop readers see a sticky sidebar to jump directly between sections.
  3. At the bottom of the guide, a verification reminder prompts students to confirm time-sensitive fees and deadlines with official BulSU offices, followed by up to 3 sibling guides from the same category (omitted cleanly if no sibling articles exist yet).

#### Acceptance Criteria
- **AC-ART-01 (`REQ-ART-01`):**
  - *Given* a Markdown guide with complete, valid metadata, *When* the site builds, *Then* a dedicated static article page is generated without errors.
  - *Given* a guide missing required metadata or using an unrecognized category identifier, *When* the site builds, *Then* compilation fails with a clear message identifying the offending file and field.
- **AC-ART-02 (`REQ-ART-02`):**
  - *Given* a guide containing headings, numbered steps, bullet lists, tables, blockquotes, and links, *When* viewed on mobile and desktop screens, *Then* all elements remain cleanly formatted and tables do not push the page wider than the screen.
- **AC-ART-03 (`REQ-ART-03`):**
  - *Given* any published article page, *When* opened by a student, *Then* the breadcrumb, main title, and formatted *Last Updated* date appear clearly above the body text.
- **AC-ART-04 (`REQ-ART-04`):**
  - *Given* an article with 2 or more section headings, *When* viewed on desktop, *Then* the "On this page" navigation appears as a sticky side rail; *When* viewed on mobile, *Then* it appears as a collapsible toggle above the prose.
  - *Given* an article with fewer than 2 section headings, *When* viewed on any screen size, *Then* no Table of Contents box or empty column is rendered.
- **AC-ART-05 (`REQ-ART-05`):**
  - *Given* an article in a category containing multiple guides, *When* scrolling to the end of the article, *Then* up to 3 different sibling guides from the same category appear beneath the verification notice without duplicating the active guide.

---

### 3.2 Feature 2: Categories & Purposeful Organization (`F-02`)

#### Requirements Specification

| Req ID | Priority | Requirement Statement |
| :--- | :--- | :--- |
| **REQ-CAT-01** | **P0** | The system shall organize all content under seven student-intent categories: `enrollment` (*Enrollment*), `academics` (*Academics*), `documents` (*Documents*), `scholarships` (*Scholarships*), `policies` (*Policies*), `organizations` (*Organizations*), and `campus` (*Campus*). |
| **REQ-CAT-02** | **P0** | The Home page shall present a Category Directory showing all seven categories with each category's summary description, live article count, and direct preview links to top articles. |
| **REQ-CAT-03** | **P0** | Each category page shall group its guides visually under `subcategory` headings rather than presenting a chronological blog timeline. |
| **REQ-CAT-04** | **P1** | Category and article pages shall display clickable breadcrumb navigation (`Home › [Category Name]` and `Home › [Category Name] › [Article Title]`) for spatial orientation. |
| **REQ-CAT-05** | **P1** | The Home page shall surface daily randomized guides inside a **Featured** section displaying 6 cards at a time and cycling through 3 daily groups (18 guides refreshed each calendar day). |

#### Product Behavior
- **Intent-Based Discovery:** Unlike a blog sorted by date, Geary organizes information around what a student needs to accomplish.
- **Home Featured Rotation:** Below the hero search area, the **Featured** section deterministically randomizes 3 non-overlapping groups of 6 guides seeded by the visitor's local calendar date (`YYYY-MM-DD`), automatically cycling through the 3 groups (pausing on hover/focus and under `prefers-reduced-motion`) with subtle indicator controls to jump between groups.
- **Category Index Views:** Opening any category displays breadcrumbs, category summary, and articles neatly grouped under their sub-topic headings (e.g., *Shifting & Transferring*, *Document Requests*, *Food & Dining*). If a category has zero articles yet, the page displays a helpful empty-state message with a link back to Home.

#### Acceptance Criteria
- **AC-CAT-01 (`REQ-CAT-01`):**
  - *Given* the seven defined categories, *When* the site builds, *Then* dedicated directory pages exist for all seven category slugs.
- **AC-CAT-02 (`REQ-CAT-02`):**
  - *Given* the Home page, *When* loaded, *Then* all seven category cards appear with accurate article counts, descriptions, category links, and up to 3 direct article preview links each.
- **AC-CAT-03 (`REQ-CAT-03`):**
  - *Given* a category with guides across multiple subcategories, *When* visiting that category page, *Then* guides appear grouped under their respective subcategory headings.
- **AC-CAT-04 (`REQ-CAT-04`):**
  - *Given* any category or article page, *When* clicking `Home` or `[Category Name]` in the breadcrumb trail, *Then* the browser navigates cleanly to the corresponding parent page.
- **AC-CAT-05 (`REQ-CAT-05`):**
  - *Given* the Home page, *When* loaded, *Then* the Featured section displays 6 articles from the active group and cycles through 3 daily randomized non-overlapping groups seeded by local calendar date.

---

### 3.3 Feature 3: Instant Client-Side Search Bar (`F-03`)

#### Requirements Specification

| Req ID | Priority | Requirement Statement |
| :--- | :--- | :--- |
| **REQ-SRCH-01** | **P0** | The system shall generate a static client-side search index at build time containing each published guide's route identifier, title, body preview, category label, subcategory, and section headings. |
| **REQ-SRCH-02** | **P0** | The system shall provide an interactive search bar prominently in the Home hero and accessibly inside the global header across all pages. |
| **REQ-SRCH-03** | **P0** | The search bar shall match user queries instantaneously in the browser against titles, section headings, subcategories, category labels, and body previews, presenting ranked results. |
| **REQ-SRCH-04** | **P1** | The search bar shall support complete keyboard operation: `/` or `Ctrl+K` (`Cmd+K`) to focus, `ArrowUp`/`ArrowDown` to move through results, `Enter` to open the selected guide, and `Escape` to close. |
| **REQ-SRCH-05** | **P1** | When a query produces zero matching articles (or when the search index cannot load), the search overlay shall display a clear fallback message with clickable quick-jump links to all seven categories. |

#### Product Behavior
- **Zero-Backend Instant Filtering:** Focusing or typing in the search bar loads the static search index once and caches it in browser memory. Multi-word queries (e.g., `"tor request"`, `"latin honors"`) rank title matches highest, followed by heading/subcategory matches, then body preview/category matches, displaying up to 8 top results.
- **Clean Overlay Lifecycle:** Clicking outside the search box, pressing `Escape`, or clearing the input dismisses results cleanly. Special punctuation in queries is treated safely as plain text.

#### Acceptance Criteria
- **AC-SRCH-01 (`REQ-SRCH-01`):**
  - *Given* a completed build, *When* inspecting the generated search index, *Then* every published guide is present with its slug, title, body preview, category metadata, subcategory, and extracted headings.
- **AC-SRCH-02 (`REQ-SRCH-02`):**
  - *Given* any page on the site (Home, Category, Article, or 404), *When* a user interacts with the hero or header search bar, *Then* the search interface activates smoothly with no runtime errors.
- **AC-SRCH-03 (`REQ-SRCH-03`):**
  - *Given* a guide titled `"How to Request a Transcript of Records (TOR)"` or containing a section heading `"INC Grade Completion"`, *When* a student types `"TOR"` or `"INC"`, *Then* the guide appears immediately in the ranked dropdown with its category badge and opens upon selection.
- **AC-SRCH-04 (`REQ-SRCH-04`):**
  - *Given* a user pressing `/` or `Ctrl+K` (`Cmd+K`) outside text inputs, *Then* the search input focuses; *When* cycling results with `ArrowDown`/`ArrowUp` and pressing `Enter`, *Then* the browser navigates to the highlighted guide; *When* pressing `Escape`, *Then* the results overlay closes.
- **AC-SRCH-05 (`REQ-SRCH-05`):**
  - *Given* a query matching zero articles, *When* typed into the search bar, *Then* a helpful no-results notice appears alongside clickable links to all seven categories.

---

### 3.4 Feature 4: Low-Cognitive-Load UI/UX & BulSUan Identity (`F-04`)

#### Requirements Specification

| Req ID | Priority | Requirement Statement |
| :--- | :--- | :--- |
| **REQ-UI-01** | **P0** | The system shall present a distinctive BulSUan visual identity anchored in BulSU Crimson primary accents, Gear Gold secondary highlights, a warm low-glare reading background, clean white card surfaces, and high-contrast dark typography. |
| **REQ-UI-02** | **P0** | Article views shall maintain a comfortable reading width, generous line spacing, and clear visual distinction between steps, callouts, and tables to keep cognitive load low on mobile and desktop screens. |
| **REQ-UI-03** | **P0** | Every page shall include a responsive global Header (Geary gear brand mark, category navigation, and search access) and global Footer (unofficial student-hub disclaimer and category directory links). |
| **REQ-UI-04** | **P1** | Subtle "Geary" geometric gear motifs and BulSU accents shall reinforce brand identity in navigation and hero areas while keeping article reading containers completely distraction-free. |
| **REQ-UI-05** | **P1** | The system shall provide a custom `404` recovery page styled in the Geary theme containing the search bar and direct links to all seven categories and Home. |

#### Product Behavior
- **Calm Reading Experience:** Instead of stark white glare or visual clutter, long university guides appear on warm paper-toned backgrounds inside a focused reading column, with mobile navigation neatly tucked into an accessible menu toggle below tablet width.
- **Graceful Recovery:** Visiting an outdated bookmark or broken URL never leaves a student stranded on a generic server error page; the branded `404` page offers immediate search and category recovery.

#### Acceptance Criteria
- **AC-UI-01 (`REQ-UI-01`):**
  - *Given* any rendered page, *When* inspected visually, *Then* the interface consistently displays the warm paper canvas, crisp card surfaces, dark high-contrast body text, BulSU Crimson links/accents, and restrained Gear Gold highlights.
- **AC-UI-02 (`REQ-UI-02`):**
  - *Given* any article page on mobile or desktop, *When* reading prose and tables, *Then* text remains comfortably constrained in width with generous spacing and zero horizontal page scrolling.
- **AC-UI-03 (`REQ-UI-03`):**
  - *Given* any page on mobile or desktop, *When* checking top and bottom navigation, *Then* the Header (brand mark, responsive category menu, search) and Footer (unofficial disclaimer and category links) render cleanly without overlap or clipping.
- **AC-UI-04 (`REQ-UI-04`):**
  - *Given* the main article reading area, *When* scrolling through content, *Then* no background watermarks, animations, or promotional popups interfere with reading comprehension.
- **AC-UI-05 (`REQ-UI-05`):**
  - *Given* an invalid URL path, *When* the `404` page displays, *Then* students see a clear recovery message, an interactive search bar, and links to Home and all seven categories.

---

### 3.5 Feature 5: Interactive 2D Campus Map (`/map`) (`F-05`)

#### Requirements Specification

| Req ID | Priority | Requirement Statement |
| :--- | :--- | :--- |
| **REQ-MAP-01** | **P0** | The system shall render a 2D interactive SVG schematic of BulSU Malolos Main Campus derived from OpenStreetMap building footprints, walkways, gates, and landmarks without external tile servers. |
| **REQ-MAP-02** | **P0** | Clicking or selecting any campus building shall highlight it and open a minimal inspector listing the selected building name and the names of contained locations/offices. |
| **REQ-MAP-03** | **P0** | A dedicated campus search bar shall search across both buildings and indoor locations (e.g., Registrar, Clinic, Cashier, OSFAS, Library, Canteen) and indicate which building contains each match; selecting a match highlights and centers that building on the map. |
| **REQ-MAP-04** | **P1** | The map canvas shall support pan, zoom-in, zoom-out, and reset controls alongside keyboard-accessible building elements. |

#### Acceptance Criteria
- **AC-MAP-01 (`REQ-MAP-01`):** *Given* `/map`, *When* loaded, *Then* the 2D BulSU Malolos SVG schematic renders with zero external map tile requests and zero horizontal overflow on mobile or desktop.
- **AC-MAP-02 (`REQ-MAP-02`):** *Given* any clickable building on the map, *When* clicked, *Then* the building highlights in BulSU Crimson (`#8B1538`) and the inspector displays its name and contained locations/offices.
- **AC-MAP-03 (`REQ-MAP-03`):** *Given* a query such as `"Registrar"` or `"Scholarship"` typed into the campus map search bar, *When* matching locations appear, *Then* each result shows its parent building name (`Flores Hall`, `College of Law Annex / Near College of Law`, etc.), and selecting it focuses that building on the map and shows the matched location in the inspector.
- **AC-MAP-04 (`REQ-MAP-04`):** *Given* pan/zoom buttons and reset control, *When* triggered by mouse or keyboard, *Then* the SVG viewport zooms cleanly and resets back to full campus view.
