import { createControlTemplate } from '@ngneers/controls-themes/api';
import { popoverControlTemplate } from '@ngneers/controls-themes/templates/popover';

export const menuControlTemplate = createControlTemplate({
  scope: 'menu',
  classNames: ['submenu', 'popover', 'item', 'item-disabled', 'item-opened', 'icon-children'],
  dependencies: [popoverControlTemplate],
});
