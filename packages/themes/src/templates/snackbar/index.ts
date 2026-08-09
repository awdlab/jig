import { createControlTemplate } from '@awdlab/jig-themes/api';

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
    'actions',
    'progressBar',
    'closeButton',
    'sr-only',
    'color-*',
  ],
});
