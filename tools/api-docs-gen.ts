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

import { writeTypeMatrix } from './type-matrix/type-matrix-gen';

const OUT_DIR = '../../apps/docs/src/app/docs/_generated';

const options: TypeDocOptions = {
  tsconfig: './tsconfig.typedoc.json',
  entryPoints: ['./src/**/*.ts'],
  exclude: ['**/tests/**', '**/*.spec.ts', '**/*.test.ts'],
  searchInComments: true,
  outputs: [
    {
      name: 'json',
      path: `${OUT_DIR}/typedoc.json`,
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

/** Angular lifecycle hooks are implementation detail, not API surface. */
const LIFECYCLE_HOOKS = new Set([
  'ngOnInit',
  'ngOnChanges',
  'ngOnDestroy',
  'ngDoCheck',
  'ngAfterContentInit',
  'ngAfterContentChecked',
  'ngAfterViewInit',
  'ngAfterViewChecked',
  'writeValue',
  'registerOnChange',
  'registerOnTouched',
  'setDisabledState',
]);

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
  // The copies must live in `children` too: the serializer walks `children`, and a
  // group id with no node behind it is dropped silently when the docs app revives it.
  control.children = [...(control.children ?? []), ...modelsOutput];

  const publicProps = props.filter(
    prop =>
      prop.kind === ReflectionKind.Property &&
      prop.flags.isPublic &&
      !inputs.includes(prop) &&
      !outputs.includes(prop)
  );

  const methods = (control.children ?? []).filter(
    child =>
      child.kind === ReflectionKind.Method &&
      child.flags.isPublic &&
      !LIFECYCLE_HOOKS.has(child.name)
  );

  // The interfaces and aliases of the control's entry point: the shapes a consumer
  // has to build (`BreadcrumbItem`, `MeterItem`, `JigUploadFile`, …). They are
  // spread over the folder's modules (`upload/upload`, `upload/types`), so collect
  // by folder. They serialize with their own module; the group only references them.
  const folder = `${control.parent?.name.split('/')[0] ?? ''}/`;
  const types = (control.parent?.parent?.children ?? [])
    .filter(module => module.name.startsWith(folder))
    .flatMap(module => module.children ?? [])
    .filter(
      child =>
        (child.kind === ReflectionKind.Interface || child.kind === ReflectionKind.TypeAlias) &&
        !child.flags.isPrivate &&
        !child.comment?.hasModifier('@internal')
    )
    .sort((a, b) => a.name.localeCompare(b.name));

  const groupInputs = new ReflectionGroup('Inputs', control);
  const groupOutputs = new ReflectionGroup('Outputs', control);
  const groupPublic = new ReflectionGroup('Properties', control);
  const groupMethods = new ReflectionGroup('Methods', control);
  const groupTypes = new ReflectionGroup('Types', control);

  groupInputs.children = inputs;
  groupOutputs.children = outputs;
  groupPublic.children = publicProps;
  groupMethods.children = methods;
  groupTypes.children = types;

  control.groups = [];
  if (inputs.length) control.groups.push(groupInputs);
  if (outputs.length) control.groups.push(groupOutputs);
  if (publicProps.length) control.groups.push(groupPublic);
  if (methods.length) control.groups.push(groupMethods);
  if (types.length) control.groups.push(groupTypes);

  // Mark inherited members, so the docs can lead with the control's own API
  // instead of burying it in base-class rows. TypeDoc's `inheritedFrom` names the
  // proximate base (`SelectTemplates`), not the class that declares the member,
  // so only the flag is useful here.
  for (const member of [...inputs, ...outputs, ...publicProps, ...methods]) {
    if (member.inheritedFrom) {
      member.comment?.modifierTags.add('@inherited');
    }
  }

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
    const unwrapped = (input.type as ReferenceType).typeArguments?.[0];
    if (unwrapped) {
      input.type = unwrapped;
    }
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
  await writeTypeMatrix(`${OUT_DIR}/type-matrix.json`);
}

void run();
