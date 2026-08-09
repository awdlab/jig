import { createControlTemplate } from '@awdlab/jig-themes/api';

export const resizableDirectiveTemplate = createControlTemplate({
  scope: 'resizable',
  classNames: ['root', 'resizable', 'resized'],
});
