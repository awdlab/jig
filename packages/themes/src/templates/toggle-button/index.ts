import { createControlTemplate } from '@awdlab/jig-themes/api';

export const toggleButtonControlTemplate = createControlTemplate({
  scope: 'toggle-button',
  classNames: ['root', 'invalid', 'button', 'label', 'active', 'placeholder', 'placeholder-active'],
  dependencies: [],
});
