import { createThemePart, css } from '@awdlab/jig-themes/api';
import { baseStyles } from '@awdlab/jig-themes/base';
import { colorsTemplate, sizesTemplate } from '@awdlab/jig-themes/nova/base';
import { menuControlTemplate } from '@awdlab/jig-themes/templates/menu';

export const menuStyles = createThemePart({
  controlTemplate: menuControlTemplate,
  base: baseStyles.menu,
  dependencies: [colorsTemplate, sizesTemplate],
  root: {
    css: ({ v, c, d }) => css`
      ${c('root')} {
        background: ${v('color.background')};
        padding: 4px;
        border-radius: ${v('size.rounded.lg')};
        border: 1px solid ${v('color.border')};
        /* The items own the focus treatment; the container is only focused programmatically
           and must not paint a ring of its own. */
        &:focus {
          outline: none;
        }
      }
      ${d('popover', 'content')} {
        border: none;
        padding: 0;
        min-width: 160px;
      }
      ${c('item')} {
        border-radius: ${v('size.rounded.sm')};
        padding: ${v('size.padding.md')};
        background: transparent;
        border: none;
        transition: background 0.2s ease;
        &:not(:disabled) {
          cursor: pointer;
          &:hover {
            background: ${v('color.surface.100')};
          }
          &:focus {
            outline: none;
            background: color-mix(
              in oklab,
              ${v('color.primary.500')} 12%,
              ${v('color.background')}
            );
          }
          &:active {
            background: color-mix(
              in oklab,
              ${v('color.primary.500')} 20%,
              ${v('color.background')}
            );
          }
        }
        &:disabled {
          opacity: 0.5;
        }
      }
      ${c('item-opened')} {
        background: color-mix(in oklab, ${v('color.primary.500')} 12%, ${v('color.background')});
      }
      ${c('icon-children')} {
        --icon-size: 8px;
        color: ${v('color.surface.600')};
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
