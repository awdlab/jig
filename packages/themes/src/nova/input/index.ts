import { createThemePart, css } from '@ngneers/controls-themes/api';
import { baseStyles } from '@ngneers/controls-themes/base';
import { colorsTemplate, sizesTemplate } from '@ngneers/controls-themes/nova/base';
import { inputControlTemplate } from '@ngneers/controls-themes/templates/input';

export const inputStyles = createThemePart({
  controlTemplate: inputControlTemplate,
  base: baseStyles.input,
  dependencies: [colorsTemplate, sizesTemplate],
  root: {
    css: ({ c, d }) => css``,
  },
});
