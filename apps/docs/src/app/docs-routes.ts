import { ALL_DOCS_TABS } from './docs';
import { AwdDocsMenu } from './frame/menu/menu';
import { AwdDocsPageRenderer } from './utils/page/page-renderer/page-renderer';
import { AwdDocsPageTabRenderer } from './utils/page/page-renderer/page-tab-renderer/page-tab-renderer';
import { safeRoutePath } from './utils/routing';

import type { AwdDocsPage, AwdDocsTab } from './utils/page/types';
import type { Route, Routes } from '@angular/router';

/**
 * Builds the leaf route for a single page. Groups are visual-only, so every
 * page routes directly under its {@link AwdDocsTab} — `/{tab}/{page}`.
 */
function getPageRoute(page: AwdDocsPage, tab: AwdDocsTab): Route {
  if (page.kind === 'tabs') {
    return {
      path: safeRoutePath(page.title),
      data: { page, tab },
      component: AwdDocsPageTabRenderer,
      children: page.tabs.map(t => ({
        path: t.default ? '' : safeRoutePath(t.title),
        data: { page, tab },
        component: AwdDocsPageTabRenderer, // Dummy: handled by parent, never used
      })),
    };
  } else if (page.kind === 'single') {
    return {
      path: safeRoutePath(page.title),
      component: AwdDocsPageRenderer,
      data: { page, tab },
    };
  } else if (page.kind === 'component') {
    // A page that renders itself — used where the content is not markdown
    // (e.g. the changelog, which is fetched at runtime).
    return {
      path: safeRoutePath(page.title),
      component: page.component,
      data: { page, tab },
    };
  }
  throw new Error(`Unroutable page kind: ${(page as { kind: string }).kind}`);
}

function getTabRoutes(tabs: AwdDocsTab[]): Routes {
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
 * demos and playgrounds (and therefore most of `@awdlab/jig`). Keeping
 * them behind `loadChildren` from {@link routes} keeps that whole graph out of
 * the initial bundle — it loads on the first navigation into the docs, not on
 * the landing page.
 */
export const docsChildRoutes: Routes = [
  {
    path: '',
    component: AwdDocsMenu,
    children: [
      ...getTabRoutes(ALL_DOCS_TABS),
      {
        path: '',
        pathMatch: 'full',
        redirectTo: safeRoutePath(ALL_DOCS_TABS[0]?.title || ''),
      },
      // Anything else under the docs shell: render the 404 in place, so the
      // sidebar, search and theme picker stay available.
      {
        path: '**',
        loadComponent: () => import('./not-found/not-found').then(m => m.AwdDocsNotFound),
      },
    ],
  },
];
