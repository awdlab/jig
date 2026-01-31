import { createThemePart, css } from '@ngneers/controls-themes/api';
import { breadcrumbControlTemplate } from '@ngneers/controls-themes/templates/breadcrumb';

export const breadcrumbStyles = createThemePart({
  controlTemplate: breadcrumbControlTemplate,
  dependencies: [],
  root: {
    css: ({ v, c, d }) => css`
      ${c('root')} {
        display: flex;
        align-items: center;
        user-select: none;
        width: 100%;
      }
      ${c('separator')} {
        display: inline-flex;
        align-items: center;
        ngn-icon {
          display: flex;
        }
      }
      ${c('item')}, ${c('overflow')} {
        display: inline-block;
      }
    `,
  },
});
