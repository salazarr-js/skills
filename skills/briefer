---
name: slzr-briefer
description: Create, edit, audit, or consolidate a product brief — the WHY-first vision / one-pager that captures a project's main idea before technical work. Enforces problem-first framing, brevity (1-2 pages), and strict separation of brief content from implementation/design/timeline docs. Use whenever the user mentions a brief, vision doc, one-pager, elevator pitch, product proposal, or strategy one-pager — or asks to draft, polish, tighten, shorten, dedupe, consolidate, or review such a doc. Trigger on file paths like `brief.md`, `vision.md`, `north-star.md`, `pitch.md`. Invoke even when the user doesn't explicitly say "audit" or "create" — if they're working with a brief-shaped doc, this applies.
---

# slzr-briefer — Product Brief skill

Personal skill for working with **product briefs**: the short, WHY-first vision document that captures the main idea of a product/project before any technical work begins. Reusable across projects.

Four modes: **create**, **edit**, **audit**, **consolidate**.

---

## What a brief is (and isn't)

A brief answers, in 1-2 pages, four questions:

1. **What problem** does this solve?
2. **For whom**?
3. **What's the core idea**?
4. **Why is this different** / why now?

It is the elevator pitch in document form — a stable artifact a stranger can read and understand the project's main idea and proposal.

### A brief is NOT
- A PRD (Product Requirements Document) — that's feature-level spec
- A design doc / RFC / ADR — that's a technical proposal
- A project plan — that's timelines and milestones
- A roadmap — that's prioritized features over time
- A pitch deck — that's slide-shaped persuasion
- A README — that's how-to-use docs
- A spec — that's contract-level behavior

When auditing, content belonging in any of those documents is **out of scope** and gets flagged for relocation.

---

## Canonical structure

Synthesis of the four frameworks listed at the bottom of this file. Pick the sections that fit the project; not every brief needs all of them.

### Required sections

1. **Title + one-line pitch** — name of the thing + a single sentence describing what it is and for whom.
2. **The problem** — what's broken in the status quo. Grounded in a concrete story or example, not abstract claims.
3. **The user** — who, specifically. Not "users" but the actual person, role, or segment.
4. **The core idea / solution concept** — the central thesis. Described conceptually, not as implementation. *What changes about the user's life,* not *what code we'll write.*
5. **Why this, why now** — what makes this idea right at this moment / what makes it different from alternatives.
6. **Principles** — the rules that should govern future decisions. Each one decidable (you could implement against it or flag a violation).
7. **Non-goals / scope decisions** — what this is explicitly **not** trying to do. (Shape Up calls these "no-gos.")
8. **Success criteria** — measurable outcomes that tell you it worked. Not feature completion — actual outcomes.

### Optional sections

9. **Open questions** — unresolved decisions. Only include if real ones exist; don't pad.
10. **Glossary** — only if vocabulary is non-obvious or invented for this project.
11. **Inspiration / references** — prior art, frameworks borrowed from, projects worth learning from.
12. **Current example / illustrative numbers** — if the brief uses variables (e.g. `target_amount`), one section can show one concrete instance for grounding. Clearly labeled as example, not spec.

---

## What does NOT belong in a brief

When auditing, flag this content and propose moving it to its proper home:

| Content type | Belongs in |
|---|---|
| Database schemas, ER diagrams | `architecture.md` / RFC |
| API endpoints, request/response shapes | `architecture.md` / API reference |
| Code snippets, JSON examples | `architecture.md` / examples folder |
| File paths, module structure | `architecture.md` / project README |
| Tech stack decisions (framework, DB, host) | `architecture.md` / ADR |
| Wireframes, mockups, screenshots | `design.md` / Figma / design folder |
| Implementation timelines, sprints, milestones | `roadmap.md` / project plan |
| Team / roles / responsibilities | `team.md` / project README |
| Detailed market sizing, competitive matrices | `research.md` / appendix |
| Step-by-step user flows | `design.md` / flow diagrams |
| Backlog of features, requirements | PRD / issue tracker |
| Migration / rollout plans | `plan.md` / runbook |
| Field/column/flag names, endpoint paths, function names, `snake_case` or `/api/...` identifiers used as nouns | `architecture.md` — replace inline with the concept the name represents |

**Rule:** if it answers HOW or WHEN, it's not brief content. If it answers WHY or WHAT, it might be.

---

## Writing rules

Each rule has a one-line *why* so you can apply judgment in edge cases instead of pattern-matching the letter of the rule.

### Content
- **R1. Problem before solution, always.** Lead each section with the user/problem context, not the proposed answer. *Why: framing shapes everything downstream — once a solution is named, conversation locks onto it and the original pain disappears.*
- **R2. WHY mandatory, WHAT summary, HOW forbidden.** A brief explains why the thing exists and what it is. *Why: a brief is a stable artifact; HOW details rot the fastest and pull readers into implementation debates instead of vision alignment.*
- **R3. Customer/user language, no jargon.** No "leveraging synergies," no internal codenames without explanation. *Why: jargon hides unclear thinking. If you can't explain it in the user's words, you don't understand it yet.*
- **R4. Concrete story over abstract claim.** "Users want better insights" → no. "When María opens her bank app at month-end, she has 12 tabs comparing currency rates" → yes. *Why: abstract claims don't survive debate; a specific story is harder to argue with and easier to remember.*
- **R5. Numbers and names are examples, not spec.** If 30,000 USD appears, it's the user's current target, not the product's hardcoded value. Spec talks about the variable; examples show the value. *Why: hardcoded numbers become accidental commitments; variables keep the system adaptable to other users.*

### Structure
- **R6. 1-2 pages target.** Roughly 200-400 lines of Markdown. Aggressive cut beats comprehensive. *Why: briefs that need re-reading don't get re-read. Brevity is a forcing function for clarity.*
- **R7. Each concept stated once.** Other sections reference, don't restate. *Why: restated concepts drift as edits happen in one place but not others; references stay in sync automatically.*
- **R8. Section proportionality.** No section is more than ~3× the size of comparable peer sections. *Peer sections = sections at the same role and hierarchy: one principle vs other principles, one mode description vs other modes.* *Why: a bloated section signals either an unresolved concept hiding inside, or a hidden second doc trying to escape.*
- **R9. Bullet lists capped at ~10 items.** Beyond that: split, group, or convert to prose / table. *Why: long flat lists are skim-hostile and items at the bottom never get read — signals undifferentiated thinking.*
- **R10. Tables for structured data, prose for narrative.** *Why: forcing data into prose triples its length; forcing prose into a table strips meaning. Use what fits.*

### Language
- **R11. One canonical term per concept.** Pick a word; stick with it. Don't drift between "users / customers / people." *Why: term drift makes readers wonder if you mean different things — even when you don't.*
- **R12. Every principle decidable.** "Be user-friendly" fails. "Capture must be faster than opening Instagram" passes. *Why: indecidable principles are decorations — they don't constrain future choices, so they don't earn their place.*
- **R13. No marketing fluff.** "Best-in-class," "designed for clarity," "lightweight," "intuitive," "seamless" — drop unless backed by a specific commitment. *Why: a brief is for stakeholders building the thing, not customers buying it. Fluff confuses the audience contract.*
- **R14. No empty intensifiers.** "Very," "really," "extremely," "truly" — usually deletable. *Why: "very important" is no more important than "important" — but it makes readers hunt for which sentences are merely important versus actually important.*
- **R15. No future-tense hedges.** "Will be," "should eventually," "might support" — commit (present tense) or move to Open Questions. *Why: hedges are unmade decisions disguised as commitments. Either decide or surface that you haven't.*

### Integrity
- **R16. No contradictions across sections.** Read end-to-end before fixing — local edits often re-introduce conflicts removed elsewhere. *Why: a contradicting brief stops being load-bearing; readers lose trust and revert to verbal alignment.*
- **R17. Decisions vs principles vs facts kept distinct.** A *decision* is a locked choice. A *principle* is a rule for future decisions. A *fact* is current state. *Why: when these blur, readers can't tell what's still negotiable — locked decisions get re-litigated, principles get treated as fixed, facts get questioned.*
- **R18. Open questions live only in dedicated section.** No "TBD" / "we'll see" / "probably" buried in body. *Why: a hedge mid-paragraph slips past readers who assume the paragraph is settled.*
- **R19. Concepts, not field names.** Describe what the user defines, tracks, or sees — never the storage field, endpoint path, flag name, or function name. "Target monthly spending" survives; `monthly_burn_target` is a commitment to a column. *Why: implementation names rot the fastest. They change with every refactor and pull readers into "is that table named right?" instead of "is that target right?" R2 catches whole sections of HOW; R19 catches the same leak when it appears as one noun inside otherwise-conceptual prose.*

---

## Mode: CREATE

When asked to "draft a brief," "write a vision doc for X," "create a brief."

### Two sub-flows

**From scratch (no prior materials):**
1. **Gather inputs.** Ask 2-4 clarifying questions covering:
   - What problem does this solve?
   - For whom?
   - What's the core idea (one sentence)?
   - Why this approach, why now?
   - Any non-goals already known?
   - Any principles already committed?
2. **Draft using canonical structure.** Use only the sections relevant to this project — don't pad.
3. **Apply writing rules during draft**, not after. Write decidable from the start.
4. **Show before saving.** Walk through the structure with the user before committing the file.

**From existing materials (notes, messages, chat history, scattered docs):**
1. **Read all provided materials first.** Identify the four core questions across the inputs — problem, user, idea, why now.
2. **Surface what's missing.** If any of the four questions doesn't have a clear answer in the materials, ask before drafting.
3. **Draft using canonical structure**, citing nothing inline (briefs don't carry sources — sources are in the user's head or in linked docs).
4. **Flag content that doesn't belong** if you encounter it in the materials (HOW, timelines, schemas) — propose it goes to a sibling doc.
5. **Show before saving.**

### Tone

Default to the **brief-voice**:
- **Declarative** — state, don't suggest
- **Present tense** — describe what is, not what will be
- **Plain** — short sentences, common words, no jargon
- **Calm** — no exclamation marks, no urgency, no hype
- **Confident** — state facts as facts; flag uncertainty as uncertainty
- **Concrete over abstract** (per R4)

If the user has a strong, distinctive voice that doesn't violate the writing rules, preserve it — the brief is theirs. But don't preserve fluff, hedges, or marketing language just because they wrote it that way; those are the problems the skill exists to fix.

### Language

If the user writes in mixed languages or non-English, preserve their language choices. Don't translate or normalize unless asked.

### Length

Aim short. 200-300 lines on first draft. Easier to expand than to cut later.

---

## Mode: EDIT

When asked to "update," "expand section X," "add Y to the brief," "rewrite the principles section."

### Process

1. **Read the whole brief first.** Don't edit a section without context — local changes can break R7 (each concept stated once) or R16 (no contradictions).
2. **Apply the requested change.**
3. **Re-check the changed section + adjacent sections against writing rules.** Common drift after edits: new content restates something already said elsewhere, or introduces a contradiction.
4. **Show diff** before committing.

### Watch for
- New content that duplicates an existing concept → reference instead.
- New content that contradicts another section → flag both, propose resolution.
- New content that's actually HOW → suggest moving to architecture / design doc.

---

## Mode: AUDIT

When asked to "audit," "review," "tighten," "simplify," "shorten," "dedupe."

### Process

**Pass 1 — Read whole doc** for context. Identify doc type. If it's not a brief (it's a PRD / spec / architecture doc), say so and decline rather than misapply the rules.

**Pass 2 — Content audit.** Flag anything from the "does NOT belong" table. Propose moves. **Do not auto-move.** Ask the user where to put it; create the destination file only on confirmation.

**Pass 3 — Structure audit.** Required section missing? Optional section bloated? Section proportionality OK?

**Pass 4 — Writing rules.** Apply R1–R19 in order. As part of R2 + R19, scan body text for `snake_case` tokens, `/api/` paths, backtick-wrapped identifiers, and implementation nouns ("endpoint", "field", "flag", "function", "schema") — each is a candidate vocabulary leak. For each finding: line range, rule number, proposed remediation.

**Pass 5 — Edit.** Default: annotated rewrite (edit file in place). On request: findings report as a standalone Markdown file with severity (must-fix / should-fix / nice).

**Pass 6 — Present diff** for user review before any commit.

### Severity rubric

- **Must-fix:** contradiction, HOW content in body, factual error, undefined canonical term.
- **Should-fix:** redundancy, marketing fluff, missing required section.
- **Nice:** stylistic tightening, intensifier removal, bullet list grouping.

### Worked example — one paragraph through one pass

**Input excerpt (line 47 of an example brief):**
> "The product will leverage cutting-edge AI to deliver best-in-class insights to users, very seamlessly integrating with their existing workflows. We'll likely use Postgres + a Vue frontend for the MVP."

**Findings:**
- Rule R13 (marketing fluff) — "cutting-edge AI," "best-in-class insights," "seamlessly" — drop.
- Rule R14 (empty intensifiers) — "very" — delete.
- Rule R15 (future-tense hedges) — "will leverage," "likely use" — commit or move to Open Questions.
- Rule R2 (no HOW) — "Postgres + a Vue frontend" — relocate to `architecture.md`.
- Rule R3 (no jargon) — "leverage" — say what you mean.

**Proposed rewrite:**
> "The product turns the user's transaction stream into a one-sentence weekly summary they can act on."

**Action:** offer to move the tech-stack sentence to `architecture.md` (ask first; don't move without confirmation).

### Worked example — inline vocabulary leak (R19)

**Input excerpt:**
> "The user sets `monthly_burn_target` and the agent reads it via the goals endpoint. The current stage is data."

**Findings:**
- Rule R19 — `monthly_burn_target` is a field name; "goals endpoint" is an API path used as a noun; "is data" is implementation jargon for "editable, not enforced."

**Proposed rewrite:**
> "The user sets a target monthly spending level; the agent reads it. The current stage is editable and tracked, never enforced."

**Action:** none — the rewrite is in place, no relocation needed. R19 leaks are usually one-noun-at-a-time fixes; full sections of HOW go to `architecture.md` per the table above.

### Iteration limit

If you've audited the same doc 3+ times in one session, stop tightening — diminishing returns are setting in. Escalate to clarifying questions (what's still bothering them?) instead of finding more nits. Over-audit is its own anti-pattern.

---

## Mode: CONSOLIDATE

When asked to "consolidate," "merge," "combine," "reconcile two/three briefs," "make one brief from these."

### Process

1. **Read all input briefs in full** before deciding structure.
2. **Map agreements and disagreements.** Produce a quick comparison:
   - What both/all briefs agree on → goes in directly.
   - What they disagree on → must be resolved by the user (do not silently pick one).
   - What's in only one brief → assess uniquely valuable vs. one-side-only padding.
3. **Surface the disagreements first.** Before drafting, present the conflicts to the user with a recommendation, but let them decide. *Don't synthesize through ambiguity.*
4. **Draft the consolidated brief** using canonical structure, with disagreements resolved per user decisions.
5. **Propose what happens to the source briefs.** Usually: delete after consolidation. Confirm before removing.

---

## Defaults

| Setting | Default | Override |
|---|---|---|
| Output mode | Annotated rewrite (edit in place) | "Give me a findings report" |
| Length target | None — cut what can be cut | "Get it under X lines" |
| Scope per invocation | One doc (multiple for CONSOLIDATE) | Explicit list of files |
| Commit policy | Never auto-commit. Show diff, wait for user. | (Don't override.) |
| Content relocation | Ask before moving | (Don't override.) |
| Language | Preserve user's language(s) | Explicit translate request |
| Audience | Internal team (the builders) | Ask if external |

---

## Context-sensitive rules

A few cases that don't fit cleanly in the rule list but come up enough to call out:

- **Major pivots in the brief's history.** If the project has gone through a significant pivot (the WHY changed, not just the WHAT), propose archiving the prior brief as `brief-v1.md` and starting the new one fresh rather than rewriting in place. The history matters for context.
- **Audience.** The default audience is the internal team building the thing. Investor briefs and public-facing one-pagers are related but different — ask before applying the rules unmodified.
- **Multi-language users.** Preserve the user's language mix. Don't translate or normalize Spanish/Portuguese/etc. into English without being asked.

---

## What good output looks like

After a **create**:
- Reader understands WHY in 30 seconds, WHAT in 2 minutes.
- No HOW content present.
- Every principle is decidable.
- Tone matches the user's voice.
- 1-2 pages.

After an **edit**:
- The requested change is in.
- No new redundancy or contradictions introduced.
- The diff is small and focused.

After an **audit**:
- Doc is shorter (often 20-40%, sometimes more).
- Vocabulary is uniform.
- No HOW / WHEN content remains; if present originally, the user was offered a destination.
- No content was lost — only restatements, fluff, hedges, misplaced details.
- Sections proportional; lists bounded; tables and prose chosen well.

After a **consolidate**:
- Single coherent brief replaces multiple sources.
- Every disagreement between sources was surfaced and resolved by the user — not silently merged.
- Source files are removed only after confirmation.

---

## What NOT to do

- **Don't rewrite a distinctive working voice.** If the user has a strong style that follows the writing rules, preserve it. But default to brief-voice (declarative, present-tense, plain, calm) — and never preserve fluff, hedges, or marketing language just because the user wrote them that way.
- **Don't add new ideas.** Audits and edits only remove, merge, or rewrite. New content requires explicit user input.
- **Don't auto-commit.** Always pause for review.
- **Don't audit non-brief docs with this skill.** If the doc is a PRD, architecture, runbook, or README, decline politely and suggest the right tool.
- **Don't move content to other files without asking.** Flag, propose destination, wait for confirmation.
- **Don't synthesize through disagreement.** In CONSOLIDATE mode, surface conflicts to the user. Never silently pick one source over another.
- **Don't keep auditing past the point of diminishing returns.** Three passes is usually enough — beyond that, escalate to questions.

---

## References

Frameworks the rules and structure are synthesized from. They differ in vocabulary but converge on the same shape: problem-first, brief, customer language, no implementation, explicit non-goals, measurable outcomes, open questions section.

- **Amazon Working Backwards PR/FAQ** — future-perspective press release (≤1 page) + FAQ (≤5 pages). Customer-focused, no jargon. https://workingbackwards.com/resources/working-backwards-pr-faq/ • concept overview: https://workingbackwards.com/concepts/working-backwards-pr-faq-process/
- **Basecamp Shape Up Pitch** — Problem / Appetite / Solution / Rabbit Holes / No-Gos. 1-2 pages with rough sketches. https://basecamp.com/shapeup/1.5-chapter-06 • rabbit holes detail: https://basecamp.com/shapeup/1.4-chapter-05
- **Lenny Rachitsky's Product 1-Pager + Strategy One-Pager** — modern PM-style briefs, one page, scannable. https://www.lennysnewsletter.com/p/my-favorite-templates-issue-37 • 1-Pager + PRD examples: https://www.lennysnewsletter.com/p/prds-1-pagers-examples
- **Productboard's Product Brief guide** — 9-section structure (Name / Problem / Users / Strategic Alignment / Current State / Success Criteria / Constraints / Assumptions / Open Questions), 1-2 pages, no solution language. https://www.productboard.com/glossary/product-brief/
- **Supporting reads** — Asana's brief template guide (https://asana.com/resources/product-brief-template) and Reforge's product brief artifacts (https://www.reforge.com/artifacts/c/product-development/product-brief).
