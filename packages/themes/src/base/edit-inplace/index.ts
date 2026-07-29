import { createThemePart, css } from '@ngneers/controls-themes/api';
import { editInplaceControlTemplate } from '@ngneers/controls-themes/templates/edit-inplace';

export const editInplaceStyles = createThemePart({
  controlTemplate: editInplaceControlTemplate,
  dependencies: [],
  root: {
    css: ({ c, d }) => css`
      /* The display swaps into a text input, so signal editing rather than navigation. */
      ${d('inplace', 'display')} {
        cursor: text;
      }
      ${c('sr-only')} {
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        white-space: nowrap;
        border: 0;
      }
    `,
  },
});
