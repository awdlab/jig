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
        ${d('item-view')} {
          gap: ${v('size.padding.md')};
        }
      }
      ${c('segment')} {
        display: flex;
        align-items: center;
        gap: ${v('size.padding.md')};
      }
      ${c('separator')} {
        display: inline-block;
        ngn-icon {
          display: inline-block;
          margin-left: 0.5rem;
        }
      }
    `,
  },
});
