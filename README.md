# salazarr-js/skills

Personal collection of **agent subagents** and **skills** for AI coding assistants.

Compatible with Claude Code, OpenCode, and Codex.

---

## Install

Requires Node.js 18+.

```bash
npx github:salazarr-js/skills
```

Interactive prompts let you pick:
- Which agents to install (multi-select, all pre-selected)
- Platform — Claude Code / OpenCode / both
- Scope — global (all projects) or project (current dir only)

### Manual (no Node.js)

Replace `<agent>` with the agent name and `<platform>` with `claude` or `opencode`:

```bash
# Claude Code — global
curl -fsSL https://raw.githubusercontent.com/salazarr-js/skills/main/agents/<agent>/claude.md \
  -o ~/.claude/agents/<agent>.md

# OpenCode — global
curl -fsSL https://raw.githubusercontent.com/salazarr-js/skills/main/agents/<agent>/opencode.md \
  -o ~/.config/opencode/agents/<agent>.md
```

### Install paths

| Scope | Claude Code | OpenCode |
|-------|-------------|---------|
| Global | `~/.claude/agents/` | `~/.config/opencode/agents/` |
| Project | `.claude/agents/` | `.opencode/agents/` |

---

## Agents vs Skills

**Agents** run as isolated subagents with their own context window. Spawn them for heavy tasks — research, audits, long-running work — so they don't pollute your main context.

**Skills** are instructions injected into the current conversation. Use them for recurring workflows that need the full context of what you're working on.

---

## Agents

| Name | Description | Platforms |
|------|-------------|-----------|
| [researcher](agents/researcher/) | Web research — searches, reads via Jina Reader, writes compressed findings to markdown | Claude Code, OpenCode |

## Skills

| Name | Description |
|------|-------------|
| [condense-doc](skills/condense-doc/) | Shorten a document while preserving all informational value |
| [slzr-briefer](skills/slzr-briefer/) | Create, edit, audit, or consolidate a product brief |
| [hono](skills/hono/) | Hono API development quick reference |

---

## Ideas

- **Product designer** — brainstorm ideas and build right documents like a product brief (PRD)
  - https://productmasterynow.com/blog/510-how-to-use-these-ai-tools-to-create-a-product-brief-with-brian-collard/
  - https://www.notion.com/templates/productbrief
- **Resume auditor**
- **Document editor**

## Resources

- https://github.com/vuejs-ai/skills
- https://github.com/onmax/nuxt-skills
- https://github.com/nuxt/ui/tree/v4/skills/nuxt-ui
- https://github.com/vueuse/skills
- https://github.com/antfu/skills

### Design
- https://impeccable.style/
- https://github.com/nextlevelbuilder/ui-ux-pro-max-skill
- https://github.com/gnurio/refactoring-ui-plugin
- https://layers.jamiemill.com/
- https://www.tasteskill.dev/
- https://app.superdesign.dev/
