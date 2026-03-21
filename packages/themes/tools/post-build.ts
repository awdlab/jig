import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { resolveWorkspaceDependencies } from '../../../tools/utils/resolve-workspace-dependencies';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

const projectRoot = path.join(__dirname, '..');
const repoRoot = path.join(projectRoot, '../..');
const distDir = path.join(projectRoot, 'dist');

preparePackageJson(path.join(projectRoot, 'package.json'), path.join(distDir, 'package.json'));
copyFile(path.join(projectRoot, 'README.md'), path.join(distDir, 'README.md'));
copyFile(path.join(repoRoot, 'LICENSE'), path.join(distDir, 'LICENSE'));
copyFile(
  path.join(projectRoot, 'src/nova/theme-types.d.ts'),
  path.join(distDir, 'nova/theme-types.d.ts')
);

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

  fs.writeFileSync(targetPath, JSON.stringify(packageJson, null, 2), 'utf-8');
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
