import { createThemePart, css } from '@awdlab/jig-themes/api';
import { baseStyles } from '@awdlab/jig-themes/base';
import { colorsTemplate, sizesTemplate } from '@awdlab/jig-themes/material/base';
import { inputControlTemplate } from '@awdlab/jig-themes/templates/input';

export const inputStyles = createThemePart({
  controlTemplate: inputControlTemplate,
  base: baseStyles.input,
  dependencies: [colorsTemplate, sizesTemplate],
  root: {
    css: ({ v, c }) => css`
      ${c('root')}::placeholder {
        color: ${v('color.surface.400')};
        opacity: 1;
      }
      ${c('root')}:focus-visible {
        outline: 2px solid ${v('color.primary.500')};
        outline-offset: -2px;
      }
    `,
  },
});
