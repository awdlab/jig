import { createThemePart, css } from '@awdlab/jig-themes/api';
import { baseStyles } from '@awdlab/jig-themes/base';
import {
  animationTemplate,
  colorsTemplate,
  fontTemplate,
  shadowTemplate,
  sizesTemplate,
} from '@awdlab/jig-themes/shade/base';
import { menuControlTemplate } from '@awdlab/jig-themes/templates/menu';

export const menuStyles = createThemePart({
  controlTemplate: menuControlTemplate,
  base: baseStyles.menu,
  dependencies: [animationTemplate, colorsTemplate, fontTemplate, shadowTemplate, sizesTemplate],
  root: {
    css: ({ v, c, d }) => css`
      ${c('root')} {
        background: ${v('color.popover.base')};
        color: ${v('color.popover.foreground')};
        padding: 4px;
        border-radius: ${v('size.rounded.md')};
        border: 1px solid ${v('color.border')};
        box-shadow: ${v('shadow.lg')};
      }
      ${d('popover', 'content')} {
        border: none;
        padding: 0;
        min-width: 160px;
        box-shadow: none;
      }
      ${c('item')} {
        border-radius: ${v('size.rounded.sm')};
        padding: ${v('size.padding.sm')} ${v('size.padding.md')};
        font-size: ${v('font.size.sm')};
        background: transparent;
        border: none;
        transition: background-color ${v('anim.time.snappyFade')} ${v('anim.ease.snappyFade')};
        &:not(:disabled) {
          cursor: pointer;
          &:hover,
          &:focus {
            outline: none;
            background: ${v('color.accent.base')};
            color: ${v('color.accent.foreground')};
          }
        }
        &:disabled {
          opacity: 0.5;
        }
      }
      ${c('item-opened')} {
        background: ${v('color.accent.base')};
        color: ${v('color.accent.foreground')};
      }
      ${c('icon-children')} {
        --icon-size: 8px;
        color: ${v('color.muted.foreground')};
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
