import { createControlTemplate } from '@awdlab/jig-themes/api';

export const spinnerControlTemplate = createControlTemplate({
  scope: 'spinner',
  classNames: ['root', 'circle', 'svg', 'color-*', 'centered'],
});
