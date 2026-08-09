import { createControlTemplate } from '@awdlab/jig-themes/api';

export const tagControlTemplate = createControlTemplate({
  scope: 'tag',
  classNames: ['root', 'content', 'icon', 'kind-*', 'color-*'],
});
