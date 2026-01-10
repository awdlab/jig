import { createControlTemplate } from '@ngneers/controls-themes/api';
import { inputControlTemplate } from '@ngneers/controls-themes/templates/input';

export const inputFieldControlTemplate = createControlTemplate({
  scope: 'input-field',
  classNames: ['invalid', 'label', 'clear-button', 'labelKind-*'],
  dependencies: [inputControlTemplate],
});
