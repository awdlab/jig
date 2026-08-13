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
      ${c('scroll-start')}, ${c('scroll-end')} {
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
      ${c('scroll-start')} {
        inset-inline-start: -0.5px; /** Not 0 to prevent small gaps due to rounding issues, I assume */
        margin-inline-end: -1rem;
        &::after {
          inset-inline-start: 100%;
          inset-inline-end: -0.625rem;
        }
      }
      ${c('scroll-end')} {
        inset-inline-end: -0.5px; /** Not 0 to prevent small gaps due to rounding issues, I assume */
        margin-inline-start: -1rem;
        &::after {
          inset-inline-end: 100%;
          inset-inline-start: -0.625rem;
        }
      }
    `,
  },
});
