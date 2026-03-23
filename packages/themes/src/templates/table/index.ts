import { createControlTemplate } from '@ngneers/controls-themes/api';
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
  ],
});
