import { createControlTemplate } from '@awdlab/jig-themes/api';

export const stepperControlTemplate = createControlTemplate({
  scope: 'stepper',
  classNames: [
    'root',
    'header',
    'step',
    'marker',
    'marker-index',
    'marker-icon',
    'connector',
    'label',
    'optional',
    'content',
    'active',
    'completed',
    'error',
    'disabled',
  ],
});
