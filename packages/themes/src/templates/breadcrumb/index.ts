import { createControlTemplate } from '@ngneers/controls-themes/api';
import { itemViewControlTemplate } from '@ngneers/controls-themes/templates/item-view';
import { menuControlTemplate } from '@ngneers/controls-themes/templates/menu';

export const breadcrumbControlTemplate = createControlTemplate({
  scope: 'breadcrumb',
  classNames: ['item', 'item-clickable', 'separator', 'overflow'],
  dependencies: [itemViewControlTemplate, menuControlTemplate],
});
