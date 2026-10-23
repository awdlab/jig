import { spawnSync } from 'node:child_process';
import { readdirSync } from 'node:fs';
import { join } from 'node:path';

const root = join(import.meta.dirname, '..');
const fixtureRoot = join(root, 'packages', 'custom-types', 'test-d');

const fixtures = readdirSync(fixtureRoot, { withFileTypes: true })
  .filter(entry => entry.isDirectory())
  .map(entry => entry.name)
  .sort();

if (fixtures.length === 0) {
  console.error(`No type fixtures found in ${fixtureRoot}`);
  process.exit(1);
}

let failed = 0;
for (const fixture of fixtures) {
  const result = spawnSync(
    'pnpm',
    ['exec', 'tsc', '-p', join(fixtureRoot, fixture, 'tsconfig.json')],
    { cwd: root, encoding: 'utf8', shell: process.platform === 'win32' }
  );
  if (result.status === 0) {
    console.log(`PASS ${fixture}`);
  } else {
    failed++;
    console.error(`FAIL ${fixture}`);
    console.error(`${result.stdout ?? ''}${result.stderr ?? ''}`.trim());
  }
}

console.log(`${fixtures.length - failed}/${fixtures.length} type fixtures passed`);
process.exit(failed === 0 ? 0 : 1);
