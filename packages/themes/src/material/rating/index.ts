import { createThemePart, css } from '@ngneers/controls-themes/api';
import { baseStyles } from '@ngneers/controls-themes/base';
import { colorsTemplate, sizesTemplate } from '@ngneers/controls-themes/material/base';
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
        color: ${v('color.surface.300')};
        cursor: pointer;
      }
      ${c('full')} {
        color: ${v('color.primary.500')};
      }
      ${c('root')}:focus-visible {
        outline: none;
        ${c('symbol')} {
          outline: 2px solid ${v('color.surface.900')};
          outline-offset: 2px;
          border-radius: ${v('size.rounded.sm')};
        }
      }
      ${c('invalid')} {
        color: ${v('color.error.200')};
        ${c('full')} {
          color: ${v('color.error.500')};
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
