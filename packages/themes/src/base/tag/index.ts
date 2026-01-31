import { createThemePart, css } from '@ngneers/controls-themes/api';
import { tagControlTemplate } from '@ngneers/controls-themes/templates/tag';

export const tagStyles = createThemePart({
  controlTemplate: tagControlTemplate,
  dependencies: [],
  root: {
    css: ({ c }) => css`
      ${c('root')} {
        display: inline-flex;
        align-items: center;
      }

      ${c('icon')} {
        flex-shrink: 0;
      }

      ${c('content')} {
        flex-grow: 1;
        font-family: inherit;
      }
    `,
  },
});
