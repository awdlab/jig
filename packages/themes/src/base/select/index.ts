import { createThemePart, css } from '@ngneers/controls-themes/api';
import { selectControlTemplate } from '@ngneers/controls-themes/templates/select';

export const selectStyles = createThemePart({
  controlTemplate: selectControlTemplate,
  dependencies: [],
  root: {
    css: ({ v, c, d }) => css`
      ${c('input')} ${d('input-field', 'root')} {
        display: flex;
        justify-content: space-between;
        align-items: center;
        white-space: nowrap;
        user-select: none;
      }
      ${c('combobox')} {
        width: 100%;
      }
      ${c('input-editable')} ${d('input-field', 'root')} {
        cursor: text;
      }
      ${c('popover-content')} {
        height: 100%;
        display: flex;
        flex-direction: column;
      }
      ${c('root')} ${d('popover', 'content')} {
        padding: 0;
      }
      ${c('list-box')}${d('list-box', 'root')} {
        border-width: 0;
      }
    `,
  },
});
