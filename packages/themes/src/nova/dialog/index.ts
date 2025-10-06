import { createThemePart, css } from '@ngneers/controls-themes/api';
import { colorsTemplate, fontTemplate, sizesTemplate } from '@ngneers/controls-themes/nova/base';
import { dialogControlTemplate } from '@ngneers/controls-themes/templates/dialog';
import { shadowTemplate } from 'packages/themes/src/nova/base/shadow';

export const dialogStyles = createThemePart({
  controlTemplate: dialogControlTemplate,
  dependencies: [colorsTemplate, sizesTemplate, fontTemplate, shadowTemplate],
  root: {
    css: ({ v, c }) => css`
      ${c()} {
        background-color: canvas;
        color: inherit;
        margin: auto;
        border: 1px solid ${v('color.surface.300')};
        border-radius: ${v('size.rounded.md')};
        padding: ${v('size.padding.md')};
        flex-direction: column;
        box-shadow: ${v('shadow.xl')};
        &[open] {
          display: flex;
        }
        &::backdrop {
          background-color: rgba(0, 0, 0, 0.1);
        }
      }
      ${c('header')} {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: ${v('size.padding.sm')};
      }
      ${c('default-header')} {
        font-weight: 600;
        font-size: ${v('font.size.2xl')};
        margin: 0;
      }
    `,
  },
});
