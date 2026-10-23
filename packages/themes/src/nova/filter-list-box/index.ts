import { createThemePart, css } from '@awdlab/jig-themes/api';
import { baseStyles } from '@awdlab/jig-themes/base';
import { colorsTemplate, sizesTemplate } from '@awdlab/jig-themes/nova/base';
import { filterListBoxControlTemplate } from '@awdlab/jig-themes/templates/filter-list-box';

export const filterListBoxStyles = createThemePart({
  controlTemplate: filterListBoxControlTemplate,
  base: baseStyles.filterListBox,
  dependencies: [colorsTemplate, sizesTemplate],
  root: {
    css: ({ v, c }) => css`
      ${c('root')} {
        gap: ${v('size.padding.md')};
      }
      ${c('search-row')} {
        gap: ${v('size.padding.sm')};
      }
      ${c('chips')} {
        gap: ${v('size.padding.sm')};
      }
      ${c('empty')} {
        gap: ${v('size.padding.md')};
        padding: ${v('size.padding.lg')};
      }
      ${c('empty-actions')} {
        gap: ${v('size.padding.sm')};
      }
    `,
  },
});
