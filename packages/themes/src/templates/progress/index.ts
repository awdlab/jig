import { createControlTemplate } from '@ngneers/controls-themes/api';

export const progressControlTemplate = createControlTemplate({
  scope: 'progress',
  classNames: ['root', 'svg', 'track', 'indeterminate', 'circular', 'fill', 'fill2'],
});
