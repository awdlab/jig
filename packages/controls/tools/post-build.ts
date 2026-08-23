import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import { resolveWorkspaceDependencies } from '../../../tools/utils/resolve-workspace-dependencies';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

const projectRoot = path.join(__dirname, '..');
const repoRoot = path.join(projectRoot, '../..');
const distDir = path.join(projectRoot, 'dist');

resolveDistDependencies(path.join(distDir, 'package.json'));
copyFile(path.join(projectRoot, 'README.md'), path.join(distDir, 'README.md'));
copyFile(path.join(repoRoot, 'LICENSE'), path.join(distDir, 'LICENSE'));

/** ng-packagr emits a ready-to-publish manifest; only the `workspace:` ranges need resolving. */
function resolveDistDependencies(manifestPath: string) {
  if (!fs.existsSync(manifestPath)) {
    console.error(`dist/package.json not found at ${manifestPath}`);
    process.exit(1);
  }

  console.log(`Resolving workspace dependencies in ${manifestPath}`);
  const packageJson = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
  resolveWorkspaceDependencies(packageJson, repoRoot);
  fs.writeFileSync(manifestPath, JSON.stringify(packageJson, null, 2), 'utf-8');
}

function copyFile(source: string, target: string) {
  console.log(`Copying ${source} to ${target}`);
  fs.copyFileSync(source, target);
}
