import tablerArrowsSort from '@iconify/icons-tabler/arrows-sort';
import tablerCalendar from '@iconify/icons-tabler/calendar';
import tablerCheck from '@iconify/icons-tabler/check';
import tablerChevronDown from '@iconify/icons-tabler/chevron-down';
import tablerChevronLeft from '@iconify/icons-tabler/chevron-left';
import tablerChevronRight from '@iconify/icons-tabler/chevron-right';
import tablerChevronUp from '@iconify/icons-tabler/chevron-up';
import tablerDots from '@iconify/icons-tabler/dots';
import tablerFilter from '@iconify/icons-tabler/filter';
import tablerFilterFilled from '@iconify/icons-tabler/filter-filled';
import tablerMinus from '@iconify/icons-tabler/minus';
import tablerSearch from '@iconify/icons-tabler/search';
import tablerSortAscending from '@iconify/icons-tabler/sort-ascending';
import tablerSortDescending from '@iconify/icons-tabler/sort-descending';
import tablerX from '@iconify/icons-tabler/x';

import { NGN_CUSTOM_ICONS, NGN_ICON_REGISTRY, type NgnIconRegistry } from '@ngneers/controls/icon';

import type { NgnFeature } from '@ngneers/controls/api/ng';

const NGN_DEFAULT_ICON_REGISTRY: NgnIconRegistry = {
  'accordion-collapse': { icon: tablerChevronUp, scale: 1.71 },
  'accordion-expand': { icon: tablerChevronDown, scale: 1.71 },
  'breadcrumb-separator': { icon: tablerChevronRight, scale: 1.71 },
  'breadcrumb-overflow': { icon: tablerDots, scale: 1.33 },
  'calendar-trigger': { icon: tablerCalendar, scale: 1.14 },
  'calendar-previous-month': { icon: tablerChevronLeft, scale: 1.71 },
  'calendar-next-month': { icon: tablerChevronRight, scale: 1.71 },
  'checkbox-checked': { icon: tablerCheck, scale: 1.41 },
  'checkbox-indeterminate': { icon: tablerMinus, scale: 1.5 },
  'chip-remove': { icon: tablerX, scale: 1.71 },
  'dialog-close': { icon: tablerX, scale: 1.71 },
  'drawer-close': { icon: tablerX, scale: 1.71 },
  'dropdown-toggle': { icon: tablerChevronDown, scale: 1.71 },
  'edit-confirm': { icon: tablerCheck, scale: 1.41 },
  'filter-active': { icon: tablerFilterFilled, scale: 1 },
  'filter-inactive': { icon: tablerFilter, scale: 1.12 },
  'filter-remove': { icon: tablerX, scale: 1.71 },
  'input-clear': { icon: tablerX, scale: 1.71 },
  'menu-submenu': { icon: tablerChevronRight, scale: 1.71 },
  'paginator-previous': { icon: tablerChevronLeft, scale: 1.71 },
  'paginator-next': { icon: tablerChevronRight, scale: 1.71 },
  search: { icon: tablerSearch, scale: 1.2 },
  'sort-neutral': { icon: tablerArrowsSort, scale: 1.2 },
  'sort-ascending': { icon: tablerSortAscending, scale: 1.26 },
  'sort-descending': { icon: tablerSortDescending, scale: 1.26 },
  'table-group-toggle': { icon: tablerChevronRight, scale: 1.71 },
  'tabs-scroll-left': { icon: tablerChevronLeft, scale: 1.71 },
  'tabs-scroll-right': { icon: tablerChevronRight, scale: 1.71 },
  'toast-close': { icon: tablerX, scale: 1.71 },
};

export function withDefaultIcons(): NgnFeature {
  return {
    providers: [
      { provide: NGN_ICON_REGISTRY, useValue: NGN_DEFAULT_ICON_REGISTRY },
      { provide: NGN_CUSTOM_ICONS, useValue: false },
    ],
  };
}
