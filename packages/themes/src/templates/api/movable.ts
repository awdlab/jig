import { createControlTemplate } from '@awdlab/jig-themes/api';

export const movableDirectiveTemplate = createControlTemplate({
  scope: 'movable',
  classNames: ['root', 'movable', 'moved', 'drag-handle-grab', 'drag-handle-grabbing'],
});
