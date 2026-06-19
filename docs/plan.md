# salazarr-js/skills — Roadmap

---

## ✅ Step 1 — Agents

Distributable subagents with isolated context windows. Each agent has a single source of truth (`agent.yaml`) that generates platform-specific files via `pnpm generate`.

**Structure:** `agents/<name>/agent.yaml` → `.claude/agents/<name>.md` + `.opencode/agents/<name>.md`

---

## ✅ Step 2 — Skills

Distributable reusable instructions injected into the current conversation on demand.

**Structure:** `skills/<name>/SKILL.md`

Install copies to `.claude/skills/<name>/` (Claude Code) and symlinks `.opencode/skills/<name>/` → `.claude/skills/<name>/` when both platforms are selected.

---

## ✅ Step 3 — Installer CLI

Interactive CLI (`node scripts/install.mjs`) that lets users pick agents, skills, platform, and scope.

**Flow:**
```
◇  Select agents      — multiselect
◇  Select skills      — multiselect
◇  Platform           — Claude Code / OpenCode / both
◇  Where to install?  — Global or Project
```

Skills installed for both platforms use Claude Code as source with a symlink for OpenCode.

---

## 🔲 Step 4 — Rules

Distributable behavioral rules injected into `.claude/rules/` (Claude Code's native rules directory — auto-loaded, no CLAUDE.md editing needed).

**Format:** single YAML file per rule with `name`, `description`, and `content`:

```
rules/
├── pnpm.yaml
├── exa-search.yaml
├── jina-fetch.yaml
└── git-safety.yaml
```

```yaml
name: pnpm
description: Always use pnpm instead of npm or yarn
content: |
  Always use `pnpm` instead of `npm` or `yarn`...
```

**Install:** copies `content` to `~/.claude/rules/<name>.md` (global) or `.claude/rules/<name>.md` (project). Idempotent by default — file copy, no append logic needed.

**Installer flow addition:**
```
◇  Select rules       — multiselect (own scope question, independent from agents/skills)
◇  Where (rules)?     — Global (~/.claude/rules/) or Project (.claude/rules/)
```

**Rules to extract from current `~/.claude/CLAUDE.md`:**

| File | Rule |
|------|------|
| `pnpm.yaml` | Always use pnpm instead of npm/yarn |
| `exa-search.yaml` | Use Exa MCP for deep research |
| `jina-fetch.yaml` | Prefer Jina Reader or CLI tools for URL fetching |
| `git-safety.yaml` | Always ask before committing or pushing |

**README updates:** add Rules table + "Adding a rule" section.

**References:**
- https://code.claude.com/docs/en/memory#organize-rules-with-claude%2Frules%2F
- https://github.com/lifedever/claude-rules
