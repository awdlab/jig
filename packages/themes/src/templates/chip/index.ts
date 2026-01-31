import { createControlTemplate } from '@ngneers/controls-themes/api';

export const chipControlTemplate = createControlTemplate({
  scope: 'chip',
  classNames: [
    'root',
    'closable',
    'actionable',
    'content',
    'close-button',
    'close-icon',
    'color-*',
  ],
});
