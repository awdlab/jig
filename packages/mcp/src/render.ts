import type {
  KnowledgePack,
  Migration,
  MigrationComponent,
  PackControl,
  PackExample,
  PackProp,
  Recipe,
  ThemePart,
  ThemeSchema,
} from './pack.js';

export type {
  KnowledgePack,
  PackControl,
  PackConcept,
  PackProp,
  PackExample,
  ThemePart,
  ThemeOptions,
  ThemeSchema,
  Migration,
  MigrationComponent,
  Recipe,
} from './pack.js';

const camel = (s: string) => s.replace(/-([a-z])/g, (_, c: string) => c.toUpperCase());

function propTable(title: string, props: PackProp[]): string {
  if (!props.length) return '';
  const rows = props
    .map(p => {
      const req = p.optional ? '' : ' *(required)*';
      const def = p.default ? `\`${p.default}\`` : '—';
      const desc = (p.description ?? '').replace(/\s+/g, ' ').trim() || '—';
      return `| \`${p.name}\`${req} | \`${p.type}\` | ${def} | ${desc} |`;
    })
    .join('\n');
  return `\n### ${title}\n\n| Name | Type | Default | Description |\n| --- | --- | --- | --- |\n${rows}\n`;
}

/**
 * The theme-dependent `kind` / `color` values for a control. These are NOT
 * static types (a control's `kind`/`color` input resolves to `unknown` in the
 * API table because the allowed set is decided by the active theme), so we list
 * the real values each built-in theme offers, and tell the agent how to find
 * them for a custom theme.
 */
export function kindsColorsSection(control: PackControl, pack: KnowledgePack): string {
  const key = camel(control.name);
  const supportsColor = pack.themeParts.find(p => p.name === control.name)?.supportsColor ?? false;

  const lines: string[] = [];
  for (const theme of pack.themes) {
    const kinds = [
      ...new Set(
        Object.keys(theme.kinds)
          .filter(k => k === key || k.startsWith(key))
          .flatMap(k => theme.kinds[k] ?? [])
      ),
    ];
    const bits: string[] = [];
    if (kinds.length) bits.push(`**kind**: ${kinds.map(k => `\`${k}\``).join(', ')}`);
    if (supportsColor) bits.push(`**color**: ${theme.colors.map(c => `\`${c}\``).join(', ')}`);
    if (bits.length) lines.push(`- \`${theme.name}\` — ${bits.join(' · ')}`);
  }
  if (!lines.length) return '';

  return (
    `\n## Kinds & colors (theme-dependent)\n\n` +
    `The \`kind\` / \`color\` inputs accept values defined by the **active theme**, not a fixed ` +
    `type. The built-in themes offer:\n\n${lines.join('\n')}\n\n` +
    `If the app uses a **custom theme**, read that theme's \`createTheme({ …, kinds, colors })\` ` +
    `or the app's \`AwdCustomTypes\` interface (\`CustomKind\` / \`CustomColor\` from ` +
    `\`@awdlab/jig-custom-types\`) for the allowed values. See get_theme_options.\n`
  );
}

/** A single example as a fenced HTML block, template optionally truncated. */
export function exampleBlock(example: PackExample, maxLen = 700): string {
  const truncated =
    example.template.length > maxLen
      ? `${example.template.slice(0, maxLen)}\n… (truncated — see jig://example/${example.slug})`
      : example.template;
  return `**${example.scenario}** _(imports: ${example.controls.join(', ')})_\n\n\`\`\`html\n${truncated}\n\`\`\``;
}

/** Examples whose primary control (or imports) is this control. */
export function examplesFor(controlName: string, pack: KnowledgePack): PackExample[] {
  return pack.examples.filter(e => e.control === controlName || e.controls.includes(controlName));
}

function examplesSection(control: PackControl, pack: KnowledgePack, limit = 3): string {
  // Prefer examples where this control is the primary one.
  const primary = pack.examples.filter(e => e.control === control.name);
  const secondary = pack.examples.filter(
    e => e.control !== control.name && e.controls.includes(control.name)
  );
  const chosen = [...primary, ...secondary].slice(0, limit);
  if (!chosen.length) return '';

  const total = primary.length + secondary.length;
  const more =
    total > chosen.length
      ? `\n_${total - chosen.length} more example(s) — see the \`jig://example/…\` resources._\n`
      : '';
  return `\n## Examples (from docs demos)\n\n${chosen
    .map(e => exampleBlock(e))
    .join('\n\n')}\n${more}`;
}

/** Full markdown doc for a single control: header + API tables + usage prose. */
export function controlMarkdown(control: PackControl, pack?: KnowledgePack): string {
  const header =
    `# ${control.className}\n\n` +
    `- **Selector:** \`${control.selector}\`\n` +
    `- **Kind:** ${control.kind}\n` +
    `- **Import:** \`@awdlab/jig\`\n\n` +
    `${control.summary}\n`;

  const api = propTable('Inputs', control.inputs) + propTable('Outputs', control.outputs);
  const kindsColors = pack ? kindsColorsSection(control, pack) : '';
  const examples = pack ? examplesSection(control, pack) : '';
  const usage = control.usage ? `\n## Usage\n\n${control.usage}\n` : '';

  return `${header}${api}${kindsColors}${usage}${examples}`;
}

/** Full markdown for one example (resource body). */
export function exampleMarkdown(example: PackExample): string {
  return (
    `# Example: ${example.scenario} — ${example.control}\n\n` +
    `Imports: ${example.controls.map(c => `\`${c}\``).join(', ')}\n\n` +
    `\`\`\`html\n${example.template}\n\`\`\``
  );
}

/** Compact one-line listing entry. */
export function controlListLine(control: PackControl): string {
  return `- **${control.className}** (\`${control.selector}\`) — ${control.summary}`;
}

/** Lowercase-normalized haystack for a control (name, class, prose, props). */
export function controlHaystack(control: PackControl): string {
  return [
    control.name,
    control.className,
    control.selector,
    control.summary,
    control.usage,
    ...control.inputs.map(p => `${p.name} ${p.description ?? ''}`),
    ...control.outputs.map(p => `${p.name} ${p.description ?? ''}`),
  ]
    .join(' ')
    .toLowerCase();
}

/** Human list of valid control names, for error messages. */
export function controlNames(pack: KnowledgePack): string {
  return pack.controls.map(c => c.name).join(', ');
}

const STOPWORDS = new Set([
  'a',
  'an',
  'the',
  'with',
  'and',
  'or',
  'for',
  'of',
  'to',
  'in',
  'on',
  'my',
  'that',
  'this',
  'i',
  'want',
  'need',
  'build',
  'create',
  'make',
  'add',
  'using',
  'use',
]);

/** Tokenize a free-text query into meaningful lowercase terms. */
export function queryTerms(query: string): string[] {
  return query
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter(t => t.length >= 2 && !STOPWORDS.has(t));
}

/**
 * Weighted relevance of a control to query terms. An identity hit (the control
 * name / class / selector token) counts far more than a prose hit, so
 * "filterable table" ranks `jig-table` above controls that merely mention
 * filtering in their description.
 */
export function scoreControl(control: PackControl, terms: string[]): number {
  const idTokens = new Set(
    [
      ...control.name.split('-'),
      control.name,
      control.className.toLowerCase(),
      ...control.selector.toLowerCase().split(/[^a-z0-9]+/),
    ].filter(Boolean)
  );
  const summary = control.summary.toLowerCase();
  const haystack = controlHaystack(control);

  let score = 0;
  for (const t of terms) {
    if (
      idTokens.has(t) ||
      control.name.includes(t) ||
      control.className.toLowerCase().includes(t)
    ) {
      score += 10;
    } else if (summary.includes(t)) {
      score += 3;
    } else if (haystack.includes(t)) {
      score += 1;
    }
  }
  return score;
}

/** The kind/color options across built-in themes, optionally scoped to a control. */
export function themeOptionsMarkdown(
  pack: KnowledgePack,
  themeName?: string,
  controlName?: string
): string {
  const themes = themeName
    ? pack.themes.filter(t => t.name === themeName.toLowerCase())
    : pack.themes;
  if (!themes.length) {
    return `Unknown theme "${themeName}". Known built-in themes: ${pack.themes
      .map(t => t.name)
      .join(', ')}.`;
  }

  const key = controlName ? camel(controlName.replace(/^jig-?/, '')) : null;
  const supportsColor = controlName
    ? (pack.themeParts.find(p => p.name === controlName.replace(/^jig-?/, ''))?.supportsColor ??
      false)
    : true;

  const blocks = themes.map(theme => {
    if (key) {
      const kinds = [
        ...new Set(
          Object.keys(theme.kinds)
            .filter(k => k === key || k.startsWith(key))
            .flatMap(k => theme.kinds[k] ?? [])
        ),
      ];
      const parts = [
        `- **kind**: ${kinds.length ? kinds.map(k => `\`${k}\``).join(', ') : '_(none — this control has no themed kinds)_'}`,
        `- **color**: ${supportsColor ? theme.colors.map(c => `\`${c}\``).join(', ') : '_(this control does not accept a color input)_'}`,
      ];
      return `### Theme \`${theme.name}\` — ${controlName}\n\n${parts.join('\n')}`;
    }
    const kindsList = Object.entries(theme.kinds)
      .map(([scope, values]) => `  - \`${scope}\`: ${values.map(v => `\`${v}\``).join(', ')}`)
      .join('\n');
    return (
      `### Theme \`${theme.name}\`\n\n` +
      `**Selectable colors**: ${theme.colors.map(c => `\`${c}\``).join(', ')}\n\n` +
      `**Kinds by control**:\n${kindsList}`
    );
  });

  return (
    `# Theme kind & color options\n\n${blocks.join('\n\n')}\n\n` +
    `> These are the **built-in** themes. Determine which theme the app configures ` +
    `(the \`preset\` in its jig config / \`provideAwdControls\`, or an active \`ThemeService\` theme). ` +
    `For a **custom theme**, the allowed values come from that theme's \`createTheme({ …, kinds, colors })\` ` +
    `and the app's \`AwdCustomTypes\` (\`CustomKind\` / \`CustomColor\`) — read those instead.`
  );
}

// --- Theming -------------------------------------------------------------

/** The token schema + authoring API as markdown. */
export function themeSchemaMarkdown(schema: ThemeSchema): string {
  const scopes = schema.scopes
    .map(
      s =>
        `### \`${s.scope}\` tokens\n\n${s.tokens
          .map(t => `- \`${t}\``)
          .join('\n')}${s.note ? `\n\n${s.note}` : ''}`
    )
    .join('\n\n');
  return `# jig theme token schema\n\n${schema.overview}\n\n## Token scopes\n\n${scopes}`;
}

/** A control's themeable anatomy: own classes + dependency scopes. */
export function themePartMarkdown(part: ThemePart): string {
  const classes = part.classNames.map(c => `- \`c('${c}')\``).join('\n') || '_(none)_';
  const deps = part.dependencies.length
    ? part.dependencies.map(d => `- \`d('${d}', '<class>')\``).join('\n')
    : '_(none)_';
  return (
    `# Theme anatomy: ${part.name}\n\n` +
    `**Scope:** \`${part.scope}\`\n\n` +
    `## Own class names (target with \`c()\`)\n\n${classes}\n\n` +
    `## Dependencies (target with \`d()\`)\n\n${deps}\n`
  );
}

/** A ready-to-edit `createThemePart` skeleton stubbing every class name. */
export function scaffoldThemePart(part: ThemePart): string {
  const camel = part.name.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
  const stubs = part.classNames.map(c => `      \${c('${c}')} {\n      }`).join('\n');
  return (
    `\`\`\`ts\n` +
    `import { createThemePart, css } from '@awdlab/jig-themes/api';\n` +
    `import { ${camel}ControlTemplate } from '@awdlab/jig-themes/templates/${part.name}';\n\n` +
    `export const ${camel}Styles = createThemePart({\n` +
    `  controlTemplate: ${camel}ControlTemplate,\n` +
    `  dependencies: [],\n` +
    `  root: {\n` +
    `    css: ({ v, c, d }) => css\`\n${stubs}\n    \`,\n` +
    `  },\n` +
    `});\n` +
    `\`\`\``
  );
}

// --- Migration -----------------------------------------------------------

function mapTable(title: string, maps: { from: string; to: string; notes?: string }[]): string {
  if (!maps.length) return '';
  const rows = maps
    .map(m => `| \`${m.from}\` | \`${m.to}\` | ${(m.notes ?? '—').replace(/\|/g, '\\|')} |`)
    .join('\n');
  return `\n**${title}**\n\n| From | To | Notes |\n| --- | --- | --- |\n${rows}\n`;
}

/** Full mapping detail for one source component. */
export function migrationComponentMarkdown(source: string, comp: MigrationComponent): string {
  const to = Array.isArray(comp.to) ? comp.to.join(', ') : comp.to;
  const head = `# ${comp.from} → ${to}\n\n_${source}_\n${comp.notes ? `\n${comp.notes}\n` : ''}`;
  const props = mapTable('Props', comp.props ?? []);
  const events = mapTable('Events', comp.events ?? []);
  const gaps = comp.gaps?.length
    ? `\n**Gaps / caveats**\n\n${comp.gaps.map(g => `- ${g}`).join('\n')}\n`
    : '';
  return `${head}${props}${events}${gaps}`;
}

/** Overview of a whole migration: notes + component index. */
export function migrationOverview(m: Migration): string {
  const index = m.components
    .map(c => `- \`${c.from}\` → \`${Array.isArray(c.to) ? c.to.join(', ') : c.to}\``)
    .join('\n');
  return (
    `# Migrating from ${m.label}\n\n${m.notes ? `${m.notes}\n\n` : ''}` +
    `## Component map (${m.components.length})\n\n${index}\n\n` +
    `Use \`map_component("${m.source}", "<name>")\` for full prop/event mappings.`
  );
}

// --- Recipes -------------------------------------------------------------

export function recipeListLine(r: Recipe): string {
  const uses = r.controls.length ? ` _(uses: ${r.controls.join(', ')})_` : '';
  return `- **${r.title}** (\`${r.slug}\`) — ${r.summary}${uses}`;
}
