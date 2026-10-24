import { createControlTemplate } from '@awdlab/jig-themes/api';
import { buttonControlTemplate } from '@awdlab/jig-themes/templates/button';
import { chipControlTemplate } from '@awdlab/jig-themes/templates/chip';
import { filterBuilderControlTemplate } from '@awdlab/jig-themes/templates/filter-builder';
import { iconControlTemplate } from '@awdlab/jig-themes/templates/icon';
import { inputControlTemplate } from '@awdlab/jig-themes/templates/input';
import { inputFieldControlTemplate } from '@awdlab/jig-themes/templates/input-field';

export const filterBarControlTemplate = createControlTemplate({
  scope: 'filter-bar',
  classNames: ['root', 'search-row', 'trigger', 'chips'],
  dependencies: [
    { class: 'search-field', template: inputFieldControlTemplate },
    { class: 'search-input', template: inputControlTemplate },
    { class: 'search-icon', template: iconControlTemplate },
    { class: 'filter-trigger', template: buttonControlTemplate },
    { class: 'filter', template: filterBuilderControlTemplate },
    { class: 'chip', template: chipControlTemplate },
  ],
});
