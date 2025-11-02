import { createControlTemplate } from '@ngneers/controls-themes/api';

export const listBoxControlTemplate = createControlTemplate({
  scope: 'list-box',
  classNames: [
    'empty',
    'invalid',
    'item',
    'group',
    'scroller',
    'item-selected',
    'item-highlighted',
  ],
});
