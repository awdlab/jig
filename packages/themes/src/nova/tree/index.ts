import { createThemePart, css } from '@ngneers/controls-themes/api';
import { baseStyles } from '@ngneers/controls-themes/base';
import { colorsTemplate, fontTemplate, sizesTemplate } from '@ngneers/controls-themes/nova/base';
import { treeControlTemplate } from '@ngneers/controls-themes/templates/tree';

export const treeStyles = createThemePart({
  controlTemplate: treeControlTemplate,
  base: baseStyles.tree,
  dependencies: [colorsTemplate, sizesTemplate, fontTemplate],
  root: {
    css: ({ v, c, d }) => css`
      ${c('root')} {
        border-radius: ${v('size.rounded.md')};
        border-color: ${v('color.surface.300')};
        border-width: 1px;
        border-style: solid;
        padding: ${v('size.padding.sm')};
        background: ${v('color.background')};
      }
      ${c('invalid')} {
        border-color: ${v('color.error.500')};
      }
      ${c('item')},
      ${c('group')} {
        gap: ${v('size.padding.sm')};
        min-height: 2.25rem;
        padding-inline-end: ${v('size.padding.md')};
        border-radius: ${v('size.rounded.md')};
        user-select: none;
        cursor: default;
        &:hover {
          background: ${v('color.surface.200')};
        }
      }
      ${c('item-highlighted')} {
        background: ${v('color.surface.200')};
      }
      ${c('item-selected')}:not(:has(${d('checkbox', 'root')})) {
        background: ${v('color.surface.300')};
        &:hover {
          background: ${v('color.surface.300')};
        }
      }
      ${c('toggle-icon')} {
        border-radius: ${v('size.rounded.full')};
        color: ${v('color.surface.500')};
      }
      ${c('toggle')}:hover ${c('toggle-icon')} {
        background: ${v('color.surface.300')};
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
