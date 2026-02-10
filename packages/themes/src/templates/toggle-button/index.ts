import { createControlTemplate } from '@ngneers/controls-themes/api';

export const toggleButtonControlTemplate = createControlTemplate({
  scope: 'toggle-button',
  classNames: ['root', 'invalid', 'button', 'label', 'active', 'placeholder', 'placeholder-active'],
  dependencies: [],
});
