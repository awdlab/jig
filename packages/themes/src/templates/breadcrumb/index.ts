import { createControlTemplate } from '@awdlab/jig-themes/api';
import { itemViewControlTemplate } from '@awdlab/jig-themes/templates/item-view';
import { menuControlTemplate } from '@awdlab/jig-themes/templates/menu';

export const breadcrumbControlTemplate = createControlTemplate({
  scope: 'breadcrumb',
  classNames: ['root', 'item', 'item-clickable', 'separator', 'overflow'],
  dependencies: [
    { class: 'item-view', template: itemViewControlTemplate },
    { class: 'menu', template: menuControlTemplate },
  ],
});
