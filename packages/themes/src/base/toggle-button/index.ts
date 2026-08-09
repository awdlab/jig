import { createThemePart, css } from '@awdlab/jig-themes/api';
import { toggleButtonControlTemplate } from '@awdlab/jig-themes/templates/toggle-button';

export const toggleButtonStyles = createThemePart({
  controlTemplate: toggleButtonControlTemplate,
  dependencies: [],
  root: {
    css: ({ v, c, d }) => css`
      ${c('root')} {
      }
      ${c('button')} {
        display: grid;
        font-family: inherit;
        flex-wrap: nowrap;
        > * {
          grid-area: 1 / 1;
        }
        &::after {
          grid-area: 1 / 1;
          content: '${'\u200B'}'; /* zero-width space to prevent collapsing when button is empty */
        }
      }
      ${c('label')}, ${c('placeholder')}, ${c('placeholder-active')} {
        display: flex;
      }
      ${c('placeholder')}, ${c('placeholder-active')} {
        visibility: hidden;
      }
      ${c('label')} {
        position: relative;
      }
    `,
  },
});
