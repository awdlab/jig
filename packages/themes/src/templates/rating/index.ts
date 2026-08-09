import { createControlTemplate } from '@awdlab/jig-themes/api';

export const ratingControlTemplate = createControlTemplate({
  scope: 'rating',
  classNames: ['root', 'symbol', 'full', 'empty', 'invalid', 'readonly', 'disabled'],
});
