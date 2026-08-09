import { createControlTemplate } from '@awdlab/jig-themes/api';

export const splitterControlTemplate = createControlTemplate({
  scope: 'splitter',
  classNames: [
    'root',
    'horizontal',
    'vertical',
    'panel',
    'divider',
    'divider-handle',
    'dragging',
    'divider-dragging',
    'kind-*',
  ],
});
