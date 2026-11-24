# Geary - The Better BulSU Student Handbook

Geary is an unofficial, student-managed information portal for Bulacan State University (BulSU) students built with SvelteKit (Svelte 5 runes), Tailwind CSS, and `@sveltejs/adapter-vercel` dynamic SSR. Always verify time-sensitive fees, schedules, and forms directly with the concerned university office.

## Quickstart

Requires **Bun** (`>= 1.x`) and **Node.js** (`>= 22.23.4`).

```sh
bun install
bun run dev
```

Set `PUBLIC_SITE_URL` in your deployment environment so canonical links, Open Graph URLs, `robots.txt`, and `sitemap.xml` resolve to your production domain (defaults to `https://geary.example.com`).

## Commands

| Command | Action |
| :--- | :--- |
| `bun run dev` | Start the local SvelteKit dev server at `localhost:5173` |
| `bun run check` | Run TypeScript and Svelte diagnostics (`svelte-check`) |
| `bun run build` | Build the SvelteKit SSR bundle for Vercel (`vite build`) |
| `bun run preview` | Preview the production SvelteKit build locally |
| `bun test` | Run Bun unit tests in `tests/unit/` (`bun run test:unit`) |
| `bun run test:e2e` | Run Playwright E2E, SEO, and Axe accessibility tests in `tests/e2e/` |

## Adding or editing student articles

1. Review writing guidelines, formatting standards, and source rules in [docs/WRITING_FRAMEWORK.md](./docs/WRITING_FRAMEWORK.md).
2. Add or edit Markdown files inside `src/content/articles/`.
3. Include valid frontmatter matching `src/lib/content-schema.ts`:
   - `title`: Article headline
   - `category`: One of `enrollment`, `academics`, `documents`, `scholarships`, `policies`, `organizations`, or `campus`
   - `subcategory`: Matching subgroup heading inside the category
   - `updatedDate`: ISO date (`YYYY-MM-DD`)
   - `sources`: List of `{ label, url? }` source citations for the end-of-article Sources and References card (legacy single `source` and `sourceUrl` fields remain optional)

## Project documentation

- [CONTRIBUTING.md](./docs/CONTRIBUTING.md) - Contributor workflow, branching, testing gate, and article process
- [AGENTS.md](./AGENTS.md) - Documentation-first workflow rules and dev server notes
- [PROJECT_CHARTER.md](./docs/PROJECT_CHARTER.md) - Scope, target users, and constraints
- [PRD.md](./docs/PRD.md) - Feature requirements and acceptance criteria
- [SRS.md](./docs/SRS.md) - System interfaces and quality attributes
- [USER_FLOWS.md](./docs/USER_FLOWS.md) - User journeys and recovery flows
- [ARCHITECTURE.md](./docs/ARCHITECTURE.md) - Tech stack, schemas, and directory map
- [DESIGN_SYSTEM.md](./docs/DESIGN_SYSTEM.md) - Tokens, typography, and contrast rules
- [TESTING.md](./docs/TESTING.md) - Verification layers and test cases
- [REQUIREMENTS.md](./docs/REQUIREMENTS.md) - Master Requirements Traceability Matrix
- [ROADMAP.md](./docs/ROADMAP.md) - Milestones and backlog
- [WRITING_FRAMEWORK.md](./docs/WRITING_FRAMEWORK.md) - Editorial, tone, and article writing framework

## Sources and attribution

Articles on Geary are sourced from:

1. Recent official BulSU PDFs and Board of Regents (BOR) resolutions (such as the Citizen's Charter 2026, updated admission guidelines, and official policy memos).
2. Verified official Facebook announcements from BulSU offices (UAO, Registrar, OSAS, ICTO, e-Library), colleges, BulSU SG, and Local Student Councils.
3. Official `bulsu.edu.ph` websites, portals, and helpdesk documentation, plus official third-party vendor education pages where applicable.
4. Direct confirmation from authorized university personnel or live student account checks for undocumented portal details.

The [2016 Undergraduate Student Manual (BOR Resolution No. 85, Series of 2016)](https://www.bulsu.edu.ph/assets/downloads/files/student_handbook.pdf) is used **only as a fallback** for standing statutory rules (such as grading scales, residency rules, and student rights) that have not been superseded. It is outdated for current procedures, fees, deadlines, and schedules.
