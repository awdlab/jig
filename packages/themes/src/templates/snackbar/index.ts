import { createControlTemplate } from '@awdlab/jig-themes/api';

export const snackbarControlTemplate = createControlTemplate({
  scope: 'snackbar',
  classNames: [
    'root',
    'host',
    'body',
    'anim-enter',
    'anim-leave',
    'default-header',
    'default-header-text',
    'default-content',
    'actions',
    'progress-bar',
    'close-button',
    'sr-only',
    'color-*',
  ],
});
