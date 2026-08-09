/**
 * Resolves `{@link …}` tags in the generated `typedoc.json` to docs URLs.
 *
 * Runs from `prepare-docs`, after `api-docs:generate`. TypeDoc resolves a link
 * to a reflection id, which says nothing about where that reflection is
 * documented — so every tag is rewritten to a string `target` holding the full
 * URL of the page (and API-table row) that renders it. Tags pointing at
 * undocumented symbols keep their id and render as plain code in the table.
 */
import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

import { safeRoutePath } from '../src/app/utils/routing';
import { API_GROUPS, collectApiRefs, DOCS_DIR } from './docs-pages';

const TYPEDOC_JSON = join(DOCS_DIR, '_generated/typedoc.json');

type Node = {
  id?: number;
  name?: string;
  variant?: string;
  kind?: number;
  children?: Node[];
  groups?: { title: string; children: number[] }[];
  [key: string]: unknown;
};

type InlineTag = {
  kind: 'inline-tag';
  tag: string;
  text: string;
  target?: number | string | object;
};

/** `ReflectionKind.Class` — the nodes a `{@link}` name can address by itself. */
const KIND_CLASS = 128;
const KIND_INTERFACE = 256;

function isNode(value: unknown): value is Node {
  return !!value && typeof value === 'object';
}

/** Every reflection id mapped to the id of its declaring parent. */
function indexParents(project: Node): Map<number, number> {
  const parentOf = new Map<number, number>();

  (function visit(node: Node, parentId?: number) {
    let ownId = parentId;
    if (typeof node.id === 'number' && typeof node.variant === 'string') {
      if (parentId !== undefined) {
        parentOf.set(node.id, parentId);
      }
      ownId = node.id;
    }
    for (const value of Object.values(node)) {
      if (Array.isArray(value)) {
        value.filter(isNode).forEach(child => visit(child, ownId));
      } else if (isNode(value)) {
        visit(value, ownId);
      }
    }
  })(project);

  return parentOf;
}

type LinkTargets = {
  /** Reflection id → URL of the page (and row) documenting it. */
  byId: Map<number, string>;
  /** `Class` and `Class.member` → the same URLs, for links TypeDoc left unresolved. */
  byName: Map<string, string>;
};

/**
 * Maps documented classes and their API-table rows to URLs. Row anchors mirror
 * the ids the table renders (`Inputs_checkbox`).
 */
async function collectLinkTargets(project: Node): Promise<LinkTargets> {
  const byId = new Map<number, string>();
  const byName = new Map<string, string>();

  for (const ref of await collectApiRefs()) {
    const module = project.children?.find(child => child.name === ref.module);
    const control = module?.children?.find(child => child.name === ref.className);
    if (!control) {
      console.warn(`[api-links] no typedoc for ${ref.module} ${ref.className}`);
      continue;
    }

    // The heading above the reference is the class section on the rendered page.
    const classUrl = ref.heading ? `/${ref.route}#${safeRoutePath(ref.heading)}` : `/${ref.route}`;
    if (control.id !== undefined) {
      byId.set(control.id, classUrl);
    }
    byName.set(ref.className, classUrl);

    const members = new Map((control.children ?? []).map(child => [child.id, child]));
    for (const group of control.groups ?? []) {
      if (!API_GROUPS.has(group.title)) {
        continue;
      }
      for (const id of group.children) {
        const member = members.get(id);
        if (!member?.name) {
          continue;
        }
        const url = `/${ref.route}#${group.title}_${member.name}`;
        byId.set(id, url);
        byName.set(`${ref.className}.${member.name}`, url);
      }
    }
  }

  return { byId, byName };
}

/**
 * Walks up from `id` to the nearest documented reflection: a member resolves to
 * its own row, anything else (a method, a private field) to its class page.
 */
function urlForId(id: number, targets: LinkTargets, parentOf: Map<number, number>): string | null {
  let current: number | undefined = id;
  while (current !== undefined) {
    const url = targets.byId.get(current);
    if (url) {
      return url;
    }
    current = parentOf.get(current);
  }
  return null;
}

/**
 * Resolves a link, preferring what its text names over the id TypeDoc picked:
 * a bare name means the class being documented (TypeDoc happily resolves such a
 * link to an inherited twin on some unrelated class), and a name TypeDoc failed
 * to resolve at all still addresses a documented symbol most of the time.
 */
function urlForTag(
  tag: InlineTag,
  ownerClass: string | null,
  targets: LinkTargets,
  parentOf: Map<number, number>
): string | null {
  // `{@link import('./x').AwdY}` — the import wrapper is noise here.
  const name = tag.text.replace(/^import\([^)]*\)\./, '').trim();
  const [holder, member] = name.split(/[.#]/);
  const byId = typeof tag.target === 'number' ? urlForId(tag.target, targets, parentOf) : null;
  const own = ownerClass ? targets.byName.get(`${ownerClass}.${name}`) : undefined;

  const url = member
    ? (targets.byName.get(`${holder}.${member}`) ?? byId ?? targets.byName.get(holder!))
    : (own ?? byId ?? targets.byName.get(name));

  // A bare page link to the page the comment is already on scrolls nowhere.
  return !url || url === (ownerClass && targets.byName.get(ownerClass)) ? null : url;
}

async function run(): Promise<void> {
  const project = JSON.parse(await readFile(TYPEDOC_JSON, 'utf8')) as Node;
  const parentOf = indexParents(project);
  const targets = await collectLinkTargets(project);

  let resolved = 0;
  const unresolved: string[] = [];

  (function visit(node: Node, ownerClass: string | null) {
    if (node.kind === KIND_CLASS || node.kind === KIND_INTERFACE) {
      ownerClass = node.name ?? ownerClass;
    }
    for (const value of Object.values(node)) {
      const children = Array.isArray(value) ? value : [value];
      for (const child of children) {
        if (!isNode(child)) {
          continue;
        }
        const tag = child as unknown as InlineTag;
        if (tag.kind === 'inline-tag') {
          if (typeof tag.target === 'string') {
            resolved++;
            continue;
          }
          const url = urlForTag(tag, ownerClass, targets, parentOf);
          if (url) {
            tag.target = url;
            resolved++;
          } else if (ownerClass && targets.byName.has(ownerClass)) {
            // Only classes with a page: an unresolved link there is one a reader
            // actually sees, everything else never reaches the API table.
            unresolved.push(`${ownerClass} → ${tag.text}`);
          }
          continue;
        }
        visit(child, ownerClass);
      }
    }
  })(project, null);

  await writeFile(TYPEDOC_JSON, JSON.stringify(project));

  console.log(
    `[api-links] ${resolved} links resolved, ${unresolved.length} left as plain text on documented pages`
  );
  for (const name of [...new Set(unresolved)].sort()) {
    console.log(`[api-links]   ${name}`);
  }
}

await run();
