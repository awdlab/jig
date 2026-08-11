import { createControlTemplate } from '@awdlab/jig-themes/api';

export const hintControlTemplate = createControlTemplate({
  scope: 'hint',
  classNames: ['root', 'root-collapsed', 'content', 'icon', 'kind-*', 'color-*'],
});
