import { createThemePart, css } from '@ngneers/controls-themes/api';
import { inputControlTemplate } from '@ngneers/controls-themes/templates/input';

export const inputStyles = createThemePart({
  controlTemplate: inputControlTemplate,
  dependencies: [],
  root: {
    css: ({ c, d }) => css`
      ${c()} {
        font-family: inherit;
        font-size: inherit;
      }
      ${d('input-field')} ${c()} {
        padding: 0;
        background: transparent;
        border: none;
        width: 100%;
        height: 100%;
        outline: none;
        resize: none;
      }
    `,
  },
});
