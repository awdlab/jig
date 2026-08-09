import { createControlTemplate } from '@awdlab/jig-themes/api';

export const messageControlTemplate = createControlTemplate({
  scope: 'message',
  classNames: ['root', 'content', 'icon', 'kind-*', 'color-*'],
});
