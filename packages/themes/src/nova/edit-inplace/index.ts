import { createThemePart, css } from '@ngneers/controls-themes/api';
import { baseStyles } from '@ngneers/controls-themes/base';
import { colorsTemplate, sizesTemplate } from '@ngneers/controls-themes/nova/base';
import { editInplaceControlTemplate } from '@ngneers/controls-themes/templates/edit-inplace';

export const editInplaceStyles = createThemePart({
  controlTemplate: editInplaceControlTemplate,
  base: baseStyles.editInplace,
  dependencies: [sizesTemplate, colorsTemplate],
  root: {
    css: ({ c, d, v }) => css`
      ${c('default-display')} {
        /* No border compensation needed: the inplace display carries a transparent border
           matching the field's, so both modes already share a box model. */
        padding: 0;
      }
      ${c('root')} {
        display: inline-block;
      }
      ${c('default-fallback-display')} {
        font-style: italic;
      }

      ${c('readonly')} ${d('inplace', 'display')} {
        cursor: default;
        &:hover,
        &:active,
        &:focus-visible {
          background-color: transparent;
        }
      }
      ${c('disabled')} ${d('inplace', 'display')} {
        cursor: default;
        color: ${v('color.disabled.text')};
        &:hover,
        &:active,
        &:focus-visible {
          background-color: transparent;
        }
      }
      ${c('invalid')} {
        ${d('inplace', 'display')} {
          color: ${v('color.error.500')};
        }
        &${c('disabled')} ${d('inplace', 'display')} {
          color: ${v('color.error.200')};
        }
      }
    `,
  },
});
