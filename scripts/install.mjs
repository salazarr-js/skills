#!/usr/bin/env node
import {
  intro, outro, multiselect, select,
  spinner, log, cancel, isCancel, note,
} from '@clack/prompts';
import { readdir, mkdir, copyFile, writeFile } from 'fs/promises';
import { existsSync } from 'fs';
import { homedir } from 'os';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const AGENTS_DIR = join(__dirname, '..', 'agents');
const REPO_RAW = 'https://raw.githubusercontent.com/salazarr-js/skills/main';

const platformSourceDir = { claude: '.claude/agents', opencode: '.opencode/agents' };

async function getAvailableAgents() {
  if (!existsSync(AGENTS_DIR)) return ['slzr-researcher'];
  const entries = await readdir(AGENTS_DIR, { withFileTypes: true });
  return entries.filter(e => e.isDirectory()).map(e => e.name);
}

function resolveTargetDir(platform, scope) {
  if (scope === 'global') {
    return platform === 'claude'
      ? join(homedir(), '.claude', 'agents')
      : join(homedir(), '.config', 'opencode', 'agents');
  }
  return platform === 'claude'
    ? join(process.cwd(), '.claude', 'agents')
    : join(process.cwd(), '.opencode', 'agents');
}

async function installAgent(agent, platform, scope) {
  const targetDir = resolveTargetDir(platform, scope);
  await mkdir(targetDir, { recursive: true });

  const dest = join(targetDir, `${agent}.md`);
  const srcPath = join(__dirname, '..', platformSourceDir[platform], `${agent}.md`);

  if (existsSync(srcPath)) {
    await copyFile(srcPath, dest);
  } else {
    const res = await fetch(`${REPO_RAW}/${platformSourceDir[platform]}/${agent}.md`);
    if (!res.ok) throw new Error(`Could not fetch ${platformSourceDir[platform]}/${agent}.md (${res.status})`);
    await writeFile(dest, await res.text());
  }

  return [{ platform, dest }];
}

async function main() {
  intro(' salazarr-js/skills ');

  const agents = await getAvailableAgents();

  const selectedAgents = await multiselect({
    message: 'Select agents to install',
    options: agents.map(a => ({ value: a, label: a })),
    initialValues: agents,
    required: true,
  });

  if (isCancel(selectedAgents)) { cancel('Cancelled.'); process.exit(0); }

  const platforms = await multiselect({
    message: 'Platform',
    options: [
      { value: 'claude',   label: 'Claude Code' },
      { value: 'opencode', label: 'OpenCode' },
    ],
    initialValues: ['claude', 'opencode'],
    required: true,
  });

  if (isCancel(platforms)) { cancel('Cancelled.'); process.exit(0); }

  const scope = await select({
    message: 'Scope',
    options: [
      { value: 'global',  label: 'Global',  hint: 'all projects  (~/.claude/agents)' },
      { value: 'project', label: 'Project', hint: 'current dir   (.claude/agents)' },
    ],
  });

  if (isCancel(scope)) { cancel('Cancelled.'); process.exit(0); }

  const s = spinner();
  s.start('Installing...');

  const installed = [];
  for (const agent of selectedAgents) {
    for (const p of platforms) {
      const results = await installAgent(agent, p, scope);
      installed.push(...results);
    }
  }

  s.stop('Done!');

  note(
    installed
      .map(r => `${r.platform === 'claude' ? 'Claude Code' : 'OpenCode '}  ${r.dest}`)
      .join('\n'),
    'Installed'
  );

  outro('Restart your AI assistant to pick up the new agents.');
}

main().catch(err => {
  log.error(err.message);
  process.exit(1);
});
