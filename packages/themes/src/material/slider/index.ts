import { createThemePart, css } from '@awdlab/jig-themes/api';
import { baseStyles } from '@awdlab/jig-themes/base';
import { animationTemplate, colorsTemplate, sizesTemplate } from '@awdlab/jig-themes/material/base';
import { sliderControlTemplate } from '@awdlab/jig-themes/templates/slider';

export const sliderStyles = createThemePart({
  controlTemplate: sliderControlTemplate,
  base: baseStyles.slider,
  dependencies: [colorsTemplate, sizesTemplate, animationTemplate],
  root: {
    css: ({ v, c, d }) => css`
      ${c('root')} {
        --trackThickness: 0.375rem;
        --thumbSize: 1.25rem;
        &:focus-visible {
          outline: none;
        }
      }
      ${c('track')} {
        background: ${v('color.surface.300')};
        border-radius: calc(var(--trackThickness) / 2);
      }
      ${c('fill')} {
        background: ${v('color.primary.500')};
        border-radius: calc(var(--trackThickness) / 2);
      }
      ${c('thumb')} {
        background: ${v('color.primary.500')};
        border-radius: ${v('size.rounded.full')};
        transition: box-shadow ${v('anim.time.snappyFade')} ${v('anim.ease.snappyFade')};
      }
      ${c('root')}:not([disabled]):not(${c('readonly')}) {
        ${c('thumb')} {
          cursor: grab;
          &:active {
            cursor: grabbing;
          }
        }
      }
      /* MD3 state-layer halo on the thumb. */
      ${c('root')}:not([disabled]):hover ${c('thumb')} {
        box-shadow: 0 0 0 0.625rem color-mix(in srgb, ${v('color.primary.500')} 8%, transparent);
      }
      ${c('root')}:focus-visible ${c('thumb')} {
        box-shadow: 0 0 0 0.625rem color-mix(in srgb, ${v('color.primary.500')} 12%, transparent);
      }
      ${c('invalid')} {
        ${c('track')} {
          background: ${v('color.error.200')};
        }
        ${c('thumb')} {
          background: ${v('color.error.500')};
        }
        ${c('fill')} {
          background: ${v('color.error.500')};
        }
      }
      ${c('root')}[disabled] {
        ${c('track')} {
          background: ${v('color.surface.100')};
        }
        ${c('thumb')} {
          background: ${v('color.surface.200')};
        }
        ${c('fill')} {
          background: ${v('color.surface.200')};
        }
        &${c('invalid')} {
          ${c('track')} {
            background: ${v('color.error.100')};
          }
          ${c('thumb')} {
            background: ${v('color.error.200')};
          }
          ${c('fill')} {
            background: ${v('color.error.200')};
          }
        }
      }
      ${c('root')}${c('readonly')} {
        ${c('thumb')} {
          background: ${v('color.surface.700')};
        }
        ${c('fill')} {
          background: ${v('color.surface.700')};
        }
        &${c('invalid')} {
          ${c('track')} {
            background: ${v('color.error.100')};
          }
          ${c('thumb')} {
            background: ${v('color.error.300')};
          }
          ${c('fill')} {
            background: ${v('color.error.300')};
          }
        }
      }
    `,
  },
});
