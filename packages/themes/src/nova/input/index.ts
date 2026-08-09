import { createThemePart, css } from '@awdlab/jig-themes/api';
import { baseStyles } from '@awdlab/jig-themes/base';
import { colorsTemplate, sizesTemplate } from '@awdlab/jig-themes/nova/base';
import { inputControlTemplate } from '@awdlab/jig-themes/templates/input';

export const inputStyles = createThemePart({
  controlTemplate: inputControlTemplate,
  base: baseStyles.input,
  dependencies: [colorsTemplate, sizesTemplate],
  root: {
    css: ({ v, c }) => css`
      ${c('root')}::placeholder {
        color: ${v('color.surface.500')};
        opacity: 1;
      }
    `,
  },
});
