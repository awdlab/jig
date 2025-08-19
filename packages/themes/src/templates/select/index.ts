import { createControlTemplate } from '@ngneers/controls-themes/api';
import { inputFieldControlTemplate } from '@ngneers/controls-themes/templates/input-field';
import { listBoxControlTemplate } from '@ngneers/controls-themes/templates/list-box';
import { popoverControlTemplate } from '@ngneers/controls-themes/templates/popover';

export const selectControlTemplate = createControlTemplate({
  scope: 'select',
  classNames: [
    '',
    'combobox',
    'input',
    'icon',
    'input-editable',
    'popover-content',
    'filter',
    'filter-icon',
    'list-box',
    'list-box-empty',
    'no-items',
  ],
  dependencies: [popoverControlTemplate, listBoxControlTemplate, inputFieldControlTemplate],
});
