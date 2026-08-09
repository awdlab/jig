import { createControlTemplate } from '@awdlab/jig-themes/api';
import { dialogControlTemplate } from '@awdlab/jig-themes/templates/dialog';
import { inputFieldControlTemplate } from '@awdlab/jig-themes/templates/input-field';
import { listBoxControlTemplate } from '@awdlab/jig-themes/templates/list-box';

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
