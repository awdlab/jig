import { createControlTemplate } from '@awdlab/jig-themes/api';

export const inputChildClassNames = ['disabled'] as const;

export const inputControlTemplate = createControlTemplate({
  scope: 'input',
  classNames: ['root', 'invalid', 'empty'],
});
