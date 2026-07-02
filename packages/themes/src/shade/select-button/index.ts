import { createThemePart, css } from '@ngneers/controls-themes/api';
import { baseStyles } from '@ngneers/controls-themes/base';
import { colorsTemplate, sizesTemplate } from '@ngneers/controls-themes/shade/base';
import { selectButtonControlTemplate } from '@ngneers/controls-themes/templates/select-button';

export const selectButtonStyles = createThemePart({
  controlTemplate: selectButtonControlTemplate,
  base: baseStyles.selectButton,
  dependencies: [colorsTemplate, sizesTemplate],
  root: {
    // The choices are composed buttons (styled by the button part); only the invalid frame is added.
    css: ({ v, c }) => css`
      ${c('invalid')} {
        border: 1px solid ${v('color.destructive.base')};
        border-radius: ${v('size.rounded.md')};
      }
    `,
  },
});
