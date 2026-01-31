import { createThemePart, css } from '@ngneers/controls-themes/api';
import { baseStyles } from '@ngneers/controls-themes/base';
import { colorsTemplate, sizesTemplate } from '@ngneers/controls-themes/nova/base';
import { sliderControlTemplate } from '@ngneers/controls-themes/templates/slider';

export const sliderStyles = createThemePart({
  controlTemplate: sliderControlTemplate,
  base: baseStyles.slider,
  dependencies: [colorsTemplate, sizesTemplate],
  root: {
    css: ({ v, c, d }) => css`
      ${c('root')} {
        --trackThickness: 0.5rem;
        --thumbBorderSize: 0.125rem;
        --thumbSize: calc(var(--thumbBorderSize) * 2 + 1rem);
        &:focus-visible {
          outline: none;
          ${c('thumb')} {
            outline: 0.4rem solid ${v('color.surface.900')};
            outline-offset: calc(-1px - var(--thumbBorderSize));
          }
        }
      }
      ${c('track')} {
        background: ${v('color.surface.200')};
        border-radius: ${v('size.rounded.md')};
      }
      ${c('fill')} {
        background: ${v('color.surface.900')};
        border-radius: ${v('size.rounded.md')};
      }
      ${c('thumb')} {
        background: ${v('color.surface.50')};
        border-radius: ${v('size.rounded.full')};
        border: var(--thumbBorderSize) solid ${v('color.surface.900')};
      }
      ${c('root')}:not([disabled]):not([aria-readonly='true']) {
        ${c('thumb')} {
          cursor: grab;
          &:active {
            cursor: grabbing;
          }
        }
      }
      ${c('invalid')} {
        ${c('track')} {
          background: ${v('color.error.200')};
        }
        ${c('thumb')} {
          border-color: ${v('color.error.500')};
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
          border-color: ${v('color.surface.200')};
        }
        ${c('fill')} {
          background: ${v('color.surface.200')};
        }
        &${c('invalid')} {
          ${c('track')} {
            background: ${v('color.error.100')};
          }
          ${c('thumb')} {
            border-color: ${v('color.error.200')};
          }
          ${c('fill')} {
            background: ${v('color.error.200')};
          }
        }
      }
      ${c('root')}[aria-readonly='true'] {
        ${c('thumb')} {
          border-color: ${v('color.surface.700')};
        }
        ${c('fill')} {
          background: ${v('color.surface.700')};
        }
        &${c('invalid')} {
          ${c('track')} {
            background: ${v('color.error.100')};
          }
          ${c('thumb')} {
            border-color: ${v('color.error.300')};
          }
          ${c('fill')} {
            background: ${v('color.error.300')};
          }
        }
      }
    `,
  },
});
