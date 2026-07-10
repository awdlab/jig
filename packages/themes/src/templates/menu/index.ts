import { createControlTemplate } from '@ngneers/controls-themes/api';
import { popoverControlTemplate } from '@ngneers/controls-themes/templates/popover';

export const menuControlTemplate = createControlTemplate({
  scope: 'menu',
  classNames: ['root', 'submenu', 'item', 'item-opened', 'icon-children', 'separator'],
  dependencies: [{ class: 'popover', template: popoverControlTemplate }],
});
