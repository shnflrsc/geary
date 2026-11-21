# Geary Article Writing Framework

**Document type:** Editorial and Writing Standard

**Applies to:** All articles, tutorials, and informational content published on Geary.

**Terminology rule:** Always refer to Geary's published entries as **articles** (never "guides") in UI copy, metadata, labels, and site prose.

**Last-updated rule:** Any and all updates to an article (content, links, sources, formatting, or frontmatter) MUST update its `updatedDate` frontmatter field to the current date (`YYYY-MM-DD`).

## 1. Editorial Philosophy

Geary prioritizes clarity, directness, and usefulness. Every article should get readers to the exact answer or action they need with minimal reading effort.

Follow these principles:

* **Straight to the point.** Lead with the answer, requirement, or action. Skip warm-up text.
* **Concise, not compressed.** Remove unnecessary words without sacrificing clarity or packing dense details into one cramped sentence.
* **Avoid Symbol Grouping.** Do not cluster heavy concentrations of numbers, dates, parentheses, slashes, dashes, and abbreviations in a single paragraph or sentence.
* **Reader-first.** Organize information around what readers need to do, not background trivia.
* **Easy to scan.** Use clear headings, short paragraphs, and purposeful lists or tables.
* **Friendly and plainspoken.** Write naturally, like explaining a process to a fellow student.
* **Structured, not fragmented.** Group distinct topics cleanly without creating headings for every minor point.
* **Practical over theoretical.** Prioritize actionable steps over lengthy explanations.

### 1.1 Reading Efficiency Over Compression

Geary does not measure efficiency by fewest words alone. Keep three concepts distinct:

* **Conciseness:** Removing unnecessary words and irrelevant information.
* **Compression:** Packing as much information as possible into as few words or sentences as possible.
* **Reading efficiency:** Communicating information with the least cognitive effort required from the reader.

Optimize for **reading efficiency**, not aggressive compression. A short paragraph that forces students to mentally unpack stacked dates, conditions, abbreviations, symbols, and parenthetical notes is harder to read than two clean sentences or a short list. When separating information improves comprehension, readability wins over saving words.

## 2. Writing Style, Tone, and Tooling

### 2.1 Required Workflow: Use the `humanizer` Skill

The Geary repository has the `humanizer` skill installed. Always use the `humanizer` skill when writing or editing articles to strip out AI phrasing, stiff transitions, and robotic patterns before publishing.

### 2.2 Tone

Write in a tone that is:

* Direct and straightforward without sounding abrupt or robotic.
* Friendly and approachable without being overly casual.
* Clear and professional without sounding bureaucratic or academic.
* Neutral and factual when stating policies, fees, deadlines, and official procedures.
* Reassuring only where a process is genuinely unfamiliar or confusing.

Avoid:

* Introductory wind-ups and wrap-up conclusions.
* Corporate jargon, legalese, and stiff formalities.
* Unexplained technical terms.
* Filler phrases, generic statements, and AI-sounding clichés.
* Excessive enthusiasm or exclamation marks.
* Repeating points already covered elsewhere in the article.

### 2.3 Sentence Construction

* Put the main point first.
* Keep sentences short and direct—one primary idea per sentence.
* Use active voice.
* Address the reader directly as "you."
* Spell out abbreviations and unfamiliar terms on first use.
* Use concrete examples when a rule or step might be misread.

Preferred:

> Submit your application form to the Office of the University Registrar.

Avoid:

> In order to facilitate the processing of your application, it is highly recommended that you proceed with the submission of the duly accomplished application form to the Office of the University Registrar.

### 2.4 Language

* Use standard, accessible English as the default language.
* Preserve official university names, office titles, document labels, and program names as written—do not translate them unnecessarily.
* Use the same term consistently throughout an article.

### 2.5 Symbol Grouping

**Core principle: Avoid Symbol Grouping.**

**Symbol Grouping** is the excessive concentration of special symbols, numerical references, parentheses, brackets, slashes, dashes, abbreviations, dates, time ranges, and other symbol-heavy elements within a single sentence, paragraph, or block of text. Even when technically accurate and short, dense symbol clusters create visual clutter and force readers to work harder to parse what applies to them.

Guidelines:

* Avoid stacking multiple numerical references, date or time ranges, parentheses, slashes, and abbreviations inside a short span of text.
* Do not chain parentheses repeatedly to tuck in exceptions, clarifications, and conditions inside prose.
* When a passage becomes symbol-heavy, break it into separate sentences, paragraphs, lists, or tables rather than compressing everything into one block.
* Preserve technical precision—never drop accurate figures, codes, or dates just to lower symbol count. Improve how they are organized and presented instead.
* Use judgment: symbols, parentheses, and abbreviations are not banned. The goal is preventing excessive density that slows reading.

#### Cognitive and UI/UX Foundations

These established principles inform how Geary structures dense information (keep them behind the scenes—do not cite or explain psychology inside student articles):

* **Cognitive Load Theory (John Sweller):** Readers have limited mental bandwidth. Cluttered, symbol-heavy prose adds extraneous load, making students spend effort decoding syntax instead of understanding the rule.
* **Cognitive Fluency:** Text that is visually and structurally easier to scan feels easier to understand and act on. Excessive symbol density disrupts fluency.
* **Gestalt Principles of Perceptual Organization:** Readers naturally group related items using spacing, alignment, and hierarchy. Separating dense details into clear visual chunks makes relationships obvious.
* **Miller's Law (George A. Miller):** Working memory is limited, so meaningful chunking helps readers retain and process details. Treat this as supporting context for grouping related facts cleanly—not as a rigid numeric rule.

## 3. Article Structure

### 3.1 Title

* Make the title specific and immediately recognizable.
* Match the reader's actual question or task.
* Avoid vague, clever, or bloated titles.

Examples:

* How to Apply for a Transfer to BulSU
* BulSU Enrollment Requirements and Procedures
* How to Request a Transcript of Records
* BulSU Scholarship Programs and Requirements

### 3.2 Opening (Skip Unnecessary Intros)

Do not write an introduction by default. If the title already makes the topic clear, jump directly into the answer, key rule, or first section.

Add a brief opening (1–2 sentences maximum) only when readers immediately need essential context before continuing—such as who the guide applies to, a major prerequisite, or a direct answer to the title's question.

Never include:

* Background history or broad context.
* Generic opening lines (e.g., "Navigating university processes can be challenging...").
* Restatements of the title.
* Section-by-section previews of what the article will cover.

### 3.3 Section Organization

Use descriptive Markdown headings to group information logically:

* `#` for the article title.
* `##` for primary sections.
* `###` for subsections.
* `####` only when genuinely necessary.

Avoid excessive nesting, repetitive headings, arbitrary splits, or one-sentence sections that belong elsewhere.

## 4. Guide-Specific Information Flow

Organize procedural guides in this logical sequence, adapting or omitting stages that do not apply:

1. Critical context and dealbreakers (eligibility, deadlines, rules, fees)
2. Preparation and prerequisites (documents, forms, accounts)
3. Step-by-step instructions
4. Follow-up details and edge cases (processing times, scoring, contacts, reminders)

**Do not use generic framework labels as literal section headings.** Name every heading after the actual topic it covers so readers can scan directly to what they need.

* Avoid: "Must-Know Information", "Requirements and Prerequisites", "How-To / Step-by-Step Process", "Additional Useful Information"
* Use instead: "Eligibility and Grade Cutoffs", "Documents to Prepare", "Application Steps", "How Qualifiers Are Selected", "Processing Time and Contacts"

### 4.1 Critical Context First

Put decision-critical details at the top—never bury them later in the guide. Include only what directly affects whether or how the reader can proceed:

* Eligibility and coverage.
* Application or processing windows and firm deadlines.
* Key policies, restrictions, and disqualification rules.
* Fees and payment rules.

### 4.2 Preparation and Prerequisites

List everything readers must have ready before starting:

* Required documents, forms, and where to get them.
* Eligibility conditions.
* Fees and accepted payment methods.
* Required accounts, portals, or credentials.

Use bullet lists for items readers must gather or verify. Clearly separate mandatory, conditional, and optional items—never frame optional documents as mandatory.

### 4.3 Step-by-Step Instructions

Present instructions in strict chronological order using numbered lists. Each step should:

* Start with a clear action verb.
* State where or how to complete the action (specific office, portal, or form).
* Note what happens next only when it matters to the reader.
* Cover one action—do not bundle unrelated tasks into a single step.

If a process branches into different scenarios (e.g., online vs. walk-in, freshmen vs. transferees), separate them into clearly labeled subsections. Include screenshots or links only when they materially help complete the step.

### 4.4 Post-Process and Supporting Details

Include concise, practical details readers need during or after the process:

* Processing times, selection criteria, and how to follow up.
* Common mistakes and how to fix frequent issues.
* Contact details and office locations.
* Alternative procedures.

Do not use this section as a catch-all for critical rules that belong earlier in the guide.

## 5. Markdown Formatting Standards

Use standard Markdown elements supported by Geary's renderer—headings, paragraphs, bullet lists, numbered lists, tables, and blockquotes—strictly for clarity and scannability, not decoration. Never rely on custom interactive widgets, graphical timelines, or non-standard Markdown extensions.

Do not default to dense paragraphs when another Markdown structure communicates information with less cognitive effort. Match the format to the content:

* **Timelines and chronological events:** Chronological bullet or numbered lists.
* **Multiple dates, schedules, fees, or comparisons:** Markdown tables.
* **Procedures and sequential instructions:** Numbered lists.
* **Requirements and items to gather or complete:** Regular bullet lists (never checkbox lists; see §5.4).
* **Important exceptions or restrictions:** Clearly separated paragraphs, blockquotes, or bullet points.
* **Explanations, context, and conceptual discussions:** Prose with clear headings and short paragraphs.

Do not force every detail into a table or list—use structured formats only when they materially improve comprehension.

### 5.1 Paragraphs

* Keep paragraphs to 1–3 short sentences.
* Separate distinct ideas; avoid walls of text.
* Do not break closely linked sentences into isolated one-liners unnecessarily.

### 5.2 Bullet Lists

Use bullet lists (`-` or `*`) for unordered related items, options, or facts. Each bullet must add distinct information. Do not turn regular prose into bullets.

### 5.3 Numbered Lists

Use numbered lists (`1.`) strictly for sequential steps, chronological actions, or ranked items. Never number unrelated points.

### 5.4 No Checkbox Lists

Never use Markdown checkbox/task lists (`- [ ]` or `- [x]`) in articles. Always use regular bullet lists (`-`) instead for required documents, pre-submission items, or verification lists.

### 5.5 Tables

Use tables only to compare structured data across multiple categories (e.g., fees, schedules, program differences, processing timelines). Avoid tables for explanations, long text, or step-by-step instructions.

### 5.6 Links

* When you mention an external source in the body of an article—such as an official Facebook post, university announcement, portal, or downloadable PDF—you can link directly to it inline if you have a verified URL.
* Use descriptive link text that tells readers exactly where the link leads—never use "here" or "this."
* Avoid raw URLs.
* Link directly to the specific official page, post, form, or document.
* Never invent or include unverified URLs.

Examples:

* Check the [UAO Freshman Admission announcement on Facebook] for the exact schedule.
* Submit your form through the [BulSU Online Application Portal].

### 5.7 Emphasis and Inline Formatting

Use Markdown formatting (bold, italic, inline code, blockquotes) sparingly and only when strictly necessary. Heavy formatting creates visual clutter and weakens real emphasis.

* **Bold:** Reserve for critical deadlines, dealbreaker warnings, or brief scan anchors where plain text would bury a key detail. Never bold entire paragraphs, routine terms, or repeated mentions of the same office or document.
* *Italic:* Use rarely—only for document titles, brief parenthetical notes, or subtle clarification when plain text is ambiguous.
* Inline code: Use very sparingly. Restrict it strictly to literal technical values, commands, file paths, or exact text a reader must type verbatim (such as a portal code or email format). Never use inline code for general emphasis, UI labels, or ordinary nouns.
* Blockquotes: Use only for brief official excerpts or standout rules that need visual separation.

When in doubt, leave it as plain text.

## 6. Information Prioritization

Order information by impact on the reader:

1. Dealbreakers: Rules, deadlines, or requirements that could cause mistakes or disqualification.
2. Core instructions: What to prepare and what to do.
3. Clarifications: Brief context that prevents confusion.
4. Extras: Helpful but non-essential details.

A reader skimming the page should immediately see what applies to them, what to prepare, what to do, and what to expect next.

## 7. Accuracy and Source Integrity

Accuracy always overrides brevity.

### 7.1 Acceptable Sources and Priority

Because many BulSU offices and colleges publish their latest schedules, memos, and rule changes on Facebook before updating websites, Geary accepts official PDF documents and official Facebook posts (including details gathered via Meta AI from official Facebook channels) alongside university web portals.

Prioritize sources by authority and recency:

1. Recent official BulSU PDFs and Board of Regents (BOR) resolutions (e.g., Citizen's Charter 2026, updated admission guidelines, official policy memos).
2. Latest official announcements on verified Facebook pages (University Admissions Office, Office of the University Registrar, OSAS, colleges, BulSU SG, and LSCs), including updates verified from those posts.
3. Official BulSU websites and portals (`bulsu.edu.ph`).
4. Direct statements from authorized university personnel.
5. **2016 Undergraduate Student Manual (BOR Res. No. 85, S. 2016) — fallback only:** Use only for standing statutory rules (e.g., grading scale, residency/graduation rules, student rights, disciplinary classifications) that have not been superseded by (1)–(3). Do not rely on it for current procedures, fees, deadlines, or schedules, and omit it from an article's `sources` when newer official sources already cover the topic completely.

When a newer official PDF or Facebook announcement updates or supersedes an older document (especially the 2016 Student Manual), treat the newer official announcement as current and note the effective date or academic year.

### 7.2 Verification

* Verify all dates, deadlines, fees, requirements, and procedures.
* When using Meta AI summaries of Facebook posts, check the original post date and wording whenever possible. Confirm that the information applies to the current semester or academic year, and watch for missing caveats or follow-up updates from the office.
* When using PDF documents, confirm the academic year or revision date, and flag any internal contradictions or missing appendices explicitly rather than guessing.
* Separate confirmed facts from assumptions or unofficial practices.
* Never fabricate policies, office details, contacts, URLs, or steps.
* State explicitly when official information is incomplete, unverified, or not yet announced.
* Preserve original qualifications and exceptions.
* Resolve conflicting sources instead of quietly picking one.

### 7.3 Source Attribution

Keep body prose free of heavy citation clutter. Do not repeatedly name PDF titles, resolution or memorandum numbers, page numbers, or Facebook post dates inside paragraphs or table cells—readers skim past them and they add unnecessary cognitive effort.

Use brief, simple inline references only when they give useful context or an actionable link (for example, linking to the portal or Facebook page a student needs to check, or briefly noting when two offices list different dates). Put the full list of official documents and posts in the Sources and References card at the end of the article instead:

* Cite the underlying official PDF document, webpage, or Facebook page/post—not "Meta AI" itself—using a descriptive, recognizable title and date or academic year when available.
* Link directly to the source whenever a verified URL exists. If a PDF is an internal/offline file or a Facebook detail came from an unlinked summary, list the exact document title or official Facebook page name and post date without inventing a URL.
* List each source on its own line.
* List only sources actually consulted.
* Omit the section entirely if no external sources were used.

Example:

> **Sources and References**
> BulSU Freshman Undergraduate Admissions Policy (*Updated Guidelines BulSU Freshman 2027–2028*, BulSU Student Policy Development Office — PDF)
> [BulSU University Admissions Office Official Facebook Page — Freshman Application Schedule Announcement, Nov 2026]
> [Office of the University Registrar]

## 8. Mobile-First Readability

Assume most students read Geary on their phones:

* Keep paragraphs short and headings concise.
* Keep tables compact—avoid layouts that require horizontal scrolling.
* Avoid deep list nesting.
* Break long workflows into short, distinct steps.
* Ensure the article still makes sense when skimmed.

## 9. Content Length and Editing

Apply the rule of minimum sufficient content while optimizing for **reading efficiency** rather than aggressive compression. No arbitrary word counts—let the complexity of the topic determine the length, and never cram dates, conditions, and parentheticals into one dense paragraph just to save words.

Before publishing, cut:

* Unnecessary intros, throat-clearing sentences, and redundant closing summaries.
* Repeated explanations and generic filler.
* Background details unrelated to the reader's goal.
* Wordy phrasing that can be stated directly.

Never cut details required for accuracy, completing the process, avoiding common mistakes, or spotting key exceptions.

## 10. Frequently Asked Questions

Add an FAQ section only for specific, practical questions readers are likely to ask that are not already answered above. Keep answers direct and link to earlier sections when useful. Never add FAQs just to pad length.

## 11. Final Editorial Checklist

### Content and Accuracy

* [ ] The article gets straight to the point and directly answers the intended topic.
* [ ] The `humanizer` skill has been run on the final copy.
* [ ] All claims are accurate, verified, or clearly qualified.
* [ ] Requirements, dates, fees, and steps are current (PDF versions and Facebook/Meta AI updates checked for recency).
* [ ] No information, link, or procedure is fabricated.
* [ ] Conflicting or outdated details have been resolved or noted.

### Structure and Readability

* [ ] The title clearly states the subject.
* [ ] There is no unnecessary introduction or closing summary.
* [ ] Critical information appears before step-by-step instructions.
* [ ] Headings are specific to the article's topic—no literal framework labels (e.g., "Must-Know Information" or "Additional Useful Information").
* [ ] Paragraphs are short (1–3 sentences) and structured formats (lists, tables, blockquotes) are chosen when they reduce cognitive effort.
* [ ] No Symbol Grouping—dense numbers, dates, abbreviations, slashes, and parentheticals are distributed cleanly across sentences, lists, or tables rather than compressed into one paragraph.
* [ ] Filler, repetition, and wordy phrasing have been cut without aggressively compressing dense details.

### Guides and Procedures

* [ ] Eligibility, deadlines, fees, and dealbreakers appear up front.
* [ ] Mandatory, conditional, and optional requirements are clearly separated.
* [ ] Steps are chronological, specific, and start with clear action verbs.
* [ ] Exceptions and alternate scenarios are clearly addressed.

### Formatting and Resources

* [ ] Markdown is clean, consistent, and mobile-friendly (no checkbox/task lists `- [ ]` or `- [x]`).
* [ ] Bold, italic, and especially inline code are used sparingly and only where necessary.
* [ ] Inline source references are brief and used only when helpful for context or action—full citations live in the Sources card.
* [ ] External sources mentioned in the text (such as Facebook posts or portals) use descriptive inline links when verified URLs exist.
* [ ] All hyperlinks have been checked.
* [ ] Sources and References cite the actual official PDFs, webpages, or Facebook announcements consulted.
* [ ] `updatedDate` frontmatter is updated to the current date (`YYYY-MM-DD`) whenever any part of the article is modified.

## 12. The Geary Editorial Standard

Every published article must pass one test:

> Can a student immediately find what they need, understand it on the first read, and know exactly what to do next?

If not, cut the clutter and sharpen the structure before publishing.

Geary is a practical student tool, not a university encyclopedia. Less friction. Zero fluff. Clear answers.
