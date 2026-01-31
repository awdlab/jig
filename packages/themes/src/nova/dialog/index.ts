import { createThemePart, css } from '@ngneers/controls-themes/api';
import { baseStyles } from '@ngneers/controls-themes/base';
import {
  colorsTemplate,
  fontTemplate,
  shadowTemplate,
  sizesTemplate,
} from '@ngneers/controls-themes/nova/base';
import { dialogControlTemplate } from '@ngneers/controls-themes/templates/dialog';

export const dialogStyles = createThemePart({
  controlTemplate: dialogControlTemplate,
  base: baseStyles.dialog,
  dependencies: [colorsTemplate, sizesTemplate, fontTemplate, shadowTemplate],
  root: {
    css: ({ v, c, d }) => css`
      ${c('root')} {
        background-color: ${v('color.background')};
        border: 1px solid ${v('color.surface.300')};
        border-radius: ${v('size.rounded.md')};
        padding: ${v('size.padding.lg')};
        box-shadow: ${v('shadow.lg')};
      }
      ${c('modal')} {
        &::backdrop {
          background-color: rgba(from ${v('color.text')} r g b / 0.1);
        }
      }
      ${c('header')} {
        gap: ${v('size.padding.sm')};
        padding-bottom: ${v('size.padding.lg')};
      }
      ${c('default-header')} {
        font-weight: 600;
        font-size: ${v('font.size.2xl')};
        margin: 0;
      }
      ${c('footer')} {
        padding-top: ${v('size.padding.lg')};
      }
      ${c('default-footer')} {
        gap: ${v('size.padding.sm')};
      }
    `,
  },
});
