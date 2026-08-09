import { InjectionToken } from '@angular/core';

import type { IconifyIcon } from '@iconify/types';
import type { AwdFeature } from '@awdlab/jig/api/ng';
import type { IconType, AwdIconEntry } from '@awdlab/jig-custom-types';

export type { AwdIconEntry } from '@awdlab/jig-custom-types';

export const NGN_ICON_KEYS = [
  'accordion-collapse',
  'accordion-expand',
  'breadcrumb-separator',
  'breadcrumb-overflow',
  'calendar-trigger',
  'calendar-previous-month',
  'calendar-next-month',
  'checkbox-checked',
  'checkbox-indeterminate',
  'chip-remove',
  'dialog-close',
  'drawer-close',
  'dropdown-toggle',
  'edit-confirm',
  'filter-active',
  'filter-inactive',
  'filter-remove',
  'hint-info',
  'hint-success',
  'hint-warning',
  'hint-error',
  'input-clear',
  'menu-submenu',
  'paginator-previous',
  'paginator-next',
  'rating-full',
  'rating-empty',
  'search',
  'sort-neutral',
  'sort-ascending',
  'sort-descending',
  'spin-decrement',
  'spin-increment',
  'stepper-completed',
  'table-group-toggle',
  'tabs-scroll-left',
  'tabs-scroll-right',
  'toast-close',
  'snackbar-close',
  'upload-trigger',
  'upload-done',
  'upload-failed',
  'upload-retry',
  'upload-cancel',
  'upload-remove',
] as const;

export type AwdIconKey = (typeof NGN_ICON_KEYS)[number];

export type AwdIconRegistry = Record<AwdIconKey, IconifyIcon | AwdIconEntry>;

export type AwdCustomIconRegistry = Record<AwdIconKey, IconType>;

export const NGN_ICON_REGISTRY = new InjectionToken<AwdIconRegistry | AwdCustomIconRegistry>(
  'NGN_ICON_REGISTRY'
);

export const NGN_CUSTOM_ICONS = new InjectionToken<boolean>('NGN_CUSTOM_ICONS');

export function withCustomIcons(registry: AwdCustomIconRegistry): AwdFeature {
  return {
    providers: [
      { provide: NGN_ICON_REGISTRY, useValue: registry },
      { provide: NGN_CUSTOM_ICONS, useValue: true },
    ],
  };
}
