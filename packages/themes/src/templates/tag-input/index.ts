import { createControlTemplate } from '@awdlab/jig-themes/api';
import { dropdownListControlTemplate } from '@awdlab/jig-themes/templates/dropdown-list';
import { inputControlTemplate } from '@awdlab/jig-themes/templates/input';

export const tagInputControlTemplate = createControlTemplate({
  scope: 'tagInput',
  classNames: [
    'root',
    'field',
    'tags',
    'tag',
    'tag-label',
    'tag-remove',
    'tag-remove-icon',
    'single-line',
    'multiline',
    'invalid',
    'empty',
    'full',
    'live-region',
  ],
  dependencies: [
    { class: 'dropdown', template: dropdownListControlTemplate },
    { class: 'input', template: inputControlTemplate },
  ],
});
