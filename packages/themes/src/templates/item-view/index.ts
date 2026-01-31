import { createControlTemplate } from '@ngneers/controls-themes/api';

export const itemViewControlTemplate = createControlTemplate({
  scope: 'item-view',
  classNames: [
    'root',
    'item',
    'item-overflowing',
    'more-items',
    'more-items-hidden',
    'more-items-default',
    'hidden-separator',
  ],
});
