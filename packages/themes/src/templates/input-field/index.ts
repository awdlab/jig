import { createControlTemplate } from '@awdlab/jig-themes/api';
import { inputControlTemplate } from '@awdlab/jig-themes/templates/input';
import { maskInputControlTemplate } from '@awdlab/jig-themes/templates/mask-input';

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
    'required-marker',
    'clear-button',
    'labelKind-*',
    'kind-*',
  ],
  dependencies: [
    { class: 'input', template: inputControlTemplate, projected: true },
    { class: 'mask', template: maskInputControlTemplate, projected: true },
  ],
});
