import { createThemePart, css } from '@ngneers/controls-themes/api';
import { colorsTemplate, sizesTemplate } from '@ngneers/controls-themes/nova/base';
import { scrollerControlTemplate } from '@ngneers/controls-themes/templates/scroller';

export const scrollerStyles = createThemePart({
  controlTemplate: scrollerControlTemplate,
  dependencies: [colorsTemplate, sizesTemplate],
  root: {
    css: ({ v, c }) => css`
      ${c()} {
        display: block;
        height: 100%;
        width: 100%;
      }
      ${c('scrollarea')} {
        width: 100%;
        height: 100%;
        position: relative;
        overflow: auto;
      }
      ${c('sticky')} {
        position: sticky;
        top: 0;
        background: white;
      }
    `,
  },
});
