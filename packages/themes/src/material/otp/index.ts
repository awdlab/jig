import { createThemePart, css } from '@awdlab/jig-themes/api';
import { baseStyles } from '@awdlab/jig-themes/base';
import {
  animationTemplate,
  colorsTemplate,
  fontTemplate,
  sizesTemplate,
} from '@awdlab/jig-themes/material/base';
import { otpControlTemplate } from '@awdlab/jig-themes/templates/otp';

export const otpStyles = createThemePart({
  controlTemplate: otpControlTemplate,
  base: baseStyles.otp,
  dependencies: [colorsTemplate, fontTemplate, sizesTemplate, animationTemplate],
  root: {
    css: ({ v, c }) => css`
      ${c('root')} {
        gap: ${v('size.padding.sm')};
      }
      ${c('box')} {
        width: 2.75rem;
        height: 2.75rem;
        font-size: ${v('font.size.lg')};
        font-weight: ${v('font.weight.medium')};
        color: ${v('color.text')};
        background: ${v('color.background')};
        border: 1px solid ${v('color.border')};
        border-radius: ${v('size.rounded.md')};
        outline: 2px solid transparent;
        outline-offset: -2px;
        transition:
          border-color ${v('anim.time.snappyFade')} ${v('anim.ease.snappyFade')},
          outline-color ${v('anim.time.snappyFade')} ${v('anim.ease.snappyFade')};
        caret-color: transparent;

        &:hover {
          border-color: ${v('color.surface.500')};
        }
        &:focus {
          border-color: ${v('color.primary.foreground')};
          outline-color: ${v('color.primary.foreground')};
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
