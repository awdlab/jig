import { createControlTemplate } from '@ngneers/controls-themes/api';

export const checkboxControlTemplate = createControlTemplate({
  scope: 'checkbox',
  classNames: [
    'root',
    'input',
    'box',
    'box-checked',
    'box-indeterminate',
    'box-icon',
    'anim-box-icon-enter',
    'anim-box-icon-leave',
    'invalid',
  ],
});
