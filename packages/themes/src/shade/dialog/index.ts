import { createThemePart, css } from '@ngneers/controls-themes/api';
import { baseStyles } from '@ngneers/controls-themes/base';
import {
  colorsTemplate,
  fontTemplate,
  shadowTemplate,
  sizesTemplate,
} from '@ngneers/controls-themes/shade/base';
import { dialogControlTemplate } from '@ngneers/controls-themes/templates/dialog';

export const dialogStyles = createThemePart({
  controlTemplate: dialogControlTemplate,
  base: baseStyles.dialog,
  dependencies: [colorsTemplate, sizesTemplate, fontTemplate, shadowTemplate],
  root: {
    css: ({ v, c }) => css`
      ${c('root')} {
        background-color: ${v('color.background')};
        color: ${v('color.foreground')};
        border: 1px solid ${v('color.border')};
        border-radius: ${v('size.rounded.lg')};
        padding: ${v('size.padding.xl')};
        box-shadow: ${v('shadow.xl')};
      }
      ${c('modal')} {
        &::backdrop {
          background-color: color-mix(in srgb, #000 50%, transparent);
        }
      }
      ${c('header')} {
        gap: ${v('size.padding.sm')};
        padding-bottom: ${v('size.padding.lg')};
      }
      ${c('default-header')} {
        font-weight: ${v('font.weight.semibold')};
        font-size: ${v('font.size.xl')};
        margin: 0;
      }
      ${c('content')} {
        color: ${v('color.muted.foreground')};
        font-size: ${v('font.size.sm')};
      }
      ${c('footer')} {
        padding-top: ${v('size.padding.lg')};
      }
      ${c('default-footer')} {
        gap: ${v('size.padding.sm')};
      }
      ${c('close-button')} {
        background: transparent;
        border: none;
        border-radius: ${v('size.rounded.md')};
        color: ${v('color.muted.foreground')};
        cursor: pointer;
        &:hover {
          background: ${v('color.accent.base')};
          color: ${v('color.accent.foreground')};
        }
      }
    `,
  },
});
