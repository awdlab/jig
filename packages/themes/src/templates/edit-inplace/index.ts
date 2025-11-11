import { createControlTemplate } from '@ngneers/controls-themes/api';
import { inplaceControlTemplate } from '@ngneers/controls-themes/templates/inplace';

export const editInplaceControlTemplate = createControlTemplate({
  scope: 'edit-inplace',
  classNames: [
    'default-display',
    'default-edit',
    'default-edit-input',
    'default-edit-close-button',
  ],
  dependencies: [inplaceControlTemplate],
});
