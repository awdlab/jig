import { createThemePart, css } from '@ngneers/controls-themes/api';
import { checkboxControlTemplate } from '@ngneers/controls-themes/templates/checkbox';

export const checkboxStyles = createThemePart({
  controlTemplate: checkboxControlTemplate,
  dependencies: [],
  root: {
    css: ({ v, c, d }) => css`
      ${c('')} {
        display: inline-flex;
        user-select: none;
        align-items: center;
        justify-content: center;
        position: relative;
        vertical-align: middle;
      }
      ${c('input')} {
        opacity: 0;
        position: absolute;
        inset: 0;
        margin: 0;
      }
      ${c('box')} {
        display: flex;
        align-items: center;
        justify-content: center;
      }
      ${c('box-icon')} {
        display: block;
      }
    `,
  },
});
