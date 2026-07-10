import { createControlTemplate } from '@ngneers/controls-themes/api';
import { buttonGroupControlTemplate } from '@ngneers/controls-themes/templates/button-group';
import { toggleButtonControlTemplate } from '@ngneers/controls-themes/templates/toggle-button';

export const selectButtonControlTemplate = createControlTemplate({
  scope: 'select-button',
  classNames: ['root', 'invalid'],
  dependencies: [
    { class: 'group', template: buttonGroupControlTemplate },
    { class: 'button', template: toggleButtonControlTemplate },
  ],
});
