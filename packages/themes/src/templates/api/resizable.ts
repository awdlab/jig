import { createControlTemplate } from '@ngneers/controls-themes/api';

export const resizableDirectiveTemplate = createControlTemplate({
  scope: 'resizable',
  classNames: ['root', 'resizable', 'resized'],
});
