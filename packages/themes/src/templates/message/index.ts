import { createControlTemplate } from '@ngneers/controls-themes/api';

export const messageControlTemplate = createControlTemplate({
  scope: 'message',
  classNames: ['root', 'content', 'icon', 'kind-*', 'color-*'],
});
