import { createControlTemplate } from '@ngneers/controls-themes/api';

export const splitterControlTemplate = createControlTemplate({
  scope: 'splitter',
  classNames: [
    'horizontal',
    'vertical',
    'panel',
    'divider',
    'divider-handle',
    'dragging',
    'divider-dragging',
  ],
});
