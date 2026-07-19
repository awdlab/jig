import { createThemePart, css } from '@ngneers/controls-themes/api';
import { baseStyles } from '@ngneers/controls-themes/base';
import { colorsTemplate, fontTemplate, sizesTemplate } from '@ngneers/controls-themes/shade/base';
import { paginatorControlTemplate } from '@ngneers/controls-themes/templates/paginator';

export const paginatorStyles = createThemePart({
  controlTemplate: paginatorControlTemplate,
  base: baseStyles.paginator,
  dependencies: [colorsTemplate, sizesTemplate, fontTemplate],
  root: {
    css: ({ c, d, v }) => css`
      ${c('root')} > ${d('item-view')} {
        justify-content: center;
      }
      ${c('page-size-options')} {
        min-width: 4rem;
      }
      ${c('active-page')} {
        background: ${v('color.surface.200')};
        color: ${v('color.text')};
        font-weight: ${v('font.weight.semibold')};
        &:hover:not(:disabled) {
          background: ${v('color.surface.300')};
        }
        &:focus:not(:disabled) {
          background: ${v('color.surface.300')};
        }
        &:active:not(:disabled) {
          background: ${v('color.surface.400')};
        }
      }
    `,
  },
});
