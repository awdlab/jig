import { createThemePart, css } from '@ngneers/controls-themes/api';
import { baseStyles } from '@ngneers/controls-themes/base';
import { colorsTemplate, sizesTemplate } from '@ngneers/controls-themes/nova/base';
import { selectButtonControlTemplate } from '@ngneers/controls-themes/templates/select-button';

export const selectButtonStyles = createThemePart({
  controlTemplate: selectButtonControlTemplate,
  base: baseStyles.selectButton,
  dependencies: [colorsTemplate, sizesTemplate],
  root: {
    css: ({ v, c, d }) => css`
      ${c('invalid')} {
        border: 1px solid ${v('color.invalid.border')};
        border-radius: ${v('size.rounded.md')};
      }
    `,
  },
});
