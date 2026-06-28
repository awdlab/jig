import { createThemePart, css } from '@ngneers/controls-themes/api';
import { inputMaskControlTemplate } from '@ngneers/controls-themes/templates/input-mask';

export const inputMaskStyles = createThemePart({
  controlTemplate: inputMaskControlTemplate,
  dependencies: [],
  root: {
    css: ({ c }) => css`
      ${c('root')} {
        display: inline-flex;
        align-items: center;
        position: relative;
      }
      ${c('section')} {
        display: inline-block;
        white-space: pre;
      }
      ${c('section-placeholder')} {
        display: inline-block;
        white-space: pre;
      }
      ${c('section-active')} {
        border-radius: 2px;
      }
      ${c('separator')} {
        display: inline-block;
        white-space: pre;
        /* Keep separators above the active section's highlight halo so the
         * highlight renders behind them rather than covering them. */
        position: relative;
        z-index: 1;
      }
      ${c('proxy')} {
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        white-space: nowrap;
        border: 0;
        opacity: 0;
      }
      ${c('sr-only')} {
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        white-space: nowrap;
        border: 0;
      }
    `,
  },
});
