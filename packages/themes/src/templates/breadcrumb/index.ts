import { createControlTemplate } from '@ngneers/controls-themes/api';
import { itemViewControlTemplate } from '@ngneers/controls-themes/templates/item-view';
import { menuControlTemplate } from '@ngneers/controls-themes/templates/menu';

export const breadcrumbControlTemplate = createControlTemplate({
  scope: 'breadcrumb',
  classNames: ['root', 'item', 'item-clickable', 'separator', 'overflow'],
  dependencies: [
    { class: 'item-view', template: itemViewControlTemplate },
    { class: 'menu', template: menuControlTemplate },
  ],
});
