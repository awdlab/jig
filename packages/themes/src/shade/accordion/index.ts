import { createThemePart, css } from '@awdlab/jig-themes/api';
import { baseStyles } from '@awdlab/jig-themes/base';
import { colorsTemplate, fontTemplate, sizesTemplate } from '@awdlab/jig-themes/shade/base';
import { accordionControlTemplate } from '@awdlab/jig-themes/templates/accordion';

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
