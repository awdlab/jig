import { createThemePart, css } from '@ngneers/controls-themes/api';
import { selectButtonControlTemplate } from '@ngneers/controls-themes/templates/select-button';

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
