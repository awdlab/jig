import { createThemePart, css } from '@awdlab/jig-themes/api';
import { baseStyles } from '@awdlab/jig-themes/base';
import {
  colorsTemplate,
  controlRing,
  ringTemplate,
  shadowTemplate,
  sizesTemplate,
} from '@awdlab/jig-themes/nova/base';
import { sliderControlTemplate } from '@awdlab/jig-themes/templates/slider';

export const sliderStyles = createThemePart({
  controlTemplate: sliderControlTemplate,
  base: baseStyles.slider,
  dependencies: [colorsTemplate, sizesTemplate, shadowTemplate, ringTemplate],
  root: {
    css: ({ v, c, d }) => css`
      ${c('root')} {
        --trackThickness: 0.3125rem;
        --thumbBorderSize: 0.125rem;
        --thumbSize: calc(var(--thumbBorderSize) * 2 + 0.75rem);
        &:focus-visible {
          outline: none;
          ${c('thumb')} {
            outline: 0.4rem solid ${controlRing(v)};
            outline-offset: 0;
          }
        }
      }
      ${c('thumb')}:focus-visible {
        outline: 0.4rem solid ${controlRing(v)};
        outline-offset: 0;
      }
      ${c('track')} {
        background: ${v('color.surface.100')};
        border-radius: ${v('size.rounded.full')};
      }
      ${c('fill')} {
        background: ${v('color.primary.500')};
        border-radius: ${v('size.rounded.full')};
      }
      ${c('thumb')} {
        background: ${v('color.background')};
        border-radius: ${v('size.rounded.full')};
        border: var(--thumbBorderSize) solid ${v('color.primary.500')};
        box-shadow: ${v('shadow.sm')};
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
