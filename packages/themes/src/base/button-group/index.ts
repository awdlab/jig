import { createThemePart, css } from '@ngneers/controls-themes/api';
import { buttonGroupControlTemplate } from '@ngneers/controls-themes/templates/button-group';

export const buttonGroupStyles = createThemePart({
  controlTemplate: buttonGroupControlTemplate,
  dependencies: [],
  root: {
    css: ({ v, c, d }) => css`
      ${c('root')} {
        display: block;
        width: 100%;
        max-width: 100%;
      }
      ${c('horizontal')}, ${c('vertical')} {
        display: flex;
        width: fit-content;
        & ${d('button', 'root')}, & ${d('toggle-button', 'root')} ${d('toggle-button', 'button')} {
          border-radius: 0;
          white-space: nowrap;
        }
      }
      ${c('horizontal')} {
        flex-direction: row;
      }
      ${c('vertical')} {
        width: fit-content;
        flex-direction: column;
      }
    `,
  },
});
