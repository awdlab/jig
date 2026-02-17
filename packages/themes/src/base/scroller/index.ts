import { createThemePart, css } from '@ngneers/controls-themes/api';
import { scrollerControlTemplate } from '@ngneers/controls-themes/templates/scroller';

export const scrollerStyles = createThemePart({
  controlTemplate: scrollerControlTemplate,
  dependencies: [],
  root: {
    css: ({ v, c }) => css`
      ${c('root')} {
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
        &::before,
        &::after {
          content: '';
          display: block;
          flex-shrink: 0;
        }
        &::before {
          height: var(--ngn-scroller-padding-top, 0px);
        }
        &::after {
          height: var(--ngn-scroller-padding-bottom, 0px);
        }
        ${c('item')} {
          flex-shrink: 0;
          height: var(--ngn-scroller-item-height, unset);
        }
      }
      ${c('item-sticky')} {
        z-index: 1;
        position: sticky;
        top: 0;
      }
      ${c('item')} {
        display: block;
      }
    `,
  },
});
