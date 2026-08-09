import { createControlTemplate } from '@awdlab/jig-themes/api';
import { popoverControlTemplate } from '@awdlab/jig-themes/templates/popover';

export const menuControlTemplate = createControlTemplate({
  scope: 'menu',
  classNames: ['root', 'submenu', 'item', 'item-opened', 'icon-children', 'separator'],
  dependencies: [{ class: 'popover', template: popoverControlTemplate }],
});
