import { createThemePart, css } from '@ngneers/controls-themes/api';
import { baseStyles } from '@ngneers/controls-themes/base';
import { colorsTemplate, fontTemplate, sizesTemplate } from '@ngneers/controls-themes/nova/base';
import { breadcrumbControlTemplate } from '@ngneers/controls-themes/templates/breadcrumb';

export const breadcrumbStyles = createThemePart({
  controlTemplate: breadcrumbControlTemplate,
  base: baseStyles.breadcrumb,
  dependencies: [colorsTemplate, sizesTemplate, fontTemplate],
  root: {
    css: ({ v, c, d }) => css`
      ${c('root')} {
        gap: ${v('size.padding.md')};
        ${d('item-view')} {
          gap: ${v('size.padding.md')};
        }
      }
      ${c('separator')} {
        color: ${v('color.surface.500')};
        ngn-icon {
          margin-left: 0.5rem;
          font-size: ${v('font.size.xs')};
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
      }
      ${c('item-clickable')}, ${c('overflow')} {
        cursor: pointer;
        &:hover {
          color: ${v('color.text')};
        }
      }
      ${c('item')}:last-child {
        color: ${v('color.text')};
        font-weight: ${v('font.weight.semibold')};
      }
    `,
  },
});
