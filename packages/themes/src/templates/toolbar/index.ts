import { createControlTemplate } from '@awdlab/jig-themes/api';
import { buttonControlTemplate } from '@awdlab/jig-themes/templates/button';
import { popoverControlTemplate } from '@awdlab/jig-themes/templates/popover';

export const toolbarControlTemplate = createControlTemplate({
  scope: 'toolbar',
  classNames: [
    'root',
    'grid',
    'horizontal',
    'vertical',
    'wrap',
    'placement-start',
    'placement-center',
    'placement-end',
    'overflow-trigger',
    'overflow-trigger-hidden',
    'overflow-button',
    'popover-content',
  ],
  dependencies: [
    { class: 'popover', template: popoverControlTemplate },
    { class: 'button', template: buttonControlTemplate, projected: true },
  ],
});
