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
    filter: {
      margin: null,
    },
  },
});

export const selectStyles = createThemePart({
  controlTemplate: selectControlTemplate,
  variables: [selectVariables],
  dependencies: [colorsTemplate],
  root: {
    values: {
      filter: {
        margin: '0.5rem',
      },
    },
    css: ({ v, c, d }) => css`
      ${c('popover-content')} {
        height: 100%;
        display: flex;
        flex-direction: column;
      }
      ${c('filter')} {
        margin: ${v('select.filter.margin')};
      }
      ${c('')} ${d('popover', 'content')} {
        padding: 0;
      }
      ${c('')} ${d('list-box', '')} {
        border-width: 0;
      }
    `,
  },
});
