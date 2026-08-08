/**
 * Build the knowledge pack the MCP server ships.
 *
 * Runs ONLY inside the monorepo (at publish / CI time). It consumes artifacts
 * that already exist here:
 *   - apps/docs/.../_generated/typedoc.json  (from `pnpm api-docs:generate`)
 *   - apps/docs/.../components/<name>/index.md (prose usage docs)
 *   - apps/docs/.../guides/**\/index.md        (concept guides)
 *
 * ...and normalizes them into a single self-contained JSON that the runtime
 * server reads. The server itself never runs this or touches the repo.
 *
 * Hybrid knowledge model: the API surface (inputs/outputs/types/defaults) is
 * auto-derived from TypeDoc; the prose usage + concepts are hand-authored docs.
 */
import { mkdirSync, readFileSync, readdirSync, writeFileSync, existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import type {
  KnowledgePack,
  Migration,
  PackConcept,
  PackControl,
  PackExample,
  PackProp,
  Recipe,
  ThemeOptions,
  ThemePart,
  ThemeSchema,
} from '../src/pack.ts';

const HERE = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(HERE, '../../..');
const DOCS = join(REPO_ROOT, 'apps/docs/src/app/docs');
const TYPEDOC = join(DOCS, '_generated/typedoc.json');
const COMPONENTS = join(DOCS, 'components');
const GUIDES = join(DOCS, 'guides');
const THEME_TEMPLATES = join(REPO_ROOT, 'packages/themes/src/templates');
const AUTHORED = resolve(HERE, '../authored');
const OUT = resolve(HERE, '../data/knowledge-pack.json');

// ---------------------------------------------------------------------------
// TypeDoc helpers — kept deliberately small; only what docs need to render.
// ---------------------------------------------------------------------------

type Any = Record<string, any>;

/** Render a TypeDoc serialized type into a readable TS string. */
function typeToString(t: Any | undefined): string {
  if (!t) return 'unknown';
  switch (t.type) {
    case 'intrinsic':
      return t.name ?? 'unknown';
    case 'literal':
      if (t.value === null) return 'null';
      return typeof t.value === 'string' ? `'${t.value}'` : String(t.value);
    case 'reference': {
      const args = (t.typeArguments ?? []).map(typeToString);
      return t.name + (args.length ? `<${args.join(', ')}>` : '');
    }
    case 'array':
      return `${typeToString(t.elementType)}[]`;
    case 'union':
      return (t.types ?? []).map(typeToString).join(' | ');
    case 'intersection':
      return (t.types ?? []).map(typeToString).join(' & ');
    case 'tuple':
      return `[${(t.elements ?? []).map(typeToString).join(', ')}]`;
    case 'reflection': {
      const sig = t.declaration?.signatures?.[0];
      if (sig) {
        const params = (sig.parameters ?? [])
          .map((p: Any) => `${p.name}: ${typeToString(p.type)}`)
          .join(', ');
        return `(${params}) => ${typeToString(sig.type)}`;
      }
      return 'object';
    }
    case 'templateLiteral':
      return 'string';
    case 'typeOperator':
      return `${t.operator} ${typeToString(t.target)}`;
    case 'query':
      return `typeof ${typeToString(t.queryType)}`;
    case 'indexedAccess':
      return `${typeToString(t.objectType)}[${typeToString(t.indexType)}]`;
    case 'named-tuple-member':
      return `${t.name}: ${typeToString(t.element)}`;
    case 'optional':
      return `${typeToString(t.elementType)}?`;
    case 'rest':
      return `...${typeToString(t.elementType)}`;
    default:
      return t.name ?? t.type ?? 'unknown';
  }
}

/** Join a TypeDoc comment display-part array into plain markdown. */
function partsToText(parts: Any[] | undefined): string {
  if (!parts) return '';
  return parts
    .map(p => {
      if (p.kind === 'inline-tag') return p.text;
      return p.text ?? '';
    })
    .join('')
    .trim();
}

function blockTag(node: Any, tag: string): string | undefined {
  const t = node.comment?.blockTags?.find((b: Any) => b.tag === tag);
  return t ? partsToText(t.content) : undefined;
}

function toProp(node: Any): PackProp {
  const rawDefault = blockTag(node, '@default');
  // api-docs-gen marks required inputs by stuffing `&nbsp;` into @default.
  const def = rawDefault && rawDefault !== '&nbsp;' ? rawDefault : undefined;
  return {
    name: node.name,
    type: typeToString(node.type),
    optional: node.flags?.isOptional ?? true,
    ...(def ? { default: def } : {}),
    ...(node.comment?.summary?.length ? { description: partsToText(node.comment.summary) } : {}),
  };
}

/** Resolve a group's child ids against a control class's children. */
function groupProps(cls: Any, title: string, byId: Map<number, Any>): PackProp[] {
  const group = cls.groups?.find((g: Any) => g.title === title);
  if (!group) return [];
  return (group.children ?? [])
    .map((id: number) => byId.get(id))
    .filter(Boolean)
    .map(toProp);
}

const CONTROLS_SRC = join(REPO_ROOT, 'packages/controls/src');

/** `control` | `directive` from the class's own `@category` tag. */
function controlKind(cls: Any): 'control' | 'directive' {
  const tag = cls.comment?.blockTags?.find((b: Any) => b.tag === '@category');
  const val = tag ? partsToText(tag.content).toLowerCase() : '';
  return val === 'directive' ? 'directive' : 'control';
}

/**
 * The real selector lives only in the `@Component`/`@Directive` decorator, not
 * in TypeDoc. Read it from the control's source: find the class declaration,
 * then the nearest preceding `selector:` in its decorator.
 */
function selectorFor(modName: string, className: string, fallback: string): string {
  const file = join(CONTROLS_SRC, `${modName}.ts`);
  if (!existsSync(file)) return fallback;
  const src = readFileSync(file, 'utf-8');
  const classIdx = src.search(new RegExp(`class\\s+${className}\\b`));
  const scope = classIdx === -1 ? src : src.slice(0, classIdx);
  const matches = [...scope.matchAll(/selector:\s*['"`]([^'"`]+)['"`]/g)];
  const last = matches[matches.length - 1];
  return last?.[1]?.trim() ?? fallback;
}

const pascal = (s: string) => s.replace(/(^|-)([a-z])/g, (_, __, c) => c.toUpperCase());

// ---------------------------------------------------------------------------
// Markdown helpers
// ---------------------------------------------------------------------------

/** Strip docs-only placeholders (`{{ demo: X }}`, `{{ api: X }}`). */
function stripPlaceholders(md: string): string {
  return md
    .replace(/\{\{\s*(demo|api):[^}]*\}\}/g, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function firstSentence(text: string): string {
  const flat = text.replace(/\s+/g, ' ').trim();
  const m = flat.match(/^(.*?[.!?])(\s|$)/);
  return (m ? m[1] : flat).trim();
}

// ---------------------------------------------------------------------------
// Build
// ---------------------------------------------------------------------------

function buildControls(): PackControl[] {
  const project = JSON.parse(readFileSync(TYPEDOC, 'utf-8')) as Any;

  const controls: PackControl[] = [];

  for (const mod of project.children ?? []) {
    for (const cls of mod.children ?? []) {
      // A control is any class api-docs-gen tagged with Inputs/Outputs groups.
      const hasIoGroup = cls.groups?.some(
        (g: Any) => g.title === 'Inputs' || g.title === 'Outputs'
      );
      if (!hasIoGroup) continue;

      const kind = controlKind(cls);
      // Internal control name = last segment of the module path (e.g.
      // `select/select` -> `select`). One module can export several controls
      // (roving group + item); the later ones fall back to their own class name
      // so every entry stays individually addressable by `get_control`.
      const moduleName = String(mod.name).split('/').pop()!;
      const name = controls.some(c => c.name === moduleName)
        ? identToScope(cls.name.replace(/^Ngn/, ''))
        : moduleName;

      const byId = new Map<number, Any>((cls.children ?? []).map((c: Any) => [c.id, c]));
      const inputs = groupProps(cls, 'Inputs', byId);
      const outputs = groupProps(cls, 'Outputs', byId);

      const mdPath = join(COMPONENTS, name, 'index.md');
      const rawUsage = existsSync(mdPath) ? readFileSync(mdPath, 'utf-8') : '';
      const usage = stripPlaceholders(rawUsage);
      const classSummary = partsToText(cls.comment?.summary);
      const summary = firstSentence(usage) || classSummary || `The ${cls.name} ${kind}.`;

      const fallbackSelector = kind === 'control' ? `ngn-${name}` : `[ngn${pascal(name)}]`;
      const selector = selectorFor(String(mod.name), cls.name, fallbackSelector);

      controls.push({
        name,
        className: cls.name,
        kind,
        selector,
        summary,
        usage,
        inputs,
        outputs,
      });
    }
  }

  controls.sort((a, b) => a.name.localeCompare(b.name));

  // `get_control` addresses controls by name, so a collision silently hides one.
  const seen = new Map<string, string>();
  for (const control of controls) {
    const other = seen.get(control.name);
    if (other) {
      throw new Error(
        `Duplicate control name "${control.name}" (${other} and ${control.className}). ` +
          `Rename the module or the class so each control is addressable.`
      );
    }
    seen.set(control.name, control.className);
  }

  return controls;
}

function buildConcepts(): PackConcept[] {
  const concepts: PackConcept[] = [];

  function walk(dir: string, trail: string[]): void {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      if (entry.isDirectory()) {
        walk(join(dir, entry.name), [...trail, entry.name]);
      } else if (entry.name === 'index.md') {
        const raw = readFileSync(join(dir, entry.name), 'utf-8');
        const body = stripPlaceholders(raw);
        if (!body) continue;
        const slug = trail.join('-');
        const heading = body.match(/^#+\s+(.+)$/m)?.[1];
        const title = heading ?? pascal(trail[trail.length - 1] ?? slug).replace(/-/g, ' ');
        concepts.push({ slug, title, body });
      }
    }
  }

  walk(GUIDES, []);
  concepts.sort((a, b) => a.slug.localeCompare(b.slug));
  return concepts;
}

/** camelCase identifier -> kebab control scope (e.g. `listBox` -> `list-box`). */
function identToScope(ident: string): string {
  return ident
    .replace(/ControlTemplate$/, '')
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .toLowerCase();
}

/**
 * Auto-derive each control's themeable anatomy from its theme template
 * (`createControlTemplate({ scope, classNames, dependencies })`). This is the
 * per-control knowledge an author needs to target parts with `c()` / `d()`.
 */
function buildThemeParts(): ThemePart[] {
  const parts: ThemePart[] = [];
  for (const entry of readdirSync(THEME_TEMPLATES, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const file = join(THEME_TEMPLATES, entry.name, 'index.ts');
    if (!existsSync(file)) continue;
    const src = readFileSync(file, 'utf-8');
    if (!src.includes('createControlTemplate')) continue;

    const scope = src.match(/scope:\s*['"`]([^'"`]+)['"`]/)?.[1] ?? entry.name;
    const classBlock = src.match(/classNames:\s*\[([\s\S]*?)\]/)?.[1] ?? '';
    const classNames = [...classBlock.matchAll(/['"`]([^'"`]+)['"`]/g)].map(m => m[1]!);
    const depBlock = src.match(/dependencies:\s*\[([\s\S]*?)\]/)?.[1] ?? '';
    const dependencies = [...depBlock.matchAll(/([A-Za-z0-9_]+ControlTemplate)/g)].map(m =>
      identToScope(m[1]!)
    );
    const supportsColor = classNames.includes('color-*');

    parts.push({ name: entry.name, scope, classNames, dependencies, supportsColor });
  }
  parts.sort((a, b) => a.name.localeCompare(b.name));
  return parts;
}

const THEME_SRC = join(REPO_ROOT, 'packages/themes/src');

/** Pull quoted strings out of a `[ 'a', 'b' ]` literal. */
function stringsIn(arrayText: string): string[] {
  return [...arrayText.matchAll(/['"`]([^'"`]+)['"`]/g)].map(m => m[1]!);
}

/** Resolve an array const to its string members, following one reference hop. */
function resolveArrayConst(id: string): string[] {
  // Search the themes source tree for `export const <id> = [ ... ]`.
  const stack = [THEME_SRC];
  while (stack.length) {
    const dir = stack.pop()!;
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const full = join(dir, entry.name);
      if (entry.isDirectory()) {
        stack.push(full);
      } else if (entry.name.endsWith('.ts')) {
        const src = readFileSync(full, 'utf-8');
        const m = src.match(new RegExp(`export const ${id}\\s*=\\s*\\[([\\s\\S]*?)\\]`));
        if (m) return stringsIn(m[1]!);
      }
    }
  }
  return [];
}

/**
 * Extract each built-in theme's kind/color options. A theme declares them as
 * `export const KINDS = { <scope>: [...] }` and `export const COLORS = [...]`
 * (or a reference like `PUBLIC_COLOR_SLOTS`) in its `index.ts`. The docs app
 * reads the same values at runtime via `injectThemeControlKinds` /
 * `injectThemeColors`, so this mirrors what a consuming app actually sees.
 */
function buildThemes(): ThemeOptions[] {
  const themes: ThemeOptions[] = [];
  for (const entry of readdirSync(THEME_SRC, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const index = join(THEME_SRC, entry.name, 'index.ts');
    if (!existsSync(index)) continue;
    const src = readFileSync(index, 'utf-8');

    const kindsBlock = src.match(/export const KINDS\s*=\s*\{([\s\S]*?)\n\}/)?.[1];
    if (!kindsBlock) continue; // only themes that declare kinds (nova, shade)

    const kinds: Record<string, string[]> = {};
    for (const m of kindsBlock.matchAll(/(\w+):\s*\[([^\]]*)\]/g)) {
      kinds[m[1]!] = stringsIn(m[2]!);
    }

    const colorsRhs = src.match(/export const COLORS\s*=\s*([^;]+);/)?.[1]?.trim() ?? '';
    const colors = colorsRhs.includes('[')
      ? stringsIn(colorsRhs)
      : resolveArrayConst(colorsRhs.replace(/[^A-Za-z0-9_].*$/, ''));

    themes.push({ name: entry.name, kinds, colors });
  }
  themes.sort((a, b) => a.name.localeCompare(b.name));
  return themes;
}

function loadThemeSchema(): ThemeSchema {
  return JSON.parse(readFileSync(join(AUTHORED, 'theme-schema.json'), 'utf-8')) as ThemeSchema;
}

function loadMigrations(): Migration[] {
  const dir = join(AUTHORED, 'migrations');
  if (!existsSync(dir)) return [];
  const migrations = readdirSync(dir)
    .filter(f => f.endsWith('.json'))
    .map(f => JSON.parse(readFileSync(join(dir, f), 'utf-8')) as Migration);
  migrations.sort((a, b) => a.label.localeCompare(b.label));
  return migrations;
}

const DEMOS = join(REPO_ROOT, 'apps/docs/src/app/demos');
// Demo folders that aren't a single control get no primary-control mapping.
const NON_CONTROL_DEMOS = new Set(['dummies', 'control-state', 'dark-mode', 'pt']);

/** Human-readable scenario name from a demo file base name. */
function scenarioName(base: string): string {
  return base
    .split('-')
    .map(w => (w ? w[0]!.toUpperCase() + w.slice(1) : w))
    .join(' ');
}

/**
 * Derive real usage examples from the docs demos. Each demo is a standalone,
 * compiled Angular component with `imports:` (the ngn controls it uses) and an
 * inline `template:` — exactly the "how do I actually wire this" snippet an
 * agent wants, straight from code that is known to build.
 */
function buildExamples(): PackExample[] {
  if (!existsSync(DEMOS)) return [];
  const examples: PackExample[] = [];

  for (const dir of readdirSync(DEMOS, { withFileTypes: true })) {
    if (!dir.isDirectory() || NON_CONTROL_DEMOS.has(dir.name)) continue;
    const folder = join(DEMOS, dir.name);
    for (const file of readdirSync(folder)) {
      if (!file.endsWith('.ts') || file === 'index.ts') continue;
      const src = readFileSync(join(folder, file), 'utf-8');

      // Inline template (first template literal after `template:`).
      const template = src.match(/template:\s*`([\s\S]*?)`/)?.[1]?.trim();
      if (!template) continue;

      // ngn controls the demo imports, e.g. `@ngneers/controls/input-field`.
      const controls = [
        ...new Set([...src.matchAll(/@ngneers\/controls\/([a-z][a-z0-9-]*)/g)].map(m => m[1]!)),
      ].filter(c => c !== 'utils');

      const base = file.replace(/\.ts$/, '');
      examples.push({
        slug: `${dir.name}--${base}`,
        control: dir.name,
        controls: controls.length ? controls : [dir.name],
        scenario: scenarioName(base),
        template,
      });
    }
  }

  examples.sort((a, b) => a.slug.localeCompare(b.slug));
  return examples;
}

function loadRecipes(): Recipe[] {
  const dir = join(AUTHORED, 'recipes');
  if (!existsSync(dir)) return [];
  const recipes: Recipe[] = [];
  for (const f of readdirSync(dir)) {
    if (!f.endsWith('.md')) continue;
    const raw = readFileSync(join(dir, f), 'utf-8');
    // Lightweight frontmatter: title / summary / controls (comma-separated).
    const fm = raw.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
    const meta = fm ? fm[1]! : '';
    const body = (fm ? fm[2]! : raw).trim();
    const field = (k: string) => meta.match(new RegExp(`^${k}:\\s*(.+)$`, 'm'))?.[1]?.trim() ?? '';
    const slug = f.replace(/\.md$/, '');
    recipes.push({
      slug,
      title: field('title') || slug,
      summary: field('summary'),
      controls: field('controls')
        .split(',')
        .map(s => s.trim())
        .filter(Boolean),
      body,
    });
  }
  recipes.sort((a, b) => a.slug.localeCompare(b.slug));
  return recipes;
}

/** ngn selector tokens (elements + attribute directives) a real control exposes. */
function knownSelectorTokens(controls: PackControl[]): Set<string> {
  const known = new Set<string>();
  for (const c of controls) {
    for (const m of c.selector.matchAll(/ngn-[a-z0-9-]+/g)) known.add(m[0]);
    for (const m of c.selector.matchAll(/ngn[A-Z][A-Za-z0-9]*/g)) known.add(m[0]);
  }
  return known;
}

/** Map every ngn selector token (element + attribute) to its control. */
function controlBySelectorToken(controls: PackControl[]): Map<string, PackControl> {
  const map = new Map<string, PackControl>();
  for (const c of controls) {
    for (const m of c.selector.matchAll(/ngn-[a-z0-9-]+/g)) map.set(m[0], c);
    for (const m of c.selector.matchAll(/ngn[A-Z][A-Za-z0-9]*/g)) map.set(m[0], c);
  }
  return map;
}

/**
 * If a prop-map `to` names a single ngn input/model (a bare `identifier` or a
 * `[(model)]` binding), return that identifier; otherwise `null` (it's free
 * text like "kind / color" or "(text content)" and isn't validated).
 */
function inputTokenOf(to: string): string | null {
  const s = to.trim();
  const model = s.match(/^\[\(([a-zA-Z][\w]*)\)\]$/);
  if (model) return model[1]!;
  if (/^[a-z][a-zA-Z0-9]*$/.test(s)) return s;
  return null;
}

/**
 * Guard against migration drift:
 *  1. Every component `to` target must reference a real ngn selector.
 *  2. Every prop-map `to` that names a single ngn input must exist on the
 *     target control (checked across all controls the `to` references).
 * Catches renamed/mistyped controls AND wrong input names at build time.
 */
function validateMigrations(migrations: Migration[], controls: PackControl[]): void {
  const known = knownSelectorTokens(controls);
  const byToken = controlBySelectorToken(controls);
  const errors: string[] = [];

  for (const m of migrations) {
    for (const comp of m.components) {
      const targets = Array.isArray(comp.to) ? comp.to : [comp.to];

      // (1) selector validity + collect the target controls this row points at.
      const targetControls: PackControl[] = [];
      for (const to of targets) {
        const tokens = [...to.matchAll(/ngn-[a-z0-9-]+|ngn[A-Z][A-Za-z0-9]*/g)].map(x => x[0]!);
        if (!tokens.length) {
          // A component with no ngn selector is only valid if it documents why
          // (a `gaps` entry) — i.e. an intentional "no direct equivalent".
          if (!comp.gaps?.length) {
            errors.push(`[${m.source}] "${comp.from}" → "${to}" has no ngn selector token`);
          }
          continue;
        }
        for (const tok of tokens) {
          if (!known.has(tok)) {
            errors.push(
              `[${m.source}] "${comp.from}" → "${to}" references unknown selector "${tok}"`
            );
          }
          const ctrl = byToken.get(tok);
          if (ctrl && !targetControls.includes(ctrl)) targetControls.push(ctrl);
        }
      }

      // (2) prop targets that name a single ngn input must exist on some target.
      if (targetControls.length && comp.props) {
        const inputs = new Set(
          targetControls.flatMap(c => [...c.inputs, ...c.outputs].map(p => p.name))
        );
        for (const prop of comp.props) {
          const token = inputTokenOf(prop.to);
          if (token && !inputs.has(token)) {
            const names = targetControls.map(c => c.name).join('/');
            errors.push(
              `[${m.source}] "${comp.from}" prop "${prop.from}" → "${prop.to}" ` +
                `is not an input of ${names}`
            );
          }
        }
      }
    }
  }

  if (errors.length) {
    throw new Error(
      `Migration validation failed (${errors.length}):\n${errors
        .map(e => `  - ${e}`)
        .join(
          '\n'
        )}\nFix the targets in authored/migrations/ (selectors + input names must be real).`
    );
  }
}

function main(): void {
  const controlsPkg = JSON.parse(
    readFileSync(join(REPO_ROOT, 'packages/controls/package.json'), 'utf-8')
  ) as Any;

  const pack: KnowledgePack = {
    generatedAt: new Date().toISOString(),
    controlsVersion: controlsPkg.version ?? 'unknown',
    controls: buildControls(),
    concepts: buildConcepts(),
    themeParts: buildThemeParts(),
    themeSchema: loadThemeSchema(),
    themes: buildThemes(),
    migrations: loadMigrations(),
    recipes: loadRecipes(),
    examples: buildExamples(),
  };

  validateMigrations(pack.migrations, pack.controls);

  mkdirSync(dirname(OUT), { recursive: true });
  writeFileSync(OUT, JSON.stringify(pack, null, 2));

  console.log(
    `knowledge-pack.json written: ${pack.controls.length} controls, ` +
      `${pack.concepts.length} concepts, ${pack.themeParts.length} theme parts, ` +
      `${pack.themes.length} themes, ${pack.migrations.length} migrations, ` +
      `${pack.recipes.length} recipes, ${pack.examples.length} examples ` +
      `(controls v${pack.controlsVersion}).`
  );
}

main();
