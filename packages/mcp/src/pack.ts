import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

/**
 * The knowledge pack is the single, self-contained source of truth the server
 * serves at runtime. It is produced at build time by `scripts/build-pack.ts`
 * from the monorepo's generated TypeDoc output + docs markdown, then bundled
 * into the published package (`data/knowledge-pack.json`).
 *
 * The runtime server never touches the monorepo or the network — it only reads
 * this file. That is what makes the server safe to `npx` inside any consumer's
 * repository, under any MCP client.
 */

/** A single input / output / model property of a control. */
export interface PackProp {
  /** Public (aliased) property name, e.g. `iconClose`. */
  name: string;
  /** Rendered TypeScript type, e.g. `boolean` or `'sm' | 'md' | 'lg'`. */
  type: string;
  /** Whether the property is optional (required inputs are `false`). */
  optional: boolean;
  /** `@default` value from TSDoc, if any. */
  default?: string;
  /** Prose description from the property's TSDoc summary. */
  description?: string;
}

/** A documented control or directive. */
export interface PackControl {
  /** Internal control name / docs folder, e.g. `select`. */
  name: string;
  /** Exported class name, e.g. `NgnSelect`. */
  className: string;
  /** `control` or `directive`. */
  kind: 'control' | 'directive';
  /** Best-effort selector, e.g. `awd-select` or `[ngnTooltip]`. */
  selector: string;
  /** One-line summary (first sentence of the docs prose). */
  summary: string;
  /** Full prose usage doc (docs `index.md`, demo placeholders stripped). */
  usage: string;
  inputs: PackProp[];
  outputs: PackProp[];
}

/** A conceptual guide (theming, passthrough, getting started, …). */
export interface PackConcept {
  /** Slug, e.g. `theming-authoring-a-theme`. */
  slug: string;
  /** Human title, e.g. `Authoring a theme`. */
  title: string;
  /** Full markdown body. */
  body: string;
}

/** The themeable anatomy of one control (auto-derived from its theme template). */
export interface ThemePart {
  /** Control name, e.g. `select`. */
  name: string;
  /** Theme scope used by `c()`, e.g. `select`. */
  scope: string;
  /** Class names targetable via `c('<name>')`. */
  classNames: string[];
  /** Scopes of dependency templates, targetable via `d('<scope>', '<class>')`. */
  dependencies: string[];
  /** Whether the control accepts a `color="…"` input (template exposes `color-*`). */
  supportsColor: boolean;
}

/** The kind/color options a specific built-in theme offers. */
export interface ThemeOptions {
  /** Theme name, e.g. `nova`, `shade`. */
  name: string;
  /** Per-control `kind` values, keyed by the theme's (camelCase) scope. */
  kinds: Record<string, string[]>;
  /** The user-selectable `color` values this theme defines. */
  colors: string[];
}

/** A token scope offered by the `v()` function. */
export interface ThemeScope {
  /** Scope prefix, e.g. `color`, `size`. */
  scope: string;
  /** Example token paths, e.g. `color.primary.500`. */
  tokens: string[];
  /** Extra guidance for authors. */
  note?: string;
}

/** The theme token schema + authoring overview (hand-authored). */
export interface ThemeSchema {
  /** Markdown explaining the `createThemePart` authoring API + gotchas. */
  overview: string;
  scopes: ThemeScope[];
}

/** A single source→target property or event mapping. */
export interface MigrationMap {
  from: string;
  to: string;
  notes?: string;
}

/** How one source-library component maps onto awd control(s). */
export interface MigrationComponent {
  /** Source selector/name, e.g. `p-dropdown`. */
  from: string;
  /** Target awd selector(s), e.g. `awd-select`. */
  to: string | string[];
  notes?: string;
  props?: MigrationMap[];
  events?: MigrationMap[];
  /** Source features with no direct awd equivalent — flag, don't fabricate. */
  gaps?: string[];
}

/** A migration guide for one source library (hand-authored). */
export interface Migration {
  /** Slug, e.g. `primeng`. */
  source: string;
  /** Display name, e.g. `PrimeNG`. */
  label: string;
  /** Cross-cutting notes for the whole migration. */
  notes?: string;
  components: MigrationComponent[];
}

/** A composition recipe for feature development (hand-authored). */
export interface Recipe {
  /** Slug, e.g. `filterable-table`. */
  slug: string;
  title: string;
  /** One-line description of what it builds. */
  summary: string;
  /** awd control names this recipe composes. */
  controls: string[];
  /** Full markdown walkthrough. */
  body: string;
}

/** A real, compiled usage example auto-derived from a docs demo. */
export interface PackExample {
  /** Slug, e.g. `select--filter`. */
  slug: string;
  /** Primary control (demo folder), e.g. `select`. */
  control: string;
  /** All awd controls the demo imports. */
  controls: string[];
  /** Human scenario name, e.g. `Filter`. */
  scenario: string;
  /** The demo's inline Angular template. */
  template: string;
}

export interface KnowledgePack {
  /** ISO date the pack was generated (stamped by the build script). */
  generatedAt: string;
  /** Version of the controls library the pack was built from. */
  controlsVersion: string;
  controls: PackControl[];
  concepts: PackConcept[];
  themeParts: ThemePart[];
  themeSchema: ThemeSchema;
  /** Kind/color options per built-in theme (nova, shade). */
  themes: ThemeOptions[];
  migrations: Migration[];
  recipes: Recipe[];
  /** Real usage examples auto-derived from the docs demos. */
  examples: PackExample[];
}

let cached: KnowledgePack | null = null;

/** Load (and memoize) the bundled knowledge pack. */
export function loadPack(): KnowledgePack {
  if (cached) return cached;
  const path = fileURLToPath(new URL('../data/knowledge-pack.json', import.meta.url));
  cached = JSON.parse(readFileSync(path, 'utf-8')) as KnowledgePack;
  return cached;
}
