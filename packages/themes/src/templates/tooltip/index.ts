import { createControlTemplate } from '@ngneers/controls-themes/api';

export const tooltipControlTemplate = createControlTemplate({
  scope: 'tooltip',
  classNames: [
    'root',
    // Sub elements
    'content',
    'text',

    // States
    'with-arrow',
    'closing',

    // Positions
    'top',
    'bottom',
    'left',
    'right',
    'start',
    'end',
  ],
});
