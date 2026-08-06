import { createControlTemplate } from '@ngneers/controls-themes/api';
import { dialogControlTemplate } from '@ngneers/controls-themes/templates/dialog';
import { inputFieldControlTemplate } from '@ngneers/controls-themes/templates/input-field';
import { listBoxControlTemplate } from '@ngneers/controls-themes/templates/list-box';

export const commandControlTemplate = createControlTemplate({
  scope: 'command',
  classNames: [
    'root',
    'search-icon',
    'item',
    'item-icon',
    'item-label',
    'item-shortcut',
    'empty',
    'hints',
    'hint',
  ],
  dependencies: [
    { class: 'dialog', template: dialogControlTemplate },
    { class: 'list-box', template: listBoxControlTemplate },
    { class: 'search', template: inputFieldControlTemplate },
  ],
});
