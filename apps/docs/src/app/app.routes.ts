import { JigDocsFrame } from './frame/frame';
import { FrameState } from './frame/frame-state';
import { Start } from './start/start';
import { TestComponent } from './test';

import type { Routes } from '@angular/router';

export const routes: Routes = [
  { path: 'test', component: TestComponent },
  {
    // Unlinked control overview — reachable by direct URL only (not in the
    // docs menu). Lazy so it stays out of the main bundle.
    path: '_gallery',
    loadComponent: () => import('./gallery/gallery').then(m => m.JigDocsGallery),
  },
  {
    path: '',
    component: JigDocsFrame,
    providers: [FrameState],
    children: [
      {
        path: '',
        pathMatch: 'full',
        component: Start,
      },
      {
        path: '',
        // Lazily loaded so the docs pages/demos (most of @awdlab/jig) stay
        // out of the initial bundle — see docs-routes.ts.
        loadChildren: () => import('./docs-routes').then(m => m.docsChildRoutes),
      },
    ],
  },
];
