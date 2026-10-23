import { createControlTemplate } from '@awdlab/jig-themes/api';

export const popoverControlTemplate = createControlTemplate({
  scope: 'popover',
  classNames: ['root', 'wrapper', 'wrapper-unpositioned', 'content', 'content-closing'],
});
