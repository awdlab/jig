import { createThemePart, css } from '@ngneers/controls-themes/api';
import { selectControlTemplate } from '@ngneers/controls-themes/templates/select';

export const selectStyles = createThemePart({
  controlTemplate: selectControlTemplate,
  dependencies: [],
  root: {
    css: ({ v, c, d }) => css`
      ${c('input')} {
        display: flex;
        justify-content: space-between;
        align-items: center;
        white-space: nowrap;
        user-select: none;
        width: 100%;
        outline: none;
      }
      ${c('root')} {
        width: 100%;
      }
      ${c('combobox')} {
        width: 100%;
      }
      ${c('input-editable')} {
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
      ${c('root')} ${d('list-box')} {
        border-width: 0;
      }
    `,
  },
});
