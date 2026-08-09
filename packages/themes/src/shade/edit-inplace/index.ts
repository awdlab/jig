import { createThemePart, css } from '@awdlab/jig-themes/api';
import { baseStyles } from '@awdlab/jig-themes/base';
import { colorsTemplate, sizesTemplate } from '@awdlab/jig-themes/shade/base';
import { editInplaceControlTemplate } from '@awdlab/jig-themes/templates/edit-inplace';

export const editInplaceStyles = createThemePart({
  controlTemplate: editInplaceControlTemplate,
  base: baseStyles.editInplace,
  dependencies: [sizesTemplate, colorsTemplate],
  root: {
    css: ({ c, d, v }) => css`
      ${c('default-display')} {
        padding: 1px; /* To avoid layout shift when switching to edit mode */
      }
      ${c('root')} {
        display: inline-block;
      }
      ${c('default-fallback-display')} {
        font-style: italic;
        color: ${v('color.muted.foreground')};
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
        opacity: 0.5;
        &:hover,
        &:active,
        &:focus-visible {
          background-color: transparent;
        }
      }
      ${c('invalid')} {
        ${d('inplace', 'display')} {
          color: ${v('color.destructive.base')};
        }
      }
    `,
  },
});
