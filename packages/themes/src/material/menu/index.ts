import { createThemePart, css } from '@ngneers/controls-themes/api';
import { baseStyles } from '@ngneers/controls-themes/base';
import {
  colorsTemplate,
  shadowTemplate,
  sizesTemplate,
} from '@ngneers/controls-themes/material/base';
import { menuControlTemplate } from '@ngneers/controls-themes/templates/menu';

export const menuStyles = createThemePart({
  controlTemplate: menuControlTemplate,
  base: baseStyles.menu,
  dependencies: [colorsTemplate, sizesTemplate, shadowTemplate],
  root: {
    css: ({ v, c, d }) => css`
      ${c('root')} {
        background: ${v('color.background')};
        padding: ${v('size.padding.sm')} 0;
        border-radius: ${v('size.rounded.md')};
        border: 1px solid ${v('color.border')};
        box-shadow: ${v('shadow.lg')};
      }
      ${d('popover', 'content')} {
        border: none;
        padding: 0;
        min-width: 160px;
      }
      ${c('item')} {
        border-radius: ${v('size.rounded.sm')};
        padding: ${v('size.padding.md')} ${v('size.padding.xl')};
        background: transparent;
        color: ${v('color.text')};
        border: none;
        transition: background 0.2s ease;
        &:not(:disabled) {
          cursor: pointer;
          &:hover {
            background: color-mix(in srgb, ${v('color.primary.500')} 8%, transparent);
          }
          &:focus {
            outline: none;
            background: color-mix(in srgb, ${v('color.primary.500')} 12%, transparent);
          }
          &:active {
            background: color-mix(in srgb, ${v('color.primary.500')} 12%, transparent);
          }
        }
        &:disabled {
          color: ${v('color.disabled.text')};
          background: transparent;
        }
      }
      ${c('item-opened')} {
        background: color-mix(in srgb, ${v('color.primary.500')} 12%, transparent);
      }
      ${c('icon-children')} {
        --icon-size: 8px;
        color: ${v('color.surface.500')};
      }
      ${c('separator')} {
        width: 100%;
        border: none;
        border-bottom: 1px solid ${v('color.border')};
        margin: ${v('size.padding.sm')} 0;
      }
    `,
  },
});
