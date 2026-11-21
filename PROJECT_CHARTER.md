# Project Charter: Geary — Unofficial BulSU Student Information Hub

---

## 1. Document Control & Project Identification

| Attribute | Details |
| :--- | :--- |
| **Project Title** | Geary — Unofficial BulSU Student Information Hub |
| **Document Type** | Project Charter (MVP Baseline) |
| **Standard Reference** | ISO/IEC/IEEE 12207 — *Systems and software engineering — Software life cycle processes* (Clause 6.3.1 *Project Planning Process* & Clause 6.4.1 *Stakeholder Needs and Requirements Definition Process*) |
| **Version** | `1.0 (MVP Baseline)` |
| **Date** | `2026-11-17` |
| **Status** | Approved for MVP Baseline |

---

## 2. Problem Statement

Critical academic, administrative, and campus-life information for students at **Bulacan State University (BulSU)** is heavily fragmented across disparate channels:
- **Social Media & Word-of-Mouth:** Procedural announcements and enrollment guidelines are scattered across dozens of college, office, and student council Facebook pages, making historical lookup difficult and error-prone.
- **Dense Official Documents:** Key university policies (such as grading scales, retention rules, Latin honors criteria, and dress code exemptions) reside inside multi-page PDF handbooks that are awkward to read, pinch-zoom, and search on mobile phones.
- **High Cognitive Load:** Students frequently waste time cross-referencing conflicting posts, physical bulletin boards, and informal advice to figure out everyday administrative procedures and campus locations.

Without a unified, readable, and student-centric reference point, students experience unnecessary confusion, missed requirements, and high cognitive friction—especially during peak enrollment and administrative deadlines.

---

## 3. Project Vision

To serve as the go-to, **unofficial centralized student information hub** for Bulacan State University—consolidating scattered administrative procedures, simplified Student Handbook policies, and practical campus life knowledge into one fast, accessible, low-cognitive-load web platform anchored in a distinctive BulSUan visual identity.

---

## 4. Project Objectives

| ID | Objective | Measurable Outcome |
| :--- | :--- | :--- |
| **OBJ-01** | **Information Consolidation** | Centralize scattered BulSU processes (enrollment, shifting, transferring, document requests), simplified handbook policies, and campus life guides (including food spots) into a single static web hub. |
| **OBJ-02** | **Readability & Low Cognitive Load** | Translate complex university bureaucracy into clear, scannable prose with predictable hierarchy and effortless navigation. |
| **OBJ-03** | **Effortless Discoverability** | Enable students to find needed answers in seconds through purposeful category organization and instant client-side search. |
| **OBJ-04** | **Distinctive BulSUan Identity** | Deliver an intuitive, mobile-first visual experience unmistakably rooted in BulSU's heritage and student identity. |
| **OBJ-05** | **Zero Operational Cost** | Operate and scale reliably during peak enrollment traffic with strictly **$0.00/month** ongoing infrastructure, database, or API expenses. |

---

## 5. Target Users & Stakeholders

### 5.1 Primary Users
- **Incoming Freshmen (`ACT-01`):** Students navigating admission requirements, initial enrollment, campus layout, and university rules for the first time, primarily via mobile smartphones.
- **Shiftees & Transferees (`ACT-02`):** Students seeking clear requirements and office workflows for changing programs or transferring into BulSU under strict deadlines.
- **Continuing Undergraduate Students (`ACT-03`):** Students checking Registrar procedures (`TOR`, `COR`, Good Moral, ID replacement, adding/dropping, `INC` completion), academic policies, scholarships, and campus spots.

### 5.2 Secondary Users
- **Prospective Applicants:** Senior high school students and parents researching BulSU admissions and campus expectations.
- **Student Leaders & Organizations:** Campus volunteers referencing simplified web guides instead of repeatedly answering recurring student inquiries.

### 5.3 Project Maintainers & Contributors
- **Student Maintainers & Contributors (`ACT-04`):** Student developers and writers maintaining and verifying guide content via Git-managed text files.

---

## 6. Project Scope (MVP Baseline)

### 6.1 In-Scope (Confirmed MVP Pillars Only)
1. **Articles & Markdown Authoring:** Publishing simplified, structured procedural how-to's, handbook summaries, and campus life guides authored in Markdown.
2. **Categories & Purposeful Organization:** Organizing all content under seven student-intent categories—*Enrollment*, *Academics*, *Documents*, *Scholarships*, *Policies*, *Organizations*, and *Campus*—with purposeful sub-topic hierarchy and reading orientation aids for fast skimming and exploration.
3. **Client-Side Search Bar:** Providing instant keyword discovery across published guides entirely within the user's browser with zero backend cost.
4. **Low-Cognitive-Load UI/UX & BulSUan Visual Identity:** Establishing a calm, mobile-first reading layout and intuitive navigation tailored to BulSU students.
5. **Interactive 2D Campus Map & Location Finder:** Providing an SVG-based BulSU Malolos Main Campus schematic (`/map`) with clickable buildings, indoor office/service listings, and instant location search with zero backend dependencies.

### 6.2 Out-of-Scope (Explicitly Excluded from MVP)
- **AI / RAG Chatbot:** An AI chatbot trained on the Student Handbook PDF is explicitly **excluded/scrapped** from the MVP to eliminate API costs, rate limits, and policy hallucination risks.
- **User Accounts & Authentication:** No student logins, profiles, or user-generated sessions.
- **Dynamic Backends & Databases:** No runtime server APIs, comments sections, voting systems, or managed external databases.
- **Official Portal Integration:** No integration with official BulSU enrollment portals, SIS, or administrative systems.
- **Unapproved Auxiliary Features:** Any capability beyond the five confirmed MVP capabilities is deferred post-MVP to preserve focus and prevent scope creep.

---

## 7. Project Constraints

### 7.1 Financial Constraints
- **Zero Operational Cost:** Total recurring cost for hosting, storage, search, and delivery must remain strictly **$0.00/month**, deploying cleanly to free-tier static web hosting.

### 7.2 Technical Baseline Constraint
- **Mandated Tech Stack:** Built strictly with **Astro + Tailwind CSS + React islands** (using React hydration only where client-side interactivity is strictly required).

### 7.3 Scope & UX Constraints
- **Strict MVP Boundary:** Development is confined strictly to the five confirmed MVP capabilities.
- **Low Cognitive Load Mandate:** Visual styling and navigation must actively minimize reading friction and distraction.

### 7.4 Operational & Legal Constraints
- **Unofficial Status & Verification Notice:** Geary operates strictly as an *unofficial*, student-maintained informational resource unaffiliated with Bulacan State University administration. Published guides must advise students to verify current fees, deadlines, and policy rulings with official BulSU offices (e.g., Office of the Registrar, Admissions Office, OSAS).
