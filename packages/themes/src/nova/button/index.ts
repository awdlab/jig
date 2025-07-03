import { createThemePart } from '@ngneers/controls-themes/api';
import { colorsTemplate } from '@ngneers/controls-themes/nova/base';
import { buttonTemplate } from '@ngneers/controls-themes/templates/button';

export const buttonVariables = createThemePart({
  template: buttonTemplate,
  dependencies: [colorsTemplate],
  root: {
    variables: {
      background: '{color.primary.default}',
      color: '{color.text}',
      borderRadius: '0.25rem',
      fontSize: '0.875rem',
      fontWeight: '600',
      padding: '0.5rem 1rem',

      hover: {
        background: '{color.primary.200}',
      },
      focus: {
        background: '{color.primary.300}',
      },
      active: {
        background: '{color.primary.100}',
      },
    },
  },
});

export const buttonStyles = createThemePart({
  template: buttonTemplate,
});

export const button = [buttonVariables, buttonStyles] as const;
