import { createControlTemplate } from '@ngneers/controls-themes/api';
import { inputFieldControlTemplate } from '@ngneers/controls-themes/templates/input-field';

export const inputMaskControlTemplate = createControlTemplate({
  scope: 'input-mask',
  classNames: [
    'root',
    'section',
    'section-active',
    'section-placeholder',
    'separator',
    'proxy',
    'sr-only',
  ],
  dependencies: [inputFieldControlTemplate],
});
