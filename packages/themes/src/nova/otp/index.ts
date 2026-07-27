import { createThemePart, css } from '@ngneers/controls-themes/api';
import { baseStyles } from '@ngneers/controls-themes/base';
import { colorsTemplate, fontTemplate, sizesTemplate } from '@ngneers/controls-themes/nova/base';
import { otpControlTemplate } from '@ngneers/controls-themes/templates/otp';

export const otpStyles = createThemePart({
  controlTemplate: otpControlTemplate,
  base: baseStyles.otp,
  dependencies: [colorsTemplate, fontTemplate, sizesTemplate],
  root: {
    css: ({ v, c }) => css`
      ${c('root')} {
        gap: ${v('size.padding.sm')};
      }
      ${c('box')} {
        --box-size: 2.75rem;
        width: var(--box-size);
        height: var(--box-size);
        font-size: ${v('font.size.lg')};
        font-weight: ${v('font.weight.medium')};
        color: ${v('color.text')};
        background: ${v('color.background')};
        border: 1px solid ${v('color.border')};
        border-radius: ${v('size.rounded.md')};
        outline: 2px solid transparent;
        outline-offset: -1px;
        transition:
          border-color 0.1s ease-in-out,
          outline-color 0.1s ease-in-out;
        caret-color: transparent;

        &:hover {
          border-color: ${v('color.surface.500')};
        }
        &:focus {
          border-color: ${v('color.primary.500')};
          outline-color: ${v('color.primary.500')};
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

      /* invalid — applied on the host, cascades to the cells */
      ${c('invalid')} ${c('box')},
      ${c('box')}[aria-invalid='true'] {
        border-color: ${v('color.invalid.border')};

        &:focus {
          border-color: ${v('color.invalid.border')};
          outline-color: ${v('color.invalid.border')};
        }
      }
    `,
  },
});
