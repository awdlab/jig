import { createThemePart, css } from '@ngneers/controls-themes/api';
import { baseStyles } from '@ngneers/controls-themes/base';
import { colorsTemplate, fontTemplate, sizesTemplate } from '@ngneers/controls-themes/shade/base';
import { treeControlTemplate } from '@ngneers/controls-themes/templates/tree';

export const treeStyles = createThemePart({
  controlTemplate: treeControlTemplate,
  base: baseStyles.tree,
  dependencies: [colorsTemplate, sizesTemplate, fontTemplate],
  root: {
    css: ({ v, c, d }) => css`
      ${c('root')} {
        border-radius: ${v('size.rounded.md')};
        border: 1px solid ${v('color.border')};
        padding: ${v('size.padding.sm')};
        background: ${v('color.background')};
        color: ${v('color.foreground')};
        font-size: ${v('font.size.sm')};
      }
      ${c('invalid')} {
        border-color: ${v('color.destructive.base')};
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
          background: ${v('color.accent.base')};
          color: ${v('color.accent.foreground')};
        }
      }
      ${c('item-highlighted')} {
        background: ${v('color.accent.base')};
        color: ${v('color.accent.foreground')};
      }
      ${c('item-selected')}:not(:has(${d('item-checkbox')})) {
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
      ${c('toggle-icon')} {
        border-radius: ${v('size.rounded.sm')};
        color: ${v('color.muted.foreground')};
      }
      ${c('toggle')}:hover ${c('toggle-icon')} {
        background: ${v('color.accent.base')};
        color: ${v('color.accent.foreground')};
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
        color: ${v('color.muted.foreground')};
      }
      ${c('root')} ${d('scroller', 'item')} {
        align-items: center;
      }
    `,
  },
});
