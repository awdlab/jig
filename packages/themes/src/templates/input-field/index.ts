import { createControlTemplate } from '@awdlab/jig-themes/api';
import { inputControlTemplate } from '@awdlab/jig-themes/templates/input';

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
