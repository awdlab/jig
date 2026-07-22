import { createThemePart, css } from '@ngneers/controls-themes/api';
import { baseStyles } from '@ngneers/controls-themes/base';
import { colorsTemplate, sizesTemplate } from '@ngneers/controls-themes/shade/base';
import { ratingControlTemplate } from '@ngneers/controls-themes/templates/rating';

export const ratingStyles = createThemePart({
  controlTemplate: ratingControlTemplate,
  base: baseStyles.rating,
  dependencies: [colorsTemplate, sizesTemplate],
  root: {
    css: ({ v, c }) => css`
      ${c('root')} {
        --icon-size: 1.5rem;
        font-size: var(--icon-size);
        color: ${v('color.muted.base')};
        cursor: pointer;
      }
      ${c('full')} {
        color: ${v('color.primary.base')};
      }
      ${c('root')}:focus-visible {
        outline: none;
        ${c('symbol')} {
          outline: 2px solid ${v('color.ring')};
          outline-offset: 2px;
          border-radius: ${v('size.rounded.sm')};
        }
      }
      ${c('invalid')} {
        color: color-mix(in srgb, ${v('color.destructive.base')} 45%, transparent);
        ${c('full')} {
          color: ${v('color.destructive.base')};
        }
      }
      ${c('readonly')}, ${c('disabled')} {
        cursor: default;
      }
      ${c('disabled')} {
        opacity: 0.6;
      }
    `,
  },
});
