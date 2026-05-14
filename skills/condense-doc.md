---
name: condense-doc
description: Reduce the length of a document while preserving its full informational value, tone, and key facts. Use this skill whenever the user wants to shorten, condense, tighten, compress, trim, or make a document more concise - including emails, reports, articles, specs, meeting notes, proposals, blog posts, or any prose. Trigger on phrases like "make this shorter", "condense this", "tighten this up", "reduce the length", "cut this down", "shorten this doc", "trim the fat", or when the user pastes a long document and asks for a shorter version. Do NOT use for summarization (which replaces the doc with a brief summary) - this skill keeps the full document structure and content, just denser.
---

# Condense Document

Act as a professional editor. Reduce the length of the provided document while preserving its core meaning, tone, and all informationally important content.

## Core principle

This is **condensing**, not **summarizing**. The output should still read as the same document - same structure, same conclusions, same data - just tighter. Nothing factually important is lost.

If the user explicitly asks for a summary (a brief abstract that replaces the doc), redirect - this skill is the wrong tool. Suggest they ask for a summary directly.

If the document is already concise (no detectable redundancy, no filler, no verbose phrasing), say so and return it essentially unchanged with `Reduction: 0% - already tight`. Forcing cuts on a tight doc risks losing real information for cosmetic gain.

## What to preserve

Before cutting anything, identify and protect:
- The central thesis or main argument
- All facts, figures, dates, names, citations, and direct quotes
- Decisions, conclusions, and recommendations
- The original tone and register (formal stays formal, casual stays casual)
- The target audience's perspective
- Legal, regulatory, or technical wording that must remain literal
- **Code blocks, command examples, and CLI output** - keep verbatim. These are reference material, not prose to tighten.
- **Tables** - cell content may tighten, but rows, columns, and data points stay intact.
- **File paths, line numbers, function names, identifiers, URLs, and version numbers** - never rephrase or shorten.

**Mixed tone:** If the source has inconsistent register (formal + casual, multiple authors, draft + polish), preserve the inconsistency. Condense each part in its own register; do not silently normalize. Tone normalization is a different request - flag the mismatch in "Possible omissions to review" so the user can ask for a separate pass if they want one. Smoothing tone without being asked can erase real signal (e.g., a meeting transcript's mix of serious and joking moments).

## How to reduce

Apply these techniques in order, stopping when the document feels appropriately tight:

### 1. Remove redundancy
- Ideas repeated in different words across paragraphs
- Chained synonyms ("fast and quick", "clear and obvious")
- Filler phrases ("it is important to note that", "as previously mentioned", "needless to say", "in order to")
- Redundant examples (if three illustrate the same point, keep the most representative)
- Restated conclusions at section ends

### 2. Consolidate and group
- Merge paragraphs covering the same sub-idea
- Combine related short sentences into denser ones
- Group scattered enumerations into a single list
- Unify overlapping sections under one heading

### 3. Tighten language
- Verbose phrasing -> direct verbs ("make use of" -> "use", "in order to" -> "to", "in the event that" -> "if")
- Passive voice -> active voice where natural
- Remove empty intensifiers ("very", "really", "basically", "actually")
- Replace long definitions with technical terms when the audience knows them

### 4. Restructure when it shortens
- Descriptive paragraphs -> lists or tables when content is enumerable or comparative
- Reorder so the most important point appears earlier
- Promote key data from buried sentences into headings or bullets

## Examples

**Example 1 - filler removal**

Input: "It is important to note that, in order to ensure proper functionality, users must first complete the registration process before they are able to access any of the features that the platform provides."

Output: "Users must register before accessing platform features."

Reduction: ~75%. Preserved: the action (register), the gate (before), the consequence (access features). Cut: "it is important to note", "in order to", "ensure proper functionality", "complete the registration process", "are able to".

**Example 2 - structural content stays verbatim**

Input:

````markdown
The auth flow uses a JWT token, which is signed with HS256.
See `src/auth/sign.js` for the implementation:

```javascript
function signToken(payload) {
  return jwt.sign(payload, SECRET, { algorithm: 'HS256' });
}
```
````

Output:

````markdown
Auth uses a JWT signed with HS256 (`src/auth/sign.js`):

```javascript
function signToken(payload) {
  return jwt.sign(payload, SECRET, { algorithm: 'HS256' });
}
```
````

Reduction: ~30%. Code block and file path preserved verbatim; only the introductory prose tightened.

**Example 3 - already-tight input**

Input: "Deploy fails on Node 18. Pin CI to Node 20."

Output: same input, unchanged. `Reduction: 0% - already tight`. Forcing a rewrite would either lose specificity or invent content.

## Self-review before delivering

Re-read your condensed version against the original and ask:
- Is all factual information preserved?
- Would a reader of the condensed version reach the same conclusions?
- Have I introduced any new claims that weren't in the source?
- Are figures, dates, names, and quoted text unchanged?
- Does the tone match the original?

If any answer is "no", revise before delivering. If you removed content whose importance is ambiguous, surface it in the "Possible omissions" section rather than silently dropping it.

## Output format

1. The condensed document, ready to use, in the same format as the input (markdown stays markdown, plain prose stays prose, etc.)
2. A final line with the approximate reduction: `Reduction: ~X%`
3. If any cuts removed content whose importance was ambiguous, list them at the end under `Possible omissions to review:` so the user can restore anything you got wrong.

If the user explicitly asks for a diff, comparison, or wants to see what changed, save both versions side-by-side (e.g., to a working directory) and produce a unified diff alongside the condensed output. Do not embed a giant diff in chat unless the user asked for it.

## Targets

If the user specifies a target length ("reduce to 200 words", "cut by half", "tighten to one page"), hit that target.

Otherwise aim for the largest reduction that doesn't sacrifice information:
- **20-40% for prose-heavy docs** (emails, articles, meeting notes, narrative reports).
- **10-25% for code/table-dense technical docs** where most volume is structural and can't be cut.
- **0-5% for already-tight docs** - return essentially unchanged. Forcing cuts here trades information for cosmetic gain.

Do not chase a percentage. Stop cutting when further reduction would risk meaning, nuance, or factual completeness.

## Constraints

- Do not invent or reinterpret information
- Do not change figures, dates, names, or direct quotes
- Do not use em dashes; use regular hyphens (-) or restructure the sentence
- Do not compress the literal wording of legal, regulatory, or contractual passages - only trim surrounding redundancy
