import { createThemePart, css } from '@ngneers/controls-themes/api';
import { baseStyles } from '@ngneers/controls-themes/base';
import {
  colorsTemplate,
  fieldInvalidRing,
  fieldRing,
  fontTemplate,
  ringTemplate,
  sizesTemplate,
} from '@ngneers/controls-themes/nova/base';
import { otpControlTemplate } from '@ngneers/controls-themes/templates/otp';

export const otpStyles = createThemePart({
  controlTemplate: otpControlTemplate,
  base: baseStyles.otp,
  dependencies: [colorsTemplate, fontTemplate, sizesTemplate, ringTemplate],
  root: {
    css: ({ v, c }) => css`
      ${c('root')} {
        gap: ${v('size.padding.sm')};
      }
      ${c('box')} {
        width: 2rem;
        height: ${v('size.height.control')};
        font-size: ${v('font.size.lg')};
        font-weight: ${v('font.weight.semibold')};
        color: ${v('color.text')};
        background: ${v('color.surface.50')};
        border: 1px solid ${v('color.border')};
        border-radius: ${v('size.rounded.lg')};
        outline: 3px solid transparent;
        outline-offset: 0;
        transition:
          border-color 0.15s ease,
          outline-color 0.15s ease;
        caret-color: transparent;

        &:hover {
          border-color: ${v('color.primary.500')};
        }
        &:focus {
          border-color: ${v('color.primary.500')};
          outline-color: ${fieldRing(v)};
        }
        &:disabled {
          background: ${v('color.disabled.background')};
          border-color: ${v('color.disabled.border')};
          color: ${v('color.disabled.text')};
        }
        &:disabled:hover {
          border-color: ${v('color.disabled.border')};
        }
        &:read-only {
          border-color: ${v('color.disabled.border')};
        }
      }

      /* invalid — applied on the host, cascades to the cells. The cells can't be wrapped in an
         input-field, so the ring treatment is shared through fieldInvalidRing instead. */
      ${c('invalid')} ${c('box')},
      ${c('box')}[aria-invalid='true'] {
        border-color: ${v('color.invalid.border')};

        &:focus {
          border-color: ${v('color.invalid.border')};
          outline-color: ${fieldInvalidRing(v)};
        }
      }
    `,
  },
});
