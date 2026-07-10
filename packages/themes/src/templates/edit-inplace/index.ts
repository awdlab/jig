import { createControlTemplate } from '@ngneers/controls-themes/api';
import { inplaceControlTemplate } from '@ngneers/controls-themes/templates/inplace';

export const editInplaceControlTemplate = createControlTemplate({
  scope: 'edit-inplace',
  classNames: [
    'root',
    'disabled',
    'readonly',
    'invalid',
    'default-display',
    'default-fallback-display',
    'default-edit',
    'default-edit-input',
    'default-edit-close-button',
    'sr-only',
  ],
  dependencies: [{ class: 'inplace', template: inplaceControlTemplate }],
});
