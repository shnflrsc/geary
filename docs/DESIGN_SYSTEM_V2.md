# Geary Design System V2

This specification translates the Geary Material 3 Concept into implementation guidance for the student handbook. It covers visual foundations, shared components, and responsive layouts. Use the existing Geary routes, content, and behavior as the basis for implementation wherever the concept depicts only a sample or a single state.

- [Geary Material 3 Concept](https://www.figma.com/design/G77Ghi6CpnskWxJzTq4ZoF/Geary-Material-3-Concept)
- [Foundations](https://www.figma.com/design/G77Ghi6CpnskWxJzTq4ZoF/Geary-Material-3-Concept?node-id=10-94)
- [Component library](https://www.figma.com/design/G77Ghi6CpnskWxJzTq4ZoF/Geary-Material-3-Concept?node-id=9-593)
- [Mobile designs](https://www.figma.com/design/G77Ghi6CpnskWxJzTq4ZoF/Geary-Material-3-Concept?node-id=20-71)
- [V1 design specification](./DESIGN_SYSTEM.md)

## Foundations

### Brand

Use the Geary gear and wordmark in the app bar. The compact interior mobile header uses the gear alone. The brand seeds are Crimson `#8B1538` and Gold `#D4A017`. Use the theme-aware mark colors for the gear, crimson roles for primary actions and selection, and the gold container pair for holidays and notes. Home uses enlarged, low-opacity gear artwork clipped by the hero surface.

### Color and theming

Figma’s **Geary · Material 3 concept** collection provides Light and Dark values. Use semantic roles in components. For CSS, expose the palette through custom properties and change their values through the existing theme mechanism. Keep Light, Dark, and System choices and ensure embedded surfaces, map artwork, focus indicators, and contrast-sensitive icons follow the resolved theme where supported.

Use `canvas` for the page, `surface` for cards and floating panels, and `hero` for the tonal Home surface. Use `ink` and `muted` for primary and secondary text. Pair filled actions with `primary` and `onPrimary`, and tonal actions with `primaryContainer` and `onPrimaryContainer`. Pair status surfaces with their matching foreground. Use `outlineVariant` for subtle dividers and `outline` for borders where the boundary needs to be clearly visible.

| Figma role | Light | Dark |
| --- | --- | --- |
| `canvas` | `#FFF8F9` | `#1B1115` |
| `surface` | `#FFFFFF` | `#24191E` |
| `hero` | `#FCE9EE` | `#342129` |
| `ink` | `#28181E` | `#F6E8EC` |
| `muted` | `#604952` | `#D8BFC9` |
| `outline` | `#867078` | `#A58F99` |
| `primary` | `#8B1538` | `#FFB1C5` |
| `onPrimary` | `#FFFFFF` | `#580020` |
| `primaryContainer` | `#FFD9E2` | `#710B2D` |
| `onPrimaryContainer` | `#3B0017` | `#FFD9E2` |
| `gold` | `#D4A017` | `#E5B32E` |
| `goldTint` | `#F7E6B1` | `#493607` |
| `onGoldTint` | `#3C2C02` | `#FFE4A0` |
| `surfaceContainerLowest` | `#FFFFFF` | `#140C10` |
| `surfaceContainerLow` | `#FFF2F5` | `#23171C` |
| `surfaceContainer` | `#F9ECF0` | `#2B1F24` |
| `surfaceContainerHigh` | `#F3E6EA` | `#36292F` |
| `surfaceContainerHighest` | `#EDE0E5` | `#413339` |
| `outlineVariant` | `#DCC5CD` | `#57454D` |
| `secondary` | `#695056` | `#D6BEC6` |
| `onSecondary` | `#FFFFFF` | `#392A30` |
| `secondaryContainer` | `#F6DCE4` | `#503E45` |
| `onSecondaryContainer` | `#28181E` | `#F6DCE4` |
| `error` | `#BA1A1A` | `#FFB4AB` |
| `onError` | `#FFFFFF` | `#690005` |
| `errorContainer` | `#FFDAD6` | `#93000A` |
| `onErrorContainer` | `#410002` | `#FFDAD6` |
| `inverseSurface` | `#392C32` | `#F6E8EC` |
| `inverseOnSurface` | `#FCEDF2` | `#392C32` |
| `inversePrimary` | `#FFB1C5` | `#8B1538` |
| `shadow` | `#000000` | `#000000` |
| `scrim` | `#000000` | `#000000` |
| `success` | `#286347` | `#9CD4B4` |
| `successContainer` | `#CDEDD9` | `#184D36` |
| `onSuccessContainer` | `#0E3928` | `#CDEDD9` |

The `m3/` roles generally alias the Geary roles of the same name. `m3/background` maps to `canvas`, `m3/onSurface` maps to `ink`, and `m3/onSurfaceVariant` maps to `muted`. `m3/tertiaryContainer` and `m3/onTertiaryContainer` map to `goldTint` and `onGoldTint`. The following brand and tertiary values are defined directly.

| Figma role | Light | Dark |
| --- | --- | --- |
| `brand/crimson` | `#8B1538` | `#8B1538` |
| `brand/gold` | `#D4A017` | `#D4A017` |
| `brand/markCrimson` | `#8B1538` | `#F26B8A` |
| `brand/markGold` | `#D4A017` | `#E5B32E` |
| `m3/tertiary` | `#785300` | `#F2C94C` |
| `m3/onTertiary` | `#FFFFFF` | `#382800` |

Map geometry uses its own roles. Pair building selection with a label or marker so it can be identified by more than its color.

| Figma role | Light | Dark |
| --- | --- | --- |
| `map/background` | `#F4EEF0` | `#20191C` |
| `map/path` | `#FFF8F9` | `#30272B` |
| `map/building` | `#EBDCE0` | `#493A41` |
| `map/buildingOutline` | `#BFA7AF` | `#A18C96` |
| `map/greenSpace` | `#E3EBDD` | `#364B3E` |
| `map/boundary` | `#FFFAF8` | `#262024` |
| `map/boundaryOutline` | `#D3BFC5` | `#564751` |
| `map/greenSpaceOutline` | `#BCCBB3` | `#5F7765` |
| `map/pathOutline` | `#E2D1D5` | `#45373F` |
| `map/selectedBuilding` | `#A6244D` | `#D76288` |
| `map/selectedOutline` | `#6E1030` | `#FFD1DF` |

### Typography

Use Plus Jakarta Sans for display and headings, Inter for reading text, Roboto for Material 3 controls, and JetBrains Mono for code. These are the local Figma text styles. Mobile frame overrides include a 35/40 px Home title and 16/27 px article prose.

| Style | Family | Weight | Size / line height | Tracking |
| --- | --- | --- | --- | --- |
| Display / Home | Plus Jakarta Sans | Extra Bold | 66 / 72 px | -2.3 px |
| Headline / Page | Plus Jakarta Sans | Bold | 40 / 48 px | -0.8 px |
| Title / Section | Plus Jakarta Sans | Bold | 24 / 32 px | -0.35 px |
| Title / Card | Plus Jakarta Sans | Semi Bold | 20 / 28 px | 0 px |
| Body / Article | Inter | Regular | 17 / 29 px | 0 px |
| Body / Standard | Inter | Regular | 16 / 24 px | 0 px |
| Body / UI | Roboto | Regular | 14 / 20 px | 0.25 px |
| Label / Action | Roboto | Medium | 14 / 20 px | 0.1 px |
| Label / Metadata | Roboto | Medium | 12 / 16 px | 0.5 px |
| Code / Inline | JetBrains Mono | Regular | 14 / 20 px | 0 px |

### Layout, shape, and elevation

| Foundation | Figma values | Application |
| --- | --- | --- |
| Spacing | 4, 8, 12, 16, 24, 32, 48, 64 px | Use smaller gaps within controls and larger gaps between sections. The mobile frames use 16 px side gutters. |
| Shape | 4, 8, 12, 16, 20, 24, 28, 32, 100 px | Use 4–12 px for compact details, 12–16 px for cards and rows, and 24–32 px for larger surfaces. The 100 px token rounds pills. |
| Control targets | 40, 44, 48 px | The desktop header search is 40 px. Mobile toolbar controls generally use 44–48 px targets. Add hit area around small icons as needed. |
| Elevation 1 | 0 1px 3px at 15% | Raised controls |
| Elevation 2 | 0 2px 6px at 16%, plus 0 1px 2px at 10% | Floating panels and sheets |
| Elevation 3 | 0 4px 12px at 18%, plus 0 1px 3px at 12% | Overlays such as the Calendar category menu |

The Figma shadows use a warm neutral with zero spread. Use the named elevation styles for exact Figma values. The 1440 × 900 desktop and 390 × 844 mobile frames are reference viewports. Reading and listing pages grow with content. Let grids, headers, filters, and text reflow at intermediate widths.

## Shared components

| Component | Design and behavior |
| --- | --- |
| App bar | Desktop places the brand on the left, primary navigation in the middle, and theme plus compact **Search Geary** on the right. Use a tonal pill for the active route. Mobile interiors use the gear, header search, theme, and menu. Mobile Home centers the wordmark and gives search to the hero. |
| Search | Use a rounded Material 3 search field. Header and Home search find articles. Calendar and Map have dedicated inputs for events and buildings or locations. Preserve the existing shortcut ownership by route, show the slash hint where the header owns it, and support clear, suggestion selection, and keyboard dismissal. Keep empty, loading, and error feedback near the relevant input. |
| Buttons and filters | Use tonal pills for paired Calendar actions, chips for article categories, and a checkbox menu for Calendar categories. Include text or a recognizable icon and a visible focus indication. Icon-only controls need accessible names. |
| Article card | Place category at the upper left, the forward arrow at the upper right, then title and a short preview. Treat the card as one link with the title as its accessible name. |
| Breadcrumbs and headings | Place breadcrumbs above the page title where shown. Distinguish linked parents from the current page. |
| Article utilities | Use the desktop contents rail and a collapsible mobile **On this page** control. Keep sharing actions in one compact group with a consistent treatment for Share, Facebook, and Copy link. The source card uses a source title, publication details, and an external-link indicator. |
| Footer | Use a divider and subdued copyright and policy links. Let links reflow on narrow viewports and keep the Ask Geary launcher clear of them. |
| Ask Geary | Use the extended launcher, with an unread badge where relevant. The panel contains messages, source links, and a composer. Use the designed loading and error states. The loading message reads “Please wait...” |

## Page layouts

### Home

Center the title, supporting copy, and main search inside a rounded tonal hero. Keep the Academic Calendar, Campus Map, and Contribute links subordinate to search. On mobile, fit the hero and footer into a typical viewport with the Ask Geary launcher clear of the policy links. Allow the layout to grow where text scaling or a short viewport requires it.

[Desktop Home](https://www.figma.com/design/G77Ghi6CpnskWxJzTq4ZoF/Geary-Material-3-Concept?node-id=3-46) · [Mobile Home](https://www.figma.com/design/G77Ghi6CpnskWxJzTq4ZoF/Geary-Material-3-Concept?node-id=20-119)

### Academic Calendar

Desktop aligns the event search with the month grid and places equal, rounded **Filters** and **Today** buttons above the right-hand agenda. The filter menu lists all seven categories and shows the active count in the trigger. Universal, Undergraduate, and Holiday are active by default.

Mobile stacks search, the paired actions, and the month grid. Keep month browsing independent of date selection. The mobile agenda appears beneath the grid after a date or event is selected, including when opening a search result. Keep the grid at its full height, bring the agenda into view, and let its close control clear the selection. Align the agenda pointer with the selected date column and hide it when the date leaves the visible grid. Preserve horizontal month swipes and vertical page scrolling.

[Desktop Calendar](https://www.figma.com/design/G77Ghi6CpnskWxJzTq4ZoF/Geary-Material-3-Concept?node-id=6-48) · [Desktop filters](https://www.figma.com/design/G77Ghi6CpnskWxJzTq4ZoF/Geary-Material-3-Concept?node-id=14-275) · [Mobile Calendar](https://www.figma.com/design/G77Ghi6CpnskWxJzTq4ZoF/Geary-Material-3-Concept?node-id=21-149) · [Mobile filters](https://www.figma.com/design/G77Ghi6CpnskWxJzTq4ZoF/Geary-Material-3-Concept?node-id=22-553) · [Mobile agenda](https://www.figma.com/design/G77Ghi6CpnskWxJzTq4ZoF/Geary-Material-3-Concept?node-id=21-317)

### Campus Map

Use a full viewport map below the header with floating map search, zoom controls, and a legend. Desktop uses a floating building directory. Mobile uses a bottom sheet that leaves the building name and location count readable and exposes floor-grouped locations when expanded. Keep the search results, selected marker, and building details synchronized.

[Desktop Map](https://www.figma.com/design/G77Ghi6CpnskWxJzTq4ZoF/Geary-Material-3-Concept?node-id=7-48) · [Mobile Map](https://www.figma.com/design/G77Ghi6CpnskWxJzTq4ZoF/Geary-Material-3-Concept?node-id=21-502)

### Articles and article detail

The Articles concept shows a card grid with category filters and uses the shared header search. Use three columns at the desktop reference width and one column on mobile. Let mobile filters wrap. The sample article uses a reading column with a contents rail on desktop and a collapsible contents control on mobile. Keep article metadata and sharing near the heading, use readable paragraph widths, and apply the designated roles to notes and sources.

[Desktop Articles](https://www.figma.com/design/G77Ghi6CpnskWxJzTq4ZoF/Geary-Material-3-Concept?node-id=12-48) · [Mobile Articles](https://www.figma.com/design/G77Ghi6CpnskWxJzTq4ZoF/Geary-Material-3-Concept?node-id=22-440) · [Desktop article](https://www.figma.com/design/G77Ghi6CpnskWxJzTq4ZoF/Geary-Material-3-Concept?node-id=12-200) · [Mobile article](https://www.figma.com/design/G77Ghi6CpnskWxJzTq4ZoF/Geary-Material-3-Concept?node-id=21-880)

### Routes using shared layouts

Use the shared page shell and typography for Contribute, Terms of Service, and Privacy Policy. Contribute uses its existing form and contribution notice. Legal pages use the article reading measure and heading hierarchy. Apply the article listing and card patterns to existing category routes.

## Implementation review

- Compare the implemented pages with the reference frames at desktop and mobile widths. Also check intermediate widths, text scaling, long titles, wrapped controls, and empty states.
- Review representative screens in both modes by switching variables on the same layout. Check Home artwork, Calendar event colors, Map labels and overlays, and article prose and links. A variable with two values still needs a component-level check if an asset or imported instance uses an explicit color.
- Check contrast for text, icons, selection cues, and focus indicators. Target at least 4.5:1 for normal text and 3:1 for large text and essential non-text cues. Verify keyboard navigation, accessible names, focus visibility, and touch target spacing.
- Use production content and data to check layout and behavior. The Figma examples establish visual patterns and representative states.
