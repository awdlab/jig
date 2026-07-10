import { createControlTemplate } from '@ngneers/controls-themes/api';
import { buttonControlTemplate } from '@ngneers/controls-themes/templates/button';
import { iconControlTemplate } from '@ngneers/controls-themes/templates/icon';
import { inputFieldControlTemplate } from '@ngneers/controls-themes/templates/input-field';
import { maskInputControlTemplate } from '@ngneers/controls-themes/templates/mask-input';
import { popoverControlTemplate } from '@ngneers/controls-themes/templates/popover';
import { selectControlTemplate } from '@ngneers/controls-themes/templates/select';

export const calendarControlTemplate = createControlTemplate({
  scope: 'calendar',
  classNames: [
    'root',
    'inline',
    'invalid',
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
    'time',
    'input-field',
  ],
  dependencies: [
    { class: 'input', template: maskInputControlTemplate },
    { class: 'trigger-icon', template: iconControlTemplate },
    { class: 'popover', template: popoverControlTemplate },
    { class: 'previous', template: buttonControlTemplate },
    { class: 'next', template: buttonControlTemplate },
    { class: 'current-month', template: selectControlTemplate },
    { class: 'current-year', template: selectControlTemplate },
    { class: 'current-month-field', template: inputFieldControlTemplate },
    { class: 'current-year-field', template: inputFieldControlTemplate },
  ],
});
