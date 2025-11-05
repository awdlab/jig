import { createThemePart, css } from '@ngneers/controls-themes/api';
import { inputFieldControlTemplate } from '@ngneers/controls-themes/templates/input-field';

export const inputFieldStyles = createThemePart({
  controlTemplate: inputFieldControlTemplate,
  dependencies: [],
  root: {
    css: ({ v, c }) => css`
      ${c()} {
        cursor: text;
        display: inline-flex;
        align-items: center;
        width: 100%;
        overflow: auto;
        &:has(textarea) {
          resize: both;
        }
      }
    `,
  },
});
