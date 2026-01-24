import { createControlTemplate } from '@ngneers/controls-themes/api';

export const toastControlTemplate = createControlTemplate({
  scope: 'toast',
  classNames: [
    'host',
    'anim-enter',
    'anim-leave',
    'defaultHeader',
    'defaultHeaderText',
    'defaultContent',
    'color-*',
  ],
});
