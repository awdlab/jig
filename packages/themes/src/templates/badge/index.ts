import { createControlTemplate } from '@awdlab/jig-themes/api';

export const badgeControlTemplate = createControlTemplate({
  scope: 'badge',
  classNames: ['root', 'dot', 'circular', 'top-end', 'top-start', 'bottom-end', 'bottom-start'],
});
