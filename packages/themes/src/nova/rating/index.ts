import { createThemePart, css } from '@awdlab/jig-themes/api';
import { baseStyles } from '@awdlab/jig-themes/base';
import {
  colorsTemplate,
  controlRing,
  ringTemplate,
  sizesTemplate,
} from '@awdlab/jig-themes/nova/base';
import { ratingControlTemplate } from '@awdlab/jig-themes/templates/rating';

export const ratingStyles = createThemePart({
  controlTemplate: ratingControlTemplate,
  base: baseStyles.rating,
  dependencies: [colorsTemplate, sizesTemplate, ringTemplate],
  root: {
    css: ({ v, c }) => css`
      ${c('root')} {
        --icon-size: 1.5rem;
        font-size: var(--icon-size);
        color: ${v('color.surface.300')};
        cursor: pointer;
      }
      ${c('full')} {
        color: ${v('color.secondary.500')};
      }
      ${c('root')}:focus-visible {
        outline: none;
        ${c('symbol')} {
          outline: 3px solid ${controlRing(v)};
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
