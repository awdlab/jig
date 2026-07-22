import { createThemePart, css } from '@ngneers/controls-themes/api';
import { baseStyles } from '@ngneers/controls-themes/base';
import {
  colorsTemplate,
  fontTemplate,
  sizesTemplate,
} from '@ngneers/controls-themes/material/base';
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
      /* Page cells are icon buttons and already come out MD3-round (kind-icon,
         full radius + built-in state layer) from the material button theme. */
      ${c('page-size-options')} {
        min-width: 4rem;
      }
      /* Current page: filled MD3 circle in the primary color, state-layered like
         a filled button so it reads as "you are here" without a separate accent. */
      ${c('active-page')} {
        background: ${v('color.primary.500')};
        color: ${v('color.primary.500-contrast')};
        font-weight: ${v('font.weight.medium')};
        &:hover:not(:disabled) {
          background: color-mix(
            in srgb,
            ${v('color.primary.500')} 92%,
            ${v('color.primary.500-contrast')}
          );
        }
        &:focus:not(:disabled) {
          background: color-mix(
            in srgb,
            ${v('color.primary.500')} 90%,
            ${v('color.primary.500-contrast')}
          );
        }
        &:active:not(:disabled) {
          background: color-mix(
            in srgb,
            ${v('color.primary.500')} 88%,
            ${v('color.primary.500-contrast')}
          );
        }
      }
    `,
  },
});
