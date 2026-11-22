# Project charter: Geary (Unofficial BulSU Student Information Hub)

## 1. Document control and project identification

| Attribute | Details |
| :--- | :--- |
| Project title | Geary - Unofficial BulSU Student Information Hub |
| Document type | Project Charter (MVP Baseline) |
| Standard reference | ISO/IEC/IEEE 12207 (*Systems and software engineering - Software life cycle processes*, Clause 6.3.1 *Project Planning Process* and Clause 6.4.1 *Stakeholder Needs and Requirements Definition Process*) |
| Specification directory | `docs/` (companion specs: [PRD.md](./PRD.md), [SRS.md](./SRS.md)) |
| Version | `1.0 (MVP Baseline)` |
| Date | `2026-11-17` |
| Status | Approved for MVP Baseline |

## 2. Problem statement

Students at Bulacan State University (BulSU) have to piece together academic, administrative, and campus information from disconnected places:

- Procedural announcements and enrollment instructions live across dozens of college, office, and student council Facebook pages, so looking up past posts is slow and unreliable.
- University policies such as grading scales, retention rules, Latin honors criteria, and dress code exemptions are buried inside multi-page PDF handbooks that are hard to read, zoom, and search on a phone.
- Everyday procedures and office locations often require cross-referencing conflicting posts, physical bulletin boards, and word-of-mouth advice.

Without a single readable reference, students miss requirements and spend too much time sorting through conflicting details, especially during enrollment and administrative deadlines.

## 3. Project vision

Geary is an unofficial, student-run information hub for Bulacan State University. It brings scattered administrative procedures, plain-language Student Handbook policies, and practical campus knowledge into one fast, mobile-first website with a BulSUan visual identity.

## 4. Project objectives

| ID | Objective | Measurable outcome |
| :--- | :--- | :--- |
| `OBJ-01` | Information consolidation | Gather scattered BulSU procedures (enrollment, shifting, transferring, document requests), simplified handbook policies, and campus life articles (including food spots) into one static website. |
| `OBJ-02` | Readability and low cognitive load | Turn dense university bureaucracy into clear, scannable prose with predictable hierarchy and straightforward navigation. |
| `OBJ-03` | Fast discoverability | Let students find answers in seconds through intent-based categories and instant client-side search. |
| `OBJ-04` | BulSUan visual identity | Deliver a mobile-first interface grounded in BulSU's colors and campus identity. |
| `OBJ-05` | Zero operational cost | Run and handle peak enrollment traffic with `$0.00/month` in hosting, database, or API costs. |

## 5. Target users and stakeholders

### 5.1 Primary users

- Incoming freshmen (`ACT-01`): students checking admission requirements, first-time enrollment steps, campus layout, and university rules, mostly on smartphones.
- Shiftees and transferees (`ACT-02`): students looking up requirements and office workflows for changing programs or transferring into BulSU under tight deadlines.
- Continuing undergraduate students (`ACT-03`): students checking Registrar procedures (`TOR`, `COR`, Good Moral, ID replacement, adding/dropping, `INC` completion), academic rules, scholarships, and campus spots.

### 5.2 Secondary users

- Prospective applicants: senior high school students and parents researching BulSU admissions and campus expectations.
- Student leaders and organizations: campus volunteers linking students to verified web articles instead of answering the same questions repeatedly.

### 5.3 Project maintainers and contributors

- Student maintainers and contributors (`ACT-04`): a multi-contributor team of student developers, writers, and reviewers who author, verify, and review article content and code through Git branches and pull requests.

## 6. Project scope (MVP baseline)

### 6.1 In scope (five confirmed MVP pillars)

1. Articles and Markdown authoring: publishing structured procedural how-to articles, handbook summaries, and campus life articles written in Markdown.
2. Categories and purposeful organization: grouping all articles under seven student-intent categories (*Enrollment*, *Academics*, *Documents*, *Scholarships*, *Policies*, *Organizations*, and *Campus*) with sub-topic headings and reading orientation aids.
3. Client-side search bar: instant keyword search across all published articles running entirely in the browser with no backend cost.
4. Low-cognitive-load UI/UX and BulSUan identity: a calm, mobile-first reading layout and consistent navigation built for BulSU students.
5. Interactive 2D campus map and location finder: an SVG schematic of the BulSU Malolos Main Campus (`/map`) with clickable buildings, indoor office listings, and instant location search with no backend dependencies.

### 6.2 Out of scope (excluded from MVP)

- AI or RAG chatbot: an AI chatbot over the Student Handbook PDF is excluded from the MVP to avoid API costs, rate limits, and policy hallucinations.
- User accounts and authentication: no student logins, profiles, or user sessions.
- Dynamic backends and databases: no runtime server APIs, comment sections, voting systems, or managed databases.
- Official portal integration: no connection to official BulSU enrollment portals, SIS, or administrative systems.
- Unapproved auxiliary features: anything outside the five confirmed MVP pillars is deferred until after the MVP ships.

## 7. Project constraints

### 7.1 Financial constraints

Total recurring costs for hosting, storage, search, and delivery must stay at `$0.00/month`, deploying cleanly to free-tier static web hosting.

### 7.2 Technical baseline constraint

The site is built with Astro, Tailwind CSS, and React islands, hydrating React only where client-side interactivity is required.

### 7.3 Scope and UX constraints

- Development stays strictly within the five confirmed MVP capabilities.
- Layout, styling, and navigation must keep reading friction and visual distraction low.

### 7.4 Operational, team, and legal constraints

- Multi-contributor workflow: contributors work through Git branches, pull request reviews, and shared specifications in `docs/` so changes stay consistent across code and articles.
- Unofficial status and verification notice: Geary is an unofficial, student-maintained resource unaffiliated with Bulacan State University administration. Published articles must remind students to verify current fees, deadlines, and policy rulings with official BulSU offices (such as the Office of the Registrar, Admissions Office, and OSAS).
