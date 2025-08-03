import { createThemePart, createVariableTemplate, css } from '@ngneers/controls-themes/api';
import { colorsTemplate, sizesTemplate } from '@ngneers/controls-themes/nova/base';
import { inputControlTemplate } from '@ngneers/controls-themes/templates/input';

export const inputVariables = createVariableTemplate({
  scope: 'input',
  variables: {},
});

export const inputStyles = createThemePart({
  controlTemplate: inputControlTemplate,
  dependencies: [colorsTemplate, sizesTemplate],
  root: {
    css: ({ c, d }) => css`
      ${d('input-field')} ${c()} {
        background: transparent;
        border: none;
        width: 100%;
        outline: none;
      }
    `,
  },
});
