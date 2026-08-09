import { createThemePart, css } from '@awdlab/jig-themes/api';
import { kbdControlTemplate } from '@awdlab/jig-themes/templates/kbd';

export const kbdStyles = createThemePart({
  controlTemplate: kbdControlTemplate,
  dependencies: [],
  root: {
    css: ({ c }) => css`
      ${c('root')} {
        display: inline-flex;
        align-items: center;
      }
      ${c('key')} {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        font-family: inherit;
        white-space: nowrap;
      }
    `,
  },
});
