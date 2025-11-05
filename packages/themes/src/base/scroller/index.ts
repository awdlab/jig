import { createThemePart, css } from '@ngneers/controls-themes/api';
import { scrollerControlTemplate } from '@ngneers/controls-themes/templates/scroller';

export const scrollerStyles = createThemePart({
  controlTemplate: scrollerControlTemplate,
  dependencies: [],
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
        overflow-y: auto;
        overflow-x: hidden;
      }
      ${c('item-sticky')} {
        position: sticky;
        top: 0;
      }
    `,
  },
});
