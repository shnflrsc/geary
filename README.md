# Geary - The Better BulSU Student Handbook

Geary is an unofficial, student-managed static article hub for Bulacan State University (BulSU) students built with Astro, Tailwind CSS, and React. Always verify time-sensitive fees, schedules, and forms directly with the concerned university office.

## Quickstart

Requires **Bun** (`>= 1.x`) and **Node.js** (`>= 22.23.4`).

```sh
bun install
bun run dev
```

Set `PUBLIC_SITE_URL` in your build environment before deploying so canonical links, Open Graph URLs, `robots.txt`, and `sitemap-index.xml` resolve to your production domain (defaults to `https://geary.example.com`).

## Commands

| Command | Action |
| :--- | :--- |
| `bun run dev` | Start the local dev server at `localhost:4321` |
| `bun run check` | Run TypeScript and Astro diagnostics (`astro check`) |
| `bun run build` | Build the static site, `/search-index.json`, `robots.txt`, and sitemap to `dist/` |
| `bun run preview` | Preview the built `dist/` bundle locally |
| `bun test` | Run Bun unit tests in `tests/unit/` (`bun run test:unit`) |
| `bun run test:e2e` | Run Playwright E2E, SEO, and Axe accessibility tests in `tests/e2e/` |

## Adding or editing student articles

1. Review writing guidelines, formatting standards, and source rules in [WRITING_FRAMEWORK.md](./WRITING_FRAMEWORK.md).
2. Add or edit Markdown files inside `src/content/articles/`.
3. Include valid frontmatter matching `src/content.config.ts`:
   - `title`: Article headline
   - `category`: One of `enrollment`, `academics`, `documents`, `scholarships`, `policies`, `organizations`, or `campus`
   - `subcategory`: Matching subgroup heading inside the category
   - `updatedDate`: ISO date (`YYYY-MM-DD`)
   - `sources`: List of `{ label, url? }` source citations for the end-of-article Sources and References card (legacy single `source` and `sourceUrl` fields remain optional)

## Project documentation

- [AGENTS.md](./AGENTS.md) - Documentation-first workflow rules and dev server notes
- [PROJECT_CHARTER.md](./PROJECT_CHARTER.md) - Scope, target users, and constraints
- [PRD.md](./PRD.md) - Feature requirements and acceptance criteria
- [SRS.md](./SRS.md) - System interfaces and quality attributes
- [USER_FLOWS.md](./USER_FLOWS.md) - User journeys and recovery flows
- [ARCHITECTURE.md](./ARCHITECTURE.md) - Tech stack, schemas, and directory map
- [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md) - Tokens, typography, and contrast rules
- [TESTING.md](./TESTING.md) - Verification layers and test cases
- [REQUIREMENTS.md](./REQUIREMENTS.md) - Master Requirements Traceability Matrix
- [ROADMAP.md](./ROADMAP.md) - Milestones and backlog
- [WRITING_FRAMEWORK.md](./WRITING_FRAMEWORK.md) - Editorial, tone, and article writing framework

## Sources and attribution

Articles on Geary prioritize recent official BulSU PDFs, Board of Regents (BOR) resolutions, verified university office and student council Facebook announcements, and official `bulsu.edu.ph` portals. Standing statutory rules not superseded by newer issuances fall back to the [Undergraduate Student Manual of Bulacan State University, BOR Resolution No. 85, Series of 2016](https://www.bulsu.edu.ph/assets/downloads/files/student_handbook.pdf).
