import { createControlTemplate } from '@awdlab/jig-themes/api';
import { buttonControlTemplate } from '@awdlab/jig-themes/templates/button';
import { calendarControlTemplate } from '@awdlab/jig-themes/templates/calendar';
import { inputControlTemplate } from '@awdlab/jig-themes/templates/input';
import { inputFieldControlTemplate } from '@awdlab/jig-themes/templates/input-field';
import { popoverControlTemplate } from '@awdlab/jig-themes/templates/popover';
import { selectControlTemplate } from '@awdlab/jig-themes/templates/select';

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
