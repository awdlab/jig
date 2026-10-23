import { createThemePart, css } from '@awdlab/jig-themes/api';
import { baseStyles } from '@awdlab/jig-themes/base';
import { colorsTemplate, sizesTemplate } from '@awdlab/jig-themes/shade/base';
import { filterBarControlTemplate } from '@awdlab/jig-themes/templates/filter-bar';

export const filterBarStyles = createThemePart({
  controlTemplate: filterBarControlTemplate,
  base: baseStyles.filterBar,
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
    `,
  },
});
