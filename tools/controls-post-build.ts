import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { resolveWorkspaceDependencies } from './utils/resolve-workspace-dependencies';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const repoRoot = path.join(__dirname, '..');

const projectRoot = path.join(repoRoot, 'packages', 'controls');
const distDir = path.join(projectRoot, 'dist');
const distPackageJsonPath = path.join(distDir, 'package.json');

if (!fs.existsSync(distPackageJsonPath)) {
  console.error(`dist/package.json not found at ${distPackageJsonPath}`);
  process.exit(1);
}

console.log(`Resolving workspace dependencies in ${distPackageJsonPath}`);
const packageJson = JSON.parse(fs.readFileSync(distPackageJsonPath, 'utf-8'));
resolveWorkspaceDependencies(packageJson, repoRoot);
fs.writeFileSync(distPackageJsonPath, JSON.stringify(packageJson, null, 2), 'utf-8');

// dist/ is the published package root, so npm's always-included files must live there.
fs.copyFileSync(path.join(projectRoot, 'README.md'), path.join(distDir, 'README.md'));
fs.copyFileSync(path.join(repoRoot, 'LICENSE'), path.join(distDir, 'LICENSE'));
console.log('Done.');
