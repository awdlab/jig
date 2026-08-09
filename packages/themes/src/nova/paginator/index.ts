import { createThemePart, css } from '@awdlab/jig-themes/api';
import { baseStyles } from '@awdlab/jig-themes/base';
import { colorsTemplate, fontTemplate, sizesTemplate } from '@awdlab/jig-themes/nova/base';
import { paginatorControlTemplate } from '@awdlab/jig-themes/templates/paginator';

export const paginatorStyles = createThemePart({
  controlTemplate: paginatorControlTemplate,
  base: baseStyles.paginator,
  dependencies: [colorsTemplate, sizesTemplate, fontTemplate],
  root: {
    css: ({ v, c, d }) => css`
      ${c('root')} {
        gap: ${v('size.padding.md')};
      }
      ${c('root')} > ${d('item-view')} {
        justify-content: center;
        /* item-view clips overflow; pad so the page buttons' focus ring is not cut off. */
        padding-block: 4px;
      }
      /* Page cells are icon buttons; let them grow past the square icon size so
         multi-digit page numbers fit. */
      ${c('root')} ${d('previous')},
      ${c('root')} ${d('next')},
      ${c('root')} ${d('page-number')},
      ${c('root')} ${d('overflow')} {
        min-width: ${v('size.height.control')};
        height: ${v('size.height.control')};
        width: auto;
      }
      ${c('page-size-options')} {
        min-width: 4rem;
      }
      /* Compact page indicator: matches the active page-button treatment. */
      ${c('root')} [data-compact-page] {
        min-width: calc(1rem + 2 * var(--padding));
        height: calc(1rem + 2 * var(--padding));
        padding: 0 ${v('size.padding.sm')};
        border-radius: ${v('size.rounded.md')};
        background: ${v('color.primary.500')};
        color: ${v('color.primary.500-contrast')};
        font-weight: ${v('font.weight.semibold')};
      }
      /* Current page: accent fill marking position, matching the theme's selection language. */
      ${c('active-page')} {
        background: ${v('color.primary.500')};
        color: ${v('color.primary.500-contrast')};
        font-weight: ${v('font.weight.semibold')};
        &:hover:not(:disabled) {
          background: ${v('color.primary.600')};
        }
        &:focus:not(:disabled) {
          background: ${v('color.primary.600')};
        }
        &:active:not(:disabled) {
          background: ${v('color.primary.700')};
        }
      }
    `,
  },
});
