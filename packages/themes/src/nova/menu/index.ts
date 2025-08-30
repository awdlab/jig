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
          min-width: 160px;
        }
      }
      ${c('item')} {
        border-radius: ${v('size.rounded.sm')};
        padding: ${v('size.padding.md')};
        display: flex;
        align-items: center;
        background: transparent;
        border: none;
        justify-content: space-between;
        transition: background 0.2s ease;
        &:not(:disabled) {
          cursor: pointer;
          &:hover {
            background: ${v('color.surface.100')};
          }
          &:focus {
            outline: none;
            background: ${v('color.surface.200')};
          }
          &:active {
            background: ${v('color.surface.300')};
          }
        }
        &:disabled {
          background: ${v('color.surface.200')};
        }
      }
      ${c('item-opened')} {
        background: ${v('color.surface.100')};
      }
      ${c('icon-children')} {
        --icon-size: 8px;
        color: ${v('color.surface.500')};
      }
      ${c('separator')} {
        width: 100%;
        border: none;
        border-bottom: 1px solid var(--ngn-color-surface-300);
        margin: ${v('size.padding.sm')} 0;
      }
    `,
  },
});
