import { Route, Routes } from '@angular/router';

import { ALL_DOCS_PAGES } from './docs';
import { NgnDocsPageRenderer } from './utils/page/page-renderer/page-renderer';
import { NgnDocsPageTabRenderer } from './utils/page/page-renderer/page-tab-renderer/page-tab-renderer';
import { NgnDocsPage } from './utils/page/types';
import { safeRoutePath } from './utils/routing';

function getDocsRoutes(pages: NgnDocsPage[]): Routes {
  const routes = pages.map(page => {
    if (page.kind === 'tabs') {
      const route: Route = {
        path: safeRoutePath(page.title),
        data: { page },
        component: NgnDocsPageTabRenderer,
        children: page.tabs.map(tab => ({
          path: tab.default ? '' : safeRoutePath(tab.title),
          data: { page },
          component: NgnDocsPageTabRenderer, // Dummy: is handled by parent and never used
        })),
      };
      return route;
    } else if (page.kind === 'single') {
      return {
        path: safeRoutePath(page.title),
        component: NgnDocsPageRenderer,
        data: { page },
      };
    } else if (page.kind === 'category') {
      return {
        path: safeRoutePath(page.title),
        children: getDocsRoutes(page.pages),
      };
    } else {
      throw new Error(`Unknown page kind: ${(page as any).kind}`);
    }
  });
  return routes;
}
export const routes: Routes = [
  {
    path: 'docs',
    children: getDocsRoutes(ALL_DOCS_PAGES),
  },
];
