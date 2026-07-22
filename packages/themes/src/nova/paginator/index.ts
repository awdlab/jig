import { createThemePart, css } from '@ngneers/controls-themes/api';
import { baseStyles } from '@ngneers/controls-themes/base';
import { colorsTemplate, fontTemplate, sizesTemplate } from '@ngneers/controls-themes/nova/base';
import { paginatorControlTemplate } from '@ngneers/controls-themes/templates/paginator';

export const paginatorStyles = createThemePart({
  controlTemplate: paginatorControlTemplate,
  base: baseStyles.paginator,
  dependencies: [colorsTemplate, sizesTemplate, fontTemplate],
  root: {
    css: ({ v, c, d }) => css`
      ${c('root')} > ${d('item-view')} {
        justify-content: center;
      }
      /* Page cells are icon buttons (circular by default) — square them off to
         match the rest of nova's clickable cells. */
      ${c('root')} ${d('previous')},
      ${c('root')} ${d('next')},
      ${c('root')} ${d('page-number')},
      ${c('root')} ${d('overflow')} {
        border-radius: ${v('size.rounded.md')};
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
        background: ${v('color.surface.200')};
        color: ${v('color.text')};
        font-weight: ${v('font.weight.semibold')};
      }
      /* Current page: a quiet neutral fill + weight, not a saturated accent block.
         It marks position without competing with the page's real primary actions. */
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
