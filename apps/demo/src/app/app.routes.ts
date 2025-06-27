import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'dialog',
    loadComponent: () =>
      import('./controls/dialog/_all').then((m) => m.Dialog_All_Component),
  },
];
