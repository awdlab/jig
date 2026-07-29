import { createThemePart, css } from '@ngneers/controls-themes/api';
import { baseStyles } from '@ngneers/controls-themes/base';
import {
  colorsTemplate,
  controlRing,
  fontTemplate,
  ringTemplate,
  sizesTemplate,
} from '@ngneers/controls-themes/nova/base';
import { accordionPanelControlTemplate } from '@ngneers/controls-themes/templates/accordion-panel';

export const accordionPanelStyles = createThemePart({
  controlTemplate: accordionPanelControlTemplate,
  base: baseStyles.accordionPanel,
  dependencies: [colorsTemplate, sizesTemplate, fontTemplate, ringTemplate],
  root: {
    css: ({ v, c }) => css`
      ${c('root')} {
        --icon-size: 14px;
        &:not(:last-child) {
          border-bottom: 1px solid ${v('color.border')};
        }
      }
      ${c('content-expander')} {
        color: ${v('color.text')};
        transition: grid-template-rows 0.2s ease-in-out;
      }
      ${c('content')} {
        color: ${v('color.surface.600')};
        ngn-defer {
          padding: ${v('size.padding.md')} ${v('size.padding.lg')};
        }
      }
      ${c('header')} {
        background: transparent;
        border: none;
        padding: 0;
        cursor: pointer;
        user-select: none;
        transition: background-color 0.2s ease-in-out;
        ngn-icon {
          color: ${v('color.surface.500')};
          margin: 0 ${v('size.padding.md')};
          transition: color 0.2s ease-in-out;
        }
        /* The accordion clips to its rounded corners, so the ring is drawn inside the header. */
        &:focus-visible {
          outline: 3px solid ${controlRing(v)};
          outline-offset: -3px;
        }
      }
      /* The outer headers carry the accordion's corner radius, so their fill and their inset
         ring follow the clipped curve instead of being cut off at the corners. The last header
         only sits on the bottom edge while its panel is collapsed. */
      ${c('root')}:first-child ${c('header')} {
        border-start-start-radius: ${v('size.rounded.lg')};
        border-start-end-radius: ${v('size.rounded.lg')};
      }
      ${c('root')}:last-child ${c('header')}:not(${c('header-expanded')}) {
        border-end-start-radius: ${v('size.rounded.lg')};
        border-end-end-radius: ${v('size.rounded.lg')};
      }
      /* Expanded panels get a tinted, accent-coloured header. */
      ${c('header-expanded')} {
        background: ${v('color.surface.50')};
        ${c('header-text')}, ngn-icon {
          color: ${v('color.primary.600')};
        }
      }
      /* Hover tints the row: the resting text is already the darkest tone, so a colour-only
         hover would have to go lighter and read as dimming. */
      ${c('root')} ${c('header')}:hover:not(${c('header-disabled')}) {
        background: ${v('color.surface.100')};
      }
      ${c('header-disabled')}, ${c('header-disabled')}:hover {
        cursor: default;
        ${c('header-text')} {
          color: ${v('color.surface.300')};
        }
        ngn-icon {
          color: ${v('color.surface.300')};
        }
      }
      ${c('header-text')} {
        padding: ${v('size.padding.md')} ${v('size.padding.lg')};
        font-weight: ${v('font.weight.semibold')};
        color: ${v('color.text')};
        transition: color 0.2s ease-in-out;
      }
    `,
  },
});
