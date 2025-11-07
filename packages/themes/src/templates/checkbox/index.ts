import { createControlTemplate } from '@ngneers/controls-themes/api';

export const checkboxControlTemplate = createControlTemplate({
  scope: 'checkbox',
  classNames: [
    'input',
    'box',
    'box-checked',
    'box-indeterminate',
    'box-icon',
    'box-icon-enter',
    'box-icon-leave',
  ],
});
