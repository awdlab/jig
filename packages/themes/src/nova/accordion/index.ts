import { createThemePart, css } from '@ngneers/controls-themes/api';
import { baseStyles } from '@ngneers/controls-themes/base';
import { colorsTemplate, fontTemplate, sizesTemplate } from '@ngneers/controls-themes/nova/base';
import { accordionControlTemplate } from '@ngneers/controls-themes/templates/accordion';

export const accordionStyles = createThemePart({
  controlTemplate: accordionControlTemplate,
  base: baseStyles.accordion,
  dependencies: [colorsTemplate, sizesTemplate, fontTemplate],
  root: {
    css: ({ v, c }) => css``,
  },
});
