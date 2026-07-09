import { ALL_DOCS_TABS } from './docs';
import { NgnDocsMenu } from './frame/menu/menu';
import { NgnDocsPageRenderer } from './utils/page/page-renderer/page-renderer';
import { NgnDocsPageTabRenderer } from './utils/page/page-renderer/page-tab-renderer/page-tab-renderer';
import { safeRoutePath } from './utils/routing';

import type { NgnDocsPage, NgnDocsTab } from './utils/page/types';
import type { Route, Routes } from '@angular/router';

/**
 * Builds the leaf route for a single page. Groups are visual-only, so every
 * page routes directly under its {@link NgnDocsTab} — `/{tab}/{page}`.
 */
function getPageRoute(page: NgnDocsPage, tab: NgnDocsTab): Route {
  if (page.kind === 'tabs') {
    return {
      path: safeRoutePath(page.title),
      data: { page, tab },
      component: NgnDocsPageTabRenderer,
      children: page.tabs.map(t => ({
        path: t.default ? '' : safeRoutePath(t.title),
        data: { page, tab },
        component: NgnDocsPageTabRenderer, // Dummy: handled by parent, never used
      })),
    };
  } else if (page.kind === 'single') {
    return {
      path: safeRoutePath(page.title),
      component: NgnDocsPageRenderer,
      data: { page, tab },
    };
  }
  throw new Error(`Unroutable page kind: ${(page as { kind: string }).kind}`);
}

function getTabRoutes(tabs: NgnDocsTab[]): Routes {
  return tabs.map(tab => {
    const pages = tab.groups.flatMap(group => group.pages);
    return <Route>{
      path: safeRoutePath(tab.title),
      children: [
        ...pages.map(page => getPageRoute(page, tab)),
        {
          path: '',
          pathMatch: 'full',
          redirectTo: safeRoutePath(pages[0]?.title || ''),
        },
      ],
    };
  });
}

/**
 * The docs menu + all guide/component pages, split into a lazily loaded chunk.
 *
 * These routes pull in `ALL_DOCS_TABS`, which statically imports every page's
 * demos and playgrounds (and therefore most of `@ngneers/controls`). Keeping
 * them behind `loadChildren` from {@link routes} keeps that whole graph out of
 * the initial bundle — it loads on the first navigation into the docs, not on
 * the landing page.
 */
export const docsChildRoutes: Routes = [
  {
    path: '',
    component: NgnDocsMenu,
    children: [
      ...getTabRoutes(ALL_DOCS_TABS),
      {
        path: '',
        pathMatch: 'full',
        redirectTo: safeRoutePath(ALL_DOCS_TABS[0]?.title || ''),
      },
    ],
  },
];
