import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { resolveWorkspaceDependencies } from './utils/resolve-workspace-dependencies';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const repoRoot = path.join(__dirname, '..');

const distPackageJsonPath = path.join(repoRoot, 'packages', 'controls', 'dist', 'package.json');

if (!fs.existsSync(distPackageJsonPath)) {
  console.error(`dist/package.json not found at ${distPackageJsonPath}`);
  process.exit(1);
}

console.log(`Resolving workspace dependencies in ${distPackageJsonPath}`);
const packageJson = JSON.parse(fs.readFileSync(distPackageJsonPath, 'utf-8'));
resolveWorkspaceDependencies(packageJson, repoRoot);
fs.writeFileSync(distPackageJsonPath, JSON.stringify(packageJson, null, 2), 'utf-8');

// dist/ is the published package root (awesome-publish `publishDir`), and npm only
// auto-includes README/LICENSE when they sit beside the manifest it packs. ng-packagr
// copies neither, so stage them here — the same thing packages/themes and
// packages/custom-types already do in their own post-build scripts.
const distDir = path.dirname(distPackageJsonPath);
copyFile(path.join(repoRoot, 'packages', 'controls', 'README.md'), path.join(distDir, 'README.md'));
copyFile(path.join(repoRoot, 'LICENSE'), path.join(distDir, 'LICENSE'));

console.log('Done.');

function copyFile(source: string, target: string) {
  if (!fs.existsSync(source)) {
    console.warn(`Not found, skipping: ${source}`);
    return;
  }
  fs.copyFileSync(source, target);
  console.log(`Copied ${path.basename(source)} -> ${target}`);
}
