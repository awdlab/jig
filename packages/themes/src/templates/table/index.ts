import { createControlTemplate } from '@ngneers/controls-themes/api';
import { iconControlTemplate } from '@ngneers/controls-themes/templates/icon';

import { scrollerControlTemplate } from '../scroller';

export const tableControlTemplate = createControlTemplate({
  scope: 'table',
  classNames: [
    'table',
    'head',
    'body',
    'cell',
    'row',
    'foot',
    'even',
    'striped',
    'sortable-column',
    'sorted-column',
  ],
  dependencies: [scrollerControlTemplate, iconControlTemplate],
});
