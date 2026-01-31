import { createControlTemplate } from '@ngneers/controls-themes/api';
import { buttonControlTemplate } from '@ngneers/controls-themes/templates/button';
import { inputControlTemplate } from '@ngneers/controls-themes/templates/input';
import { inputFieldControlTemplate } from '@ngneers/controls-themes/templates/input-field';
import { popoverControlTemplate } from '@ngneers/controls-themes/templates/popover';
import { selectControlTemplate } from '@ngneers/controls-themes/templates/select';

export const filterControlTemplate = createControlTemplate({
  scope: 'filter',
  classNames: [
    'root',
    'inline',
    'input-field',
    'summary',
    'icon',
    'popover-content',
    'rows',
    'row',
    'operator',
    'value',
    'row-actions',
    'match',
    'footer',
  ],
  dependencies: [
    popoverControlTemplate,
    inputFieldControlTemplate,
    inputControlTemplate,
    selectControlTemplate,
    buttonControlTemplate,
  ],
});
