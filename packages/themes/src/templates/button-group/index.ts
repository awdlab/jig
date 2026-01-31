import { createControlTemplate } from '@ngneers/controls-themes/api';
import { buttonControlTemplate } from '@ngneers/controls-themes/templates/button';

export const buttonGroupControlTemplate = createControlTemplate({
  scope: 'button-group',
  classNames: ['root', 'vertical', 'horizontal'],
  dependencies: [buttonControlTemplate],
});
