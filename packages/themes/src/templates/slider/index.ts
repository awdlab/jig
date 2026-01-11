import { createControlTemplate } from '@ngneers/controls-themes/api';

export const sliderControlTemplate = createControlTemplate({
  scope: 'slider',
  classNames: ['horizontal', 'vertical', 'track', 'thumb', 'fill', 'invalid'],
});
