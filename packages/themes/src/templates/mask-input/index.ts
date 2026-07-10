import { createControlTemplate } from '@ngneers/controls-themes/api';

export const maskInputControlTemplate = createControlTemplate({
  scope: 'mask-input',
  classNames: [
    'root',
    'section',
    'section-active',
    'section-placeholder',
    'separator',
    'proxy',
    'sr-only',
  ],
  dependencies: [],
});
