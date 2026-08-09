import { createControlTemplate } from '@awdlab/jig-themes/api';
import { buttonGroupControlTemplate } from '@awdlab/jig-themes/templates/button-group';
import { toggleButtonControlTemplate } from '@awdlab/jig-themes/templates/toggle-button';

export const selectButtonControlTemplate = createControlTemplate({
  scope: 'select-button',
  classNames: ['root', 'invalid'],
  dependencies: [
    { class: 'group', template: buttonGroupControlTemplate },
    { class: 'button', template: toggleButtonControlTemplate },
  ],
});
