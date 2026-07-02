import { createThemePart, css } from '@ngneers/controls-themes/api';
import { baseStyles } from '@ngneers/controls-themes/base';
import { colorsTemplate, sizesTemplate } from '@ngneers/controls-themes/shade/base';
import { selectControlTemplate } from '@ngneers/controls-themes/templates/select';

export const selectStyles = createThemePart({
  controlTemplate: selectControlTemplate,
  base: baseStyles.select,
  dependencies: [colorsTemplate, sizesTemplate],
  root: {
    // The trigger surface comes from the input-field part; the dropdown from list-box + popover.
    css: ({ v, c, d }) => css`
      ${c('root')} {
        --icon-size: 14px;
      }
      ${c('input')} {
        gap: ${v('size.padding.sm')};
        &:not(:has([aria-readonly])):not(:has([disabled])) {
          cursor: pointer;
        }
        &:has([aria-readonly]),
        &:has([disabled]) {
          cursor: default;
        }
      }
      ${d(
        'input-field',
        'root'
      )}:has([role='combobox']:not([disabled]):not([aria-readonly='true'])) {
        cursor: pointer;
      }
      ${c('icon')} {
        color: ${v('color.muted.foreground')};
        cursor: pointer;
      }
      ${c('filter-icon')} {
        color: ${v('color.muted.foreground')};
      }
      ${c('input-editable')} {
        cursor: text;
      }
      ${c('filter')} {
        margin: ${v('size.padding.md')};
      }
    `,
  },
});
