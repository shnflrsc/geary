# Design system specification (DESIGN_SYSTEM.md): Geary - Unofficial BulSU Student Information Portal

## 1. Document control and design philosophy (ISO/IEC 25010 Usability / Interaction Capability)

### 1.1 Document metadata

| Attribute | Details |
| :--- | :--- |
| Document title | Design system specification (DESIGN_SYSTEM.md): Geary - Unofficial BulSU Student Information Portal |
| Version | `1.0 (MVP Baseline)` |
| Date | `2026-11-17` |
| Standard reference | ISO/IEC 25010:2011/2023 (*Usability / Interaction Capability*) and WCAG 2.1 Level AA |
| Related baseline documents | [PROJECT_CHARTER.md](./PROJECT_CHARTER.md), [PRD.md](./PRD.md), [SRS.md](./SRS.md), [USER_FLOWS.md](./USER_FLOWS.md), [ARCHITECTURE.md](./ARCHITECTURE.md), [TESTING.md](./TESTING.md) |
| Status | Approved UI/UX baseline |

### 1.2 Alignment with ISO/IEC 25010 Usability / Interaction Capability

Geary is built for low cognitive load, predictable navigation, and a clear BulSU visual identity. Because multiple contributors build and review UI components in parallel, all contributors must use the shared semantic tokens and component rules below rather than introducing one-off hex values or custom spacing scales.

| ISO 25010 sub-characteristic | Geary design implementation |
| :--- | :--- |
| Appropriateness recognizability | Signals BulSU identity through Crimson (`#8B1538`) and Gear Gold (`#D4A017`) accents, a geometric gear mark, and a task-oriented 7-category student directory. |
| Learnability | Repeatable page templates, hierarchical breadcrumbs (`Home > Category > Article`), and consistent card layouts let first-time freshmen navigate without training. |
| Operability | Mobile-first touch targets (`>= 44x44px`), keyboard shortcuts (`/` or `Ctrl+K` / `Cmd+K`, `Arrow` keys, `Enter`, `Escape`), and responsive Table of Contents placement (`<details>` on mobile, sticky rail on desktop). |
| User error protection | Calm recovery paths on zero-match search queries (7 category pills), offline search fallback links, and a branded `/404.html` page with search and directory links. |
| User interface aesthetics | Slate-Paper (`#F8F9FA`) surfaces keep reading clean without glare; `1px` cool borders (`#DEE2E6`) replace heavy shadows; article prose (`~65ch`) has no decorative watermarks or popups. |
| Accessibility | Meets WCAG 2.1 Level AA color contrast (`>= 4.5:1` normal text), semantic HTML5 landmarks, visible `:focus-visible` outlines, and zero horizontal overflow at `375px`, `768px`, and `1280px`. |

## 2. Color system and design tokens

### 2.1 Color palette and WCAG 2.1 contrast verification

| Category | Token name | CSS variable / Tailwind utility | Hex value | Contrast vs. `#F8F9FA` / `#FFFFFF` | Usage rules and restrictions |
| :--- | :--- | :--- | :--- | :--- | :--- |
| Canvas & Surface | `canvas-paper` | `--color-canvas` / `bg-[#F8F9FA]` | `#F8F9FA` | Baseline | Default `<body>` canvas; cool off-white without a yellow cast. |
| Canvas & Surface | `surface-card` | `--color-surface` / `bg-white` | `#FFFFFF` | Baseline | Elevated cards, SearchBar input/dropdown, mobile menu, collapsible TOC box. |
| Canvas & Surface | `surface-subtle` | `--color-subtle` / `bg-[#EEF1F4]` | `#EEF1F4` | `1.1:1` surface step | Table headers (`<thead>`), inline `<code>` pills, `<kbd>` shortcut chips, subtle hover states. |
| BulSU Brand | `brand-crimson` | `--color-crimson` / `text-[#8B1538]` | `#8B1538` | `8.81:1` / `9.28:1` (**AAA**) | Primary brand color: links, active nav states, category badges, primary CTA accents. |
| BulSU Brand | `brand-crimson-hover` | `--color-crimson-hover` / `hover:text-[#6E0F2B]` | `#6E0F2B` (or `#800020`) | `> 11.0:1` (**AAA**) | Hover/active state for crimson buttons, links, and solid accent pills. |
| BulSU Brand | `brand-crimson-wash` | `--color-crimson-wash` / `bg-[#FDF2F4]` | `#FDF2F4` | Tint surface | Soft background for category badges, highlighted search results, and informational callouts. |
| BulSU Accent | `brand-gold` | `--color-gold` / `border-[#D4A017]` | `#D4A017` | Decorative (`2.25:1`) | Geometric gear ring, decorative top/left borders, and icon accents. Never use for small text on light backgrounds. |
| BulSU Accent | `brand-gold-wash` | `--color-gold-wash` / `bg-[#FEF9E7]` | `#FEF9E7` | Tint surface | Background fill for `"Pro-Tip"` or notice callouts paired strictly with `brand-gold-ink`. |
| BulSU Accent | `brand-gold-ink` | `--color-gold-ink` / `text-[#785300]` | `#785300` | `6.56:1` on `#FEF9E7` (**AA+**) | Accessible dark gold/amber ink for text inside gold-tinted badges or callouts. |
| Typography Ink | `ink-primary` | `--color-ink` / `text-[#181C20]` | `#181C20` | `16.25:1` / `17.13:1` (**AAA**) | All headings (`h1`-`h4`) and main body prose. |
| Typography Ink | `ink-secondary` | `--color-ink-secondary` / `text-[#495057]` | `#495057` | `7.76:1` / `8.18:1` (**AAA**) | Summaries, breadcrumbs, `Last Updated` metadata, TOC links, footer text. |
| Typography Ink | `ink-muted` | `--color-ink-muted` / `text-[#636C74]` | `#636C74` | `5.07:1` / `5.35:1` (**AA**) | Search input placeholders and subtle `<kbd>` hint labels. |
| Borders | `border-subtle` | `--color-border` / `border-[#DEE2E6]` | `#DEE2E6` | `>= 1.2:1` structural | Default `1px` card borders, header/footer hairlines, Markdown table cell dividers. |
| Borders | `border-strong` | `--color-border-strong` / `border-[#CED4DA]` | `#CED4DA` | Structural | Search input resting border and neutral hover elevation border. |

### 2.2 Dark mode design contract

Dark mode (`BL-22` / `RTM-22`) keeps Geary's low-cognitive-load reading experience, restrained BulSU visual identity, and WCAG 2.1 AA contrast baseline intact.

#### 2.2.1 Theme behavior and preference model

- Default: On a first visit, follow the operating system's `prefers-color-scheme` value. If the browser provides no preference, default to light mode.
- Choices: The Header theme menu offers Light, Dark, and System default. Store the selection in `localStorage` under the stable key `geary-theme` with the value `light`, `dark`, or `system`.
- Priority: `light` and `dark` force that mode. `system` resolves against `prefers-color-scheme` and updates when the OS preference changes. Missing, invalid, or blocked storage behaves as `system` without breaking page rendering.
- Control semantics: The trigger is an icon-only menu button with `aria-haspopup="menu"`, `aria-expanded`, and an accessible name such as `Choose color theme`. The popup uses a keyboard-operable radio-menu pattern with the three named options and a visible selected state that does not rely on color alone. The trigger and every option keep the `44 x 44px` minimum mobile target and the standard crimson `:focus-visible` ring.
- Icons: Use a sun for Light, a crescent moon for Dark, and a monitor for System default. The trigger reflects the resolved active mode; text labels stay available to assistive technology and inside the menu.
- No flash of wrong theme: A small inline `<head>` bootstrap runs before styles paint. It resolves the preference, applies `class="dark"` to `<html>` when needed, and sets `color-scheme: light dark`. The hydrated control reconciles with that initial state instead of re-deciding it after paint.
- Motion restraint: Theme changes may use a short color transition only when `prefers-reduced-motion: no-preference`. Crossfade overlays, page reloads, and layout shifts are not permitted.

#### 2.2.2 Dark token set and contrast rules

Geary's dark theme is Obsidian Slate & Luminous Crimson. It avoids pure black (`#000000`) glare and pure-white (`#FFFFFF`) body text halation. These values override the light semantic tokens; contributors must not add parallel hard-coded palettes in components.

| Semantic token | Dark value | Required use |
| :--- | :--- | :--- |
| `canvas-paper` | `#0F1317` | Default page canvas and hero gear cut-outs. |
| `surface-card` | `#171C22` | Cards, inputs, dropdowns, mobile menu, TOC, source card, and map inspector. |
| `surface-subtle` | `#212830` | Table headers, code/kbd chips, and neutral hover surfaces. |
| `brand-crimson` | `#F26B8A` | Links, active navigation, category accents, and selected interactive states; AA+ on dark surfaces. |
| `brand-crimson-hover` | `#F78DA7` | Hover and active text accents only. |
| `brand-crimson-solid` | `#A81C44` | Filled primary controls with white labels; preserves at least 7:1 contrast. |
| `brand-crimson-wash` | `#2D161E` | Selected rows, badges, and map-match wash. |
| `brand-gold` | `#E5B32E` | Gear ring, decorative borders, and icon accents; never small body text. |
| `brand-gold-wash` / `brand-gold-ink` | `#292112` / `#F2C94C` | Notice and tip callouts; use the pair together. |
| `ink-primary` / `ink-secondary` / `ink-muted` | `#F1F3F5` / `#B0B8C1` / `#88929D` | Headings/body, supporting text, and placeholders respectively. |
| `border-subtle` / `border-strong` | `#2A323C` / `#3C4652` | Structural borders and resting interactive borders. |

Normal text and meaningful control boundaries must maintain at least `4.5:1` contrast; large text and non-text UI indicators must maintain at least `3:1`. Gold remains decorative unless paired with its approved dark-gold ink treatment. The light theme stays unchanged.

#### 2.2.3 Implementation boundaries

- Define light tokens at `:root` and dark overrides at `:root.dark`. Use semantic Tailwind and CSS token utilities (`bg-canvas-paper`, `bg-surface-card`, `text-ink-primary`, `border-border-subtle`); do not branch component markup by theme.
- Audit and replace hard-coded light surfaces in `Header`, `Footer`, `SearchBar`, `ExploreSpotlight`, `CategoryCard`, `ArticleCard`, `ArticleLayout`, `TableOfContents`, `VerificationBanner`, and `CampusMap`.
- Use `fill="var(--color-canvas-paper)"` for hero gear holes. The campus SVG must use semantic token-backed fills and strokes: canvas ground, subtle building surfaces, structural borders, crimson wash and outline for hover, and crimson-solid with gold outline for selection.
- Keep information hierarchy, typography, spacing, card anatomy, and responsive breakpoints identical across themes. Dark mode changes color only.

#### 2.2.4 Completion and verification gate

`BL-22` is complete only when the preference control, bootstrap, and all token migrations are in place and these gates pass:

1. `TC-E2E-08`: Explicit preference persists across reloads; initial render does not flash the opposite theme; keyboard operation and reduced-motion behavior pass.
2. `TC-A11Y-03`: Axe reports zero WCAG 2.1 AA violations in dark mode on Home, Category, Article, Map, and 404 routes.
3. Existing responsive overflow, search, TOC, map, and focus tests pass in both themes without lowering any verified requirement.

## 3. Typography system

### 3.1 Font family stacks

- Headings (`--font-heading`): `'Plus Jakarta Sans', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`
- Body & UI (`--font-sans`): `'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`
- Monospace (`--font-mono`): `'JetBrains Mono', ui-monospace, SFMono-Regular, Consolas, monospace`

`Plus Jakarta Sans` (`600`-`800`) and `Inter` (`400`-`700`, `400-italic`) are self-hosted locally via `@fontsource` Latin subsets with `font-display: swap`; system fallbacks prevent invisible text on slow campus mobile connections.

### 3.2 Typographic scale

| Role | Font family | Mobile size (`<768px`) | Desktop size (`>=768px`) | Line height | Weight | Letter spacing | Vertical margin rules |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| Hero display (`H1` Home) | `--font-heading` | `1.875rem` (`30px`) | `2.5rem` (`40px`) | `1.15` | `800` | `-0.025em` | `mb-4` (`16px`) |
| Page / article title (`H1`) | `--font-heading` | `1.75rem` (`28px`) | `2.25rem` (`36px`) | `1.2` | `700` | `-0.02em` | `mt-3 mb-3` |
| Section heading (`H2` prose) | `--font-heading` | `1.375rem` (`22px`) | `1.5rem` (`24px`) | `1.3` | `700` | `-0.015em` | `mt-9 mb-3` (`2.25em` top / `0.75em` bottom) |
| Subsection heading (`H3` prose) | `--font-heading` | `1.125rem` (`18px`) | `1.25rem` (`20px`) | `1.35` | `600` | `-0.01em` | `mt-7 mb-2` |
| Minor heading (`H4` prose) | `--font-heading` | `1rem` (`16px`) | `1.0625rem` (`17px`) | `1.4` | `600` | `0` | `mt-5 mb-1.5` |
| Article prose body | `--font-sans` | `1rem` (`16px`) | `1.0625rem` (`17px`) | `1.75` | `400` | `0` | `mb-5` between paragraphs |
| UI / card body | `--font-sans` | `0.9375rem` (`15px`) | `0.9375rem` (`15px`) | `1.5` | `400` | `0` | `mb-2` inside cards |
| Caption / metadata / badge | `--font-sans` | `0.75rem` (`12px`) | `0.8125rem` (`13px`) | `1.4` | `500`-`600` | `0.01em` | Inline / `gap-2` |

### 3.3 Low-cognitive-load prose rules

1. Constrained measure (`65ch`): Article reading width stops at `max-w-prose` (`65ch`) so lines stay scannable on wide monitors.
2. Asymmetric heading spacing: A larger top margin (`2.25em`) than bottom margin (`0.75em`) on `h2` ties each heading visually to the section below it.
3. 16px mobile input and body floor: Keeps iOS and Android browsers from auto-zooming on `<SearchBar />` inputs and keeps body text readable outdoors.

## 4. Spacing, grid, and responsive breakpoints

### 4.1 Spatial scale (`4px` / `0.25rem` base unit)

| Token | Value | Primary layout application |
| :--- | :--- | :--- |
| `space-1` | `4px` (`0.25rem`) | Tight inline icon gaps, vertical badge padding. |
| `space-2` | `8px` (`0.5rem`) | Breadcrumb separators, badge-to-title spacing, `<kbd>` gaps. |
| `space-3` | `12px` (`0.75rem`) | Internal card element spacing, mobile TOC padding. |
| `space-4` | `16px` (`1rem`) | Mobile page gutter (`px-4`), grid gap on small screens (`gap-4`), prose list gaps. |
| `space-5` | `20px` (`1.25rem`) | Standard mobile card padding (`p-5`), paragraph spacing. |
| `space-6` | `24px` (`1.5rem`) | Tablet page gutter (`sm:px-6`), desktop card padding (`md:p-6`), desktop grid gap (`md:gap-6`). |
| `space-8` | `32px` (`2rem`) | Desktop page gutter (`lg:px-8`), article header bottom divider margin. |
| `space-12` | `48px` (`3rem`) | Major section vertical separation on mobile/tablet (`py-12`). |
| `space-16` | `64px` (`4rem`) | Hero and directory vertical spacing on desktop (`lg:py-16`). |

### 4.2 Container, grid, and responsive breakpoints

- Global max-width container: `max-w-6xl` (`1152px`) centered with `mx-auto px-4 sm:px-6 lg:px-8`.
- Zero horizontal overflow rule: Every route must maintain `document.documentElement.scrollWidth <= window.innerWidth` at `375px`, `768px`, and `1280px`.

| Breakpoint | Viewport width | Navigation header | Home discovery grids | Subcategory / related grid | Article reading layout |
| :--- | :--- | :--- | :--- | :--- | :--- |
| Mobile (default) | `< 768px` | Brand mark + Search trigger + Hamburger drawer toggle (`>= 44x44px`) | `1` column (`grid-cols-1`) for Featured (6 cards per group) | `1` column (`grid-cols-1`) | Single stack: Header -> Collapsed `<details>` TOC -> Prose (`100%` up to `65ch`) -> Related |
| Tablet (`md`) | `768px - 1023px` | Brand mark + Inline category links + Compact SearchBar | `2` columns (`md:grid-cols-2`) for Featured (6 cards per group) | `2` columns (`md:grid-cols-2`) | Single stack (`max-w-prose mx-auto`) with collapsed `<details>` TOC |
| Desktop (`lg`) | `>= 1024px` | Full single-row top nav (`h-16` / `64px`) | `3` columns (`lg:grid-cols-3`) for Featured (6 cards per group) | `2`-`3` columns (`lg:grid-cols-2` / `3`) | Two-column CSS grid: `[minmax(0, 65ch)_260px]` with sticky `"On this page"` `<aside>` TOC (`top-24`) |

## 5. Component specifications and interactive states

### 5.1 Global header and Geary brand mark (`Header.astro`)

- Anatomy: Sticky top `64px` (`h-16`) bar on `bg-[#F8F9FA]/95` with `border-b border-[#DEE2E6]`.
  - Desktop (`>= 768px`): Geary wordmark + 8-tooth geometric gear SVG (`#8B1538` outer gear, `#D4A017` inner ring) on the left; `Home` (`/`), `Articles` (`/articles`), `Campus Map` (`/map`), and `Contribute` (`/contribute`) links; and `<SearchBar variant="header" />` (`md:w-48 lg:w-60`) on the right.
  - Mobile (`< 768px`): On Home (`/`), `<SearchBar variant="header" />` is hidden and the gear mark + Geary wordmark sit centered beside the right-aligned drawer toggle. On interior pages, only the gear mark shows on the left (`sr-only md:not-sr-only` wordmark) and `<SearchBar variant="header" />` spans the available space (`flex-1`) between the gear mark and the drawer toggle.
- Interactive states:
  - Default: `text-[#495057]` navigation links, `min-h-[44px]` mobile tap target.
  - Hover: `text-[#8B1538]` with `150ms` transition; gear SVG rotates `90deg` (`300ms ease-out`) and returns to `0deg` on pointer leave.
  - Active route: `text-[#8B1538] font-semibold` with pill wash `bg-[#FDF2F4]`.
  - Focus-visible: `2px solid #8B1538` ring (`outline-offset-2`).

### 5.2 Search Bar React island (`SearchBar.tsx`)

- Variants:
  - `hero` (Home page): `h-[52px]` (`rounded-xl`), `bg-surface-card` inside a rotating dual-beam crimson/gold border frame (`.hero-search-beam`, static under `prefers-reduced-motion: reduce`), magnifying glass icon (`text-ink-muted`), cycling placeholder, and right-aligned desktop `<kbd>/</kbd>` hint (`bg-surface-subtle text-ink-secondary`).
  - `header` (Interior pages / navbar): Compact `h-10` input (`w-44 sm:w-56 md:w-64`, `rounded-lg`) opening an overlay dropdown without breaking the single-row header on `375px` mobile.
- Dropdown results overlay (`z-50`): `bg-white border border-[#DEE2E6] rounded-xl shadow-lg max-h-[400px] overflow-y-auto mt-2`.
- Interactive states:
  - Hover / keyboard active (`activeIndex`): Row shifts to `bg-[#FDF2F4]` with `3px` left accent border (`border-l-[3px] border-[#8B1538]`).
  - Focus-visible: `border-[#8B1538] ring-2 ring-[#8B1538]/20`.
  - Empty / zero-match: Displays `"No articles matched '<query>'."` (JSX-escaped).
  - Offline / fetch error: Inline message (`"Search index couldn't load right now."`) plus direct links to all 7 categories.

### 5.3 Category directory card (`CategoryCard.astro`)

- Anatomy: Clickable `<a href="/categories/...">` card (`group flex flex-col justify-between bg-white border border-[#DEE2E6] rounded-xl p-5 transition-colors`).
  - Top row: Category icon inside a `w-10 h-10 rounded-lg bg-[#FDF2F4] text-[#8B1538]` container.
  - Title row: Category title (`text-lg font-bold text-[#181C20]`) on the left and right-aligned arrow indicator (`->`, `text-[#8B1538]`).
- Interactive states: Hover shifts card border to `#8B1538` and title/arrow to `#8B1538` / `#6E0F2B`; `:focus-visible` shows crimson outline.

### 5.4 Article summary card (`ArticleCard.astro`)

- Anatomy: Clickable `<a href="/articles/...">` card (`flex flex-col justify-between bg-white border border-[#DEE2E6] rounded-xl p-5 transition-colors`). Shows title (`font-semibold text-[#181C20]`) and a bottom-aligned row pairing the 2-line clamped body preview (`line-clamp-2 flex-1 text-sm text-[#495057]`) with `->` (`text-[#8B1538]`) on the right.
- Interactive states: Hover changes border and title color to `#8B1538` and nudges `->`; `:focus-visible` shows crimson outline.

### 5.5 Breadcrumbs (`Breadcrumbs.astro`)

- Anatomy: `<nav aria-label="Breadcrumb">` with `text-sm text-[#495057] flex flex-wrap items-center gap-1.5`. Links (`Home`, `Categories`, `[Category Name]`) hover to `text-[#8B1538] underline`; separator `>` (`aria-hidden="true" text-[#636C74]`); current page uses `text-[#181C20] font-medium` with `aria-current="page"`.

### 5.6 Responsive Table of Contents (`TableOfContents.astro`)

- Desktop (`>= 1024px`): `<aside class="hidden lg:block sticky top-24 self-start">` titled `"On this page"` (`text-xs font-semibold uppercase tracking-wider text-[#495057]`). Vertical list with `border-l border-[#DEE2E6]`; subsection links indented (`pl-6` vs `pl-3`).
- Mobile (`< 1024px`): `<details class="lg:hidden bg-white border border-[#DEE2E6] rounded-xl p-4 mb-6">` with `<summary>` (`min-h-[44px]` touch target) revealing section anchor links.
- Visual suppression: Rendered only when 2 or more headings exist; omitted on short articles without leaving blank spacing.

### 5.7 Markdown prose and procedural callouts (`ArticleLayout.astro`)

- Ordered procedures (`<ol>`): Step numbering (`marker:font-semibold marker:text-[#8B1538]`) with `space-y-2` vertical spacing.
- Blockquotes / callouts (`<blockquote>`): `bg-[#FEF9E7]` (or `#FDF2F4`) with `border-l-4 border-[#D4A017]` (or `#8B1538`), `px-4 py-3 rounded-r-lg text-[#181C20]` so student tips and office rules stand out.
- Tables (`<table>`): `bg-[#EEF1F4]` `<thead>` rows, balanced column padding, wrapping header text, and `min-width` protection on 3-column notes cells with `overflow-x: auto` so wide tables stay readable on `375px` screens.
- Source card (`ArticleLayout.astro`): When `source` or `sources` frontmatter is present, renders `mt-8 rounded-xl border border-[#DEE2E6] bg-white p-4 sm:p-5` below `<article>`, showing an uppercase `"Source"` (or `"Sources"` for multiple entries) label (`text-xs font-semibold uppercase tracking-wider text-[#495057]`) and a list of plain-text labels (`text-[#181C20]`) or external links (`text-[#8B1538]`).

### 5.8 Global footer (`Footer.astro`)

- Anatomy: `border-t border-[#DEE2E6] bg-[#F8F9FA] py-8` with `© 2026 Geary` on the left and a single row of legal links ([Terms of Service](/terms) and [Privacy Policy](/privacy)) on the right.

### 5.9 Interactive 2D campus map (`CampusMap.tsx`)

- Layout: Responsive split container (`lg:grid-cols-[minmax(0,1fr)_360px]`) pairing the SVG viewport on the left/top with a sticky building inspector panel on desktop (stacked below on mobile).
- Map surface and building states: Campus grounds on `canvas-paper` (`#F8F9FA`) / `#F1F3F5`, footpaths in `#DEE2E6`, parks in `#E8F3EA`, resting clickable buildings in `white` with `border-strong` (`#CED4DA`) strokes, hovered buildings in `brand-crimson-wash` (`#FDF2F4`) with `#8B1538` stroke, and selected buildings filled `#8B1538` with `#D4A017` highlight outline (`>= 2px`).
- Controls: Accessible zoom in (`+`), zoom out (`-`), and reset view buttons overlaid on the map canvas; drag/scroll pan inside the bounded SVG canvas; a standalone search bar (no extra label, filter, or quick-jump ribbons); and a right-hand inspector showing only the selected building's name and contained locations.

## 6. Interaction principles and accessibility ergonomics

1. Keyboard and focus discipline: Every interactive element uses `:focus-visible { outline: 2px solid #8B1538; outline-offset: 2px; }` (never `outline: none` without a visible replacement). Full keyboard parity applies across search (`/`, `Ctrl+K`, `ArrowUp`, `ArrowDown`, `Enter`, `Escape`), header navigation, mobile drawer (`aria-expanded`), theme menu, and native `<details>` TOC.
2. Minimum touch target (`>= 44x44px`): Mobile header buttons, TOC `<summary>`, search close/clear triggers, and category pills keep comfortable tap targets for one-handed phone use on campus.
3. Motion and cognitive restraint: Transitions stay brief (`150ms`-`300ms` ease-out on color, border, and transform properties, plus slow ambient rotation on the home hero watermark), respecting `@media (prefers-reduced-motion: reduce)` by disabling motion when requested. Auto-playing carousels, modals on load, floating chat widgets, and decorative watermarks are not allowed inside `<article>`.
4. Progressive clarity: Core navigation, category browsing, and article reading stay visually stable and legible before interactive controls hydrate.
