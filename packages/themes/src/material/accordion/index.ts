import { createThemePart, css } from '@awdlab/jig-themes/api';
import { baseStyles } from '@awdlab/jig-themes/base';
import { colorsTemplate, fontTemplate, sizesTemplate } from '@awdlab/jig-themes/material/base';
import { accordionControlTemplate } from '@awdlab/jig-themes/templates/accordion';

export const accordionStyles = createThemePart({
  controlTemplate: accordionControlTemplate,
  base: baseStyles.accordion,
  dependencies: [colorsTemplate, sizesTemplate, fontTemplate],
  root: {
    css: ({ v, c }) => css`
      ${c('root')} {
        background: ${v('color.background')};
        border: 1px solid ${v('color.border')};
        border-radius: ${v('size.rounded.lg')};
        display: block;
        /* clip panel hover/content to the rounded group corners */
        overflow: hidden;
      }
    `,
  },
});
