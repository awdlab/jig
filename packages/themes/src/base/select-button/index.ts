import { createThemePart, css } from '@awdlab/jig-themes/api';
import { selectButtonControlTemplate } from '@awdlab/jig-themes/templates/select-button';

export const selectButtonStyles = createThemePart({
  controlTemplate: selectButtonControlTemplate,
  dependencies: [],
  root: {
    css: ({ v: _v, c, d: _d }) => css`
      ${c('root')} {
        /* Base styles - implementation pending */
      }
    `,
  },
});
