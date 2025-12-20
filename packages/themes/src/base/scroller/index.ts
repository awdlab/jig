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
        overflow-y: auto;
        overflow-x: hidden;
        position: relative;
        overflow-anchor: none;
      }
      ${c('virtual')} {
        display: flex;
        flex-direction: column;
        ${c('item')} {
          flex-shrink: 0;
          height: var(--ngn-scroller-item-height);
        }
      }
      ${c('spacer')} {
        flex-shrink: 0;
        display: block;
      }
      ${c('item-sticky')} {
        position: sticky;
        top: 0;
      }
      ${c('item')} {
        display: block;
      }
    `,
  },
});
