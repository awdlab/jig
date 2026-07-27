import { createControlTemplate } from '@ngneers/controls-themes/api';
import { inputControlTemplate } from '@ngneers/controls-themes/templates/input';

export const inputFieldControlTemplate = createControlTemplate({
  scope: 'input-field',
  classNames: [
    'root',
    'host',
    'filled',
    'disabled',
    'readonly',
    'invalid',
    'label',
    'clear-button',
    'labelKind-*',
    'kind-*',
  ],
  dependencies: [{ class: 'input', template: inputControlTemplate, projected: true }],
});
