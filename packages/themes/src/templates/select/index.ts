import { createControlTemplate } from '@awdlab/jig-themes/api';
import { inputFieldControlTemplate } from '@awdlab/jig-themes/templates/input-field';
import { listBoxControlTemplate } from '@awdlab/jig-themes/templates/list-box';
import { popoverControlTemplate } from '@awdlab/jig-themes/templates/popover';

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
