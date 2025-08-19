import { createControlTemplate } from '@ngneers/controls-themes/api';

export const scrollerControlTemplate = createControlTemplate({
  scope: 'scroller',
  classNames: ['scrollarea', 'item', 'item-sticky', 'item-sticky-preserved'],
});
