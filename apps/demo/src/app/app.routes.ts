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
        path: 'button',
        loadComponent: () =>
          import('./controls/button-demo/_all').then(m => m.Button_All_Component),
      },
      {
        path: 'calendar',
        loadComponent: () =>
          import('./controls/calendar-demo/_all').then(m => m.Calendar_All_Component),
      },
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
      {
        path: 'list-box',
        loadComponent: () =>
          import('./controls/list-box-demo/_all').then(m => m.ListBox_All_Component),
      },
    ],
  },
];
