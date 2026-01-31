import { createThemePart, css } from '@ngneers/controls-themes/api';
import { globalControlTemplate } from '@ngneers/controls-themes/templates/global';

export const globalStyles = createThemePart({
  controlTemplate: globalControlTemplate,
  root: {
    css: ({ v, c }) => css`
      --ngn-color-scrollbar: var(--ngn-color-surface-300) transparent;
      ${c('root')} {
        /* styles for all ngn controls go here */
        * {
          scrollbar-color: var(--ngn-color-scrollbar);
        }
      }
    `,
  },
});
