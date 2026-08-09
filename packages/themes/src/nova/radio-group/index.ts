import { createThemePart, css } from '@awdlab/jig-themes/api';
import { baseStyles } from '@awdlab/jig-themes/base';
import { colorsTemplate, sizesTemplate } from '@awdlab/jig-themes/nova/base';
import { radioGroupControlTemplate } from '@awdlab/jig-themes/templates/radio-group';

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
