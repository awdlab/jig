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
      /* Page cells are icon buttons (circular by default) — square them off to
         match the rest of nova's clickable cells. */
      ${c('root')} ${d('button', 'root')} {
        border-radius: ${v('size.rounded.md')};
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
