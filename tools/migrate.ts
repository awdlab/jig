import JSON5 from 'json5';
import { AwesomeLogger, type AwesomePromptValidator } from 'awesome-logging';
import { promiseExec } from './utils/promise-exec';
import { readFile, unlink, writeFile } from 'node:fs/promises';
import * as yaml from 'yaml';
import { dirname, join } from 'node:path';
import { format } from 'prettier';
import { fileURLToPath } from 'node:url';
const __dirname = dirname(fileURLToPath(import.meta.url));

const projects = ['apps/docs', 'apps/test-wrapper', 'packages/controls'];
let selectedProjects: string[] = [];
const baseCfgPath = join(__dirname, '../tsconfig.json');
const tempConfigName = 'tsconfig.migrate.json';
const restoreMap: Record<string, string> = {};
const successMap: Record<string, boolean> = {};
const tempConfigContentMap: Record<string, string> = {};

function createProjectTempConfig(baseCfg: Record<string, unknown>) {
  const projectTempConfig = structuredClone(baseCfg) as {
    compilerOptions?: {
      paths?: Record<string, string[]>;
    };
  };

  Object.keys(projectTempConfig.compilerOptions?.paths ?? {}).forEach(key => {
    projectTempConfig.compilerOptions!.paths![key] = projectTempConfig.compilerOptions!.paths![
      key
    ].map(value => `../../${value}`);
  });

  return projectTempConfig;
}

function normalizeProjectTempConfig(tempConfigText: string) {
  const tempConfig = JSON5.parse(tempConfigText) as {
    compilerOptions?: {
      paths?: Record<string, string[]>;
    };
  };

  Object.keys(tempConfig.compilerOptions?.paths ?? {}).forEach(key => {
    tempConfig.compilerOptions!.paths![key] = tempConfig.compilerOptions!.paths![key].map(value =>
      value.replace(/^\.\.\//, '').replace(/^\.\.\//, '')
    );
  });

  return JSON.stringify(tempConfig, null, 2);
}

async function createTempConfigs(selectedProjects: string[]) {
  const baseCfgText = await readFile(baseCfgPath); // test if base config exists
  const baseCfg = JSON5.parse(baseCfgText.toString()) as Record<string, unknown>;

  for (const project of selectedProjects) {
    const projectCfgPath = join(project, 'tsconfig.json');
    const projectCfgText = await readFile(projectCfgPath);
    restoreMap[project] = projectCfgText.toString();
    const projectCfg = JSON5.parse(projectCfgText.toString());
    projectCfg.extends = `./${tempConfigName}`;
    await writeFile(projectCfgPath, JSON.stringify(projectCfg, null, 2));

    const projectTempConfigPath = join(project, tempConfigName);
    const projectTempConfig = createProjectTempConfig(baseCfg);
    const projectTempConfigText = JSON.stringify(projectTempConfig, null, 2);
    tempConfigContentMap[project] = projectTempConfigText;
    await writeFile(projectTempConfigPath, projectTempConfigText);
  }
}

AwesomeLogger.init();
async function run() {
  const pnpmWorkspaceString = await readFile(`pnpm-workspace.yaml`);
  const pnpmWorkspace = yaml.parse(pnpmWorkspaceString.toString());
  const catalog = pnpmWorkspace.catalog as Record<string, string>;
  const availablePackages = Object.keys(catalog).sort();

  const packageValidator: AwesomePromptValidator = {
    description: `Package must be one of: ${availablePackages.join(', ')}`,
    validator: (val: string) => val.trim() in catalog,
  };

  const versionValidator: AwesomePromptValidator = {
    description: 'Version must be in format x.y.z',
    validator: (val: string) => /^\d+\.\d+\.\d+$/.test(val),
  };

  const packageName = (
    await AwesomeLogger.prompt('text', {
      text: 'Select package to run migrations from',
      hints: availablePackages,
      default: '@angular/core',
      validators: [packageValidator],
    }).result
  ).trim();

  const currentPackageVersion = catalog[packageName] ?? '';

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

  await createTempConfigs(selectedProjects);

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
  let updatedBaseConfigText: string | null = null;
  for (const project of selectedProjects) {
    if (restoreMap[project]) {
      await writeFile(join(project, 'tsconfig.json'), restoreMap[project]);
    }
    const newProjectTempConfigContent = await readFile(join(project, tempConfigName)).catch(
      () => null
    );
    if (
      updatedBaseConfigText === null &&
      newProjectTempConfigContent &&
      newProjectTempConfigContent.toString() !== tempConfigContentMap[project]
    ) {
      updatedBaseConfigText = normalizeProjectTempConfig(newProjectTempConfigContent.toString());
    }
    await unlink(join(project, tempConfigName)).catch(() => null);
  }
  if (updatedBaseConfigText) {
    const updatedBaseConfigFormatted = await format(updatedBaseConfigText, { parser: 'json' });
    console.log(
      'Temporary project tsconfig was changed during migration, overwriting tsconfig.json'
    );
    await writeFile(baseCfgPath, updatedBaseConfigFormatted);
  }
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
    void restore();
    logSuccess();
  })
  .catch(err => {
    console.error(err);
    void restore();
    logSuccess();
  });
