/**
 * Reads the docs page structure — routes, tabs and the `{{ api: … }}` references
 * that bind a typedoc class to the page documenting it. Shared by the tools that
 * need to link into rendered pages (search index, API links).
 */
import { readFile, readdir } from 'node:fs/promises';
import { join } from 'node:path';

import { safeRoutePath } from '../src/app/utils/routing';

export const DOCS_DIR = join(import.meta.dirname, '../src/app/docs');

/** The typedoc groups the API table renders, and therefore the ones with anchors. */
export const API_GROUPS = new Set(['Inputs', 'Outputs', 'Properties']);

export async function walk(dir: string, match: (path: string) => boolean): Promise<string[]> {
  const found: string[] = [];
  for (const item of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, item.name);
    if (item.isDirectory()) {
      found.push(...(await walk(path, match)));
    } else if (match(path)) {
      found.push(path);
    }
  }
  return found;
}

export type MdTab = {
  /** Path relative to the docs root, as written in `page.ts`. */
  mdFile: string;
  /** Tab title, or the page title for a page that is not tabbed. */
  title: string;
  /** Default tabs render at the page route with no extra segment. */
  isDefault: boolean;
};

export type PageMeta = { pageTitle: string; tabs: MdTab[] };

/**
 * Reads titles and markdown references straight out of a `page.ts`.
 *
 * Route slugs come from titles, never from folder or file names — those disagree
 * (`guides/mcp` renders at `/guides/mcp-server`), so guessing from paths ships
 * dead links. Throws instead of guessing when a title cannot be found.
 */
export async function readPageMeta(pageTs: string): Promise<PageMeta> {
  const source = await readFile(pageTs, 'utf8');
  const pageTitle = /:\s*AwdDocsPage\s*=\s*\{[\s\S]*?title:\s*[`'"](.+?)[`'"]/.exec(source)?.[1];
  if (!pageTitle) {
    throw new Error(`No page title found in ${pageTs}`);
  }

  const tabs: MdTab[] = [];
  for (const match of source.matchAll(/mdFile:\s*[`'"]([^`'"]+)[`'"]/g)) {
    // The enclosing object literal, back to its opening brace: tabs always
    // declare `title` (and `default`) ahead of `mdFile`.
    const object = source.slice(source.lastIndexOf('{', match.index), match.index);
    const title = /title:\s*[`'"](.+?)[`'"]/.exec(object)?.[1] ?? pageTitle;
    tabs.push({
      mdFile: match[1]!,
      title,
      // An untabbed page carries `mdFile` on the page object itself, so its
      // title is the page title and it routes without an extra segment.
      isDefault: title === pageTitle || /default:\s*true/.test(object),
    });
  }
  return { pageTitle, tabs };
}

/** Tab titles from the docs root, so a page's first URL segment can be checked. */
export async function readTabSlugs(): Promise<Set<string>> {
  const source = await readFile(join(DOCS_DIR, 'index.ts'), 'utf8');
  return new Set(
    [...source.matchAll(/^\s*title:\s*[`'"](.+?)[`'"]/gm)].map(m => safeRoutePath(m[1]!))
  );
}

/** Resolves a tab's routes: the tab itself, and the page it belongs to. */
export function tabRoutes(
  pageTitle: string,
  tab: MdTab,
  tabSlugs: Set<string>
): { route: string; pageRoute: string } {
  const area = tab.mdFile.split('/')[0]!;
  if (!tabSlugs.has(area)) {
    throw new Error(`${tab.mdFile} is not under a known docs tab (${[...tabSlugs].join(', ')})`);
  }
  const pageRoute = `${area}/${safeRoutePath(pageTitle)}`;
  return {
    route: tab.isDefault ? pageRoute : `${pageRoute}/${safeRoutePath(tab.title)}`,
    pageRoute,
  };
}

export type ApiRef = {
  module: string;
  className: string;
  /** The API tab itself, where members are documented. */
  route: string;
  /** The control's default tab, where a selector lookup should land. */
  pageRoute: string;
  controlDir: string;
  /** Heading the reference sits under, `null` when it opens the file. */
  heading: string | null;
};

/** Every `{{ api: module Class }}` reference across the docs, with its route. */
export async function collectApiRefs(): Promise<ApiRef[]> {
  const pages = await walk(DOCS_DIR, p => p.endsWith('page.ts'));
  const tabSlugs = await readTabSlugs();
  const refs: ApiRef[] = [];

  for (const pageTs of pages.sort()) {
    const { pageTitle, tabs } = await readPageMeta(pageTs);
    for (const tab of tabs) {
      const { route, pageRoute } = tabRoutes(pageTitle, tab, tabSlugs);
      const raw = await readFile(join(DOCS_DIR, tab.mdFile), 'utf8');
      let heading: string | null = null;
      for (const line of raw.split('\n')) {
        const headingMatch = /^#{1,3}\s+(.+?)\s*$/.exec(line);
        if (headingMatch) {
          heading = headingMatch[1]!;
          continue;
        }
        const api = /{{\s*api:\s*(\S+)\s+(\S+)\s*}}/.exec(line);
        if (api) {
          refs.push({
            module: api[1]!,
            className: api[2]!,
            route,
            pageRoute,
            controlDir: api[1]!.split('/')[0]!,
            heading,
          });
        }
      }
    }
  }

  return refs;
}
