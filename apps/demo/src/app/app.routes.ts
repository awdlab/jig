import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'dialog',
    loadComponent: () => import('./controls/dialog/_all').then(m => m.Dialog_All_Component),
  },
  {
    path: 'popover',
    loadComponent: () => import('./controls/popover/_all').then(m => m.Popover_All_Component),
  },
  {
    path: 'text-field',
    loadComponent: () => import('./controls/text-field/_all').then(m => m.TextField_All_Component),
  },
  {
    path: 'select',
    loadComponent: () => import('./controls/select/_all').then(m => m.Select_All_Component),
  },
];
