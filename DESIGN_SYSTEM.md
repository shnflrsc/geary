# Design System Specification (DESIGN_SYSTEM.md): Geary — Unofficial BulSU Student Information Hub

---

## 1. Document Control & Design Philosophy *(ISO/IEC 25010 Usability / Interaction Capability)*

### 1.1 Document Metadata

| Attribute | Details |
| :--- | :--- |
| **Document Title** | Design System Specification (DESIGN_SYSTEM.md): Geary — Unofficial BulSU Student Information Hub |
| **Version** | `1.0 (MVP Baseline)` |
| **Date** | `2026-11-17` |
| **Standard Reference** | ISO/IEC 25010:2011/2023 (*Usability / Interaction Capability*) & WCAG 2.1 Level AA |
| **Related Baseline Documents** | [PROJECT_CHARTER.md](./PROJECT_CHARTER.md), [PRD.md](./PRD.md), [SRS.md](./SRS.md), [USER_FLOWS.md](./USER_FLOWS.md), [ARCHITECTURE.md](./ARCHITECTURE.md), [TESTING.md](./TESTING.md) |
| **Status** | Approved UI/UX Baseline |

### 1.2 Alignment with ISO/IEC 25010 Usability / Interaction Capability
Geary's design philosophy—**low cognitive load, intuitive navigation, and a distinctive BulSUan visual identity**—maps directly to the six **ISO/IEC 25010 Usability / Interaction Capability** sub-characteristics:

| ISO 25010 Sub-Characteristic | Geary Design Implementation |
| :--- | :--- |
| **Appropriateness Recognizability** | Instantly communicates BulSU identity through Crimson (`#8B1538`) and Gear Gold (`#D4A017`) accents, a geometric gear mark, and a task-oriented 5-category student directory. |
| **Learnability** | Uses predictable, repeatable page templates, hierarchical breadcrumbs (`Home › Category › Article`), and consistent card anatomy so first-time freshmen navigate without training. |
| **Operability** | Mobile-first touch targets (`>= 44×44px`), keyboard shortcuts (`/` or `Ctrl+K` / `Cmd+K`, `Arrow` keys, `Enter`, `Escape`), and responsive Table of Contents placement (`<details>` on mobile, sticky rail on desktop). |
| **User Error Protection** | Calm recovery paths on zero-match search queries (5 category pills), offline search fallback links, and a branded `/404.html` page with search and directory links. |
| **User Interface Aesthetics** | Crisp Slate-Paper (`#F8F9FA`) surfaces keep reading clean without glare; `1px` cool borders (`#DEE2E6`) replace heavy shadows; article prose (`~65ch`) remains completely free of decorative watermarks or popups. |
| **Accessibility** | Meets WCAG 2.1 Level AA color contrast (`>= 4.5:1` normal text), semantic HTML5 landmarks, visible `:focus-visible` outlines, and zero horizontal overflow at `375px`, `768px`, and `1280px`. |

---

## 2. Color System & Design Tokens

### 2.1 Color Palette & WCAG 2.1 Contrast Verification

| Category | Token Name | CSS Variable / Tailwind Utility | Hex Value | Contrast vs. `#F8F9FA` / `#FFFFFF` | Usage Rules & Restrictions |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Canvas & Surface** | `canvas-paper` | `--color-canvas` / `bg-[#F8F9FA]` | `#F8F9FA` | Baseline | Default `<body>` canvas; crisp cool off-white without yellow cast. |
| **Canvas & Surface** | `surface-card` | `--color-surface` / `bg-white` | `#FFFFFF` | Baseline | Elevated cards, SearchBar input/dropdown, mobile menu, collapsible TOC box. |
| **Canvas & Surface** | `surface-subtle` | `--color-subtle` / `bg-[#EEF1F4]` | `#EEF1F4` | `1.1:1` surface step | Table headers (`<thead>`), inline `<code>` pills, `<kbd>` shortcut chips, subtle hover states. |
| **BulSU Brand** | `brand-crimson` | `--color-crimson` / `text-[#8B1538]` | `#8B1538` | `8.81:1` / `9.28:1` (**AAA**) | Primary brand color: links, active nav states, category badges, primary CTA accents. |
| **BulSU Brand** | `brand-crimson-hover` | `--color-crimson-hover` / `hover:text-[#6E0F2B]` | `#6E0F2B` (or `#800020`) | `> 11.0:1` (**AAA**) | Hover/active state for crimson buttons, links, and solid accent pills. |
| **BulSU Brand** | `brand-crimson-wash` | `--color-crimson-wash` / `bg-[#FDF2F4]` | `#FDF2F4` | Tint surface | Soft background for category badges, highlighted search results, and informational callouts. |
| **BulSU Accent** | `brand-gold` | `--color-gold` / `border-[#D4A017]` | `#D4A017` | Decorative (`2.25:1`) | Geometric gear ring, decorative top/left borders, and icon accents. **Never use for small text on light backgrounds.** |
| **BulSU Accent** | `brand-gold-wash` | `--color-gold-wash` / `bg-[#FEF9E7]` | `#FEF9E7` | Tint surface | Background fill for `"Pro-Tip"` or notice callouts paired strictly with `brand-gold-ink`. |
| **BulSU Accent** | `brand-gold-ink` | `--color-gold-ink` / `text-[#785300]` | `#785300` | `6.56:1` on `#FEF9E7` (**AA+**) | Accessible dark gold/amber ink for text inside gold-tinted badges or callouts. |
| **Typography Ink** | `ink-primary` | `--color-ink` / `text-[#181C20]` | `#181C20` | `16.25:1` / `17.13:1` (**AAA**) | All headings (`h1`–`h4`) and main body prose. |
| **Typography Ink** | `ink-secondary` | `--color-ink-secondary` / `text-[#495057]` | `#495057` | `7.76:1` / `8.18:1` (**AAA**) | Summaries, breadcrumbs, `Last Updated` metadata, TOC links, footer text. |
| **Typography Ink** | `ink-muted` | `--color-ink-muted` / `text-[#636C74]` | `#636C74` | `5.07:1` / `5.35:1` (**AA**) | Search input placeholders and subtle `<kbd>` hint labels. |
| **Borders** | `border-subtle` | `--color-border` / `border-[#DEE2E6]` | `#DEE2E6` | `>= 1.2:1` structural | Default `1px` card borders, header/footer hairlines, Markdown table cell dividers. |
| **Borders** | `border-strong` | `--color-border-strong` / `border-[#CED4DA]` | `#CED4DA` | Structural | Search input resting border and neutral hover elevation border. |

---

## 3. Typography System

### 3.1 Font Family Stacks
- **Headings (`--font-heading`):** `'Plus Jakarta Sans', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`
- **Body & UI (`--font-sans`):** `'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`
- **Monospace (`--font-mono`):** `'JetBrains Mono', ui-monospace, SFMono-Regular, Consolas, monospace`

*(Note: `Plus Jakarta Sans` (`600`–`800`) and `Inter` (`400`–`700`, `400-italic`) are self-hosted locally via `@fontsource` Latin subsets with `font-display: swap`; system fallbacks prevent FOIT on constrained campus cellular connections.)*

### 3.2 Typographic Scale

| Role | Font Family | Mobile Size (`<768px`) | Desktop Size (`>=768px`) | Line Height | Weight | Letter Spacing | Vertical Margin Rules |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Hero Display (`H1` Home)** | `--font-heading` | `1.875rem` (`30px`) | `2.5rem` (`40px`) | `1.15` | `800` | `-0.025em` | `mb-4` (`16px`) |
| **Page / Article Title (`H1`)** | `--font-heading` | `1.75rem` (`28px`) | `2.25rem` (`36px`) | `1.2` | `700` | `-0.02em` | `mt-3 mb-3` |
| **Section Heading (`H2` Prose)** | `--font-heading` | `1.375rem` (`22px`) | `1.5rem` (`24px`) | `1.3` | `700` | `-0.015em` | `mt-9 mb-3` (`2.25em` top / `0.75em` bottom) |
| **Subsection Heading (`H3` Prose)** | `--font-heading` | `1.125rem` (`18px`) | `1.25rem` (`20px`) | `1.35` | `600` | `-0.01em` | `mt-7 mb-2` |
| **Minor Heading (`H4` Prose)** | `--font-heading` | `1rem` (`16px`) | `1.0625rem` (`17px`) | `1.4` | `600` | `0` | `mt-5 mb-1.5` |
| **Article Prose Body** | `--font-sans` | `1rem` (`16px`) | `1.0625rem` (`17px`) | `1.75` | `400` | `0` | `mb-5` between paragraphs |
| **UI / Card Body** | `--font-sans` | `0.9375rem` (`15px`) | `0.9375rem` (`15px`) | `1.5` | `400` | `0` | `mb-2` inside cards |
| **Caption / Metadata / Badge** | `--font-sans` | `0.75rem` (`12px`) | `0.8125rem` (`13px`) | `1.4` | `500`–`600` | `0.01em` | Inline / `gap-2` |

### 3.3 Low-Cognitive-Load Prose Rules
1. **Constrained Measure (`65ch`):** Article reading width is strictly capped at `max-w-prose` (`65ch`) so eyes never lose track across wide desktop monitors.
2. **Asymmetric Heading Spacing:** Larger top margin (`2.25em`) than bottom margin (`0.75em`) on `h2` visually binds headings to the content that follows.
3. **16px Mobile Input & Body Floor:** Ensures iOS/Android browsers never trigger auto-zoom on `<SearchBar />` inputs and keeps handbook policies legible outdoors.

---

## 4. Spacing, Grid & Responsive Breakpoints

### 4.1 Spatial Scale (`4px` / `0.25rem` Base Unit)

| Token | Value | Primary Layout Application |
| :--- | :--- | :--- |
| `space-1` | `4px` (`0.25rem`) | Tight inline icon gaps, badge padding vertical axis. |
| `space-2` | `8px` (`0.5rem`) | Breadcrumb separators, badge-to-title spacing, `<kbd>` gaps. |
| `space-3` | `12px` (`0.75rem`) | Card internal element spacing, mobile TOC padding. |
| `space-4` | `16px` (`1rem`) | Mobile page gutter (`px-4`), grid gap on small screens (`gap-4`), prose list gaps. |
| `space-5` | `20px` (`1.25rem`) | Standard card padding on mobile (`p-5`), paragraph spacing. |
| `space-6` | `24px` (`1.5rem`) | Tablet page gutter (`sm:px-6`), desktop card padding (`md:p-6`), desktop grid gap (`md:gap-6`). |
| `space-8` | `32px` (`2rem`) | Desktop page gutter (`lg:px-8`), article header bottom divider margin. |
| `space-12` | `48px` (`3rem`) | Major section vertical separation on mobile/tablet (`py-12`). |
| `space-16` | `64px` (`4rem`) | Hero and directory vertical breathing room on desktop (`lg:py-16`). |

### 4.2 Container, Grid & Responsive Breakpoints

- **Global Max-Width Container:** `max-w-6xl` (`1152px`) centered with `mx-auto px-4 sm:px-6 lg:px-8`.
- **Zero Horizontal Overflow Rule:** Every route must maintain `document.documentElement.scrollWidth <= window.innerWidth` across `375px`, `768px`, and `1280px`.

| **Breakpoint** | **Viewport Width** | **Navigation Header** | **Home Discovery Grids** | **Subcategory / Related Grid** | **Article Reading Layout** |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Mobile (Default)** | `< 768px` | Brand mark + Search trigger + Hamburger drawer toggle (`>= 44×44px`) | `1` column (`grid-cols-1`) for Featured (6 cards per group) | `1` column (`grid-cols-1`) | Single stack: Header → Collapsed `<details>` TOC → Prose (`100%` up to `65ch`) → Related |
| **Tablet (`md`)** | `768px – 1023px` | Brand mark + Inline category links + Compact SearchBar | `2` columns (`md:grid-cols-2`) for Featured (6 cards per group) | `2` columns (`md:grid-cols-2`) | Single stack (`max-w-prose mx-auto`) with collapsed `<details>` TOC |
| **Desktop (`lg`)** | `>= 1024px` | Full single-row top nav (`h-16` / `64px`) | `3` columns (`lg:grid-cols-3`) for Featured (6 cards per group) | `2`–`3` columns (`lg:grid-cols-2` / `3`) | Two-column CSS grid: `[minmax(0, 65ch)_260px]` with sticky `"On this page"` `<aside>` TOC (`top-24`) |

---

## 5. Component Specifications & Interactive States

### 5.1 Global Header & Geary Brand Mark (`Header.astro`)
- **Anatomy:** Sticky/top `64px` (`h-16`) bar on `bg-[#F8F9FA]/95` with `border-b border-[#DEE2E6]`.
  - *Desktop (`>= 768px`):* **Geary** wordmark + minimalist 8-tooth geometric gear SVG (`#8B1538` outer gear, `#D4A017` inner ring) on the left, `Home` (`/`), `Articles` (`/articles`), `Campus Map` (`/map`), and `Contribute` (`/contribute`) links, and `<SearchBar variant="header" />` (`md:w-48 lg:w-60`) on the right.
  - *Mobile (`< 768px`):* On Home (`/`), `<SearchBar variant="header" />` is hidden and the gear mark + **Geary** wordmark are centered beside the right-aligned drawer toggle. On all interior pages, only the gear mark shows on the left (`sr-only md:not-sr-only` wordmark) and `<SearchBar variant="header" />` stretches across the full available space (`flex-1`) between the gear mark and the drawer toggle.
- **Interactive States:**
  - *Default:* `text-[#495057]` navigation links, `min-h-[44px]` mobile tap target.
  - *Hover:* `text-[#8B1538]` with `150ms` transition; gear SVG rotates `90deg` smoothly (`300ms ease-out`) and returns to `0deg` when unhovered.
  - *Active Route:* `text-[#8B1538] font-semibold` with pill wash `bg-[#FDF2F4]`.
  - *Focus-Visible:* `2px solid #8B1538` ring (`outline-offset-2`).

### 5.2 Search Bar React Island (`SearchBar.tsx`)
- **Variants:**
  - **`hero` (Home Page):** Prominent `h-[52px]` (`rounded-xl`), `bg-white border border-[#CED4DA]`, magnifying glass icon (`#636C74`), placeholder (`"Search..."`), right-aligned desktop `<kbd>/</kbd>` hint (`bg-[#EEF1F4] text-[#495057]`).
  - **`header` (All Sub-Pages / Navbar):** Compact `h-10` input (`w-44 sm:w-56 md:w-64`, `rounded-lg`) expanding or opening a clean overlay dropdown without breaking single-row header layout on `375px` mobile.
- **Dropdown Results Overlay (`z-50`):** `bg-white border border-[#DEE2E6] rounded-xl shadow-lg max-h-[400px] overflow-y-auto mt-2`.
- **Interactive States:**
  - *Hover / Keyboard Active (`activeIndex`):* Row shifts to `bg-[#FDF2F4]` with `3px` left accent border (`border-l-[3px] border-[#8B1538]`).
  - *Focus-Visible:* `border-[#8B1538] ring-2 ring-[#8B1538]/20`.
  - *Empty / Zero-Match:* Displays `"No articles matched '<query>'."` (JSX-escaped).
  - *Offline / Fetch Error:* Non-alarming inline message (`"Search index couldn't load right now."`) + direct links to all 5 categories.

### 5.3 Category Directory Card (`CategoryCard.astro`)
- **Anatomy:** Compact clickable `<a href="/categories/...">` card (`group flex flex-col justify-between bg-white border border-[#DEE2E6] rounded-xl p-5 transition-colors`).
  - Top row: Category icon inside a `w-10 h-10 rounded-lg bg-[#FDF2F4] text-[#8B1538]` container.
  - Title row: Category Title (`text-lg font-bold text-[#181C20]`) on the left and right-aligned arrow indicator (`→`, `text-[#8B1538]`).
- **Interactive States:** Hover shifts card border to `#8B1538` and title/arrow to `#8B1538` / `#6E0F2B`; `:focus-visible` shows crimson outline.

### 5.4 Article Summary Card (`ArticleCard.astro`)
- **Anatomy:** Clickable `<a href="/articles/...">` card (`flex flex-col justify-between bg-white border border-[#DEE2E6] rounded-xl p-5 transition-colors`). Displays title (`font-semibold text-[#181C20]`) and a bottom-aligned row pairing the 2-line clamped body preview (`line-clamp-2 flex-1 text-sm text-[#495057]`) with `→` (`text-[#8B1538]`) on the right.
- **Interactive States:** Hover changes border to `#8B1538`, title color to `#8B1538`, and nudges `→`; `:focus-visible` shows crimson outline.

### 5.5 Breadcrumbs (`Breadcrumbs.astro`)
- **Anatomy:** `<nav aria-label="Breadcrumb">` with `text-sm text-[#495057] flex flex-wrap items-center gap-1.5`. Links (`Home`, `Categories`, `[Category Name]`) hover to `text-[#8B1538] underline`; separator `›` (`aria-hidden="true" text-[#636C74]`); current page uses `text-[#181C20] font-medium` with `aria-current="page"`.

### 5.6 Responsive Table of Contents (`TableOfContents.astro`)
- **Desktop (`>= 1024px`):** `<aside class="hidden lg:block sticky top-24 self-start">` titled `"On this page"` (`text-xs font-semibold uppercase tracking-wider text-[#495057]`). Vertical list with `border-l border-[#DEE2E6]`; secondary subsection links indented (`pl-6` vs `pl-3`).
- **Mobile (`< 1024px`):** `<details class="lg:hidden bg-white border border-[#DEE2E6] rounded-xl p-4 mb-6">` with `<summary>` (`min-h-[44px]` touch comfort) revealing section anchor links.
- **Visual Suppression:** Displayed only when multiple sections exist; hidden cleanly without leaving blank spacing on short guides.

### 5.7 Markdown Prose & Procedural Callouts (`ArticleLayout.astro`)
- **Ordered Procedures (`<ol>`):** Clear step numbering (`marker:font-semibold marker:text-[#8B1538]`) with `space-y-2` vertical breathing room.
- **Blockquotes / Callouts (`<blockquote>`):** `bg-[#FEF9E7]` (or `#FDF2F4`) with `border-l-4 border-[#D4A017]` (or `#8B1538`), `px-4 py-3 rounded-r-lg text-[#181C20]` so student survival tips and office rules stand out immediately.
- **Tables (`<table>`):** Styled with `bg-[#EEF1F4]` `<thead>` rows, balanced column padding, wrapping header text, and `min-width` protection on 3-column notes cells with `overflow-x: auto` so wide or text-heavy tables stay readable without breaking `375px` mobile layout.
- **Source Card (`ArticleLayout.astro`):** When `source` and/or `sources` frontmatter is present, renders `mt-8 rounded-xl border border-[#DEE2E6] bg-white p-4 sm:p-5` below `<article>`, showing an uppercase `"Source"` (or `"Sources"` when multiple entries exist) label (`text-xs font-semibold uppercase tracking-wider text-[#495057]`) and a list of plain-text labels (`text-[#181C20]`) or external links (`text-[#8B1538]`, when a URL is provided).

### 5.8 Global Footer (`Footer.astro`)
- **Global Footer:** `border-t border-[#DEE2E6] bg-[#F8F9FA] py-8` displaying `© 2026 Geary` on the left and a single row of legal links ([Terms of Service](/terms) and [Privacy Policy](/privacy)) on the right.

### 5.9 Interactive 2D Campus Map (`CampusMap.tsx`)
- **Layout:** Responsive split container (`lg:grid-cols-[minmax(0,1fr)_360px]`) pairing the interactive SVG viewport on the left/top with a sticky building inspector panel on desktop (stacked cleanly below on mobile).
- **Map Surface & Building States:** Campus grounds on `canvas-paper` (`#F8F9FA`) / `#F1F3F5`, footpaths in `#DEE2E6`, parks in `#E8F3EA`, resting clickable buildings in `white` with `border-strong` (`#CED4DA`) strokes, hovered buildings in `brand-crimson-wash` (`#FDF2F4`) with `#8B1538` stroke, and selected buildings filled `#8B1538` with `#D4A017` highlight outline (`>= 2px`).
- **Controls:** Accessible zoom in (`+`), zoom out (`-`), reset view buttons overlaid cleanly on the map canvas, drag/scroll pan inside the bounded SVG canvas, a standalone search bar (no extra label, filter, or quick-jump ribbons), and a minimal right-hand inspector showing only the selected building's name and contained locations.

---

## 6. Interaction Principles & Accessibility Ergonomics

1. **Keyboard & Focus Discipline:** Every interactive element uses `:focus-visible { outline: 2px solid #8B1538; outline-offset: 2px; }` (never `outline: none` without replacement). Full keyboard parity applies across search (`/`, `Ctrl+K`, `ArrowUp`, `ArrowDown`, `Enter`, `Escape`), header navigation, mobile drawer (`aria-expanded`), and native `<details>` TOC.
2. **Minimum Touch Target (`>= 44×44px`):** Mobile header buttons, TOC `<summary>`, search close/clear triggers, and category pills preserve comfortable tap targets for one-handed phone use on campus.
3. **Motion & Cognitive Restraint:** Transitions stay lightweight (`150ms–300ms` ease-out on color, border, and transform properties, plus slow ambient rotation on the home hero watermark), respecting `@media (prefers-reduced-motion: reduce)` by disabling motion when requested. No auto-playing carousels, modals on load, floating chat widgets, or decorative watermarks may appear inside `<article>`.
4. **Progressive Clarity:** Core navigation, category browsing, and article reading remain visually stable and immediately legible before interactive controls hydrate.
