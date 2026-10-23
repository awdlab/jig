import { createControlTemplate } from '@awdlab/jig-themes/api';
import { attributeFilterControlTemplate } from '@awdlab/jig-themes/templates/attribute-filter';
import { buttonControlTemplate } from '@awdlab/jig-themes/templates/button';
import { chipControlTemplate } from '@awdlab/jig-themes/templates/chip';
import { iconControlTemplate } from '@awdlab/jig-themes/templates/icon';
import { inputControlTemplate } from '@awdlab/jig-themes/templates/input';
import { inputFieldControlTemplate } from '@awdlab/jig-themes/templates/input-field';
import { listBoxControlTemplate } from '@awdlab/jig-themes/templates/list-box';

export const filterListBoxControlTemplate = createControlTemplate({
  scope: 'filterListBox',
  classNames: ['root', 'search-row', 'chips', 'empty', 'empty-actions'],
  dependencies: [
    { class: 'search-field', template: inputFieldControlTemplate },
    { class: 'search-input', template: inputControlTemplate },
    { class: 'search-icon', template: iconControlTemplate },
    { class: 'filter-trigger', template: buttonControlTemplate },
    { class: 'filter', template: attributeFilterControlTemplate },
    { class: 'chip', template: chipControlTemplate },
    { class: 'list-box', template: listBoxControlTemplate },
    { class: 'clear-all-button', template: buttonControlTemplate },
  ],
});
