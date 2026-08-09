import { createControlTemplate } from '@awdlab/jig-themes/api';

export const buttonControlTemplate = createControlTemplate({
  scope: 'button',
  classNames: ['root', 'inline', 'loading', 'kind-*', 'color-*'],
});
