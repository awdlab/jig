import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./playground/playground').then(m => m.PlaygroundComponent),
  },
  {
    path: 'docs',
    loadComponent: () => import('./docs/docs').then(m => m.DocsComponent),
    children: [
      {
        path: 'dialog',
        loadComponent: () =>
          import('./controls/dialog-demo/_all').then(m => m.Dialog_All_Component),
      },
      {
        path: 'popover',
        loadComponent: () =>
          import('./controls/popover-demo/_all').then(m => m.Popover_All_Component),
      },
      {
        path: 'text-field',
        loadComponent: () =>
          import('./controls/text-field-demo/_all').then(m => m.TextField_All_Component),
      },
      {
        path: 'select',
        loadComponent: () =>
          import('./controls/select-demo/_all').then(m => m.Select_All_Component),
      },
    ],
  },
];
