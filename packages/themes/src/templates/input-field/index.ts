import { createControlTemplate } from '@ngneers/controls-themes/api';
import { inputControlTemplate } from '@ngneers/controls-themes/templates/input';

export const inputFieldControlTemplate = createControlTemplate({
  scope: 'input-field',
  classNames: ['invalid', 'readonly', 'label', 'disabled', 'clear-button'],
  dependencies: [inputControlTemplate],
});
