import { createControlTemplate } from '@awdlab/jig-themes/api';
import { buttonControlTemplate } from '@awdlab/jig-themes/templates/button';

export const toolbarRegionControlTemplate = createControlTemplate({
  scope: 'toolbar-region',
  classNames: ['root', 'item', 'item-overflowing'],
  dependencies: [{ class: 'button', template: buttonControlTemplate, projected: true }],
});
