import { createThemePart, css } from '@ngneers/controls-themes/api';
import { baseStyles } from '@ngneers/controls-themes/base';
import { colorsTemplate, fontTemplate, sizesTemplate } from '@ngneers/controls-themes/nova/base';
import { listBoxControlTemplate } from '@ngneers/controls-themes/templates/list-box';

export const listBoxStyles = createThemePart({
  controlTemplate: listBoxControlTemplate,
  base: baseStyles.listBox,
  dependencies: [colorsTemplate, sizesTemplate, fontTemplate],
  root: {
    css: ({ v, c, d }) => css`
      ${c('root')} {
        border-radius: ${v('size.rounded.md')};
        border-color: ${v('color.surface.300')};
        border-width: 1px;
        border-style: solid;
        padding: ${v('size.padding.sm')};
      }
      ${c('invalid')} {
        border-color: ${v('color.error.500')};
      }
      ${c('item')} {
        padding: ${v('size.padding.md')};
        border-radius: ${v('size.rounded.md')};
        border-width: 0;
        border-style: solid;
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
      ${c('group')} {
        padding: ${v('size.padding.md')};
        font-weight: ${v('font.weight.semibold')};
        background: ${v('color.surface.100')};
        color: ${v('color.surface.500')};
        border-radius: ${v('size.rounded.md')};
        border-width: 0;
        border-style: solid;
        cursor: default;
        &:hover {
          background: ${v('color.surface.100')};
        }
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
