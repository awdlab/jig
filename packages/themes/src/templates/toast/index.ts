import { createControlTemplate } from '@ngneers/controls-themes/api';

export const toastControlTemplate = createControlTemplate({
  scope: 'toast',
  classNames: [
    'root',
    'host',
    'anim-enter',
    'anim-leave',
    'defaultHeader',
    'defaultHeaderText',
    'defaultContent',
    'color-*',
  ],
});
