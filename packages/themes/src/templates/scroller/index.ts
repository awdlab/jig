import { createControlTemplate } from '@ngneers/controls-themes/api';

export const scrollerControlTemplate = createControlTemplate({
  scope: 'scroller',
  classNames: ['root', 'virtual', 'item', 'spacer', 'item-sticky'],
});
