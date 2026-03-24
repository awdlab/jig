import { createControlTemplate } from '@ngneers/controls-themes/api';
import { checkboxControlTemplate } from '@ngneers/controls-themes/templates/checkbox';
import { filterControlTemplate } from '@ngneers/controls-themes/templates/filter';
import { iconControlTemplate } from '@ngneers/controls-themes/templates/icon';
import { paginatorControlTemplate } from '@ngneers/controls-themes/templates/paginator';
import { popoverControlTemplate } from '@ngneers/controls-themes/templates/popover';
import { scrollerControlTemplate } from '@ngneers/controls-themes/templates/scroller';

export const tableControlTemplate = createControlTemplate({
  scope: 'table',
  classNames: [
    'root',
    'table',
    'virtual',
    'head',
    'body',
    'cell',
    'row',
    'foot',
    'even',
    'striped',
    'spacer',
    'sort-control',
    'sortable-column',
    'sorted-column',
    'filter-control',
    'filterable-column',
    'filtered-column',
    'resize-handle',
    'resizable',
    'resizing',
    'cell-text',
    'selected-row',
    'selection-checkbox',
    'selection-column',
    'selectable',
    'focused-row',
    'selected-row-cell',
    'focused-row-cell',
    'group-header-row',
    'group-header-cell',
    'group-toggle',
    'group-expanded',
    'reorderable',
    'reordering',
    'drag-source',
    'drop-indicator',
  ],
  dependencies: [
    scrollerControlTemplate,
    iconControlTemplate,
    filterControlTemplate,
    popoverControlTemplate,
    paginatorControlTemplate,
    checkboxControlTemplate,
  ],
});
