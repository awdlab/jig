import { createControlTemplate } from '@ngneers/controls-themes/api';

export const inputMaskChildClassNames = ['disabled'] as const;

export const inputMaskControlTemplate = createControlTemplate({
  scope: 'input-mask',
  classNames: ['mask', 'mask-placeholder', 'mask-text'],
});
