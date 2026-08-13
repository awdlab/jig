import { createThemePart, css } from '@awdlab/jig-themes/api';
import { baseStyles } from '@awdlab/jig-themes/base';
import { colorsTemplate, fontTemplate, sizesTemplate } from '@awdlab/jig-themes/nova/base';
import { toolbarControlTemplate } from '@awdlab/jig-themes/templates/toolbar';

export const toolbarStyles = createThemePart({
  controlTemplate: toolbarControlTemplate,
  base: baseStyles.toolbar,
  dependencies: [colorsTemplate, sizesTemplate, fontTemplate],
  root: {
    css: ({ v, c }) => css`
      ${c('grid')} {
        background: ${v('color.background')};
        border: 1px solid ${v('color.border')};
        border-radius: ${v('size.rounded.md')};
        padding: ${v('size.padding.sm')};
      }
      ${c('overflow-button')} {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: ${v('size.padding.sm')};
        border-radius: ${v('size.rounded.sm')};
        color: ${v('color.surface.600')};
        cursor: pointer;
        &:hover {
          background: ${v('color.surface.100')};
        }
      }
      ${c('popover-content')} {
        padding: ${v('size.padding.sm')};
        gap: ${v('size.padding.sm')};
      }
    `,
  },
});
