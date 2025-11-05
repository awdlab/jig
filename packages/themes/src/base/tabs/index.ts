import { createThemePart, css } from '@ngneers/controls-themes/api';
import { tabsControlTemplate } from '@ngneers/controls-themes/templates/tabs';

export const tabsStyles = createThemePart({
  controlTemplate: tabsControlTemplate,
  dependencies: [],
  root: {
    css: ({ v, c }) => css`
      ${c()} {
        display: flex;
        flex-direction: column;
      }
      ${c('headers')} {
        width: 100%;
        display: flex;
        position: relative;
        overflow-x: scroll;
        overflow-y: hidden;
        &::-webkit-scrollbar {
          display: none;
        }
        --ms-overflow-style: none; /* IE and Edge */
        scrollbar-width: none; /* Firefox */
      }
      ${c('header')} {
        white-space: nowrap;
      }
      ${c('header-active-indicator')} {
        position: absolute;
        bottom: 0;
        pointer-events: none;
      }
      ${c('scroll-left')}, ${c('scroll-right')} {
        position: sticky;
        border: none;
        flex-shrink: 0;
        z-index: 1;
        &::after {
          content: '';
          position: absolute;
          top: 0;
          bottom: 0;
          pointer-events: none;
        }
      }
      ${c('scroll-left')} {
        left: 0;
        margin-right: -16px;
        &::after {
          left: 100%;
          right: -10px;
          background: linear-gradient(90deg, var(--blurColor), transparent);
        }
      }
      ${c('scroll-right')} {
        right: 0;
        margin-left: -16px;
        &::after {
          right: 100%;
          left: -10px;
          background: linear-gradient(270deg, var(--blurColor), transparent);
        }
      }
    `,
  },
});
