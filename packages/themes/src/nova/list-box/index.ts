import { createThemePart, css } from '@ngneers/controls-themes/api';
import { colorsTemplate, sizesTemplate } from '@ngneers/controls-themes/nova/base';
import { listBoxControlTemplate } from '@ngneers/controls-themes/templates/list-box';

export const listBoxStyles = createThemePart({
  controlTemplate: listBoxControlTemplate,
  dependencies: [colorsTemplate, sizesTemplate],
  root: {
    css: ({ v, c }) => css`
      ${c()} {
        border-radius: ${v('size.rounded.md')};
        border-color: ${v('color.surface.300')};
        border-width: 1px;
        border-style: solid;
        width: 100%;
        height: 100%;
      }
      ${c('invalid')} {
        border-color: ${v('color.error.default')};
      }
      ${c('scroller')} {
        padding: ${v('size.padding.sm')};
      }
      ${c('item')} {
        display: inline-block;
        width: 100%;
        padding: ${v('size.padding.md')};
        border-radius: ${v('size.rounded.md')};
        border-width: 0;
        border-style: solid;
        &:hover {
          background: ${v('color.surface.200')};
        }
      }
      ${c('item-highlighted')} {
        background: ${v('color.surface.200')};
      }
      ${c('item-selected')} {
        background: ${v('color.surface.300')};
        &:hover {
          background: ${v('color.surface.300')};
        }
      }
      ${c('group')} {
        display: inline-block;
        width: 100%;
        padding: ${v('size.padding.md')};
        padding-left: ${v('size.padding.lg')};
        background: ${v('color.surface.100')};
        color: ${v('color.surface.600')};
        border-radius: ${v('size.rounded.md')};
        border-width: 0;
        border-style: solid;
        &:hover {
          background: ${v('color.surface.100')};
        }
      }
    `,
  },
});
