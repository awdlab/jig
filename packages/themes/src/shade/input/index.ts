import { createThemePart, css } from '@ngneers/controls-themes/api';
import { baseStyles } from '@ngneers/controls-themes/base';
import {
  animationTemplate,
  colorsTemplate,
  focusRing,
  focusRingSetup,
  fontTemplate,
  shadowTemplate,
  sizesTemplate,
} from '@ngneers/controls-themes/shade/base';
import { inputControlTemplate } from '@ngneers/controls-themes/templates/input';

export const inputStyles = createThemePart({
  controlTemplate: inputControlTemplate,
  base: baseStyles.input,
  dependencies: [animationTemplate, colorsTemplate, fontTemplate, shadowTemplate, sizesTemplate],
  root: {
    css: ({ v, c }) => css`
      ${c('root')} {
        /* focus-ring contract (see focusRingSetup): states override --shade-shadow / --shade-ring */
        ${focusRingSetup(v)}
        --shade-shadow: ${v('shadow.sm')};
        box-sizing: border-box;
        border: 1px solid ${v('color.input')};
        border-radius: ${v('size.rounded.md')};
        font-family: ${v('font.family')};
        font-size: ${v('font.size.sm')};
        padding: ${v('size.padding.md')} ${v('size.padding.lg')};
        background: transparent;
        color: ${v('color.foreground')};
        box-shadow: var(--shade-shadow);
        transition-property: color, background-color, border-color, box-shadow;
        transition-duration: ${v('anim.time.snappyFade')};
        transition-timing-function: ${v('anim.ease.snappyFade')};
        ${focusRing}
        &:focus-visible {
          border-color: ${v('color.ring')};
        }

        &::placeholder {
          color: ${v('color.muted.foreground')};
        }

        /* readable but clearly non-editable; :read-only also matches disabled
         * inputs, which must keep their un-recolored opacity-only treatment */
        &:read-only:not(:disabled),
        &[aria-readonly]:not(:disabled) {
          background: ${v('color.muted.base')};
        }

        &:disabled {
          opacity: 0.5;
          cursor: default;
        }
      }

      ${c('invalid')} {
        border-color: ${v('color.destructive.base')};
        --shade-ring: color-mix(in srgb, ${v('color.destructive.base')} 20%, transparent);
        &:focus-visible {
          border-color: ${v('color.destructive.base')};
        }
      }
    `,
  },
});
