import { createControlTemplate } from '@awdlab/jig-themes/api';
import { listBoxControlTemplate } from '@awdlab/jig-themes/templates/list-box';
import { popoverControlTemplate } from '@awdlab/jig-themes/templates/popover';

export const dropdownListControlTemplate = createControlTemplate({
  scope: 'dropdown-list',
  classNames: ['root', 'content', 'header'],
  dependencies: [
    { class: 'popover', template: popoverControlTemplate },
    { class: 'list-box', template: listBoxControlTemplate },
  ],
});
