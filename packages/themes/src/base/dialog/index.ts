import { createThemePart, css } from '@awdlab/jig-themes/api';
import { dialogControlTemplate } from '@awdlab/jig-themes/templates/dialog';

export const dialogStyles = createThemePart({
  controlTemplate: dialogControlTemplate,
  dependencies: [],
  root: {
    css: ({ v, c, d }) => css`
      ${c('root')} {
        display: contents;
      }
      ${c('wrapper')} {
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
      ${c('wrapper')}${d('movable', 'moved')} {
        margin: unset;
      }
    `,
  },
});
