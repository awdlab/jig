import { createThemePart, css } from '@awdlab/jig-themes/api';
import { baseStyles } from '@awdlab/jig-themes/base';
import {
  colorsTemplate,
  fontTemplate,
  shadowTemplate,
  sizesTemplate,
} from '@awdlab/jig-themes/material/base';
import { listBoxControlTemplate } from '@awdlab/jig-themes/templates/list-box';

export const listBoxStyles = createThemePart({
  controlTemplate: listBoxControlTemplate,
  base: baseStyles.listBox,
  dependencies: [colorsTemplate, sizesTemplate, fontTemplate, shadowTemplate],
  root: {
    css: ({ v, c, d }) => css`
      ${c('root')} {
        border-radius: ${v('size.rounded.md')};
        border-color: ${v('color.border')};
        border-width: 1px;
        border-style: solid;
        box-shadow: ${v('shadow.lg')};
        padding: ${v('size.padding.sm')};
        background: ${v('color.background')};
      }
      ${c('invalid')} {
        border-color: ${v('color.invalid.border')};
      }
      ${c('item')} {
        padding: ${v('size.padding.md')} ${v('size.padding.xl')};
        border-radius: ${v('size.rounded.sm')};
        border-width: 0;
        border-style: solid;
        user-select: none;
        cursor: default;
        &:hover {
          background: color-mix(in srgb, ${v('color.primary.500')} 8%, transparent);
        }
      }
      ${c('item-highlighted')} {
        background: color-mix(in srgb, ${v('color.primary.500')} 12%, transparent);
      }
      ${c('item-selected')}:not(:has(${d('checkbox')})) {
        background: color-mix(in srgb, ${v('color.primary.500')} 12%, transparent);
        color: ${v('color.primary.foreground')};
        &:hover {
          background: color-mix(in srgb, ${v('color.primary.500')} 12%, transparent);
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
