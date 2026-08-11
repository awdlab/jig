import { createControlTemplate } from '@awdlab/jig-themes/api';

export const sliderControlTemplate = createControlTemplate({
  scope: 'slider',
  classNames: ['root', 'horizontal', 'vertical', 'range', 'track', 'thumb', 'fill', 'invalid'],
});
