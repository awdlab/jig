import { createControlTemplate } from '@ngneers/controls-themes/api';

export const textFieldChildClassNames = ['disabled'] as const;

export const textFieldControlTemplate = createControlTemplate({
  scope: 'text-field',
  classNames: ['mask'],
});
