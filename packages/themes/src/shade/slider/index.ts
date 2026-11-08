import { createThemePart, css } from '@awdlab/jig-themes/api';
import { baseStyles } from '@awdlab/jig-themes/base';
import {
  colorsTemplate,
  focusRingStyles,
  shadowTemplate,
  sizesTemplate,
} from '@awdlab/jig-themes/shade/base';
import { sliderControlTemplate } from '@awdlab/jig-themes/templates/slider';

export const sliderStyles = createThemePart({
  controlTemplate: sliderControlTemplate,
  base: baseStyles.slider,
  dependencies: [colorsTemplate, sizesTemplate, shadowTemplate],
  root: {
    css: ({ v, c }) => css`
      ${c('root')} {
        --trackThickness: 0.375rem;
        --thumbBorderSize: 0.125rem;
        --thumbSize: calc(var(--thumbBorderSize) * 2 + 0.75rem);
        &:focus-visible {
          outline: none;
          ${c('thumb')} {
            ${focusRingStyles(v)}
          }
        }
      }
      ${c('track')} {
        background: ${v('color.muted.base')};
        border-radius: ${v('size.rounded.full')};
      }
      ${c('fill')} {
        background: ${v('color.primary.base')};
        border-radius: ${v('size.rounded.full')};
      }
      ${c('thumb')} {
        background: ${v('color.background')};
        border-radius: ${v('size.rounded.full')};
        border: var(--thumbBorderSize) solid ${v('color.primary.base')};
        box-shadow: ${v('shadow.sm')};
      }
      ${c('root')}:not([disabled]):not(${c('readonly')}) {
        ${c('thumb')} {
          cursor: grab;
          &:active {
            cursor: grabbing;
          }
        }
      }
      ${c('invalid')} {
        ${c('fill')} {
          background: ${v('color.destructive.base')};
        }
        ${c('thumb')} {
          border-color: ${v('color.destructive.base')};
        }
      }
      ${c('root')}[disabled] {
        opacity: 0.5;
      }
    `,
  },
});
