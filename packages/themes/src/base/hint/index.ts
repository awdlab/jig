import { createThemePart, css } from '@awdlab/jig-themes/api';
import { hintControlTemplate } from '@awdlab/jig-themes/templates/hint';

export const hintStyles = createThemePart({
  controlTemplate: hintControlTemplate,
  dependencies: [],
  root: {
    css: ({ c }) => css`
      ${c('root')} {
        /**
         * Grid trick to animate between 0 and auto height, until 'interpolate-size' is
         * supported outside of chromium. Replace with 'interpolate-size' once it is.
         * Source: https://css-tricks.com/css-grid-can-do-auto-height-transitions
         */
        display: grid;
        grid-template-rows: 1fr;
        overflow: hidden;
        font-size: 0.8125em;
        line-height: 1.4;
      }

      /* Margins go too, else a collapsed hint still reserves its spacing —
         doubled selector to outweigh the margin the themes set on the root. */
      ${c('root')}${c('root-collapsed')} {
        grid-template-rows: 0fr;
        margin: 0;
      }

      ${c('icon')} {
        flex-shrink: 0;
        font-size: 1em;
        line-height: 1;
      }

      ${c('content')} {
        display: flex;
        align-items: center;
        gap: 0.375em;
        min-height: 0;
        font-family: inherit;
      }
    `,
  },
});
