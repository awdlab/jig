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
      ${c('input')}[disabled], ${c('input')}[aria-readonly] {
        cursor: default;
      }
      ${c('input')} {
        cursor: pointer;
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
    `,
  },
});
