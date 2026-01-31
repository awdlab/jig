import { createControlTemplate } from '@ngneers/controls-themes/api';

export const tagControlTemplate = createControlTemplate({
  scope: 'tag',
  classNames: ['root', 'content', 'icon', 'kind-*', 'color-*'],
});
