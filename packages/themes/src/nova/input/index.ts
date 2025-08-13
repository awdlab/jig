import { createThemePart, css } from '@ngneers/controls-themes/api';
import { colorsTemplate, sizesTemplate } from '@ngneers/controls-themes/nova/base';
import { inputControlTemplate } from '@ngneers/controls-themes/templates/input';

export const inputStyles = createThemePart({
  controlTemplate: inputControlTemplate,
  dependencies: [colorsTemplate, sizesTemplate],
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
