import { createThemePart, css } from '@ngneers/controls-themes/api';
import { baseStyles } from '@ngneers/controls-themes/base';
import {
  colorsTemplate,
  controlRing,
  ringTemplate,
  sizesTemplate,
} from '@ngneers/controls-themes/nova/base';
import { inplaceControlTemplate } from '@ngneers/controls-themes/templates/inplace';

export const inplaceStyles = createThemePart({
  controlTemplate: inplaceControlTemplate,
  base: baseStyles.inplace,
  dependencies: [sizesTemplate, colorsTemplate, ringTemplate],
  root: {
    css: ({ v, c }) => css`
      /* Box model mirrors the input-field it swaps places with (same padding, border box and
         height), so entering edit mode doesn't shift the content. */
      ${c('display')} {
        display: inline-flex;
        align-items: center;
        min-height: ${v('size.height.control')};
        padding: ${v('size.padding.sm')} ${v('size.padding.lg')};
        cursor: pointer;
        background-color: transparent;
        border: 1px solid transparent;
        border-radius: ${v('size.rounded.sm')};
        &:hover {
          background-color: ${v('color.surface.100')};
        }
        &:active {
          background-color: ${v('color.surface.200')};
        }
        &:focus-visible {
          outline: 3px solid ${controlRing(v)};
          outline-offset: 0;
        }
      }
    `,
  },
});
