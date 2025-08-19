import { createControlTemplate } from '@ngneers/controls-themes/api';

export const inputFieldChildClassNames = ['disabled'] as const;

export const inputFieldControlTemplate = createControlTemplate({
  scope: 'input-field',
  classNames: ['invalid', 'readonly', 'label', 'disabled'],
});
