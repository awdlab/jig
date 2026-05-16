import { InjectionToken } from '@angular/core';

import type { IconifyIcon } from '@iconify/types';
import type { NgnFeature } from '@ngneers/controls/api/ng';
import type { IconType, NgnIconEntry } from '@ngneers/controls-custom-types';

export type { NgnIconEntry } from '@ngneers/controls-custom-types';

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
  'input-clear',
  'menu-submenu',
  'paginator-previous',
  'paginator-next',
  'search',
  'sort-neutral',
  'sort-ascending',
  'sort-descending',
  'table-group-toggle',
  'tabs-scroll-left',
  'tabs-scroll-right',
  'toast-close',
] as const;

export type NgnIconKey = (typeof NGN_ICON_KEYS)[number];

export type NgnIconRegistry = Record<NgnIconKey, IconifyIcon | NgnIconEntry>;

export type NgnCustomIconRegistry = Record<NgnIconKey, IconType>;

export const NGN_ICON_REGISTRY = new InjectionToken<NgnIconRegistry | NgnCustomIconRegistry>(
  'NGN_ICON_REGISTRY'
);

export const NGN_CUSTOM_ICONS = new InjectionToken<boolean>('NGN_CUSTOM_ICONS');

export function withCustomIcons(registry: NgnCustomIconRegistry): NgnFeature {
  return {
    providers: [
      { provide: NGN_ICON_REGISTRY, useValue: registry },
      { provide: NGN_CUSTOM_ICONS, useValue: true },
    ],
  };
}
