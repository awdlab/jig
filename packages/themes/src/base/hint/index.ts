import { createThemePart, css } from '@ngneers/controls-themes/api';
import { hintControlTemplate } from '@ngneers/controls-themes/templates/hint';

export const hintStyles = createThemePart({
  controlTemplate: hintControlTemplate,
  dependencies: [],
  root: {
    css: ({ c }) => css`
      ${c('root')} {
        display: inline-flex;
        align-items: center;
        gap: 0.375em;
        font-size: 0.8125em;
        line-height: 1.4;
      }

      ${c('icon')} {
        flex-shrink: 0;
        font-size: 1em;
        line-height: 1;
      }

      ${c('content')} {
        font-family: inherit;
      }
    `,
  },
});
