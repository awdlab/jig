/**
 * Builds the docs search index: every markdown section and every documented API
 * member, embedded with the same `potion` runtime the browser uses.
 *
 * Runs from `prepare-docs`, after `api-docs:generate` — it reads that step's
 * `typedoc.json`. Outputs are gitignored, as is the model blob under
 * `public/search/model` that `quantize-potion.ts` produces just before this runs.
 */
import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

import { decodePotion, embed } from '../src/app/utils/search/potion';
import { safeRoutePath } from '../src/app/utils/routing';
import {
  API_GROUPS,
  collectApiRefs,
  DOCS_DIR,
  readPageMeta,
  readTabSlugs,
  tabRoutes,
  walk,
} from './docs-pages';

import type { ApiRef } from './docs-pages';
import type { PotionModel } from '../src/app/utils/search/potion';
import type { SearchEntry, SearchIndex, SearchName } from '../src/app/utils/search/types';

const CONTROLS_DIR = join(import.meta.dirname, '../../../packages/controls/src');
const MODEL_DIR = join(import.meta.dirname, '../public/search/model');
const OUT_DIR = join(import.meta.dirname, '../public/search');

/** Chars of prose kept per entry for the result list. */
const SNIPPET_LENGTH = 180;

/** Strips fenced code — identifiers embed as noise, and `names` covers them. */
function stripFences(md: string): string {
  return md.replace(/^```[\s\S]*?^```/gm, '');
}

/**
 * Inlines `{{ include: … }}` and drops every other `{{ … }}` directive. Includes
 * must land in place: the browser slugs headings across the whole rendered page,
 * so an injected heading shifts the duplicate counters after it.
 */
async function expandDirectives(md: string, chain: readonly string[] = []): Promise<string> {
  const includes = [...md.matchAll(/{{\s*include:\s*([^}]+?)\s*}}/g)];
  let expanded = md;
  for (const [directive, path] of includes) {
    const file = path!.trim();
    if (chain.includes(file)) {
      throw new Error(`Circular {{ include: }}: ${[...chain, file].join(' → ')}`);
    }
    const included = await expandDirectives(await readFile(join(DOCS_DIR, file), 'utf8'), [
      ...chain,
      file,
    ]);
    // Replacement function, so `$&` and friends in the included markdown stay literal.
    expanded = expanded.replace(directive, () => included);
  }
  return expanded.replace(/{{\s*[a-zA-Z0-9_-]+\s*:[^}]+}}/g, '');
}

type Section = { heading: string; anchor: string; body: string };

/**
 * Splits markdown at its `h1`–`h3` headings, mirroring the slugs the page
 * renderer assigns so anchors line up. Prose before the first heading becomes a
 * leading section with an empty anchor.
 */
function splitSections(md: string): Section[] {
  const sections: Section[] = [{ heading: '', anchor: '', body: '' }];
  const used = new Set<string>();

  for (const line of md.split('\n')) {
    const heading = /^(#{1,3})\s+(.+?)\s*$/.exec(line);
    if (!heading) {
      sections.at(-1)!.body += `${line}\n`;
      continue;
    }
    const text = heading[2]!.trim();
    const base = safeRoutePath(text) || 'section';
    let anchor = base;
    let n = 1;
    while (used.has(anchor)) {
      anchor = `${base}-${n++}`;
    }
    used.add(anchor);
    sections.push({ heading: text, anchor, body: '' });
  }

  return sections;
}

/** Collapses markdown noise into plain prose for embedding and display. */
function toProse(md: string): string {
  return md
    .replace(/^[\s|:-]*$/gm, '')
    .replace(/!?\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/[`*_>|]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

async function collectMarkdown(): Promise<SearchEntry[]> {
  const pages = await walk(DOCS_DIR, p => p.endsWith('page.ts'));
  const tabSlugs = await readTabSlugs();
  const entries: SearchEntry[] = [];

  for (const pageTs of pages.sort()) {
    const { pageTitle, tabs } = await readPageMeta(pageTs);

    for (const tab of tabs) {
      const { route } = tabRoutes(pageTitle, tab, tabSlugs);
      const section = tab.isDefault ? '' : tab.title;
      const raw = await readFile(join(DOCS_DIR, tab.mdFile), 'utf8');

      for (const chunk of splitSections(stripFences(await expandDirectives(raw)))) {
        const prose = toProse(chunk.body);
        if (!prose && !chunk.heading) {
          continue;
        }
        entries.push({
          kind: 'doc',
          route,
          anchor: chunk.anchor,
          heading: chunk.heading || pageTitle,
          page: pageTitle,
          section,
          snippet: prose.slice(0, SNIPPET_LENGTH),
        });
      }
    }
  }

  return entries;
}

type TypedocNode = {
  id: number;
  name: string;
  children?: TypedocNode[];
  groups?: { title: string; children: number[] }[];
  comment?: { summary?: { text?: string }[] };
};

function commentText(node: TypedocNode): string {
  return (node.comment?.summary ?? [])
    .map(part => part.text ?? '')
    .join('')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Every documented input/output/property, as its own searchable entry. */
async function collectApi(
  apiRefs: ApiRef[]
): Promise<{ entries: SearchEntry[]; names: SearchName[] }> {
  const project = JSON.parse(
    await readFile(join(DOCS_DIR, '_generated/typedoc.json'), 'utf8')
  ) as TypedocNode;
  const entries: SearchEntry[] = [];
  const names: SearchName[] = [];

  for (const ref of apiRefs) {
    const module = project.children?.find(child => child.name === ref.module);
    const control = module?.children?.find(child => child.name === ref.className);
    if (!control) {
      console.warn(`[search] no typedoc for ${ref.module} ${ref.className}`);
      continue;
    }
    names.push({ name: ref.className, route: ref.route, anchor: '', kind: 'class' });

    const byId = new Map((control.children ?? []).map(child => [child.id, child]));
    for (const group of control.groups ?? []) {
      // Only the groups the API table actually renders — anything else has no
      // row, and therefore no anchor to link to.
      if (!API_GROUPS.has(group.title)) {
        continue;
      }
      for (const id of group.children) {
        const member = byId.get(id);
        if (!member) {
          continue;
        }
        // Matches the row ids the API table renders (`Inputs_checkbox`).
        const anchor = `${group.title}_${member.name}`;
        const summary = commentText(member);
        entries.push({
          kind: 'api',
          route: ref.route,
          anchor,
          heading: member.name,
          page: ref.className,
          section: `${ref.className} · ${group.title}`,
          snippet: summary.slice(0, SNIPPET_LENGTH),
        });
        names.push({ name: member.name, route: ref.route, anchor, kind: 'member' });
      }
    }
  }

  return { entries, names };
}

/** Element and attribute selectors, read from the control sources verbatim. */
async function collectSelectors(apiRefs: ApiRef[]): Promise<SearchName[]> {
  const routeByDir = new Map(apiRefs.map(ref => [ref.controlDir, ref.pageRoute]));
  const names: SearchName[] = [];

  for (const dir of routeByDir.keys()) {
    const route = routeByDir.get(dir)!;
    let sources: string[];
    try {
      sources = await walk(join(CONTROLS_DIR, dir), p => p.endsWith('.ts'));
    } catch {
      continue;
    }
    for (const source of sources) {
      const code = await readFile(source, 'utf8');
      for (const [, selector] of code.matchAll(/^\s*selector:\s*'([^']+)'/gm)) {
        for (const single of selector!.split(',')) {
          // Attribute directives are written against their host element
          // (`button[ngnButton]`); people search for the attribute, not the host.
          const attribute = /\[([^\]]+)\]/.exec(single);
          const name = (attribute?.[1] ?? single).trim();
          if (name && !names.some(existing => existing.name === name)) {
            names.push({ name, route, anchor: '', kind: 'selector' });
          }
        }
      }
    }
  }

  return names;
}

async function loadModel(): Promise<PotionModel> {
  const [blob, vocabTxt] = await Promise.all([
    readFile(join(MODEL_DIR, 'potion.i8.bin')),
    readFile(join(MODEL_DIR, 'vocab.txt'), 'utf8'),
  ]);
  return decodePotion(
    blob.buffer.slice(blob.byteOffset, blob.byteOffset + blob.byteLength) as ArrayBuffer,
    vocabTxt
  );
}

/**
 * Packs two int8 vectors per entry — heading then body. Heading and body are
 * scored separately so a matching headline can outweigh matching prose; a single
 * blended vector cannot express that.
 */
function packVectors(model: PotionModel, entries: SearchEntry[]): Uint8Array {
  const { dim } = model;
  const packed = new Int8Array(entries.length * 2 * dim);

  entries.forEach((entry, index) => {
    const heading = embed(model, `${entry.page} ${entry.section} ${entry.heading}`);
    const body = embed(model, entry.snippet || entry.heading);
    for (let d = 0; d < dim; d++) {
      packed[index * 2 * dim + d] = Math.round((heading[d] ?? 0) * 127);
      packed[index * 2 * dim + dim + d] = Math.round((body[d] ?? 0) * 127);
    }
  });

  return new Uint8Array(packed.buffer);
}

async function main() {
  const model = await loadModel();
  const mdEntries = await collectMarkdown();
  const apiRefs = await collectApiRefs();
  const { entries: apiEntries, names: apiNames } = await collectApi(apiRefs);
  const selectors = await collectSelectors(apiRefs);

  const entries = [...mdEntries, ...apiEntries];
  const index: SearchIndex = {
    dim: model.dim,
    entries,
    names: [...selectors, ...apiNames],
  };

  const vectors = packVectors(model, entries);
  await writeFile(join(OUT_DIR, 'index.json'), JSON.stringify(index));
  await writeFile(join(OUT_DIR, 'vectors.bin'), vectors);

  console.log(
    `[search] ${mdEntries.length} sections + ${apiEntries.length} API members, ` +
      `${index.names.length} exact names, ${(vectors.length / 1024).toFixed(0)}KB of vectors`
  );
}

await main();
