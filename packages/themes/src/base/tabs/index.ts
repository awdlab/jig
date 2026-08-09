import { createThemePart, css } from '@awdlab/jig-themes/api';
import { tabsControlTemplate } from '@awdlab/jig-themes/templates/tabs';

export const tabsStyles = createThemePart({
  controlTemplate: tabsControlTemplate,
  dependencies: [],
  root: {
    css: ({ v, c }) => css`
      ${c('root')} {
        display: flex;
        flex-direction: column;
      }
      ${c('headers-container')} {
        display: flex;
        align-items: center;
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
        width: 1rem;
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
        left: -0.5px; /** Not 0 to prevent small gaps due to rounding issues, I assume */
        margin-right: -1rem;
        &::after {
          left: 100%;
          right: -0.625rem;
        }
      }
      ${c('scroll-right')} {
        right: -0.5px; /** Not 0 to prevent small gaps due to rounding issues, I assume */
        margin-left: -1rem;
        &::after {
          right: 100%;
          left: -0.625rem;
        }
      }
    `,
  },
});
