import { createThemePart, css } from '@awdlab/jig-themes/api';
import { baseStyles } from '@awdlab/jig-themes/base';
import { colorsTemplate, sizesTemplate } from '@awdlab/jig-themes/shade/base';
import { selectButtonControlTemplate } from '@awdlab/jig-themes/templates/select-button';

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
