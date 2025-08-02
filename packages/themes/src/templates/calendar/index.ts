import { createControlTemplate } from '@ngneers/controls-themes/api';
import { buttonControlTemplate } from '@ngneers/controls-themes/templates/button';

export const calendarControlTemplate = createControlTemplate({
  scope: 'calendar',
  classNames: [
    'input',
    'details',
    'header',
    'navigation',
    'days',
    'week-day',
    'day',
    'day-selected',
    'day-today',
    'day-other-month',
    'months',
    'month',
    'year',
    'time',
    'next',
    'previous',
  ],
  dependencies: [buttonControlTemplate],
});
