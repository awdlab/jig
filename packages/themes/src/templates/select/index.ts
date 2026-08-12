import { createControlTemplate } from '@awdlab/jig-themes/api';
import { dropdownListControlTemplate } from '@awdlab/jig-themes/templates/dropdown-list';
import { inputFieldControlTemplate } from '@awdlab/jig-themes/templates/input-field';

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
    'filter-icon',
  ],
  dependencies: [
    { class: 'dropdown', template: dropdownListControlTemplate },
    { class: 'filter', template: inputFieldControlTemplate },
  ],
});
