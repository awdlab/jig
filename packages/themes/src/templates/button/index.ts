import { createControlTemplate } from '@ngneers/controls-themes/api';

export const buttonControlTemplate = createControlTemplate({
  scope: 'button',
  classNames: ['loading', 'icon-only', 'kind-*'],
});
