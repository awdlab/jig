import { createControlTemplate } from '@awdlab/jig-themes/api';

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

    // Animations
    'fade-in',
    'fade-out',

    // Positions
    'top',
    'bottom',
    'left',
    'right',
    'start',
    'end',
  ],
});
