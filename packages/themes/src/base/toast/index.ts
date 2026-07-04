import { createThemePart, css } from '@ngneers/controls-themes/api';
import { toastControlTemplate } from '@ngneers/controls-themes/templates/toast';

export const toastStyles = createThemePart({
  controlTemplate: toastControlTemplate,
  dependencies: [],
  root: {
    css: ({ c }) => css`
      ${c('host')} {
        display: none;
        flex-direction: column;
        margin: unset;
        inset: unset;
        position: fixed;
        &:popover-open {
          display: flex;
        }
      }
      ${c('root')} {
        &:focus {
          outline: none;
        }
        &:focus-visible {
          outline: 2px solid currentColor;
          outline-offset: 2px;
        }
      }
      ${c('defaultHeader')} {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
    `,
  },
});
