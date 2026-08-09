import { createControlTemplate } from '@awdlab/jig-themes/api';

export const hintControlTemplate = createControlTemplate({
  scope: 'hint',
  classNames: ['root', 'content', 'icon', 'kind-*', 'color-*'],
});
