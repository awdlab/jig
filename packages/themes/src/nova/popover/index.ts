import { createThemePart, css } from '@ngneers/controls-themes/api';
import { colorsTemplate, sizesTemplate } from '@ngneers/controls-themes/nova/base';
import { popoverControlTemplate } from '@ngneers/controls-themes/templates/popover';

export const popoverStyles = createThemePart({
  controlTemplate: popoverControlTemplate,
  dependencies: [colorsTemplate, sizesTemplate],
  root: {
    css: ({ v, c }) => css`
      ${c()} {
        background: transparent;
        pointer-events: none;
      }
      ${c('content')} {
        pointer-events: auto;
        border-style: solid;
        background: ${v('color.background')};
        color: ${v('color.text')};
        border-color: ${v('color.surface.300')};
        border-radius: ${v('size.rounded.md')};
        border-width: 1px;
        padding: ${v('size.rounded.md')};
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      }
    `,
  },
});
