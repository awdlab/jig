import { createThemePart, css } from '@ngneers/controls-themes/api';
import { baseStyles } from '@ngneers/controls-themes/base';
import {
  colorsTemplate,
  controlRing,
  fontTemplate,
  ringTemplate,
  shadowTemplate,
  sizesTemplate,
} from '@ngneers/controls-themes/nova/base';
import { listBoxControlTemplate } from '@ngneers/controls-themes/templates/list-box';

export const listBoxStyles = createThemePart({
  controlTemplate: listBoxControlTemplate,
  base: baseStyles.listBox,
  dependencies: [colorsTemplate, sizesTemplate, fontTemplate, shadowTemplate, ringTemplate],
  root: {
    css: ({ v, c, d }) => css`
      ${c('root')} {
        border-radius: ${v('size.rounded.lg')};
        border-color: ${v('color.border')};
        border-width: 1px;
        border-style: solid;
        padding: ${v('size.padding.sm')};
        background: ${v('color.background')};
        box-shadow: ${v('shadow.sm')};
        /* The list is one tab stop and moves the highlight with the arrow keys, so the ring
           goes on the container. */
        &:focus-visible {
          outline: 3px solid ${controlRing(v)};
          outline-offset: 0;
        }
      }
      ${c('invalid')} {
        border-color: ${v('color.error.500')};
      }
      ${c('item')} {
        padding: ${v('size.padding.md')};
        border-radius: ${v('size.rounded.sm')};
        border-width: 0;
        border-style: solid;
        user-select: none;
        cursor: default;
        &:hover {
          background: ${v('color.surface.100')};
        }
      }
      /* Tints mix the accent into the surface rather than using a fixed palette step,
         so they stay visible in both schemes (a fixed 50 step collapses into the dark background). */
      ${c('item-highlighted')} {
        background: color-mix(in oklab, ${v('color.primary.500')} 12%, ${v('color.background')});
      }
      ${c('item-selected')}:not(:has(${d('checkbox')})) {
        background: color-mix(in oklab, ${v('color.primary.500')} 16%, ${v('color.background')});
        color: ${v('color.primary.700')};
        font-weight: ${v('font.weight.semibold')};
        &:hover {
          background: color-mix(in oklab, ${v('color.primary.500')} 22%, ${v('color.background')});
        }
      }
      ${c('group')} {
        padding: ${v('size.padding.md')};
        font-weight: ${v('font.weight.semibold')};
        background: ${v('color.surface.100')};
        color: ${v('color.surface.500')};
        border-radius: ${v('size.rounded.sm')};
        border-width: 0;
        border-style: solid;
        cursor: default;
        &:hover {
          background: ${v('color.surface.100')};
        }
      }
      /* every group but the first opens a new section with a divider above it */
      ${c('separator')} ${c('group')}:not(:first-of-type) {
        border-radius: 0;
        border-top: 1px solid ${v('color.border')};
        margin-top: ${v('size.padding.sm')};
        padding-top: ${v('size.padding.md')};
      }
      ${c('default-group')}, ${c('default-item')} {
        max-width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      ${c('empty')} {
        text-align: center;
        padding: ${v('size.padding.md')};
      }
      ${c('root')} ${d('scroller', 'item')} {
        gap: ${v('size.padding.md')};
        align-items: center;
      }
    `,
  },
});
