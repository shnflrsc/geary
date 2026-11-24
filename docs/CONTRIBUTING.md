# Contributing to Geary

Welcome to **Geary**, an unofficial, student-run information portal for Bulacan State University (BulSU). This document explains how development, article writing, testing, and pull requests work so new contributors can ship changes safely without stepping on each other.

**Terminology note:** Refer to Geary as an **information portal** and to its published entries as **articles** (never "guides") in UI copy, metadata, and docs.

## 1. Local Setup

Geary uses **Bun**, **Astro**, **Tailwind CSS**, and **React** (hydrated only for interactive islands).

```bash
bun install
bun run dev
```

Useful scripts from `package.json`:

| Command | Purpose |
| --- | --- |
| `bun run dev` | Start the local Astro dev server |
| `bun run check` | Run `astro check` for TypeScript, Astro, and content schema validation |
| `bun test` | Run Bun unit tests in `tests/unit` |
| `bun run build` | Build the static site into `dist/` (also generates `/search-index.json` and sitemap) |
| `bun run preview` | Preview the production build locally |
| `bun run test:e2e` | Run Playwright end-to-end and accessibility tests |

## 2. Documentation-First Workflow

The `docs/` folder is the source of truth for Geary's scope, requirements, architecture, design tokens, and testing rules:

- [PROJECT_CHARTER.md](./PROJECT_CHARTER.md) — Problem statement, scope boundaries, and project constraints
- [PRD.md](./PRD.md) — Features, priorities, and acceptance criteria
- [SRS.md](./SRS.md) — System constraints, functional requirements, and quality targets
- [USER_FLOWS.md](./USER_FLOWS.md) — User journeys and edge/error flows
- [ARCHITECTURE.md](./ARCHITECTURE.md) — Stack, Astro island boundaries, and data contracts
- [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md) — Color tokens, typography, contrast, and component states
- [TESTING.md](./TESTING.md) — Test cases and verification layers
- [REQUIREMENTS.md](./REQUIREMENTS.md) — Bidirectional traceability matrix
- [ROADMAP.md](./ROADMAP.md) — Milestones and backlog
- [WRITING_FRAMEWORK.md](./WRITING_FRAMEWORK.md) — Editorial standard for all articles

**Before writing code:** Read the relevant spec file(s). If your change alters scope, features, requirements, user flows, architecture, design tokens, or testing strategy, **update the matching spec in `docs/` first** in the same PR.

## 3. Writing and Updating Articles

All articles live in `src/content/articles/` and must follow [WRITING_FRAMEWORK.md](./WRITING_FRAMEWORK.md).

Our standard article workflow:

1. **Gather and cross-check sources:** Collect official BulSU PDFs, verified Facebook advisories (UAO, Registrar, OSAS, ICTO, colleges, SG/LSCs), and official vendor pages. When using AI research tools (such as Gemini Deep Research, ChatGPT, or Meta AI) to survey a broad topic, synthesize findings into one reference and flag every unverified or conflicting claim.
2. **Verify BulSU-specific facts directly:** Never guess campus quotas, exact error messages, office contacts, or portal rules. Confirm them directly (for example, testing a student account or checking with the responsible BulSU office) before publishing.
3. **Draft to the editorial standard:**
   - Lead with the answer—skip warm-up intros and closing summaries.
   - Keep paragraphs short (1–3 sentences), use active voice, and avoid symbol-heavy walls of text.
   - Use **bold** for email addresses (never inline code), descriptive inline links (no raw URLs), and regular bullet lists (never `- [ ]` checkboxes).
   - Put full source attribution in the frontmatter `sources` array with verified `http://` or `https://` URLs (omit `url` for offline PDFs rather than inventing one).
   - Update `updatedDate` (`YYYY-MM-DD`) whenever you edit any part of an article.
4. **Humanize and tighten:** Strip out stiff transitions, filler, and AI-sounding phrasing before opening a PR.

## 4. Branching, Commits, and Pull Requests

Never commit directly to `main`. Keep each change focused and easy to review or revert:

1. **Create a branch off `origin/main`:**
   - `feat/<short-name>` for new features or articles
   - `fix/<short-name>` for bug fixes
   - `docs/<short-name>` for documentation or spec updates
   - `refactor/<short-name>` for structural cleanup
2. **Use clear conventional commits:**
   - `feat(map): ...`, `fix(search): ...`, `docs(article): ...`, `refactor: ...`, `chore: ...`
3. **Run the local verification gate before pushing:**
   ```bash
   bun run check
   bun test
   bun run build
   ```
   GitHub Actions (`.github/workflows/ci.yml`) runs these same three checks on every pull request targeting `main`.
4. **Open a pull request:** Summarize what changed, why, and the verification output. If you are stacking a PR on another branch that gets squash-merged into `main`, rebase your branch onto `origin/main` (`git rebase --onto origin/main <old-base> <your-branch>`) and force-push with `--force-with-lease` to clear conflicts cleanly.

## 5. Working with AI Coding Agents

Contributors are welcome to use AI coding agents (such as Antigravity) alongside manual development:

- **Follow `AGENTS.md`:** The repository root `AGENTS.md` enforces the documentation-first rule and article writing framework.
- **Iterate in small slices:** Review changes in the browser and diff before committing. If a UI experiment does not feel right, revert it cleanly instead of layering workarounds.
- **Verify every claim and diff:** Treat AI-generated research, URLs, and code as drafts until `bun run check`, `bun test`, `bun run build`, and your own review confirm them.

## 6. Maintainer Note: Syncing Dual Remotes

Maintainers who work across both `shnflrsc/geary` (`origin`) and `bulsutools/geary` (`bulsutools`) merge upstream `origin/main` into `bulsutools/main` using a dedicated sync branch (for example, `sync/upstream-main-<n>`) and PR. Keep org-specific deployment or domain settings (such as `https://geary.bulsu.tools` in `src/pages/robots.txt.ts` or org CI workflows) intact when resolving merge conflicts.
