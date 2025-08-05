import { createThemePart, css } from '@ngneers/controls-themes/api';
import { colorsTemplate, sizesTemplate } from '@ngneers/controls-themes/nova/base';
import { selectControlTemplate } from '@ngneers/controls-themes/templates/select';

export const selectStyles = createThemePart({
  controlTemplate: selectControlTemplate,
  dependencies: [colorsTemplate, sizesTemplate],
  root: {
    css: ({ v, c, d }) => css`
      ${c('input')} ${d('input-field')} {
        cursor: pointer;
      }
      ${c('input-editable')} ${d('input-field')} {
        cursor: text;
      }
      ${c('popover-content')} {
        height: 100%;
        display: flex;
        flex-direction: column;
      }
      ${c('filter')} {
        margin: ${v('size.padding.md')};
      }
      ${c('')} ${d('popover', 'content')} {
        padding: 0;
      }
      ${c('')} ${d('list-box')} {
        border-width: 0;
      }
    `,
  },
});
