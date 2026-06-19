#!/usr/bin/env node
import {
  intro, outro, multiselect, select,
  spinner, log, cancel, isCancel, note,
} from '@clack/prompts';
import { readdir, mkdir, copyFile, writeFile, cp, symlink, rm } from 'fs/promises';
import { existsSync } from 'fs';
import { homedir } from 'os';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const AGENTS_DIR = join(__dirname, '..', 'agents');
const SKILLS_DIR = join(__dirname, '..', 'skills');
const REPO_RAW = 'https://raw.githubusercontent.com/salazarr-js/skills/main';

const platformAgentDir = { claude: '.claude/agents', opencode: '.opencode/agents' };

// --- agents ---

async function getAvailableAgents() {
  if (!existsSync(AGENTS_DIR)) return [];
  const entries = await readdir(AGENTS_DIR, { withFileTypes: true });
  return entries.filter(e => e.isDirectory() && e.name !== 'example-agent').map(e => e.name);
}

function resolveAgentTargetDir(platform, scope) {
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
  const targetDir = resolveAgentTargetDir(platform, scope);
  await mkdir(targetDir, { recursive: true });

  const dest = join(targetDir, `${agent}.md`);
  const srcPath = join(__dirname, '..', platformAgentDir[platform], `${agent}.md`);

  if (existsSync(srcPath)) {
    await copyFile(srcPath, dest);
  } else {
    const res = await fetch(`${REPO_RAW}/${platformAgentDir[platform]}/${agent}.md`);
    if (!res.ok) throw new Error(`Could not fetch ${platformAgentDir[platform]}/${agent}.md (${res.status})`);
    await writeFile(dest, await res.text());
  }

  return { platform, dest };
}

// --- skills ---

async function getAvailableSkills() {
  if (!existsSync(SKILLS_DIR)) return [];
  const entries = await readdir(SKILLS_DIR, { withFileTypes: true });
  return entries.filter(e => e.isDirectory()).map(e => e.name);
}

function resolveSkillTargetDir(platform, scope) {
  if (scope === 'global') {
    return platform === 'claude'
      ? join(homedir(), '.claude', 'skills')
      : join(homedir(), '.config', 'opencode', 'skills');
  }
  return platform === 'claude'
    ? join(process.cwd(), '.claude', 'skills')
    : join(process.cwd(), '.opencode', 'skills');
}

async function installSkill(skill, platform, scope) {
  const targetDir = join(resolveSkillTargetDir(platform, scope), skill);
  await mkdir(targetDir, { recursive: true });

  const srcDir = join(SKILLS_DIR, skill);
  if (existsSync(srcDir)) {
    await cp(srcDir, targetDir, { recursive: true });
  } else {
    const res = await fetch(`${REPO_RAW}/skills/${skill}/SKILL.md`);
    if (!res.ok) throw new Error(`Could not fetch skills/${skill}/SKILL.md (${res.status})`);
    await writeFile(join(targetDir, 'SKILL.md'), await res.text());
  }

  return join(targetDir, 'SKILL.md');
}

async function symlinkSkill(skill, sourcePlatform, scope) {
  const srcDir  = join(resolveSkillTargetDir(sourcePlatform, scope), skill);
  const linkDir = join(resolveSkillTargetDir('opencode', scope), skill);
  await mkdir(dirname(linkDir), { recursive: true });
  await rm(linkDir, { recursive: true, force: true });
  await symlink(srcDir, linkDir);
  return join(linkDir, 'SKILL.md');
}

// --- main ---

async function main() {
  intro(' salazarr-js/skills ');

  // 1. select agents
  const agents = await getAvailableAgents();
  let selectedAgents = [];
  if (agents.length === 0) {
    log.warn('No agents available.');
  } else {
    const ans = await multiselect({
      message: 'Select agents',
      options: agents.map(a => ({ value: a, label: a })),
      initialValues: agents,
      required: false,
    });
    if (isCancel(ans)) { cancel('Cancelled.'); process.exit(0); }
    selectedAgents = ans;
  }

  // 2. select skills
  const skills = await getAvailableSkills();
  let selectedSkills = [];
  if (skills.length === 0) {
    log.warn('No skills available.');
  } else {
    const ans = await multiselect({
      message: 'Select skills',
      options: skills.map(s => ({ value: s, label: s })),
      initialValues: skills,
      required: false,
    });
    if (isCancel(ans)) { cancel('Cancelled.'); process.exit(0); }
    selectedSkills = ans;
  }

  if (selectedAgents.length === 0 && selectedSkills.length === 0) {
    cancel('Nothing selected — aborting.');
    process.exit(0);
  }

  // 3. platform — shared for agents and skills
  const platforms = await multiselect({
    message: 'Platform',
    options: [
      { value: 'claude',   label: 'Claude Code' },
      { value: 'opencode', label: 'OpenCode' },
    ],
    initialValues: ['claude', 'opencode'],
    required: false,
  });
  if (isCancel(platforms)) { cancel('Cancelled.'); process.exit(0); }

  if (platforms.length === 0) {
    cancel('No platform selected — aborting.');
    process.exit(0);
  }

  // 4. scope — one question for everything
  const scope = await select({
    message: 'Where to install?',
    options: [
      { value: 'global',  label: 'Global',  hint: '~/.claude/... and ~/.config/opencode/...' },
      { value: 'project', label: 'Project', hint: '.claude/... and .opencode/...' },
    ],
  });
  if (isCancel(scope)) { cancel('Cancelled.'); process.exit(0); }

  // 5. install
  const s = spinner();
  s.start('Installing...');
  const installed = [];

  for (const agent of selectedAgents)
    for (const p of platforms)
      installed.push({ type: 'agent', ...(await installAgent(agent, p, scope)) });

  const bothSkillPlatforms = platforms.includes('claude') && platforms.includes('opencode');
  for (const skill of selectedSkills) {
    if (bothSkillPlatforms) {
      // install to Claude, symlink from OpenCode → Claude
      const dest = await installSkill(skill, 'claude', scope);
      installed.push({ type: 'skill', platform: 'claude', dest });
      const link = await symlinkSkill(skill, 'claude', scope);
      installed.push({ type: 'skill', platform: 'opencode', dest: `${link} → symlink` });
    } else {
      const p = platforms[0];
      const dest = await installSkill(skill, p, scope);
      installed.push({ type: 'skill', platform: p, dest });
    }
  }

  s.stop('Done.');

  if (installed.length === 0) {
    cancel('Nothing installed.');
    process.exit(0);
  }

  note(
    installed.map(r => {
      const label = r.type === 'agent'
        ? r.platform === 'claude' ? 'Claude Code' : 'OpenCode '
        : r.platform === 'claude' ? 'Skill (CC) ' : 'Skill (OC) ';
      return `${label}  ${r.dest}`;
    }).join('\n'),
    `Installed (${installed.length})`
  );

  outro('Restart your AI assistant to pick up the new agents and skills.');
}

main().catch(err => {
  log.error(err.message);
  process.exit(1);
});
