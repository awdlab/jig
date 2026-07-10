import { createControlTemplate } from '@ngneers/controls-themes/api';
import { checkboxControlTemplate } from '@ngneers/controls-themes/templates/checkbox';
import { scrollerControlTemplate } from '@ngneers/controls-themes/templates/scroller';

export const treeControlTemplate = createControlTemplate({
  scope: 'tree',
  classNames: [
    'root',
    'empty',
    'invalid',
    'item',
    'group',
    'default-item',
    'toggle',
    'toggle-placeholder',
    'toggle-icon',
    'toggle-arrow',
    'item-checkbox-placeholder',
    'item-selectable',
    'item-selected',
    'item-highlighted',
    'item-disabled',
    'item-expanded',
  ],
  dependencies: [
    { class: 'scroller', template: scrollerControlTemplate },
    { class: 'item-checkbox', template: checkboxControlTemplate },
  ],
});
