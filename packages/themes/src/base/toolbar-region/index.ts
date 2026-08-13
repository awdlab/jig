import { createThemePart, css } from '@awdlab/jig-themes/api';
import { toolbarRegionControlTemplate } from '@awdlab/jig-themes/templates/toolbar-region';

export const toolbarRegionStyles = createThemePart({
  controlTemplate: toolbarRegionControlTemplate,
  dependencies: [],
  root: {
    css: ({ c }) => css`
      /* The region is a grouping construct, not a box: its items must be direct
         flex children of the placement track so a single gap applies across all
         regions — which is the gap the collapse math reads. */
      ${c('root')} {
        display: contents;
      }
      /* Never shrink: a squeezed item wraps its own text, so the width the collapse
         math measured stops matching the width the item actually wants. Items overflow,
         they do not compress. */
      ${c('item')} {
        display: flex;
        align-items: center;
        flex: none;
        white-space: nowrap;
      }
      /* Collapsed items stay laid out off-screen so they keep reporting a real
         size. Hiding them with display:none measures 0, everything "fits",
         they come back, and the toolbar flips forever. */
      ${c('item-overflowing')} {
        position: absolute;
        top: -9999px;
        inset-inline-start: -9999px;
        opacity: 0;
        pointer-events: none;
      }
    `,
  },
});
