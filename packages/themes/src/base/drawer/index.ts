import { createThemePart, css } from '@ngneers/controls-themes/api';
import { drawerControlTemplate } from '@ngneers/controls-themes/templates/drawer';

export const drawerStyles = createThemePart({
  controlTemplate: drawerControlTemplate,
  dependencies: [],
  root: {
    css: ({ v, c, d }) => css`
      ${c()} {
        color: inherit;
        flex-direction: column;
        position: fixed;
        &[open],
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
    `,
  },
});
