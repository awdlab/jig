import { createControlTemplate } from '@ngneers/controls-themes/api';
import { movableDirectiveTemplate } from '@ngneers/controls-themes/templates/api';

export const dialogControlTemplate = createControlTemplate({
  scope: 'dialog',
  classNames: [
    'root',
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
