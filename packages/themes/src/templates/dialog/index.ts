import { createControlTemplate } from '@awdlab/jig-themes/api';
import { movableDirectiveTemplate } from '@awdlab/jig-themes/templates/api';

export const dialogControlTemplate = createControlTemplate({
  scope: 'dialog',
  classNames: [
    'root',
    'wrapper',
    'modal',
    'header',
    'default-header',
    'content',
    'footer',
    'default-footer',
    'close-button',
  ],
  dependencies: [{ class: 'movable', template: movableDirectiveTemplate, projected: true }],
});
