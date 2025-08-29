import { createThemePart, css } from '@ngneers/controls-themes/api';
import { colorsTemplate, sizesTemplate } from '@ngneers/controls-themes/nova/base';
import { menuControlTemplate } from '@ngneers/controls-themes/templates/menu';

export const menuStyles = createThemePart({
  controlTemplate: menuControlTemplate,
  dependencies: [colorsTemplate, sizesTemplate],
  root: {
    css: ({ v, c, d }) => css`
      ${c()} {
        display: flex;
        flex-direction: column;
      }
      ${c('submenu')} ${d('popover', 'content')} {
        margin: -4px 0;
      }
      ${c('popover')} {
        ${d('popover', 'content')} {
          padding: 4px;
        }
      }
      ${c('item-button')} {
        background: transparent;
        border: none;
        padding: 0;

        &:hover ${c('item')}:not(${c('item-disabled')}) {
          background: ${v('color.surface.100')};
        }
        &:focus-visible {
          outline: none;
          ${c('item')}:not(${c('item-disabled')}) {
            background: ${v('color.surface.200')};
          }
        }
        &:active ${c('item')}:not(${c('item-disabled')}) {
          background: ${v('color.surface.300')};
        }
      }
      ${c('item')} {
        border-radius: ${v('size.rounded.sm')};
        padding: ${v('size.padding.md')};
        display: flex;
        align-items: center;
        &:not(${c('item-disabled')}) {
          cursor: pointer;
        }
      }
      ${c('item-disabled')} {
        background: ${v('color.surface.200')};
      }
    `,
  },
});
