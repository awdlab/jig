import { NgnDocsFrame } from './frame/frame';
import { Start } from './start/start';
import { TestComponent } from './test';

import type { Routes } from '@angular/router';

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
        // Lazily loaded so the docs pages/demos (most of @ngneers/controls) stay
        // out of the initial bundle — see docs-routes.ts.
        loadChildren: () => import('./docs-routes').then(m => m.docsChildRoutes),
      },
    ],
  },
  {
    path: '**',
    redirectTo: '',
  },
];
