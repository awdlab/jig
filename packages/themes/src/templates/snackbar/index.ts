import { createControlTemplate } from '@ngneers/controls-themes/api';

export const snackbarControlTemplate = createControlTemplate({
  scope: 'snackbar',
  classNames: [
    'root',
    'host',
    'body',
    'anim-enter',
    'anim-leave',
    'defaultHeader',
    'defaultHeaderText',
    'defaultContent',
    'color-*',
  ],
});
