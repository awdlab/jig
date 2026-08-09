import { createThemePart, css } from '@awdlab/jig-themes/api';
import { selectControlTemplate } from '@awdlab/jig-themes/templates/select';

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
        /* Fill the host so an editable select's input can stretch across the
           surrounding field's full height and claim its padding. */
        height: 100%;
      }
      ${c('root')} {
        width: 100%;
        align-self: stretch;
      }
      ${c('combobox')} {
        width: 100%;
        min-height: 1lh;
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
