## Project Specifications & Documentation-First Rule

Use these Markdown specification files in `docs/` as the authoritative context for the project:

- `docs/PROJECT_CHARTER.md` (ISO/IEC/IEEE 12207): Problem statement, vision, objectives, target users, MVP scope boundaries, and project constraints.
- `docs/PRD.md` (Adapted ISO/IEC/IEEE 29148): MVP features, priorities (`P0`/`P1`), product behavior, and verifiable acceptance criteria.
- `docs/SRS.md` (ISO/IEC/IEEE 29148): System constraints, external interfaces, functional requirements, and non-functional quality requirements.
- `docs/USER_FLOWS.md` (ISO/IEC/IEEE 29148): Operational modes, user journeys, use cases, alternative flows, and error/off-nominal scenarios.
- `docs/ARCHITECTURE.md` (ISO/IEC/IEEE 42010 & 12207): Technology stack (Bun + Astro + Tailwind CSS + React islands), component hierarchy, data contracts, and directory structure.
- `docs/DESIGN_SYSTEM.md` (ISO/IEC 25010): Color tokens, WCAG contrast rules, typography, spacing/breakpoints, component states, and interaction principles.
- `docs/TESTING.md` (ISO/IEC 25010 & ISO/IEC/IEEE 29148): Applicable verification layers, test cases (`TC-*`), and CLI test pipeline.
- `docs/REQUIREMENTS.md` (ISO/IEC/IEEE 29148): Master bidirectional Requirements Traceability Matrix linking Charter objectives, PRD features/ACs, SRS functional/non-functional/constraint IDs, user flows/errors, architecture modules, design tokens, backlog tasks, test cases, and live verification status.
- `docs/ROADMAP.md` (ISO/IEC/IEEE 12207): Project milestones, prioritized implementation backlog, completed work, and known issues/risks for autonomous `/goal` execution.
- `docs/WRITING_FRAMEWORK.md`: Editorial, tone, structure, formatting, and source-attribution standard for all articles and student guides.

### Mandatory Workflow
1. Always read and use the relevant `.md` specification files above as source-of-truth context before planning or writing code.
2. **Any modification to scope, features, requirements, user flows, architecture, design tokens/components, or testing strategy MUST update the respective `.md` specification file(s) FIRST before implementing code changes.**
3. Keep each `.md` file strictly scoped to its specific document purpose and ISO standard reference with zero redundant cross-document overlap.
4. **When writing or editing any article (`src/content/articles/`), always follow `docs/WRITING_FRAMEWORK.md` (including running the `humanizer` skill).**

## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)
