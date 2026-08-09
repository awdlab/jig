import { createControlTemplate } from '@awdlab/jig-themes/api';
import { buttonControlTemplate } from '@awdlab/jig-themes/templates/button';
import { iconControlTemplate } from '@awdlab/jig-themes/templates/icon';
import { inputFieldControlTemplate } from '@awdlab/jig-themes/templates/input-field';
import { maskInputControlTemplate } from '@awdlab/jig-themes/templates/mask-input';
import { popoverControlTemplate } from '@awdlab/jig-themes/templates/popover';
import { selectControlTemplate } from '@awdlab/jig-themes/templates/select';

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
