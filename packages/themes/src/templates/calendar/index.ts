import { createControlTemplate } from '@ngneers/controls-themes/api';
import { buttonControlTemplate } from '@ngneers/controls-themes/templates/button';
import { inputControlTemplate } from '@ngneers/controls-themes/templates/input';
import { inputFieldControlTemplate } from '@ngneers/controls-themes/templates/input-field';
import { selectControlTemplate } from '@ngneers/controls-themes/templates/select';

export const calendarControlTemplate = createControlTemplate({
  scope: 'calendar',
  classNames: [
    'inline',
    'input',
    'input-field',
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
    'current-month',
    'current-year',
    'time',
    'next',
    'previous',
  ],
  dependencies: [
    buttonControlTemplate,
    selectControlTemplate,
    inputControlTemplate,
    inputFieldControlTemplate,
  ],
});
