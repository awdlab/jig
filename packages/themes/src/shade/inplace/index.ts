import { createThemePart, css } from '@awdlab/jig-themes/api';
import { baseStyles } from '@awdlab/jig-themes/base';
import {
  animationTemplate,
  colorsTemplate,
  focusRingStyles,
  sizesTemplate,
} from '@awdlab/jig-themes/shade/base';
import { inplaceControlTemplate } from '@awdlab/jig-themes/templates/inplace';

export const inplaceStyles = createThemePart({
  controlTemplate: inplaceControlTemplate,
  base: baseStyles.inplace,
  dependencies: [sizesTemplate, colorsTemplate, animationTemplate],
  root: {
    css: ({ v, c }) => css`
      ${c('display')} {
        padding: ${v('size.padding.sm')} ${v('size.padding.md')};
        cursor: pointer;
        background-color: transparent;
        border: none;
        border-radius: ${v('size.rounded.md')};
        transition: background-color ${v('anim.time.snappyFade')} ease;
        &:hover {
          background-color: ${v('color.accent.base')};
        }
        &:active {
          background-color: ${v('color.accent.base')};
        }
        &:focus-visible {
          ${focusRingStyles(v)}
        }
      }
    `,
  },
});
