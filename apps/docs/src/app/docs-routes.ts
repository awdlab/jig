import { ALL_DOCS_PAGES } from './docs';
import { NgnDocsMenu } from './frame/menu/menu';
import { NgnDocsPageRenderer } from './utils/page/page-renderer/page-renderer';
import { NgnDocsPageTabRenderer } from './utils/page/page-renderer/page-tab-renderer/page-tab-renderer';
import { safeRoutePath } from './utils/routing';

import type { NgnDocsCategory, NgnDocsPage } from './utils/page/types';
import type { Route, Routes } from '@angular/router';

function getDocsRoutes(pages: NgnDocsPage[], category?: NgnDocsCategory): Routes {
  const routes = pages.map(page => {
    if (page.kind === 'tabs') {
      const route: Route = {
        path: safeRoutePath(page.title),
        data: { page, category },
        component: NgnDocsPageTabRenderer,
        children: page.tabs.map(tab => ({
          path: tab.default ? '' : safeRoutePath(tab.title),
          data: { page, category },
          component: NgnDocsPageTabRenderer, // Dummy: is handled by parent and never used
        })),
      };
      return route;
    } else if (page.kind === 'single') {
      return {
        path: safeRoutePath(page.title),
        component: NgnDocsPageRenderer,
        data: { page, category },
      };
    } else if (page.kind === 'category') {
      return <Route>{
        path: safeRoutePath(page.title),
        children: [
          ...getDocsRoutes(page.pages, page),
          {
            path: '',
            pathMatch: 'full',
            redirectTo: safeRoutePath(page.pages[0]?.title || ''),
          },
        ],
      };
    } else {
      throw new Error(`Unknown page kind: ${(page as any).kind}`);
    }
  });
  return routes;
}

/**
 * The docs menu + all component/theme pages, split into a lazily loaded chunk.
 *
 * These routes pull in `ALL_DOCS_PAGES`, which statically imports every page's
 * demos and playgrounds (and therefore most of `@ngneers/controls`). Keeping
 * them behind `loadChildren` from {@link routes} keeps that whole graph out of
 * the initial bundle — it loads on the first navigation into the docs, not on
 * the landing page.
 */
export const docsChildRoutes: Routes = [
  {
    path: '',
    component: NgnDocsMenu,
    children: getDocsRoutes(ALL_DOCS_PAGES),
  },
];
