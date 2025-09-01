import { createThemePart, css } from '@ngneers/controls-themes/api';
import { colorsTemplate, fontTemplate, sizesTemplate } from '@ngneers/controls-themes/nova/base';
import { breadcrumbControlTemplate } from '@ngneers/controls-themes/templates/breadcrumb';

export const breadcrumbStyles = createThemePart({
  controlTemplate: breadcrumbControlTemplate,
  dependencies: [colorsTemplate, sizesTemplate, fontTemplate],
  root: {
    css: ({ v, c, d }) => css`
      ${c()} {
        display: flex;
        align-items: center;
        gap: ${v('size.padding.md')};
        user-select: none;
        ${d('item-view')} {
          gap: ${v('size.padding.md')};
        }
      }
      ${c('separator')} {
        display: inline-block;
        color: ${v('color.surface.500')};
        ngn-icon {
          display: inline-block;
          margin-left: 0.5rem;
        }
      }
      ${c('item')}, ${c('overflow')} {
        cursor: default;
        color: ${v('color.surface.600')};
        transition: color 0.2s;
        background: transparent;
        border: none;
        padding: 0;
        font-size: inherit;
        display: inline-block;
      }
      ${c('item-clickable')}, ${c('overflow')} {
        cursor: pointer;
        &:hover {
          color: ${v('color.text')};
        }
      }
    `,
  },
});
