import { createControlTemplate } from '@ngneers/controls-themes/api';
import { inputFieldControlTemplate } from '@ngneers/controls-themes/templates/input-field';

export const inputChildClassNames = ['disabled'] as const;

export const inputControlTemplate = createControlTemplate({
  scope: 'input',
  classNames: ['invalid'],
  dependencies: [inputFieldControlTemplate],
});
