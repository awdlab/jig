import { createThemePart, css } from '@ngneers/controls-themes/api';
import { menuControlTemplate } from '@ngneers/controls-themes/templates/menu';

export const menuStyles = createThemePart({
  controlTemplate: menuControlTemplate,
  dependencies: [],
  root: {
    css: ({ v, c, d }) => css`
      ${c('root')} {
        display: flex;
        flex-direction: column;
      }
      ${c('item')} {
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
    `,
  },
});
