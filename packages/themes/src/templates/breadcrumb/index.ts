import { createControlTemplate } from '@ngneers/controls-themes/api';
import { itemViewControlTemplate } from '@ngneers/controls-themes/templates/item-view';

export const breadcrumbControlTemplate = createControlTemplate({
  scope: 'breadcrumb',
  classNames: ['item', 'item-clickable', 'separator', 'overflow'],
  dependencies: [itemViewControlTemplate],
});
