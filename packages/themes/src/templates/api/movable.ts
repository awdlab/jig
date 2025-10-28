import { createControlTemplate } from '@ngneers/controls-themes/api';

export const movableDirectiveTemplate = createControlTemplate({
  scope: 'movable',
  classNames: ['drag-handle-grab', 'drag-handle-grabbing'],
});
