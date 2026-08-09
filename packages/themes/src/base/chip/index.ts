import { createThemePart, css } from '@awdlab/jig-themes/api';
import { chipControlTemplate } from '@awdlab/jig-themes/templates/chip';

export const chipStyles = createThemePart({
  controlTemplate: chipControlTemplate,
  dependencies: [],
  root: {
    css: ({ v, c, d }) => css`
      ${c('root')} {
        display: inline-flex;
        align-items: stretch;
      }

      ${c('content')} {
        flex-grow: 1;
        font-family: inherit;
      }

      /* WCAG 2.5.8 — the remove target stays at least 24 CSS px wide. */
      ${c('close-button')} {
        min-width: 24px;
      }
    `,
  },
});
