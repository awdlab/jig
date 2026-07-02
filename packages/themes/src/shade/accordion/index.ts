import { createThemePart, css } from '@ngneers/controls-themes/api';
import { baseStyles } from '@ngneers/controls-themes/base';
import { colorsTemplate, fontTemplate, sizesTemplate } from '@ngneers/controls-themes/shade/base';
import { accordionControlTemplate } from '@ngneers/controls-themes/templates/accordion';

export const accordionStyles = createThemePart({
  controlTemplate: accordionControlTemplate,
  base: baseStyles.accordion,
  dependencies: [colorsTemplate, sizesTemplate, fontTemplate],
  root: {
    // shadcn accordion has no surrounding box; rows are separated by their own bottom borders.
    css: ({ v, c }) => css`
      ${c('root')} {
        font-size: ${v('font.size.sm')};
        background: transparent;
        border: none;
        display: block;
      }
    `,
  },
});
