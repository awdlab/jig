import { createControlTemplate } from '@ngneers/controls-themes/api';

import { scrollerControlTemplate } from '../scroller';

export const tableControlTemplate = createControlTemplate({
  scope: 'table',
  classNames: ['table', 'head', 'body', 'cell', 'row', 'foot', 'even', 'striped'],
  dependencies: [scrollerControlTemplate],
});
