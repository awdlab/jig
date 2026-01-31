import { createControlTemplate } from '@ngneers/controls-themes/api';

export const sliderControlTemplate = createControlTemplate({
  scope: 'slider',
  classNames: ['root', 'horizontal', 'vertical', 'track', 'thumb', 'fill', 'invalid'],
});
