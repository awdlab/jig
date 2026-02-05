import { ALL_DOCS_PAGES } from './docs';
import { NgnDocsFrame } from './frame/frame';
import { NgnDocsMenu } from './frame/menu/menu';
import { Start } from './start/start';
import { TestComponent } from './test';
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
export const routes: Routes = [
  { path: 'test', component: TestComponent },
  {
    path: '',
    component: NgnDocsFrame,
    children: [
      {
        path: '',
        pathMatch: 'full',
        component: Start,
      },
      {
        path: '',
        component: NgnDocsMenu,
        children: getDocsRoutes(ALL_DOCS_PAGES),
      },
    ],
  },
  {
    path: '**',
    redirectTo: '',
  },
];
