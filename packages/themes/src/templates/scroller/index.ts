import { createControlTemplate } from '@awdlab/jig-themes/api';

export const scrollerControlTemplate = createControlTemplate({
  scope: 'scroller',
  classNames: ['root', 'virtual', 'item', 'item-sticky'],
});
