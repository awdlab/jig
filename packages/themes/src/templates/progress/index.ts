import { createControlTemplate } from '@awdlab/jig-themes/api';

export const progressControlTemplate = createControlTemplate({
  scope: 'progress',
  classNames: ['root', 'svg', 'track', 'indeterminate', 'circular', 'fill', 'fill2'],
});
