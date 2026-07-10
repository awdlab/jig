import { createControlTemplate } from '@ngneers/controls-themes/api';
import { buttonControlTemplate } from '@ngneers/controls-themes/templates/button';
import { calendarControlTemplate } from '@ngneers/controls-themes/templates/calendar';
import { inputControlTemplate } from '@ngneers/controls-themes/templates/input';
import { inputFieldControlTemplate } from '@ngneers/controls-themes/templates/input-field';
import { popoverControlTemplate } from '@ngneers/controls-themes/templates/popover';
import { selectControlTemplate } from '@ngneers/controls-themes/templates/select';

export const filterControlTemplate = createControlTemplate({
  scope: 'filter',
  classNames: [
    'root',
    'inline',
    'summary',
    'icon',
    'popover-content',
    'rows',
    'row',
    'condition-divider',
    'footer',
    'footer-actions',
    'active-indicator',
  ],
  dependencies: [
    { class: 'popover', template: popoverControlTemplate },
    { class: 'input-field', template: inputFieldControlTemplate },
    { class: 'value', template: inputFieldControlTemplate },
    { class: 'operator', template: inputFieldControlTemplate },
    { class: 'list-select', template: selectControlTemplate },
    { class: 'operator-select', template: selectControlTemplate },
    { class: 'calendar', template: calendarControlTemplate },
    { class: 'input', template: inputControlTemplate },
    { class: 'remove-btn', template: buttonControlTemplate },
    { class: 'add-button', template: buttonControlTemplate },
    { class: 'cancel-button', template: buttonControlTemplate },
    { class: 'apply-button', template: buttonControlTemplate },
    { class: 'clear-button', template: buttonControlTemplate },
  ],
});
