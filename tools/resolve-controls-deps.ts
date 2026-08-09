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
console.log('Done.');
