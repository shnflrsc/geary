## Project Specifications & Token-Efficient Context Rules

`docs/` holds the project specs:

- `docs/PROJECT_CHARTER.md` — vision, users, MVP scope boundaries
- `docs/PRD.md` — MVP features (`P0`/`P1`) and acceptance criteria
- `docs/SRS.md` — functional, non-functional, and security requirements
- `docs/USER_FLOWS.md` — operational modes, user journeys, error flows
- `docs/ARCHITECTURE.md` — Bun + SvelteKit 3 + Svelte 5 + Tailwind v4 stack, routes, contracts
- `docs/DESIGN_SYSTEM.md` — color tokens, WCAG contrast, typography, component states
- `docs/TESTING.md` — verification layers, `TC-*` cases, CLI pipeline
- `docs/REQUIREMENTS.md` — bidirectional traceability matrix
- `docs/ROADMAP.md` — milestones, backlog, known issues
- `docs/WRITING_FRAMEWORK.md` — editorial, formatting, and source standard for articles

### Mandatory Workflow
1. **Docs on demand only:** Do NOT pre-read `docs/*.md` before coding. Only grep and read the specific section needed when requirements, tokens, or contracts are ambiguous.
2. **Scope doc updates:** Update `docs/*.md` ONLY when adding/removing routes, changing API/data schemas, or altering MVP scope. Skip doc updates for UI tweaks, bug fixes, copy changes, and article edits.
3. **Context diet:** Never read large files whole (`docs/*.md`, `src/data/campus-map.ts`, `src/data/academic-calendar.ts`). Search for the symbol/section first and read targeted line ranges.
4. **Articles (`src/content/articles/`):** Follow `docs/WRITING_FRAMEWORK.md` and run the `humanizer` skill.

## Development

Dev server:

```
bun run dev
```

Verification before committing:
- Article-only edits: `bun test tests/unit/content.test.ts`
- Code/config edits: `bun run check; bun test; bun run build`
