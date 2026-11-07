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
        /* Centers the arrow on the overlap between tooltip and anchor rather than on the anchor's center. */
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
