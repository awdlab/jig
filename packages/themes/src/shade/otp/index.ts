import { createThemePart, css } from '@awdlab/jig-themes/api';
import { baseStyles } from '@awdlab/jig-themes/base';
import {
  animationTemplate,
  colorsTemplate,
  focusRing,
  focusRingSetup,
  fontTemplate,
  shadowTemplate,
  sizesTemplate,
} from '@awdlab/jig-themes/shade/base';
import { otpControlTemplate } from '@awdlab/jig-themes/templates/otp';

export const otpStyles = createThemePart({
  controlTemplate: otpControlTemplate,
  base: baseStyles.otp,
  dependencies: [animationTemplate, colorsTemplate, fontTemplate, shadowTemplate, sizesTemplate],
  root: {
    css: ({ v, c }) => css`
      ${c('root')} {
        gap: ${v('size.padding.md')};
      }
      ${c('box')} {
        /* focus-ring contract (see focusRingSetup): states override --shade-shadow / --shade-ring */
        ${focusRingSetup(v)}
        --shade-shadow: ${v('shadow.sm')};
        width: 2.75rem;
        height: 2.75rem;
        border: 1px solid ${v('color.input')};
        border-radius: ${v('size.rounded.md')};
        font-family: ${v('font.family')};
        font-size: ${v('font.size.lg')};
        font-weight: ${v('font.weight.medium')};
        background: transparent;
        color: ${v('color.foreground')};
        box-shadow: var(--shade-shadow);
        transition-property: color, background-color, border-color, box-shadow;
        transition-duration: ${v('anim.time.snappyFade')};
        transition-timing-function: ${v('anim.ease.snappyFade')};
        caret-color: transparent;
        ${focusRing}

        &:focus-visible {
          border-color: ${v('color.ring')};
        }
        &:read-only:not(:disabled) {
          background: ${v('color.muted.base')};
        }
        &:disabled {
          opacity: 0.5;
        }
      }

      /* invalid — applied on the host, cascades to the cells */
      ${c('invalid')} ${c('box')},
      ${c('box')}[aria-invalid='true'] {
        border-color: ${v('color.destructive.base')};
        --shade-ring: color-mix(in srgb, ${v('color.destructive.base')} 20%, transparent);
        &:focus-visible {
          border-color: ${v('color.destructive.base')};
        }
      }
    `,
  },
});
