import { createThemePart, css } from '@ngneers/controls-themes/api';
import { messageControlTemplate } from '@ngneers/controls-themes/templates/message';

export const messageStyles = createThemePart({
  controlTemplate: messageControlTemplate,
  dependencies: [],
  root: {
    css: ({ c }) => css`
      ${c('root')} {
        display: flex;
        align-items: flex-start;
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
