import { createControlTemplate } from '@awdlab/jig-themes/api';

export const meterControlTemplate = createControlTemplate({
  scope: 'meter',
  classNames: [
    'root',
    'horizontal',
    'vertical',
    'track',
    'segment',
    'legend',
    'item',
    'swatch',
    'icon',
    'label',
    'value',
    'highlighted',
    'sr-only',
  ],
});
