import { createControlTemplate } from '@awdlab/jig-themes/api';
import { checkboxControlTemplate } from '@awdlab/jig-themes/templates/checkbox';
import { scrollerControlTemplate } from '@awdlab/jig-themes/templates/scroller';

export const listBoxControlTemplate = createControlTemplate({
  scope: 'list-box',
  classNames: [
    'root',
    'empty',
    'invalid',
    'item',
    'group',
    'default-item',
    'default-group',
    'item-selected',
    'item-highlighted',
    'item-disabled',
    'separator',
  ],
  dependencies: [
    { class: 'checkbox', template: checkboxControlTemplate },
    { class: 'scroller', template: scrollerControlTemplate },
  ],
});
