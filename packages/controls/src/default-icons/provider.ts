import tablerAlertCircle from '@iconify/icons-tabler/alert-circle';
import tablerAlertTriangle from '@iconify/icons-tabler/alert-triangle';
import tablerArrowsSort from '@iconify/icons-tabler/arrows-sort';
import tablerCalendar from '@iconify/icons-tabler/calendar';
import tablerCheck from '@iconify/icons-tabler/check';
import tablerChevronDown from '@iconify/icons-tabler/chevron-down';
import tablerChevronLeft from '@iconify/icons-tabler/chevron-left';
import tablerChevronRight from '@iconify/icons-tabler/chevron-right';
import tablerChevronUp from '@iconify/icons-tabler/chevron-up';
import tablerCircleCheck from '@iconify/icons-tabler/circle-check';
import tablerDots from '@iconify/icons-tabler/dots';
import tablerFilter from '@iconify/icons-tabler/filter';
import tablerFilterFilled from '@iconify/icons-tabler/filter-filled';
import tablerInfoCircle from '@iconify/icons-tabler/info-circle';
import tablerMinus from '@iconify/icons-tabler/minus';
import tablerRefresh from '@iconify/icons-tabler/refresh';
import tablerSearch from '@iconify/icons-tabler/search';
import tablerSortAscending from '@iconify/icons-tabler/sort-ascending';
import tablerSortDescending from '@iconify/icons-tabler/sort-descending';
import tablerStar from '@iconify/icons-tabler/star';
import tablerStarFilled from '@iconify/icons-tabler/star-filled';
import tablerUpload from '@iconify/icons-tabler/upload';
import tablerX from '@iconify/icons-tabler/x';

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
  'tabs-scroll-left': { icon: tablerChevronLeft, scale: 1.71 },
  'tabs-scroll-right': { icon: tablerChevronRight, scale: 1.71 },
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
