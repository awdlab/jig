import { createControlTemplate } from '@ngneers/controls-themes/api';

export const spinnerControlTemplate = createControlTemplate({
  scope: 'spinner',
  classNames: ['circle', 'svg', 'color-*', 'centered'],
});
