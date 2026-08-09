import { createThemePart, css } from '@awdlab/jig-themes/api';
import { breadcrumbControlTemplate } from '@awdlab/jig-themes/templates/breadcrumb';

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
        awd-icon {
          display: flex;
        }
      }
      ${c('item')}, ${c('overflow')} {
        display: inline-block;
      }
    `,
  },
});
