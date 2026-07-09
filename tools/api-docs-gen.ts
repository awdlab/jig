import { readFile } from 'fs/promises';
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
  CommentTag,
  OptionDefaults,
} from 'typedoc';

const OUT_DIR = '../../apps/docs/src/app/docs/_generated';

const options: TypeDocOptions = {
  tsconfig: './tsconfig.typedoc.json',
  entryPoints: ['./src/**/*.ts'],
  exclude: ['**/tests/**', '**/*.spec.ts', '**/*.test.ts'],
  searchInComments: true,
  outputs: [
    {
      name: 'json',
      path: OUT_DIR + '/typedoc.json',
      options: { pretty: false },
    },
  ],
  blockTags: [...OptionDefaults.blockTags, '@alias', '@todo'],
};

async function parseTsDocs() {
  const app = await Application.bootstrapWithPlugins(options);

  const project = await app.convert();

  return { app, project };
}

async function convertControl(control: DeclarationReflection) {
  const props = control.getProperties();

  const inputs = props.filter(
    prop =>
      prop.kind === ReflectionKind.Property &&
      prop.flags.isPublic &&
      ['InputSignal', 'InputSignalWithTransform'].includes((prop.type as ReferenceType).name)
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
    try {
      const copy = new DeclarationReflection(m.name, m.kind, control);
      copy.fromObject(d, m.toObject(s));
      copy.name = `${copy.name}Change`;
      return copy;
    } catch {
      // Some complex model types can't be serialized/deserialized
      // (e.g. intersection types, mapped types). Skip the output copy.
      const copy = new DeclarationReflection(`${m.name}Change`, m.kind, control);
      copy.type = m.type;
      copy.comment = m.comment;
      copy.flags = m.flags;
      return copy;
    }
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

  // Replace names with aliases
  [...inputs, ...outputs].forEach(input => {
    const i = input.comment?.blockTags.findIndex(tag => tag.tag === '@alias');
    if (i !== undefined && i !== -1) {
      input.name = input.comment?.blockTags[i].content[0].text ?? input.name;
      input.comment?.blockTags.splice(i, 1);
    }
  });

  // Remove readonly & signal/output wrapper type from inputs/outputs
  [...inputs, ...outputs].forEach(input => {
    input.type = (input.type as ReferenceType).typeArguments?.[0]!;
    input.flags.setFlag(ReflectionFlag.Readonly, false);
  });

  // Add * to required inputs
  const promises = [...inputs].map(async input => {
    const source = input.sources?.[0];
    const file = source?.fullFileName;
    const line = source?.line;
    if (!file || !line) return;
    const lineText = await readFile(file, 'utf-8').then(content => {
      const lines = content.split('\n');
      return lines[line - 1];
    });
    if (lineText.includes('.required')) {
      input.flags.setFlag(ReflectionFlag.Optional, false);
      const i = input.comment?.blockTags.findIndex(tag => tag.tag === '@default');
      // remove @default tag
      if (i !== undefined && i !== -1) {
        input.comment?.blockTags.splice(i, 1);
      }
      input.comment?.blockTags.push(new CommentTag('@default', [{ kind: 'text', text: '&nbsp;' }]));
    } else {
      input.flags.setFlag(ReflectionFlag.Optional, true);
    }
  });
  await Promise.all(promises);

  // Sort required inputs to the top and alphabetically
  inputs.sort((a, b) => {
    if (!a.flags.hasFlag(ReflectionFlag.Optional) && b.flags.hasFlag(ReflectionFlag.Optional)) {
      return -1;
    } else if (
      a.flags.hasFlag(ReflectionFlag.Optional) &&
      !b.flags.hasFlag(ReflectionFlag.Optional)
    ) {
      return 1;
    }
    return a.name.localeCompare(b.name);
  });

  function isNullorUndefinedType(type: SomeType): boolean {
    return (
      (type instanceof LiteralType && type.value === null) ||
      (type instanceof IntrinsicType && type.name === 'undefined')
    );
  }

  // Sort null & undefined to the back
  // & map @defaultValue to @default
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
    // Unify @defaultValue to @default
    const tag = prop.comment?.blockTags.find(tag => tag.tag === '@defaultValue');
    if (tag) {
      tag.tag = '@default';
    }
  });
}

function hasCategory(x: DeclarationReflection | undefined, category: string): boolean {
  return !!x?.comment?.blockTags.some(
    tag =>
      tag.tag === '@category' && tag.content.some(tc => tc.kind === 'text' && tc.text === category)
  );
}

async function convertProject(project: ProjectReflection) {
  const componentLevelReflections = project.children?.flatMap(c => c.children);
  const controlReflections =
    componentLevelReflections
      ?.filter(x => hasCategory(x, 'control') || hasCategory(x, 'directive'))
      .filter(Boolean)
      .map(x => x as DeclarationReflection) ?? [];

  return Promise.all(
    controlReflections.map(control => {
      return convertControl(control);
    })
  );
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
