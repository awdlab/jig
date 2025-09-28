import { createControlTemplate } from '@ngneers/controls-themes/api';

export const itemViewControlTemplate = createControlTemplate({
  scope: 'item-view',
  classNames: ['item', 'item-overflowing', 'more-items', 'more-items-default', 'hidden-separator'],
});
