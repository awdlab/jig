import { createThemePart, css } from '@awdlab/jig-themes/api';
import { spinButtonsControlTemplate } from '@awdlab/jig-themes/templates/spin-buttons';

export const spinButtonsStyles = createThemePart({
  controlTemplate: spinButtonsControlTemplate,
  dependencies: [],
  root: {
    css: ({ c, d }) => css`
      ${c('root')} {
        display: inline-flex;
        /* stacked by default: increment on top, decrement below
         * (DOM order is decrement, increment) */
        flex-direction: column-reverse;
        align-self: stretch;
        justify-content: center;
        flex: none;
      }
      /* A leading (flanking) button is pulled before the input via flex order,
       * regardless of its content-projection slot. */
      ${c('leading')} {
        order: -1;
      }
      ${c('kind-inline')} {
        flex-direction: row;
        /* stretch so the buttons fill the full field height, not just their content */
        align-items: stretch;
      }
      ${d('decrement')},
      ${d('increment')} {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        user-select: none;
        touch-action: none;
        background: transparent;
        border: none;
      }
      /* Lone / inline buttons fill the full field height for a large hit area. */
      ${d('decrement')},
      ${d('increment')} {
        flex: 1 1 auto;
      }
      ${d('decrement')}:disabled,
      ${d('increment')}:disabled {
        cursor: default;
      }
    `,
  },
});
