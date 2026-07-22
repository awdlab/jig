import { createThemePart, css } from '@ngneers/controls-themes/api';
import { baseStyles } from '@ngneers/controls-themes/base';
import {
  colorsTemplate,
  fontTemplate,
  sizesTemplate,
} from '@ngneers/controls-themes/material/base';
import { treeControlTemplate } from '@ngneers/controls-themes/templates/tree';

export const treeStyles = createThemePart({
  controlTemplate: treeControlTemplate,
  base: baseStyles.tree,
  dependencies: [colorsTemplate, sizesTemplate, fontTemplate],
  root: {
    css: ({ v, c, d }) => css`
      ${c('root')} {
        border-radius: ${v('size.rounded.md')};
        border-color: ${v('color.border')};
        border-width: 1px;
        border-style: solid;
        padding: ${v('size.padding.sm')};
        background: ${v('color.background')};
      }
      ${c('invalid')} {
        border-color: ${v('color.invalid.border')};
      }
      ${c('item')},
      ${c('group')} {
        gap: ${v('size.padding.sm')};
        min-height: 2.25rem;
        padding-inline-end: ${v('size.padding.md')};
        border-radius: ${v('size.rounded.sm')};
        user-select: none;
        cursor: default;
        &:hover {
          background: color-mix(in srgb, ${v('color.text')} 8%, transparent);
        }
      }
      /* Extra breathing room between a row's checkbox and its label
         (adds to the row's flex gap; leaves the toggle-arrow spacing untouched). */
      ${d('item-checkbox')} {
        margin-inline-end: ${v('size.padding.sm')};
      }
      ${c('item-highlighted')} {
        background: color-mix(in srgb, ${v('color.text')} 8%, transparent);
      }
      ${c('item-selected')}:not(:has(${d('item-checkbox')})) {
        background: color-mix(in srgb, ${v('color.primary.500')} 12%, transparent);
        &:hover {
          background: color-mix(in srgb, ${v('color.primary.500')} 12%, transparent);
        }
      }
      ${c('toggle-icon')} {
        border-radius: ${v('size.rounded.full')};
        color: ${v('color.surface.500')};
      }
      ${c('toggle')}:hover ${c('toggle-icon')} {
        background: color-mix(in srgb, ${v('color.text')} 8%, transparent);
        color: ${v('color.surface.700')};
      }
      ${c('toggle-arrow')} {
        width: 0;
        height: 0;
        border-top: 0.4rem solid transparent;
        border-bottom: 0.4rem solid transparent;
        border-left: 0.5rem solid currentColor;
      }
      ${c('item-selectable')} {
        cursor: pointer;
      }
      ${c('default-item')} {
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
        align-items: center;
      }
    `,
  },
});
