import { createThemePart, css } from '@awdlab/jig-themes/api';
import { meterControlTemplate } from '@awdlab/jig-themes/templates/meter';

export const meterStyles = createThemePart({
  controlTemplate: meterControlTemplate,
  dependencies: [],
  root: {
    css: ({ c }) => css`
      ${c('root')} {
        display: flex;
        min-width: 0;
      }
      ${c('horizontal')} {
        flex-direction: column;
      }
      ${c('vertical')} {
        flex-direction: row;
        align-items: stretch;
      }

      /* Segments are sized in percent of the track, so anything past the total is clipped.
         \`clip\` rather than \`hidden\`: it clips the same way but stays a non-scrolling box, so
         a theme can let a highlighted segment lift out of the track via overflow-clip-margin. */
      ${c('track')} {
        display: flex;
        overflow: clip;
        flex: 0 0 auto;
      }
      ${c('horizontal')} ${c('track')} {
        flex-direction: row;
        width: 100%;
      }
      /* Reversed: a vertical bar fills bottom-up, the way a tank or gauge reads. */
      ${c('vertical')} ${c('track')} {
        flex-direction: column-reverse;
        height: 100%;
      }

      /* Shrinkable so the minimum below is reachable: when the other segments already
         claim the whole track, they give up the pixels the sliver needs instead of
         pushing it past the edge. */
      ${c('segment')} {
        flex: 0 1 auto;
        box-sizing: border-box;
        background: var(--meter-color, currentColor);
      }
      /* A non-zero item always paints: without a floor, a sub-percent share rounds to
         nothing and the legend claims a slice the bar never shows. */
      ${c('horizontal')} ${c('segment')} {
        width: var(--meter-size, 0%);
        min-width: 2px;
        height: 100%;
      }
      ${c('vertical')} ${c('segment')} {
        height: var(--meter-size, 0%);
        min-height: 2px;
        width: 100%;
      }

      ${c('legend')} {
        display: flex;
        flex-wrap: wrap;
        list-style: none;
        margin: 0;
        padding: 0;
        min-width: 0;
      }
      ${c('vertical')} ${c('legend')} {
        flex-direction: column;
        flex-wrap: nowrap;
      }

      ${c('item')} {
        display: flex;
        align-items: center;
        min-width: 0;
      }
      ${c('swatch')} {
        flex: 0 0 auto;
        background: var(--meter-color, currentColor);
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
        pointer-events: none;
      }
    `,
  },
});
