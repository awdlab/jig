import { createThemePart, createVariableTemplate, css } from '@ngneers/controls-themes/api';
import { colorsTemplate, sizesTemplate } from '@ngneers/controls-themes/nova/base';
import { inputControlTemplate } from '@ngneers/controls-themes/templates/input';

export const inputVariables = createVariableTemplate({
  scope: 'input',
  variables: {
    fontSize: null,
    fontWeight: null,
    fontFamily: null,
    color: null,
  },
});

export const inputStyles = createThemePart({
  controlTemplate: inputControlTemplate,
  variables: [inputVariables],
  dependencies: [colorsTemplate, sizesTemplate],
  root: {
    css: ({ v, c, d }) => css`
      ${d('input-field')} ${c()} {
        font-size: ${v('input.fontSize')};
        font-weight: ${v('input.fontWeight')};
        font-family: ${v('input.fontFamily')};
        color: ${v('input.color')};
        background: transparent;
        border: none;
        width: 100%;
      }
    `,
  },
});
