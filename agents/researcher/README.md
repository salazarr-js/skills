# researcher

> A tool-agnostic research subagent for any LLM assistant (Claude Code, OpenCode, Codex, etc.)
> Goal: find → clean → digest → compress → store. Minimize tokens, maximize signal.

Spawn it for any research task to keep your main context clean and token-efficient.

---

## The Pipeline

```mermaid
flowchart TD
    A([🔍 Research Query]) --> B[Web Search\nfind relevant URLs]
    B --> C{Enough signal\nin snippets?}
    C -- Yes --> E
    C -- No --> D[Scrape / Crawl\nfetch page content]
    D --> E[Clean & Parse\nstrip HTML noise, extract text]
    E --> F[Digest\nLLM summarizes key facts]
    F --> G[Compress\nextract findings + references]
    G --> H([📄 Research Document\nmarkdown + source links])

    style A fill:#1e1e2e,color:#cdd6f4
    style H fill:#1e1e2e,color:#cdd6f4
    style C fill:#313244,color:#cdd6f4
```

| Step | What happens | Token cost |
|------|-------------|------------|
| **1. Web Search** | Query → list of URLs + snippets | Low |
| **2. Scrape/Crawl** | Fetch pages — only if snippet isn't enough | High if raw HTML |
| **3. Clean & Parse** | Strip ads, nav, scripts → plain text | Saved here |
| **4. Digest** | LLM reads cleaned text → extracts facts | Medium |
| **5. Compress** | Findings written to file, raw content discarded | Context freed |
| **6. Store** | Markdown doc with inline references | Zero tokens in future |

**Key rule:** most research stops at step 1-2. Only go deeper when snippets are insufficient.

---

## Tools by Step

### Step 1 — Web Search

| Tool | Free | Quality | Notes |
|------|------|---------|-------|
| **Exa MCP** | 1k/mo or 150/day unauthed | ⭐⭐⭐⭐⭐ | Semantic search — finds by meaning, not just keywords. Best for research. |
| **Built-in WebSearch** | Unlimited (Claude Code) | ⭐⭐⭐⭐ | Already live, no setup. Returns snippets + links. |
| **Brave Search MCP** | 2k/mo | ⭐⭐⭐⭐ | Reliable, independent index. |
| **Tavily MCP** | 1k/mo | ⭐⭐⭐⭐ | Built for AI agents, returns clean summaries. |
| **DuckDuckGo MCP** | Unlimited | ⭐⭐⭐ | No API key, keyword-only, noisier results. |
| **Jina Search (`s.jina.ai`)** | 10M tokens/signup (~1k searches) | ⭐⭐⭐ | Requires free API key (not keyless like r.jina.ai). 10k token minimum per query — less efficient than Exa. Use r.jina.ai for reading, not search. |

### Step 2-3 — Scrape + Clean

| Tool | Free | Quality | Notes |
|------|------|---------|-------|
| **Jina Reader** (`r.jina.ai/<url>`) | Unlimited | ⭐⭐⭐⭐⭐ | Prepend to any URL → instant clean LLM text. Zero setup. |
| **Firecrawl MCP** | 1k pages/mo | ⭐⭐⭐⭐⭐ | Best scraper. JS rendering, handles SPAs, 80% token reduction vs raw HTML. |
| **Crawl4AI** | Open source | ⭐⭐⭐⭐ | Self-hosted, outputs chunked Markdown for RAG. Apache 2.0. |
| **Raw fetch + grep** | Unlimited | ⭐⭐ | Pipe through `sed`/`grep` to extract target content. Fragile but free. |

### Step 4-6 — Digest + Compress + Store

Any LLM handles this. The pattern is the same regardless of provider:
1. Feed cleaned text
2. Ask for key facts + source URL
3. Write output to a `.md` file
4. Discard raw content from context

---

## Usage

**Claude Code**
```
Spawn a researcher agent to investigate: "best open source vector databases 2026"
Output to ./research-vector-dbs.md
```

**OpenCode**
```
/researcher "best open source vector databases 2026"
```

---

## Install

```bash
npx github:salazarr-js/skills
```

See [root README](../../README.md#install) for platform, scope, and manual curl options.

## Compatibility

| Platform | File | Status |
|----------|------|--------|
| Claude Code | `claude.md` | ✅ |
| OpenCode | `opencode.md` | ✅ |
| Codex | `codex.md` | planned |

---

## Tool Evaluation

The pipeline has two independent steps that can be swapped: **search** (Step 1) and **scrape+clean** (Steps 2-3). Evaluate each step separately, then combine the winners.

### Step 1 — Search tools

Goal: given a query, return the most relevant URLs with useful snippets.

**Tools to evaluate**

| ID | Tool | Cost |
|----|------|------|
| S1 | Built-in WebSearch | Free (unlimited) |
| S2 | DuckDuckGo MCP | Free (unlimited) |
| S3 | Exa MCP | Free (1k/mo) |
| S4 | Tavily MCP | Free (1k/mo) |
| S5 | Brave Search MCP | Free (2k/mo) |
| S6 | Jina Search (`s.jina.ai`) | Free key (10M tokens) |

**How to test**

Run each tool against the same 3 queries. Compare raw results (do not fetch pages yet):

| # | Query | Type |
|---|-------|------|
| T1 | "best open source vector databases 2026" | Broad survey |
| T2 | "Exa API rate limits and pricing details" | Specific factual |
| T3 | "how does Firecrawl handle JavaScript rendering" | Technical deep dive |

**What to score per tool per query**

- **Relevance** (1-5) — are the top 5 URLs actually about the query?
- **Snippet quality** (1-5) — do snippets answer the question without fetching?
- **Freshness** (1-5) — are results from 2025-2026 or outdated?

**Search scorecard**

| Tool | T1 Relevance | T1 Snippets | T2 Relevance | T2 Snippets | T3 Relevance | T3 Snippets | Winner? |
|------|-------------|-------------|-------------|-------------|-------------|-------------|---------|
| S1 - WebSearch | 5 | 4 | 5 | 4 | 5 | 4 | ✅ fallback |
| S2 - DDG MCP | - | - | - | - | - | - | |
| S3 - Exa MCP | 5 | 5 | 5 | 5 | 5 | 5 | ✅ winner |
| S4 - Tavily | - | - | - | - | - | - | |
| S5 - Brave | - | - | - | - | - | - | |
| S6 - Jina Search | ❌ not evaluated for search | — not recommended — requires API key; 10k token minimum/query vs Exa's ~1.5k; best used as r.jina.ai (reader) only |

**Full pipeline token comparison (WebSearch vs Exa, same 3 queries):**

| | T1 Tokens | T1 Calls | T2 Tokens | T2 Calls | T3 Tokens | T3 Calls | Total |
|---|---|---|---|---|---|---|---|
| WebSearch | 18,254 | 9 | 15,374 | 9 | 17,104 | 9 | **50,732** |
| Exa | 50,093 | 8 | 31,948 | 6 | 36,386 | 6 | **118,427** |

**Key findings:**
- Exa returns richer content per result (2.3x more tokens) but fewer tool calls and faster on factual/technical queries
- Exa surfaces deeper signal: real-world migration stories, edge-case pricing, newer API details not in WebSearch snippets
- WebSearch is the token-efficient fallback — quality is solid for broad surveys

**Decision** → **Exa MCP = winner** (quality + speed). **WebSearch = fallback** (token budget or Exa limit hit). **Jina Search = not recommended** for search (requires API key, 10k token minimum per query, no highlights mode — 7-10x worse token efficiency than Exa). Use `r.jina.ai` for reading pages only.

---

### Step 2-3 — Scrape + Clean tools

Goal: given a URL, return the cleanest, most token-efficient text for the LLM.

**Tools to evaluate**

| ID | Tool | Cost |
|----|------|------|
| C1 | Jina Reader (`r.jina.ai/<url>`) | Free (unlimited) |
| C2 | Firecrawl MCP | Free (1k pages/mo) |
| C3 | Raw WebFetch | Free (baseline) |

**How to test**

Use the same URL across all three tools. Pick 3 URLs that represent different page types:

| # | URL type | Example |
|---|----------|---------|
| U1 | Simple article | A blog post or docs page |
| U2 | JS-heavy SPA | A React/Next.js app page |
| U3 | Long reference page | API docs or pricing page |

**What to score per tool per URL**

- **Token count** — count tokens in the returned text (lower = better)
- **Content completeness** (1-5) — did it capture the key facts?
- **Noise ratio** (1-5) — how much nav/ad/footer junk survived?
- **JS rendering** — did it work on the SPA? (yes/no)

**Test URLs**

| # | URL | Type |
|---|-----|------|
| U1 | `qdrant.tech/blog/what-is-a-vector-database/` | Article (JS-rendered, Next.js) |
| U2 | `firecrawl.dev` | SPA (React/Next.js) |
| U3 | `docs.exa.ai/reference/search` | API reference page |

**Scrape scorecard**

| Tool | U1 Chars | U1 ~Tokens | U2 Chars | U2 ~Tokens | U3 Chars | U3 ~Tokens | JS? | Winner? |
|------|----------|-----------|----------|-----------|----------|-----------|-----|---------|
| C1 - Jina | 37,734 | ~9,400 | 11,605 | ~2,900 | 16,174 | ~4,000 | ✅ | ✅ winner |
| C2 - Firecrawl | 38,932 | ~9,700 | 28,867 | ~7,200 | 14,792 | ~3,700 | ✅ | ✅ fallback |
| C3 - Raw fetch | 321 (redirect) | ❌ fails | 1,228,646 | ~307k | 668,005 | ~167k | ❌ | ❌ |

**Key findings:**
- Raw HTML is unusable — U1 is just a redirect shell, U2/U3 return 100-300x more tokens than needed, no LLM can process that efficiently
- Jina and Firecrawl are close on quality — both handle JS rendering, both return clean markdown
- Jina wins on tokens — 2.5x fewer than Firecrawl on the SPA (U2), comparable on article and docs
- Firecrawl advantage — `--only-main-content` flag strips more aggressively; better for complex auth/interaction flows

**Decision** → **Jina Reader = winner** (free, unlimited, fewer tokens). **Firecrawl = fallback** (when Jina strips too much or page needs JS interaction).

---

### Full pipeline results

End-to-end runs with winning combo (Exa + Jina, built-in WebSearch baseline):

| Combo | T1 Tokens | T1 Calls | T2 Tokens | T2 Calls | T3 Tokens | T3 Calls | Total |
|-------|-----------|----------|-----------|----------|-----------|----------|-------|
| **Exa + Jina** | 50,093 | 8 | 31,948 | 6 | 36,386 | 6 | **118,427** |
| **WebSearch + Jina** | 18,254 | 9 | 15,374 | 9 | 17,104 | 9 | **50,732** |

> Exa produces richer, deeper output but costs 2.3x more tokens. Use Exa for research quality, WebSearch when on token budget.

---

## Recommended Stack

_Validated by benchmark — June 2026_

### Quality mode (default)
```
Search  →  Exa MCP            semantic results, 1k free/mo
Scrape  →  Jina Reader        r.jina.ai/<url>, unlimited, free
Digest  →  LLM                any: Claude, GPT, Codex, local
Store   →  Write to .md       compressed findings + sources
```

### Token budget mode
```
Search  →  Built-in WebSearch  unlimited, 2.3x cheaper than Exa
Scrape  →  Jina Reader         same
Digest  →  LLM                 same
Store   →  Write to .md        same
```

### Fallback escalation

| Symptom | Swap in |
|---------|---------|
| Exa 1k/mo limit hit | Brave Search MCP (2k/mo free) |
| Jina strips too much content | Firecrawl free tier (1k pages/mo) |
| Page needs login / clicks | Firecrawl interact |
| Self-hosted / air-gapped | Crawl4AI (open source, Apache 2.0) |
| High volume production | Firecrawl Hobby $16/mo |

---

## NotebookLM Comparison

Use NotebookLM instead when:
- You have a fixed set of documents (PDFs, reports) to analyze
- You need hard source grounding — answers must cite exact passages, no training data bleed
- You want Audio Overview (podcast summary) or visual mind maps
- Sharing a curated source collection with a team

Use this pipeline instead when:
- Sources are live/unknown — you need to discover them
- You need to act on findings (write code, edit files, call APIs)
- Research feeds into a codebase or automation

---

## References

- [Exa MCP](https://exa.ai/mcp) — semantic search API
- [Jina Reader](https://jina.ai/reader) — URL to LLM text
- [Firecrawl MCP](https://github.com/firecrawl/firecrawl-mcp-server) — scrape + clean at scale
- [Crawl4AI](https://github.com/unclecode/crawl4ai) — open source AI crawler
- [DuckDuckGo MCP](https://github.com/nickclyde/duckduckgo-mcp-server) — free keyword search
- [Tavily](https://tavily.com) — AI-agent search API
- [Brave Search API](https://brave.com/search/api/) — independent search index
- [Firecrawl + Claude Code token reduction](https://www.mindstudio.ai/blog/firecrawl-claude-code-web-scraping-80-percent-token-reduction)
- [MCP Servers for Claude Code](https://intuitionlabs.ai/articles/mcp-servers-claude-code-internet-search)
