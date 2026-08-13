import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import { resolveWorkspaceDependencies } from '../../../tools/utils/resolve-workspace-dependencies';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

const projectRoot = path.join(__dirname, '..');
const repoRoot = path.join(projectRoot, '../..');
const distDir = path.join(projectRoot, 'dist');

const THEMES = ['nova', 'shade', 'material'];

rewriteRelativeSpecifiers(distDir);
preparePackageJson(path.join(projectRoot, 'package.json'), path.join(distDir, 'package.json'));
copyFile(path.join(projectRoot, 'README.md'), path.join(distDir, 'README.md'));
copyFile(path.join(repoRoot, 'LICENSE'), path.join(distDir, 'LICENSE'));
for (const theme of THEMES) {
  // Declaration-only files are not emitted by tsc, so they have to be copied over.
  copyFile(
    path.join(projectRoot, `src/${theme}/theme-types.d.ts`),
    path.join(distDir, `${theme}/theme-types.d.ts`)
  );
  copyFile(
    path.join(projectRoot, `src/${theme}/typed.d.ts`),
    path.join(distDir, `${theme}/typed.d.ts`)
  );
}

function preparePackageJson(sourcePath: string, targetPath: string) {
  console.log(`Preparing package.json from ${sourcePath} to ${targetPath}`);
  const packageJson = JSON.parse(fs.readFileSync(sourcePath, 'utf-8'));
  delete packageJson.devDependencies;
  delete packageJson.scripts;
  delete packageJson.packageManager;

  resolveWorkspaceDependencies(packageJson, repoRoot);

  // Find all package.json files to build exports
  packageJson.exports = {};
  const projectRoot = path.dirname(sourcePath);
  const exportDirs = findFilesRecursive(projectRoot, 'package.json').map(file =>
    `./${path.relative(projectRoot, path.dirname(file)).replace(/\\/g, '/')}`
      .replace(/\/$/, '')
      .replace(/\/src\//g, '/')
  );
  console.log(`Found export directories: ${exportDirs.join(', ')}`);
  for (const dir of exportDirs) {
    packageJson.exports[dir] = {
      import: `${dir}/index.js`,
      types: `${dir}/index.d.ts`,
    };
  }

  // A theme's default entry points at typed.d.ts, which pulls in the theme's type
  // augmentation. Both entries share the same runtime file — only the types differ.
  // "types" must be listed first — conditions are matched in declaration order, and a leading
  // "import" would make TypeScript derive the types from index.js and ignore typed.d.ts.
  for (const theme of THEMES) {
    packageJson.exports[`./${theme}`] = {
      types: `./${theme}/typed.d.ts`,
      import: `./${theme}/index.js`,
    };
    packageJson.exports[`./${theme}/untyped`] = {
      types: `./${theme}/index.d.ts`,
      import: `./${theme}/index.js`,
    };
  }

  fs.writeFileSync(targetPath, JSON.stringify(packageJson, null, 2), 'utf-8');
}

/**
 * `module: preserve` emits import specifiers verbatim, so the extensionless and directory
 * specifiers the source uses survive into `dist` — where Node's ESM resolver rejects them
 * (`ERR_UNSUPPORTED_DIR_IMPORT`). Rewrite them to the real emitted file.
 */
function rewriteRelativeSpecifiers(dir: string) {
  const files = fs
    .readdirSync(dir, { withFileTypes: true, recursive: true })
    .filter(entry => entry.isFile() && /\.(js|d\.ts)$/.test(entry.name))
    .map(entry => path.join(entry.parentPath, entry.name));

  for (const file of files) {
    const source = fs.readFileSync(file, 'utf-8');
    const rewritten = source.replace(
      /(from\s*|import\s*\(?\s*)'(\.\.?\/[^']*)'/g,
      (match, prefix: string, specifier: string) => {
        if (/\.(js|json|css)$/.test(specifier)) return match;
        const target = path.join(path.dirname(file), specifier);
        const suffix = fs.existsSync(target) && fs.statSync(target).isDirectory() ? '/index' : '';
        return `${prefix}'${specifier}${suffix}.js'`;
      }
    );
    if (rewritten !== source) fs.writeFileSync(file, rewritten, 'utf-8');
  }
}

function copyFile(source: string, target: string) {
  console.log(`Copying ${source} to ${target}`);
  fs.copyFileSync(source, target);
}

function findFilesRecursive(dir: string, fileName: string): string[] {
  const results: string[] = [];
  const items = fs.readdirSync(dir, { withFileTypes: true });

  for (const item of items) {
    const fullPath = path.join(dir, item.name);
    if (item.isDirectory()) {
      results.push(...findFilesRecursive(fullPath, fileName));
    } else if (item.isFile() && item.name === fileName) {
      results.push(fullPath);
    }
  }

  return results;
}

function moveAllFilesFromDir(sourceDir: string, targetDir: string) {
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }
  const items = fs.readdirSync(sourceDir, { withFileTypes: true });
  for (const item of items) {
    const sourcePath = path.join(sourceDir, item.name);
    const targetPath = path.join(targetDir, item.name);
    if (item.isDirectory()) {
      moveAllFilesFromDir(sourcePath, targetPath);
    } else if (item.isFile()) {
      fs.renameSync(sourcePath, targetPath);
    } else {
      console.warn(`Skipping ${sourcePath} as it is not a file or directory`);
    }
  }
  fs.rmdirSync(sourceDir);
}
