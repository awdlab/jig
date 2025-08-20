import { createThemePart, css } from '@ngneers/controls-themes/api';
import { colorsTemplate, fontTemplate, sizesTemplate } from '@ngneers/controls-themes/nova/base';
import { accordionControlTemplate } from '@ngneers/controls-themes/templates/accordion';

export const accordionStyles = createThemePart({
  controlTemplate: accordionControlTemplate,
  dependencies: [colorsTemplate, sizesTemplate, fontTemplate],
  root: {
    css: ({ v, c }) => css`
      ${c()} {
        display: flex;
        flex-direction: column;
      }
      ${c('panel')} {
        border-bottom: 1px solid ${v('color.surface.200')};
      }
      ${c('panel-content')} {
        display: block;
        padding: ${v('size.padding.md')} ${v('size.padding.xl')};
      }
      ${c('panel-header')} {
        display: flex;
        cursor: pointer;
      }
      ${c('panel-header-text')} {
        padding: ${v('size.padding.md')} ${v('size.padding.xl')};
        font-weight: ${v('font.weight.semibold')};
        color: ${v('color.surface.500')};
      }
    `,
  },
});
