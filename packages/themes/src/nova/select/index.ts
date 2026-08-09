import { createThemePart, css } from '@awdlab/jig-themes/api';
import { baseStyles } from '@awdlab/jig-themes/base';
import { colorsTemplate, sizesTemplate } from '@awdlab/jig-themes/nova/base';
import { selectControlTemplate } from '@awdlab/jig-themes/templates/select';

export const selectStyles = createThemePart({
  controlTemplate: selectControlTemplate,
  base: baseStyles.select,
  dependencies: [colorsTemplate, sizesTemplate],
  root: {
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
      ${c('root')}:has([role='combobox']:not([disabled]):not([aria-readonly='true'])) {
        cursor: pointer;
      }
      ${c('icon')} {
        color: ${v('color.surface.600')};
        cursor: pointer;
      }
      ${c('filter-icon')} {
        color: ${v('color.surface.600')};
      }
      ${c('placeholder')} {
        color: ${v('color.surface.600')};
      }
      ${c('input-editable')} {
        cursor: text;
      }
      ${d('filter')} {
        margin: ${v('size.padding.md')};
      }
    `,
  },
});
