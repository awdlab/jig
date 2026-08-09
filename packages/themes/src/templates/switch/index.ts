import { createControlTemplate } from '@awdlab/jig-themes/api';

export const switchControlTemplate = createControlTemplate({
  scope: 'switch',
  classNames: ['root', 'input', 'track', 'track-checked', 'thumb', 'invalid'],
});
