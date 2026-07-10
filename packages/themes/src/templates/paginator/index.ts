import { createControlTemplate } from '@ngneers/controls-themes/api';
import { buttonControlTemplate } from '@ngneers/controls-themes/templates/button';
import { itemViewControlTemplate } from '@ngneers/controls-themes/templates/item-view';

export const paginatorControlTemplate = createControlTemplate({
  scope: 'paginator',
  classNames: ['root', 'page-size-options', 'active-page'],
  dependencies: [
    { class: 'previous', template: buttonControlTemplate },
    { class: 'next', template: buttonControlTemplate },
    { class: 'page-number', template: buttonControlTemplate },
    { class: 'overflow', template: buttonControlTemplate },
    { class: 'item-view', template: itemViewControlTemplate },
  ],
});
