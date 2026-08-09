/**
 * Format and/or lint only the files that changed versus an upstream base
 * (default `origin/main`), running the independent tool jobs concurrently.
 *
 * Usage:
 *   tsx tools/lint-changed.ts [flags]
 *
 * Flags (combinable; if none of the four op flags are given, defaults to
 * `--format-check --lint-check`):
 *   --format-check     oxfmt --check (.ts/.json/.md) + prettier --check (.html)
 *   --format-fix       oxfmt (write) + prettier --write
 *   --lint-check       oxlint --type-aware (.ts)
 *   --lint-fix         oxlint --type-aware --fix
 *   --base <ref>       comparison base (default: origin/main, falls back to main)
 *   --concurrency <n>  max parallel jobs (default: CPU count)
 *
 * "Changed" = everything different from the merge-base with <base> (committed
 * work on the branch + uncommitted working-tree changes) plus new untracked
 * files. Untracked files honour .gitignore, and committed/tracked files are by
 * definition not git-ignored, so only non-ignored files are ever processed.
 * Each tool additionally applies its own ignore config (oxfmt/prettier read
 * .gitignore; oxlint uses .oxlintrc ignorePatterns).
 */
import { spawn, execFileSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

// --- argument parsing ---------------------------------------------------------
const argv = process.argv.slice(2);
const has = (flag: string) => argv.includes(flag);
const flagValue = (flag: string, fallback: string) => {
  const i = argv.indexOf(flag);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : fallback;
};

let formatCheck = has('--format-check');
let formatFix = has('--format-fix');
let lintCheck = has('--lint-check');
let lintFix = has('--lint-fix');
if (!formatCheck && !formatFix && !lintCheck && !lintFix) {
  formatCheck = true;
  lintCheck = true;
}
const doFormat = formatCheck || formatFix;
const doLint = lintCheck || lintFix;

const base = flagValue('--base', 'origin/main');
const cpuCount = os.availableParallelism?.() ?? os.cpus().length;
const concurrency = Math.max(1, Number.parseInt(flagValue('--concurrency', String(cpuCount)), 10));

// --- git helpers --------------------------------------------------------------
function git(args: string[]): string[] {
  return execFileSync('git', args, { cwd: repoRoot, encoding: 'utf8' })
    .split('\n')
    .map(line => line.trim())
    .filter(Boolean);
}

function resolveBase(ref: string): string {
  for (const candidate of [ref, 'main', 'HEAD']) {
    try {
      git(['rev-parse', '--verify', '--quiet', candidate]);
      return candidate;
    } catch {
      // try next
    }
  }
  return 'HEAD';
}

const resolvedBase = resolveBase(base);
// --diff-filter=ACMR drops deletions; --merge-base diffs from the branch point.
const committed = git(['diff', '--name-only', '--diff-filter=ACMR', '--merge-base', resolvedBase]);
const untracked = git(['ls-files', '--others', '--exclude-standard']);
const changed = [...new Set([...committed, ...untracked])].filter(f =>
  existsSync(path.join(repoRoot, f))
);

if (changed.length === 0) {
  console.log(`No changed files versus ${resolvedBase}. Nothing to do.`);
  process.exit(0);
}

// --- route files by extension / owning package --------------------------------
const ext = (f: string) => path.extname(f).slice(1).toLowerCase();
const oxfmtFiles = changed.filter(f => ['ts', 'json', 'md'].includes(ext(f)));
const htmlFiles = changed.filter(f => ext(f) === 'html');
const oxlintFiles = changed.filter(f => ext(f) === 'ts');

// --- build the job list -------------------------------------------------------
interface Job {
  label: string;
  cmd: string;
  args: string[];
  cwd: string;
}

// Split a file list into batches whose joined length stays well under the OS
// command-line limit (Windows cmd.exe caps at ~8191 chars). Each batch becomes
// its own job, so batching does not cost parallelism.
function chunkByLength(files: string[], maxChars = 6000): string[][] {
  const chunks: string[][] = [];
  let current: string[] = [];
  let length = 0;
  for (const file of files) {
    if (current.length > 0 && length + file.length + 1 > maxChars) {
      chunks.push(current);
      current = [];
      length = 0;
    }
    current.push(file);
    length += file.length + 1;
  }
  if (current.length > 0) chunks.push(current);
  return chunks;
}

function addChunkedJobs(
  name: string,
  files: string[],
  cwd: string,
  build: (batch: string[]) => { cmd: string; args: string[] }
): void {
  const batches = chunkByLength(files);
  batches.forEach((batch, i) => {
    const suffix = batches.length > 1 ? ` ${i + 1}/${batches.length}` : '';
    jobs.push({ label: `${name} (${batch.length})${suffix}`, cwd, ...build(batch) });
  });
}

const jobs: Job[] = [];

if (doFormat && oxfmtFiles.length) {
  addChunkedJobs('oxfmt', oxfmtFiles, repoRoot, batch => ({
    cmd: 'pnpm',
    args: ['exec', 'oxfmt', ...(formatFix ? [] : ['--check']), ...batch],
  }));
}
if (doFormat && htmlFiles.length) {
  // Match the repo's prettier invocation (loads prettier.config.mts via strip-types).
  addChunkedJobs('prettier:html', htmlFiles, repoRoot, batch => ({
    cmd: 'node',
    args: [
      '--experimental-strip-types',
      'node_modules/prettier/bin/prettier.cjs',
      formatFix ? '--write' : '--check',
      '--ignore-path',
      '.gitignore',
      ...batch,
    ],
  }));
}
if (doLint && oxlintFiles.length) {
  addChunkedJobs('oxlint', oxlintFiles, repoRoot, batch => ({
    cmd: 'pnpm',
    args: ['exec', 'oxlint', '--type-aware', ...(lintFix ? ['--fix'] : []), ...batch],
  }));
}

// --- run with a bounded concurrency pool --------------------------------------

// Tool output meaning "every file I was given is covered by an ignore rule" — a
// no-op, not a failure. The router passes files by extension, so a batch can end
// up entirely matched by a tool's own ignore config (oxfmt `ignorePatterns`,
// .prettierignore, .oxlintrc); given explicit filenames those tools exit
// non-zero. Swallow it so an all-ignored change set still passes.
const ALL_IGNORED_RE =
  /Expected at least one target file|excluded by ignore rules|No matching files|No files matching/i;

function run(job: Job): Promise<{ label: string; ok: boolean }> {
  return new Promise(resolve => {
    // shell:true so the pnpm/node launcher resolves on Windows too. Args are
    // chunked (see chunkByLength) to stay under the OS command-line limit.
    // ponytail: with shell:true the args are concatenated, not escaped, so a
    // file path containing spaces would break. No such paths exist in this repo;
    // switch to shell:false + resolved binaries if that ever changes.
    // Output is captured (not inherited) so the all-ignored case can be detected;
    // it's re-emitted on completion so diagnostics still surface.
    const child = spawn(job.cmd, job.args, { cwd: job.cwd, shell: true });
    let output = '';
    child.stdout?.on('data', d => (output += d));
    child.stderr?.on('data', d => (output += d));
    child.on('exit', code => {
      if (code !== 0 && ALL_IGNORED_RE.test(output)) {
        console.log(`↷ ${job.label}: all files ignored — nothing to do`);
        resolve({ label: job.label, ok: true });
        return;
      }
      if (output.trim()) process.stdout.write(output.endsWith('\n') ? output : `${output}\n`);
      resolve({ label: job.label, ok: code === 0 });
    });
    child.on('error', () => resolve({ label: job.label, ok: false }));
  });
}

async function pool(items: Job[], limit: number) {
  const results: { label: string; ok: boolean }[] = [];
  let next = 0;
  const worker = async () => {
    while (next < items.length) {
      const job = items[next++];
      results.push(await run(job));
    }
  };
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker));
  return results;
}

const ops = [
  formatFix && 'format:fix',
  formatCheck && 'format:check',
  lintFix && 'lint:fix',
  lintCheck && 'lint:check',
]
  .filter(Boolean)
  .join(', ');
console.log(
  `${changed.length} changed file(s) vs ${resolvedBase} → ${jobs.length} job(s) [${ops}], concurrency ${concurrency}`
);

const results = await pool(jobs, concurrency);
const failed = results.filter(r => !r.ok);
console.log(
  failed.length
    ? `\n✖ ${failed.length}/${results.length} job(s) failed: ${failed.map(f => f.label).join(', ')}`
    : `\n✓ all ${results.length} job(s) passed`
);
process.exit(failed.length ? 1 : 0);
