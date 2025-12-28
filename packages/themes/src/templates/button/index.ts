import { createControlTemplate } from '@ngneers/controls-themes/api';

export const buttonControlTemplate = createControlTemplate({
  scope: 'button',
  classNames: ['inline', 'loading', 'kind-*', 'color-*'],
});
