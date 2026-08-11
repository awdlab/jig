import { createThemePart, css } from '@awdlab/jig-themes/api';
import { tooltipControlTemplate } from '@awdlab/jig-themes/templates/tooltip';

export const tooltipStyles = createThemePart({
  controlTemplate: tooltipControlTemplate,
  dependencies: [],
  root: {
    css: ({ v, c }) => css`
      ${c('root')} {
        &:not(:popover-open) {
          display: none;
        }
        // Browser-Reset:
        width: unset;
        height: unset;
        color: unset;
        background-color: unset;
        inset: unset;
        margin: unset;
        border-width: unset;
        border-style: unset;
        border-color: unset;
        border-image: unset;
        padding: unset;
        overflow: unset;
      }

      ${c('content')} {
        position: relative;
      }

      ${c('text')} {
        pointer-events: none;
      }

      ${c('with-arrow')} {
        --arrow-width: 16px;
        /* Center the arrow on the overlap between the tooltip and its anchor, not on the anchor's
         * center. When the tooltip is at least as large as the anchor this equals the anchor
         * center; when the anchor is taller/wider than the tooltip (e.g. a small tooltip on a big
         * button) it keeps the arrow centered on the tooltip body instead of pushed to the edge.
         * --anchor-start/--anchor-end are the anchor's near/far edges relative to the tooltip's
         * top-left; 100% resolves against height (top) or width (left) at each use site. */
        --arrow-pos: calc((max(0px, var(--anchor-start)) + min(100%, var(--anchor-end))) / 2);

        &::before {
          content: '';
          position: absolute;
          clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);
          width: var(--arrow-width);
          height: var(--arrow-width);
        }

        &${c('left')} {
          padding-right: calc(var(--arrow-width) / 2);
          &::before {
            right: 0;
            top: var(--arrow-pos);
            transform: translateY(-50%);
          }
        }

        &${c('right')} {
          padding-left: calc(var(--arrow-width) / 2);
          &::before {
            left: 0;
            top: var(--arrow-pos);
            transform: translateY(-50%);
          }
        }

        &${c('top')} {
          padding-bottom: calc(var(--arrow-width) / 2);
          &::before {
            bottom: 0;
            left: var(--arrow-pos);
            transform: translateX(-50%);
          }
        }

        &${c('bottom')} {
          padding-top: calc(var(--arrow-width) / 2);
          &::before {
            top: 0;
            left: var(--arrow-pos);
            transform: translateX(-50%);
          }
        }
      }

      ${c('closing')}:popover-open {
        pointer-events: none;
      }
    `,
  },
});
