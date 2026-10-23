import tablerAlertCircle from '@iconify/icons-tabler/alert-circle.js';
import tablerAlertTriangle from '@iconify/icons-tabler/alert-triangle.js';
import tablerArrowsSort from '@iconify/icons-tabler/arrows-sort.js';
import tablerCalendar from '@iconify/icons-tabler/calendar.js';
import tablerCheck from '@iconify/icons-tabler/check.js';
import tablerChevronDown from '@iconify/icons-tabler/chevron-down.js';
import tablerChevronLeft from '@iconify/icons-tabler/chevron-left.js';
import tablerChevronRight from '@iconify/icons-tabler/chevron-right.js';
import tablerChevronUp from '@iconify/icons-tabler/chevron-up.js';
import tablerCircleCheck from '@iconify/icons-tabler/circle-check.js';
import tablerDots from '@iconify/icons-tabler/dots.js';
import tablerFilter from '@iconify/icons-tabler/filter.js';
import tablerFilterFilled from '@iconify/icons-tabler/filter-filled.js';
import tablerInfoCircle from '@iconify/icons-tabler/info-circle.js';
import tablerMinus from '@iconify/icons-tabler/minus.js';
import tablerRefresh from '@iconify/icons-tabler/refresh.js';
import tablerSearch from '@iconify/icons-tabler/search.js';
import tablerSortAscending from '@iconify/icons-tabler/sort-ascending.js';
import tablerSortDescending from '@iconify/icons-tabler/sort-descending.js';
import tablerStar from '@iconify/icons-tabler/star.js';
import tablerStarFilled from '@iconify/icons-tabler/star-filled.js';
import tablerUpload from '@iconify/icons-tabler/upload.js';
import tablerX from '@iconify/icons-tabler/x.js';

import { JIG_CUSTOM_ICONS, JIG_ICON_REGISTRY, type JigIconRegistry } from '@awdlab/jig/icon';

import type { JigFeature } from '@awdlab/jig/api/ng';

const JIG_DEFAULT_ICON_REGISTRY: JigIconRegistry = {
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
  'hint-info': { icon: tablerInfoCircle, scale: 1.14 },
  'hint-success': { icon: tablerCircleCheck, scale: 1.14 },
  'hint-warning': { icon: tablerAlertTriangle, scale: 1.14 },
  'hint-error': { icon: tablerAlertCircle, scale: 1.14 },
  'input-clear': { icon: tablerX, scale: 1.71 },
  'menu-submenu': { icon: tablerChevronRight, scale: 1.71 },
  'paginator-previous': { icon: tablerChevronLeft, scale: 1.71 },
  'paginator-next': { icon: tablerChevronRight, scale: 1.71 },
  'rating-full': { icon: tablerStarFilled, scale: 1.14 },
  'rating-empty': { icon: tablerStar, scale: 1.14 },
  search: { icon: tablerSearch, scale: 1.2 },
  'sort-neutral': { icon: tablerArrowsSort, scale: 1.2 },
  'sort-ascending': { icon: tablerSortAscending, scale: 1.26 },
  'sort-descending': { icon: tablerSortDescending, scale: 1.26 },
  'spin-decrement': { icon: tablerChevronDown, scale: 1.71 },
  'spin-increment': { icon: tablerChevronUp, scale: 1.71 },
  'stepper-completed': { icon: tablerCheck, scale: 1.41 },
  'table-group-toggle': { icon: tablerChevronRight, scale: 1.71 },
  'tabs-scroll-start': { icon: tablerChevronLeft, scale: 1.71 },
  'tabs-scroll-end': { icon: tablerChevronRight, scale: 1.71 },
  'toast-close': { icon: tablerX, scale: 1.71 },
  'toolbar-overflow': { icon: tablerDots, scale: 1.33 },
  'snackbar-close': { icon: tablerX, scale: 1.71 },
  'upload-trigger': { icon: tablerUpload, scale: 1.14 },
  'upload-done': { icon: tablerCircleCheck, scale: 1.14 },
  'upload-failed': { icon: tablerAlertCircle, scale: 1.14 },
  'upload-retry': { icon: tablerRefresh, scale: 1.33 },
  'upload-cancel': { icon: tablerX, scale: 1.71 },
  'upload-remove': { icon: tablerX, scale: 1.71 },
};

export function withDefaultIcons(): JigFeature {
  return {
    providers: [
      { provide: JIG_ICON_REGISTRY, useValue: JIG_DEFAULT_ICON_REGISTRY },
      { provide: JIG_CUSTOM_ICONS, useValue: false },
    ],
  };
}
