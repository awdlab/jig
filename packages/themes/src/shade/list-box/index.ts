import { createThemePart, css } from '@ngneers/controls-themes/api';
import { baseStyles } from '@ngneers/controls-themes/base';
import { colorsTemplate, fontTemplate, sizesTemplate } from '@ngneers/controls-themes/shade/base';
import { listBoxControlTemplate } from '@ngneers/controls-themes/templates/list-box';

export const listBoxStyles = createThemePart({
  controlTemplate: listBoxControlTemplate,
  base: baseStyles.listBox,
  dependencies: [colorsTemplate, sizesTemplate, fontTemplate],
  root: {
    css: ({ v, c, d }) => css`
      ${c('root')} {
        border-radius: ${v('size.rounded.md')};
        border: 1px solid ${v('color.border')};
        padding: ${v('size.padding.sm')};
        background: ${v('color.background')};
        color: ${v('color.foreground')};
      }
      ${c('invalid')} {
        border-color: ${v('color.destructive.base')};
      }
      ${c('item')} {
        padding: ${v('size.padding.sm')} ${v('size.padding.md')};
        border-radius: ${v('size.rounded.sm')};
        user-select: none;
        cursor: default;
        font-size: ${v('font.size.sm')};
        &:hover {
          background: ${v('color.accent.base')};
          color: ${v('color.accent.foreground')};
        }
      }
      ${c('item-highlighted')} {
        background: ${v('color.accent.base')};
        color: ${v('color.accent.foreground')};
      }
      ${c('item-selected')}:not(:has(${d('checkbox')})) {
        background: ${v('color.accent.base')};
        color: ${v('color.accent.foreground')};
        &:hover {
          background: ${v('color.accent.base')};
        }
      }
      ${c('item-disabled')} {
        opacity: 0.5;
        &:hover {
          background: transparent;
          color: inherit;
        }
      }
      ${c('group')} {
        padding: ${v('size.padding.sm')} ${v('size.padding.md')};
        font-weight: ${v('font.weight.medium')};
        color: ${v('color.muted.foreground')};
        background: ${v('color.surface.50')};
        font-size: ${v('font.size.xs')};
        cursor: default;
      }
      /* every group but the first opens a new section with a divider above it */
      ${c('separator')} ${c('group')}:not(:first-of-type) {
        border-radius: 0;
        border-top: 1px solid ${v('color.border')};
        margin-top: ${v('size.padding.sm')};
        padding-top: ${v('size.padding.md')};
      }
      ${c('default-group')},
      ${c('default-item')} {
        max-width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      ${c('empty')} {
        text-align: center;
        padding: ${v('size.padding.md')};
        color: ${v('color.muted.foreground')};
      }
      ${c('root')} ${d('scroller', 'item')} {
        gap: ${v('size.padding.md')};
        align-items: center;
      }
    `,
  },
});
