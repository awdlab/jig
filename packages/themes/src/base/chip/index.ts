import { createThemePart, css } from '@ngneers/controls-themes/api';
import { chipControlTemplate } from '@ngneers/controls-themes/templates/chip';

export const chipStyles = createThemePart({
  controlTemplate: chipControlTemplate,
  dependencies: [],
  root: {
    css: ({ v, c, d }) => css`
      ${c('')} {
        display: inline-flex;
        align-items: stretch;
      }

      ${c('content')} {
        flex-grow: 1;
        font-family: inherit;
      }
    `,
  },
});
