import { createThemePart, createVariableTemplate, css } from '@ngneers/controls-themes/api';
import { colorsTemplate } from '@ngneers/controls-themes/nova/base';
import { selectControlTemplate } from '@ngneers/controls-themes/templates/select';

export const selectVariables = createVariableTemplate({
  scope: 'select',
  variables: {
    content: {
      borderColor: null,
      borderRadius: null,
      borderWidth: null,
      padding: null,
      background: null,
      color: null,
      boxShadow: null,
    },
  },
});

export const selectStyles = createThemePart({
  controlTemplate: selectControlTemplate,
  variables: [selectVariables],
  dependencies: [colorsTemplate],
  root: {
    values: {},
    css: ({ v, c, d }) => css`
      ${c('popover-content')} {
        height: 100%;
        display: flex;
        flex-direction: column;
      }
      ${d('popover', 'content')} {
        padding: 0;
      }
    `,
  },
});
