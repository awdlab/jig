import { createThemePart, css } from '@ngneers/controls-themes/api';
import { baseStyles } from '@ngneers/controls-themes/base';
import { colorsTemplate, sizesTemplate } from '@ngneers/controls-themes/material/base';
import { radioGroupControlTemplate } from '@ngneers/controls-themes/templates/radio-group';

export const radioGroupStyles = createThemePart({
  controlTemplate: radioGroupControlTemplate,
  base: baseStyles.radioGroup,
  dependencies: [colorsTemplate, sizesTemplate],
  root: {
    css: ({ v, c }) => css`
      ${c('invalid')} {
        border: 1px solid ${v('color.invalid.border')};
        border-radius: ${v('size.rounded.md')};
        padding: 0.5rem;
      }
    `,
  },
});
