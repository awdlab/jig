import { createControlTemplate } from '@ngneers/controls-themes/api';
import { checkboxControlTemplate } from '@ngneers/controls-themes/templates/checkbox';
import { scrollerControlTemplate } from '@ngneers/controls-themes/templates/scroller';

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
    'scroller',
    'item-selected',
    'item-highlighted',
  ],
  dependencies: [checkboxControlTemplate, scrollerControlTemplate],
});
