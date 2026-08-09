import { createControlTemplate } from '@awdlab/jig-themes/api';
import { buttonControlTemplate } from '@awdlab/jig-themes/templates/button';
import { toggleButtonControlTemplate } from '@awdlab/jig-themes/templates/toggle-button';

export const buttonGroupControlTemplate = createControlTemplate({
  scope: 'button-group',
  classNames: ['root', 'vertical', 'horizontal'],
  dependencies: [
    { class: 'button', template: buttonControlTemplate, projected: true },
    { class: 'toggle-button', template: toggleButtonControlTemplate, projected: true },
  ],
});
