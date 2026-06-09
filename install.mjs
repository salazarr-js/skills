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
const REPO_RAW = 'https://raw.githubusercontent.com/salazarr-js/skills/main';

async function getAvailableAgents() {
  const agentsDir = join(__dirname, 'agents');
  if (!existsSync(agentsDir)) return ['researcher'];
  const entries = await readdir(agentsDir, { withFileTypes: true });
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
  const platforms = platform === 'both' ? ['claude', 'opencode'] : [platform];
  const results = [];

  for (const p of platforms) {
    const targetDir = resolveTargetDir(p, scope);
    await mkdir(targetDir, { recursive: true });

    const dest = join(targetDir, `${agent}.md`);
    const srcPath = join(__dirname, 'agents', agent, `${p}.md`);

    if (existsSync(srcPath)) {
      await copyFile(srcPath, dest);
    } else {
      const res = await fetch(`${REPO_RAW}/agents/${agent}/${p}.md`);
      if (!res.ok) throw new Error(`Could not fetch ${agent}/${p}.md (${res.status})`);
      await writeFile(dest, await res.text());
    }

    results.push({ platform: p, dest });
  }

  return results;
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

  const platform = await select({
    message: 'Platform',
    options: [
      { value: 'both',      label: 'Both',      hint: 'Claude Code + OpenCode' },
      { value: 'claude',    label: 'Claude Code' },
      { value: 'opencode',  label: 'OpenCode' },
    ],
  });

  if (isCancel(platform)) { cancel('Cancelled.'); process.exit(0); }

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
    const results = await installAgent(agent, platform, scope);
    installed.push(...results);
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
