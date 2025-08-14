import { readdir } from 'fs/promises';
import { type PluginOptions } from 'typedoc-plugin-markdown';
import {
  Application,
  ArrayType,
  ConditionalType,
  DeclarationReflection,
  IndexedAccessType,
  InferredType,
  IntersectionType,
  IntrinsicType,
  LiteralType,
  MappedType,
  NamedTupleMember,
  OptionalType,
  PredicateType,
  ProjectReflection,
  QueryType,
  ReferenceType,
  ReflectionFlag,
  ReflectionKind,
  ReflectionType,
  RestType,
  TemplateLiteralType,
  TupleType,
  type TypeDocOptions,
  TypeOperatorType,
  UnionType,
  UnknownType,
} from 'typedoc';

const COMPONENT_DOCS_PATH = '../../apps/docs/src/docs/components';

type SomeType =
  | ArrayType
  | ConditionalType
  | IndexedAccessType
  | InferredType
  | IntersectionType
  | IntrinsicType
  | LiteralType
  | MappedType
  | OptionalType
  | PredicateType
  | QueryType
  | ReferenceType
  | ReflectionType
  | RestType
  | TemplateLiteralType
  | TupleType
  | NamedTupleMember
  | TypeOperatorType
  | UnionType
  | UnknownType;

const a: TypeDocOptions & PluginOptions = {
  entryPoints: ['./src/**/*.ts'],
  plugin: ['typedoc-plugin-markdown'],
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
  },
};

async function parseTsDocs() {
  const app = await Application.bootstrapWithPlugins(a);

  const project = await app.convert();

  return { app, project };
}

async function getControlNames() {
  const dirs = await readdir(COMPONENT_DOCS_PATH);
  return dirs;
}

function convertControl(control: DeclarationReflection) {
  const props = control.getProperties();

  // TODO: Convert Outputs
  const inputs = props.filter(
    prop =>
      prop.kind === ReflectionKind.Property &&
      prop.flags.isPublic &&
      ['InputSignal', 'ModelSignal'].includes((prop.type as ReferenceType).name)
  );

  const ignoredProps = props.filter(prop => !inputs.includes(prop));
  ignoredProps.forEach(prop => prop.setFlag(ReflectionFlag.Private, true));

  inputs.forEach(input => {
    input.type = (input.type as ReferenceType).typeArguments?.[0]!;
    input.flags.setFlag(ReflectionFlag.Readonly, false);
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

async function run() {
  const { app, project } = await parseTsDocs();
  if (!project) {
    console.error('Failed to parse TypeScript documentation');
    return;
  }
  await convertProject(project);
  await app.generateOutputs(project);
}

run();
