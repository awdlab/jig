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
      ${c('active-page')} {
        background: ${v('color.secondary.500')};
        color: ${v('color.secondary.500-contrast')};
        &:hover:not(:disabled) {
          background: ${v('color.secondary.600')};
          color: ${v('color.secondary.600-contrast')};
        }
        &:focus:not(:disabled) {
          background: ${v('color.secondary.700')};
          color: ${v('color.secondary.700-contrast')};
        }
        &:active:not(:disabled) {
          background: ${v('color.secondary.800')};
          color: ${v('color.secondary.800-contrast')};
        }
      }
    `,
  },
});
