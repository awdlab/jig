import { createControlTemplate } from '@ngneers/controls-themes/api';

export const messageControlTemplate = createControlTemplate({
  scope: 'message',
  classNames: ['content', 'icon', 'kind-*', 'color-*'],
});
