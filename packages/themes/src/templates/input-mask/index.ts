import { createControlTemplate } from '@ngneers/controls-themes/api';
import { inputControlTemplate } from '@ngneers/controls-themes/templates/input';
import { inputFieldControlTemplate } from '@ngneers/controls-themes/templates/input-field';

export const inputMaskChildClassNames = ['disabled'] as const;

export const inputMaskControlTemplate = createControlTemplate({
  scope: 'input-mask',
  classNames: ['mask', 'mask-placeholder', 'mask-text'],
  dependencies: [inputFieldControlTemplate, inputControlTemplate],
});
