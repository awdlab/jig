import { createThemePart, css } from '@ngneers/controls-themes/api';
import { baseStyles } from '@ngneers/controls-themes/base';
import { colorsTemplate, sizesTemplate } from '@ngneers/controls-themes/nova/base';
import { paginatorControlTemplate } from '@ngneers/controls-themes/templates/paginator';

export const paginatorStyles = createThemePart({
  controlTemplate: paginatorControlTemplate,
  base: baseStyles.paginator,
  dependencies: [colorsTemplate, sizesTemplate],
  root: {
    css: ({ v, c, d }) => css`
      ${c('root')} > ${d('item-view', 'root')} {
        justify-content: center;
      }
      ${c('page-size-options')} {
        min-width: 4rem;
      }
    `,
  },
});
