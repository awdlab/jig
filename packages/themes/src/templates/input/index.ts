import { createControlTemplate } from '@ngneers/controls-themes/api';

export const inputChildClassNames = ['disabled'] as const;

export const inputControlTemplate = createControlTemplate({
  scope: 'input',
  classNames: ['invalid'],
});
