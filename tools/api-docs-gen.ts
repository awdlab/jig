import { readdir, readFile, stat, writeFile } from 'fs/promises';
import { type PluginOptions } from 'typedoc-plugin-markdown';
import {
  Application,
  DeclarationReflection,
  Deserializer,
  IntrinsicType,
  LiteralType,
  Logger,
  type ProjectReflection,
  ReferenceType,
  ReflectionFlag,
  ReflectionGroup,
  ReflectionKind,
  Serializer,
  type TypeDocOptions,
  UnionType,
  type SomeType,
} from 'typedoc';
import { join } from 'path';

const COMPONENT_DOCS_PATH = '../../apps/docs/src/docs/components';
const OUT_DIR = '../../apps/docs/src/docs/api';

const options: TypeDocOptions & PluginOptions = {
  entryPoints: ['./src/**/*.ts'],
  plugin: ['typedoc-plugin-markdown'],
  out: OUT_DIR,
  hidePageHeader: true,
  hideBreadcrumbs: true,
  hideGenerator: true,
  hidePageTitle: true,
  hideGroupHeadings: true,
  propertyMembersFormat: 'table',
  parametersFormat: 'table',
  classPropertiesFormat: 'table',
  tableColumnSettings: {
    hideModifiers: true,
    hideSources: true,
    hideInherited: true,
  },
  searchInComments: true,
};

async function parseTsDocs() {
  const app = await Application.bootstrapWithPlugins(options);

  const project = await app.convert();

  return { app, project };
}

async function getControlNames() {
  const dirs = await readdir(COMPONENT_DOCS_PATH);
  return dirs;
}

function convertControl(control: DeclarationReflection) {
  const props = control.getProperties();

  const inputs = props.filter(
    prop =>
      prop.kind === ReflectionKind.Property &&
      prop.flags.isPublic &&
      ['InputSignal'].includes((prop.type as ReferenceType).name)
  );

  const outputs = props.filter(
    prop =>
      prop.kind === ReflectionKind.Property &&
      prop.flags.isPublic &&
      ['OutputEmitterRef'].includes((prop.type as ReferenceType).name)
  );

  const models = props.filter(
    prop =>
      prop.kind === ReflectionKind.Property &&
      prop.flags.isPublic &&
      ['ModelSignal'].includes((prop.type as ReferenceType).name)
  );

  const d = new Deserializer(new Logger());
  const s = new Serializer();
  const modelsOutput = models.map(m => {
    const copy = new DeclarationReflection(m.name, m.kind, control);
    copy.fromObject(d, m.toObject(s));
    copy.name = `${copy.name}Change`;
    return copy;
  });

  inputs.push(...models);
  outputs.push(...modelsOutput);

  const publicProps = props.filter(
    prop =>
      prop.kind === ReflectionKind.Property &&
      prop.flags.isPublic &&
      !inputs.includes(prop) &&
      !outputs.includes(prop)
  );

  const groupInputs = new ReflectionGroup('Inputs', control);
  const groupOutputs = new ReflectionGroup('Outputs', control);
  const groupPublic = new ReflectionGroup('Properties', control);

  groupInputs.children = inputs;
  groupOutputs.children = outputs;
  groupPublic.children = publicProps;

  control.groups = [];
  inputs.length && control.groups.push(groupInputs);
  outputs.length && control.groups.push(groupOutputs);
  publicProps.length && control.groups.push(groupPublic);

  [...inputs, ...outputs].forEach(input => {
    input.type = (input.type as ReferenceType).typeArguments?.[0]!;
    input.flags.setFlag(ReflectionFlag.Readonly, false);
  });

  function isNullorUndefinedType(type: SomeType): boolean {
    return (
      (type instanceof LiteralType && type.value === null) ||
      (type instanceof IntrinsicType && type.name === 'undefined')
    );
  }

  // Sort null & undefined to the back
  [...inputs, ...outputs, ...publicProps].forEach(prop => {
    if (prop.type instanceof UnionType) {
      prop.type.types.sort((a, b) => {
        if (isNullorUndefinedType(a) && !isNullorUndefinedType(b)) {
          return 1;
        } else if (isNullorUndefinedType(b) && !isNullorUndefinedType(a)) {
          return -1;
        }
        return 0;
      });
    }
  });
}

function convertControlGroup(project: ProjectReflection, controlGroupName: string) {
  const group = project.getChildByName(controlGroupName) as DeclarationReflection;
  const childNames = group.children?.map(child => child.name) ?? [];

  childNames.forEach(childName => {
    const child = group.getChildByName(childName) as DeclarationReflection;
    convertControl(child);
  });
}

async function convertProject(project: ProjectReflection) {
  const controlGroupNames = await getControlNames();

  return controlGroupNames.forEach(controlGroupName => {
    convertControlGroup(project, `${controlGroupName}/${controlGroupName}`);
  });
}

async function getAllMarkdownFilesRecursive(dir = OUT_DIR): Promise<string[]> {
  const entries = await readdir(dir);
  let markdownFiles: string[] = [];

  for (const entry of entries) {
    const fullPath = join(dir, entry);
    const stats = await stat(fullPath);

    if (stats.isDirectory()) {
      const nestedFiles = await getAllMarkdownFilesRecursive(fullPath);
      markdownFiles = markdownFiles.concat(nestedFiles);
    } else if (entry.endsWith('.md')) {
      markdownFiles.push(fullPath);
    }
  }

  return markdownFiles;
}

async function fixLinks() {
  const allMarkdownFilesRecursive = await getAllMarkdownFilesRecursive();

  const all = allMarkdownFilesRecursive.map(async filePath => {
    const content = await readFile(filePath, 'utf-8');

    const out = content.replace(
      /\(\.\.\/\.\.\/types\/type-aliases\/([^/]+)\.md\)/,
      '(/docs/api/type-aliases/ngneers-controls/$1)'
    );

    await writeFile(filePath, out, 'utf-8');
  });

  await Promise.all(all);
}

async function run() {
  const { app, project } = await parseTsDocs();
  if (!project) {
    console.error('Failed to parse TypeScript documentation');
    return;
  }
  await convertProject(project);
  await app.generateOutputs(project);

  await fixLinks();
}

run();
