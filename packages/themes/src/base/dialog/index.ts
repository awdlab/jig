import { createThemePart, css } from '@ngneers/controls-themes/api';
import { dialogControlTemplate } from '@ngneers/controls-themes/templates/dialog';

export const dialogStyles = createThemePart({
  controlTemplate: dialogControlTemplate,
  dependencies: [],
  root: {
    css: ({ v, c, d }) => css`
      ${c()} {
        color: inherit;
        margin: auto;
        flex-direction: column;
        position: fixed;
        &[open],
        &:popover-open {
          display: flex;
        }
      }
      ${c('header')} {
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
      ${c('content')} {
        overflow: auto;
      }
      ${c('default-footer')} {
        display: flex;
        align-items: center;
        justify-content: flex-end;
      }
      ${d('movable', 'moved')} {
        margin: unset;
      }
    `,
  },
});
