import { createThemePart, css } from '@awdlab/jig-themes/api';
import { drawerControlTemplate } from '@awdlab/jig-themes/templates/drawer';

export const drawerStyles = createThemePart({
  controlTemplate: drawerControlTemplate,
  dependencies: [],
  root: {
    css: ({ v, c, d }) => css`
      ${c('root')} {
        color: inherit;
        flex-direction: column;
        position: fixed;
        &:popover-open {
          display: flex;
        }
      }
      ${c('header')} {
        width: 100%;
      }
      ${c('default-header')} {
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
      ${c('footer')} {
        width: 100%;
      }
      body:has(${c('root')}:popover-open) {
        pointer-events: none;
        ${c('root')} {
          pointer-events: all;
        }
      }
    `,
  },
});
