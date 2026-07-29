import { createThemePart, css } from '@ngneers/controls-themes/api';
import { baseStyles } from '@ngneers/controls-themes/base';
import { colorsTemplate, fontTemplate, sizesTemplate } from '@ngneers/controls-themes/nova/base';
import { accordionControlTemplate } from '@ngneers/controls-themes/templates/accordion';

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
        /* Clips the expanded header's fill to the rounded corners. */
        overflow: hidden;
      }
    `,
  },
});
