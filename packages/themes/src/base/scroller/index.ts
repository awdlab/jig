import { createThemePart, css } from '@awdlab/jig-themes/api';
import { scrollerControlTemplate } from '@awdlab/jig-themes/templates/scroller';

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
          height: var(--awd-scroller-padding-top, 0px);
        }
        &::after {
          height: var(--awd-scroller-padding-bottom, 0px);
        }
        ${c('item')} {
          flex-shrink: 0;
          height: var(--awd-scroller-item-height, unset);
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
