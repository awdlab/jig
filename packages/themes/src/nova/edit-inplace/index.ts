import { createThemePart, css } from '@ngneers/controls-themes/api';
import { baseStyles } from '@ngneers/controls-themes/base';
import { colorsTemplate, sizesTemplate } from '@ngneers/controls-themes/nova/base';
import { editInplaceControlTemplate } from '@ngneers/controls-themes/templates/edit-inplace';

export const editInplaceStyles = createThemePart({
  controlTemplate: editInplaceControlTemplate,
  base: baseStyles.editInplace,
  dependencies: [sizesTemplate, colorsTemplate],
  root: {
    css: ({ c }) => css`
      ${c('default-display')} {
        padding: 1px; /* To avoid layout shift when switching to edit mode */
      }
    `,
  },
});
