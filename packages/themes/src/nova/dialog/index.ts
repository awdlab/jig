import { createThemePart, css } from '@ngneers/controls-themes/api';
import {
  colorsTemplate,
  fontTemplate,
  shadowTemplate,
  sizesTemplate,
} from '@ngneers/controls-themes/nova/base';
import { dialogControlTemplate } from '@ngneers/controls-themes/templates/dialog';

export const dialogStyles = createThemePart({
  controlTemplate: dialogControlTemplate,
  dependencies: [colorsTemplate, sizesTemplate, fontTemplate, shadowTemplate],
  root: {
    css: ({ v, c, d }) => css`
      ${c()} {
        background-color: canvas;
        color: inherit;
        margin: auto;
        border: 1px solid ${v('color.surface.300')};
        border-radius: ${v('size.rounded.md')};
        padding: ${v('size.padding.lg')};
        flex-direction: column;
        box-shadow: ${v('shadow.lg')};
        position: fixed;
        &[open] {
          display: flex;
        }
      }
      ${c('modal')} {
        &::backdrop {
          background-color: rgba(0, 0, 0, 0.1);
        }
      }
      ${c('header')} {
        display: flex;
        align-items: center;
        justify-content: space-between;
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
        display: flex;
        align-items: center;
        justify-content: flex-end;
        gap: ${v('size.padding.sm')};
      }
      ${d('movable', 'moved')} {
        margin: unset;
      }
    `,
  },
});
