import { createControlTemplate } from '@ngneers/controls-themes/api';

export const tooltipControlTemplate = createControlTemplate({
  scope: 'tooltip',
  classNames: ['content', 'top', 'bottom', 'left', 'right', 'start', 'end'],
});
