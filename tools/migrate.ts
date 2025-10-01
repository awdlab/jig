import JSON5 from 'json5';
import { AwesomeLogger, AwesomePromptValidator } from 'awesome-logging';
import { promiseExec } from './utils/promise-exec';
import { readFile, stat, symlink, unlink, writeFile } from 'node:fs/promises';
import * as yaml from 'yaml';
import { dirname, join } from 'node:path';
import { format } from 'prettier';
import { fileURLToPath } from 'node:url';
const __dirname = dirname(fileURLToPath(import.meta.url));

const projects = ['apps/docs', 'apps/test-wrapper', 'packages/controls'];
let selectedProjects: string[] = [];
const baseCfgPath = join(__dirname, '../tsconfig.json');
const baseSymlinkPath = join(__dirname, '../tsconfig.symlink.json');
const restoreMap: Record<string, string> = {};
const successMap: Record<string, boolean> = {};
let baseSymlinkContent = '';

async function createSymlinks(selectedProjects: string[]) {
  const baseCfgText = await readFile(baseCfgPath); // test if base config exists
  const baseCfg = JSON5.parse(baseCfgText.toString());
  Object.keys(baseCfg.compilerOptions.paths).forEach(key => {
    baseCfg.compilerOptions.paths[key] = [`../../${baseCfg.compilerOptions.paths[key]}`];
  });
  baseSymlinkContent = JSON.stringify(baseCfg, null, 2);
  await writeFile(baseSymlinkPath, baseSymlinkContent);

  for (const project of selectedProjects) {
    const projectCfgText = await readFile(join(project, 'tsconfig.json'));
    restoreMap[project] = projectCfgText.toString();
    const projectCfg = JSON5.parse(projectCfgText.toString());
    projectCfg.extends = './tsconfig.symlink.json';
    await writeFile(join(project, 'tsconfig.json'), JSON.stringify(projectCfg, null, 2));

    const tsConfigPath = `${project}/tsconfig.symlink.json`;
    // test if target exists
    if (await stat(tsConfigPath).catch(() => null)) {
      // does exist, delete it
      await unlink(tsConfigPath).catch(() => null);
    }
    // create symlink
    await symlink(baseSymlinkPath, tsConfigPath);
  }
}

AwesomeLogger.init();
async function run() {
  const versionValidator: AwesomePromptValidator = {
    description: 'Version must be in format x.y.z',
    validator: (val: string) => /^\d+\.\d+\.\d+$/.test(val),
  };

  const packageName = await AwesomeLogger.prompt('text', {
    text: 'Select package to run migrations from',
    hints: ['@angular/core', '@angular/cli'],
  }).result;

  const pnpmWorkspaceString = await readFile(`pnpm-workspace.yaml`);
  const pnpmWorkspace = yaml.parse(pnpmWorkspaceString.toString());
  const currentPackageVersion = pnpmWorkspace.catalog[packageName] ?? '';

  const versionTo = await AwesomeLogger.prompt('text', {
    text: 'Select version to migrate to',
    default: currentPackageVersion,
    validators: [versionValidator],
  }).result;

  const previousMajorVersion = parseInt(currentPackageVersion.split('.')[0]) - 1;

  const versionFrom = await AwesomeLogger.prompt('text', {
    text: 'Select version to migrate from',
    default: `${previousMajorVersion}.0.0`,
    validators: [versionValidator],
  }).result;

  const projectsPrompt = AwesomeLogger.prompt('toggle', {
    text: 'Select projects to migrate',
    options: projects,
    default: projects,
  });

  selectedProjects = await projectsPrompt.result;

  await createSymlinks(selectedProjects);

  for (const project of selectedProjects) {
    console.log(`Migrating ${project}...`);
    await promiseExec(
      `pnpm ng update ${packageName} --migrate-only --from=${versionFrom} --to=${versionTo} --allow-dirty`,
      {
        cwd: project,
      }
    )
      .then(() => {
        successMap[project] = true;
        console.log(`Migrated ${project}.`);
      })
      .catch(err => {
        successMap[project] = false;
        console.error(`Error migrating ${project}:`, err);
      });
  }
}

async function restore() {
  console.log('Restoring tsconfig files...');
  for (const project of selectedProjects) {
    if (restoreMap[project]) {
      await writeFile(join(project, 'tsconfig.json'), restoreMap[project]);
    }
    await unlink(join(project, 'tsconfig.symlink.json')).catch(() => null);
  }
  const newBaseSymlinkContent = await readFile(baseSymlinkPath).catch(() => null);
  const newBaseSymlinkContentFormatted = await format(newBaseSymlinkContent?.toString() ?? '', {
    parser: 'json',
  });
  const baseSymlinkContentFormatted = await format(baseSymlinkContent, { parser: 'json' });
  if (newBaseSymlinkContentFormatted !== baseSymlinkContentFormatted) {
    console.log('Base symlink content was changed during migration, overwriting tsconfig.json');
    await writeFile(baseCfgPath, newBaseSymlinkContentFormatted);
  }
  await unlink(baseSymlinkPath).catch(() => null);
  console.log('Restored.');
}

function logSuccess() {
  console.log('Migration results:');
  selectedProjects.forEach(project => {
    if (successMap[project]) {
      console.log(`  - ${project}: \x1b[32mSUCCESS\x1b[0m`);
    } else {
      console.log(`  - ${project}: \x1b[31mFAILED\x1b[0m`);
    }
  });
}

run()
  .then(() => {
    restore();
    logSuccess();
  })
  .catch(err => {
    console.error(err);
    restore();
    logSuccess();
  });
