import { cpSync, existsSync, mkdirSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { AwesomeLogger } from 'awesome-logging';

/**
 * `awdlab-controls-mcp init` — install the package's bundled skills into a
 * consumer project. Interactive (via awesome-logging): on an already-installed
 * skill it compares versions and asks before overwriting. Non-interactive
 * environments (no TTY) or `--yes` overwrite outdated skills automatically and
 * never touch up-to-date ones.
 */

const SKILLS_DIR = fileURLToPath(new URL('../skills', import.meta.url));

interface ShippedSkill {
  name: string;
  version: number;
  description: string;
  dir: string;
}

/** Parse `name`, `metadata.version`, and `description` out of a SKILL.md. */
function parseSkill(md: string): { name: string; version: number; description: string } {
  const fm = md.match(/^---\n([\s\S]*?)\n---/)?.[1] ?? '';
  const name = fm.match(/^name:\s*(.+)$/m)?.[1]?.trim() ?? '';
  const description = fm.match(/^description:\s*(.+)$/m)?.[1]?.trim() ?? '';
  const version = Number(fm.match(/^\s*version:\s*(\d+)/m)?.[1] ?? '0');
  return { name, version, description };
}

function readShippedSkills(): ShippedSkill[] {
  if (!existsSync(SKILLS_DIR)) return [];
  const skills: ShippedSkill[] = [];
  for (const entry of readdirSync(SKILLS_DIR, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const md = join(SKILLS_DIR, entry.name, 'SKILL.md');
    if (!existsSync(md)) continue;
    const parsed = parseSkill(readFileSync(md, 'utf-8'));
    skills.push({ ...parsed, name: parsed.name || entry.name, dir: join(SKILLS_DIR, entry.name) });
  }
  return skills.sort((a, b) => a.name.localeCompare(b.name));
}

interface InitOptions {
  dir: string;
  yes: boolean;
  list: boolean;
  only: string[] | null;
}

function parseArgs(argv: string[]): InitOptions {
  const opts: InitOptions = { dir: '.claude/skills', yes: false, list: false, only: null };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--yes' || a === '-y') opts.yes = true;
    else if (a === '--list') opts.list = true;
    else if (a === '--dir') opts.dir = argv[++i] ?? opts.dir;
    else if (a === '--skill') (opts.only ??= []).push(argv[++i] ?? '');
  }
  if (opts.only) opts.only = opts.only.filter(Boolean);
  return opts;
}

async function confirm(text: string, yes: boolean): Promise<boolean> {
  // Auto-accept when told to, or when there is no interactive terminal.
  if (yes || !process.stdin.isTTY) return true;
  return AwesomeLogger.prompt('confirm', { text, default: 'yes' }).result;
}

export async function runInit(argv: string[]): Promise<void> {
  const opts = parseArgs(argv);
  const shipped = readShippedSkills();

  if (!shipped.length) {
    AwesomeLogger.log('No skills bundled with this package.');
    return;
  }

  if (opts.list) {
    AwesomeLogger.log('Available @awdlab/jig skills:');
    for (const s of shipped) AwesomeLogger.log(`  • ${s.name} (v${s.version}) — ${s.description}`);
    return;
  }

  const selected = opts.only ? shipped.filter(s => opts.only!.includes(s.name)) : shipped;
  if (!selected.length) {
    AwesomeLogger.log(`No matching skills. Available: ${shipped.map(s => s.name).join(', ')}.`);
    return;
  }

  AwesomeLogger.log(`Installing ${selected.length} skill(s) into ${opts.dir}/`);
  let installed = 0;
  let skipped = 0;

  for (const skill of selected) {
    const target = join(opts.dir, skill.name);
    const targetMd = join(target, 'SKILL.md');

    if (existsSync(targetMd)) {
      const current = parseSkill(readFileSync(targetMd, 'utf-8')).version;
      if (current >= skill.version) {
        AwesomeLogger.log(`  = ${skill.name} already up to date (v${current}).`);
        skipped++;
        continue;
      }
      const ok = await confirm(
        `Update ${skill.name} (installed v${current} → v${skill.version})?`,
        opts.yes
      );
      if (!ok) {
        AwesomeLogger.log(`  - ${skill.name} skipped.`);
        skipped++;
        continue;
      }
    }

    mkdirSync(target, { recursive: true });
    cpSync(skill.dir, target, { recursive: true });
    AwesomeLogger.log(`  + ${skill.name} installed (v${skill.version}).`);
    installed++;
  }

  AwesomeLogger.log(`Done: ${installed} installed, ${skipped} unchanged.`);
}
