import { createControlTemplate } from '@ngneers/controls-themes/api';
import { inputFieldControlTemplate } from '@ngneers/controls-themes/templates/input-field';
import { listBoxControlTemplate } from '@ngneers/controls-themes/templates/list-box';
import { popoverControlTemplate } from '@ngneers/controls-themes/templates/popover';

export const selectControlTemplate = createControlTemplate({
  scope: 'select',
  classNames: [
    'root',
    'combobox',
    'empty',
    'placeholder',
    'input',
    'icon',
    'input-editable',
    'popover-content',
    'filter-icon',
    'list-box-empty',
  ],
  dependencies: [
    { class: 'popover', template: popoverControlTemplate },
    { class: 'list-box', template: listBoxControlTemplate },
    { class: 'filter', template: inputFieldControlTemplate },
  ],
});
