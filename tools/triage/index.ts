import { execFileSync } from 'node:child_process';
import { mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join, posix, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { PNG } from 'pngjs';
import { classify, defaultThresholds, type RgbaImage, type Thresholds } from './classify.ts';
import { renderReport, type Entry } from './report.ts';

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const snapshotDir = 'tests/snapshots';
const outDir = join(repoRoot, 'tests/triage');

function git(args: string[]) {
  return execFileSync('git', args, { cwd: repoRoot, encoding: 'utf8', maxBuffer: 1 << 28 });
}

function gitBuffer(args: string[]) {
  return execFileSync('git', args, { cwd: repoRoot, maxBuffer: 1 << 28 });
}

/** Snapshots modified in the working tree, as repo-relative posix paths. */
function changedSnapshots(base: string) {
  return git(['diff', '--name-only', '--diff-filter=M', base, '--', snapshotDir])
    .split('\n')
    .map(l => l.trim())
    .filter(l => l.endsWith('.png'));
}

function toRgba(buffer: Buffer): RgbaImage {
  const png = PNG.sync.read(buffer);
  return { width: png.width, height: png.height, data: new Uint8Array(png.data) };
}

/** Expected in grey, differing pixels in magenta. */
function diffPng(expected: RgbaImage, actual: RgbaImage, colorEps: number) {
  const { width, height } = expected;
  const png = new PNG({ width, height });
  for (let p = 0; p < width * height; p++) {
    const i = p * 4;
    const delta = Math.max(
      Math.abs(expected.data[i]! - actual.data[i]!),
      Math.abs(expected.data[i + 1]! - actual.data[i + 1]!),
      Math.abs(expected.data[i + 2]! - actual.data[i + 2]!)
    );
    if (delta > colorEps) {
      png.data[i] = 255;
      png.data[i + 1] = 0;
      png.data[i + 2] = 255;
    } else {
      const grey = Math.round(
        255 -
          (255 -
            (0.2126 * actual.data[i]! +
              0.7152 * actual.data[i + 1]! +
              0.0722 * actual.data[i + 2]!)) *
            0.25
      );
      png.data[i] = grey;
      png.data[i + 1] = grey;
      png.data[i + 2] = grey;
    }
    png.data[i + 3] = 255;
  }
  return PNG.sync.write(png);
}

/** `tests/snapshots/components/menu.test.ts-snapshots/visual-opened-webkit.png` */
function describe(path: string) {
  const parts = path.split('/');
  const file = parts.at(-1)!.replace(/\.png$/, '');
  const suite = (parts.at(-2) ?? '').replace(/\.test\.ts-snapshots$/, '');
  const match = /^(.*)-(chromium|firefox|webkit)$/.exec(file);
  return {
    component: suite || 'unknown',
    name: match?.[1] ?? file,
    browser: match?.[2] ?? 'unknown',
  };
}

function parseArgs(argv: string[]) {
  const base = argv.find(a => a.startsWith('--base='))?.slice('--base='.length) ?? 'HEAD';
  const thresholds: Thresholds = { ...defaultThresholds };
  for (const key of ['colorEps', 'edgeRange', 'flatMin', 'minArea'] as const) {
    const raw = argv.find(a => a.startsWith(`--${key}=`))?.slice(key.length + 3);
    if (raw !== undefined) thresholds[key] = Number(raw);
  }
  return { base, thresholds };
}

function main() {
  const { base, thresholds } = parseArgs(process.argv.slice(2));
  const paths = changedSnapshots(base);

  if (paths.length === 0) {
    console.log(`No modified snapshots under ${snapshotDir} against ${base}.`);
    return;
  }

  rmSync(outDir, { recursive: true, force: true });
  mkdirSync(outDir, { recursive: true });

  const entries: Entry[] = [];
  let failed = 0;

  for (const [index, path] of paths.entries()) {
    process.stdout.write(`\r${index + 1}/${paths.length} ${path.padEnd(70).slice(0, 70)}`);
    let expected: RgbaImage;
    let actual: RgbaImage;
    try {
      expected = toRgba(gitBuffer(['show', `${base}:${path}`]));
      actual = toRgba(readFileSync(join(repoRoot, path)));
    } catch (error) {
      failed++;
      console.warn(`\nskipped ${path}: ${(error as Error).message}`);
      continue;
    }

    const classification = classify(expected, actual, thresholds);
    const slug = path.replace(/[^a-zA-Z0-9]+/g, '-');
    const expectedSrc = `images/${slug}-expected.png`;
    const actualSrc = `images/${slug}-actual.png`;
    mkdirSync(join(outDir, 'images'), { recursive: true });
    writeFileSync(join(outDir, expectedSrc), gitBuffer(['show', `${base}:${path}`]));
    writeFileSync(join(outDir, actualSrc), readFileSync(join(repoRoot, path)));

    // Only the flagged ones get studied pixel by pixel.
    let diffSrc: string | null = null;
    if (classification.verdict !== 'safe' && expected.width === actual.width) {
      diffSrc = `images/${slug}-diff.png`;
      writeFileSync(join(outDir, diffSrc), diffPng(expected, actual, thresholds.colorEps));
    }

    entries.push({
      path,
      ...describe(path),
      classification,
      expectedSrc,
      actualSrc,
      diffSrc,
    });
  }

  process.stdout.write('\n');

  const rank = { regression: 0, review: 1, safe: 2 };
  entries.sort(
    (a, b) =>
      rank[a.classification.verdict] - rank[b.classification.verdict] ||
      b.classification.offEdgePixels - a.classification.offEdgePixels ||
      b.classification.diffPixels - a.classification.diffPixels
  );

  const reportPath = join(outDir, 'index.html');
  writeFileSync(reportPath, renderReport(entries, { base, generated: new Date().toISOString() }));

  const count = (v: string) => entries.filter(e => e.classification.verdict === v).length;
  console.log(
    `safe ${count('safe')} · review ${count('review')} · regression ${count('regression')}`
  );
  if (failed > 0) console.log(`${failed} could not be read`);
  console.log(posix.join('.', relative(process.cwd(), reportPath).split(/[\\/]/).join('/')));
}

main();
