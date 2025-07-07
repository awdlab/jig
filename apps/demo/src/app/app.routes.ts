import { Routes } from '@angular/router';

import { allDemos } from './controls/_all';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./playground/playground').then(m => m.PlaygroundComponent),
  },
  {
    path: 'docs',
    loadComponent: () => import('./docs/docs').then(m => m.DocsComponent),
    children: allDemos.map(demo => ({
      path: demo.id,
      loadComponent: () => import('./controls/_base/all').then(m => m.All_Component),
      data: {
        demo,
      },
    })),
  },
];
