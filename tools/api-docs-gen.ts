import { readdir } from 'fs/promises';
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
  ReflectionKind,
  ReflectionType,
  RestType,
  TemplateLiteralType,
  TupleType,
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

async function parseTsDocs() {
  const app = await Application.bootstrapWithPlugins({
    entryPoints: ['./src/**/*.ts'],
  });

  const project = await app.convert();

  return project;
}

async function getControlNames() {
  const dirs = await readdir(COMPONENT_DOCS_PATH);
  return dirs;
}

function convertType(typeArguments: SomeType): string {
  switch (typeArguments.type) {
    case 'array':
      return `Array<${convertType(typeArguments.elementType)}>`;
    case 'union':
      return typeArguments.types
        .filter(
          x =>
            (x.type !== 'intrinsic' || x.name !== 'undefined') &&
            (x.type !== 'literal' || x.value !== null)
        )
        .map(convertType)
        .join(' | ');
    case 'intersection':
      return typeArguments.types.map(convertType).join(' & ');
    case 'literal':
      return JSON.stringify(typeArguments.value);
    case 'intrinsic':
      return typeArguments.name;
    case 'templateLiteral':
      return typeArguments.stringify('templateLiteralElement');
    case 'reference':
      if (
        typeArguments.reflection?.isTypeParameter() &&
        typeArguments.reflection.type?.type === 'intrinsic'
      ) {
        return typeArguments.reflection.type?.name;
      }
      if (typeArguments.typeArguments) {
        return `${typeArguments.name}<${typeArguments.typeArguments.map(convertType).join(', ')}>`;
      }
      return typeArguments.name;
    case 'typeOperator':
      if (typeArguments.operator === 'readonly') {
        return convertType(typeArguments.target);
      }
      return `${typeArguments.operator} ${convertType(typeArguments.target)}`;
    default:
      return typeArguments.toString();
  }
}

async function convertControl(project: ProjectReflection, control: DeclarationReflection) {
  const props = control.getProperties();

  const inputs = props.filter(
    prop =>
      prop.kind === ReflectionKind.Property &&
      prop.flags.isPublic &&
      ['InputSignal', 'ModelSignal'].includes((prop.type as ReferenceType).name)
  );

  const convertedInputs = inputs.map(input => {
    const actualType = convertType((input.type as ReferenceType).typeArguments?.[0]!);

    return {
      type: actualType,
      name: input.name,
    };
  });

  console.log(convertedInputs);
}

async function convertControlGroup(project: ProjectReflection, controlGroupName: string) {
  const group = project.getChildByName(controlGroupName) as DeclarationReflection;
  const childNames = group.children?.map(child => child.name) ?? [];

  for (const childName of childNames) {
    const child = group.getChildByName(childName) as DeclarationReflection;
    await convertControl(project, child);
  }
}

async function convertProject(project: ProjectReflection) {
  const controlGroupNames = await getControlNames();

  for (const controlGroupName of controlGroupNames) {
    await convertControlGroup(project, `${controlGroupName}/${controlGroupName}`);
  }
}

async function run() {
  const project = await parseTsDocs();
  if (!project) {
    console.error('Failed to parse TypeScript documentation');
    return;
  }
  convertProject(project);
}

run();
