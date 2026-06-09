#!/usr/bin/env node
/**
 * Generates platform agent files from each agent.yaml into the correct root dirs.
 * claude   → .claude/agents/<name>.md
 * opencode → .opencode/agents/<name>.md
 * Usage: pnpm generate
 */
import { readFileSync, writeFileSync, mkdirSync, readdirSync } from 'fs'
import { basename, dirname, join } from 'path'
import { fileURLToPath } from 'url'
import { load, dump } from 'js-yaml'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')

const platformDirs = {
  claude: '.claude/agents',
  opencode: '.opencode/agents',
}

function findAgentYamls(dir) {
  const results = []
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name)
    if (entry.isDirectory()) results.push(...findAgentYamls(full))
    else if (entry.name === 'agent.yaml') results.push(full)
  }
  return results
}

const yamls = findAgentYamls(join(root, 'agents'))

for (const yamlPath of yamls) {
  const source = load(readFileSync(yamlPath, 'utf8'))
  const agentName = basename(dirname(yamlPath))

  for (const [platform, platformFields] of Object.entries(source.platforms)) {
    const outDir = platformDirs[platform]
    if (!outDir) {
      console.warn(`⚠ unknown platform "${platform}" — skipping`)
      continue
    }
    const name = platformFields.name ?? agentName
    const frontmatter = { ...source.shared, ...platformFields }
    const fm = dump(frontmatter, { lineWidth: -1 }).trim()
    const output = `---\n${fm}\n---\n\n${source.prompt.trimEnd()}\n`
    const dest = join(root, outDir)
    mkdirSync(dest, { recursive: true })
    writeFileSync(join(dest, `${name}.md`), output)
    console.log(`✓ ${outDir}/${name}.md`)
  }
}
