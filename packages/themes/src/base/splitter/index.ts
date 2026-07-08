import { createThemePart, css } from '@ngneers/controls-themes/api';
import { splitterControlTemplate } from '@ngneers/controls-themes/templates/splitter';

export const splitterStyles = createThemePart({
  controlTemplate: splitterControlTemplate,
  dependencies: [],
  root: {
    css: ({ c }) => css`
      ${c('root')} {
        display: grid;
        width: 100%;
        height: 100%;
      }

      ${c('panel')} {
        min-height: 0;
        min-width: 0;
      }

      ${c('divider')} {
        touch-action: none;
      }

      ${c('divider-handle')} {
        display: block;
        border: none;
        padding: 0;
        position: relative;
      }

      ${c('horizontal')} {
        ${c('divider')}, ${c('divider-handle')} {
          height: 100%;
          cursor: col-resize;
        }
      }

      ${c('vertical')} {
        ${c('divider')}, ${c('divider-handle')} {
          width: 100%;
          cursor: row-resize;
        }
      }

      @media (hover: none) and (pointer: coarse) {
        ${c('divider-handle')}::before {
          content: '';
          position: absolute;
          top: -20px;
          left: -20px;
          right: -20px;
          bottom: -20px;
          background: transparent;
          pointer-events: auto;
        }
      }

      /*
       * Thin & invisible kinds.
       *
       * The splitter measures the divider element's offset size to build the grid
       * track (see splitter-calculator). To expand the handle on interaction
       * WITHOUT shifting content, the divider stays a fixed size (1px / 0px) and
       * the handle is taken out of flow. The visible bar is a centered ::after
       * whose size animates from the resting line width up to the default width.
       */
      ${c('kind-thin')}, ${c('kind-invisible')} {
        ${c('divider')} {
          position: relative;
          overflow: visible;
          z-index: 1;
        }

        ${c('divider-handle')} {
          position: absolute;
          background: transparent;
        }

        ${c('divider-handle')}::after {
          content: '';
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          transition:
            width 0.15s ease,
            height 0.15s ease;
        }
      }

      /* Horizontal: fixed-width divider, centered vertical grab zone + bar. */
      ${c('horizontal')}${c('kind-thin')} ${c('divider')} {
        width: 1px;
      }
      ${c('horizontal')}${c('kind-invisible')} ${c('divider')} {
        width: 0;
      }
      ${c('horizontal')}${c('kind-thin')} ${c('divider-handle')},
      ${c('horizontal')}${c('kind-invisible')} ${c('divider-handle')} {
        width: 8px;
        height: 100%;
        left: 50%;
        top: 0;
        transform: translateX(-50%);
      }
      ${c('horizontal')}${c('kind-thin')} ${c('divider-handle')}::after,
      ${c('horizontal')}${c('kind-invisible')} ${c('divider-handle')}::after {
        height: 100%;
      }
      ${c('horizontal')}${c('kind-thin')} ${c('divider-handle')}::after {
        width: 1px;
      }
      ${c('horizontal')}${c('kind-invisible')} ${c('divider-handle')}::after {
        width: 0;
      }
      ${c('horizontal')}${c('kind-thin')} ${c('divider-handle')}:hover::after,
      ${c('horizontal')}${c('kind-thin')} ${c('divider-handle')}:focus::after,
      ${c('horizontal')}${c('kind-thin')} ${c('divider-handle')}:active::after,
      ${c('horizontal')}${c('kind-invisible')} ${c('divider-handle')}:hover::after,
      ${c('horizontal')}${c('kind-invisible')} ${c('divider-handle')}:focus::after,
      ${c('horizontal')}${c('kind-invisible')} ${c('divider-handle')}:active::after {
        width: 0.25rem;
      }

      /* Vertical: fixed-height divider, centered horizontal grab zone + bar. */
      ${c('vertical')}${c('kind-thin')} ${c('divider')} {
        height: 1px;
      }
      ${c('vertical')}${c('kind-invisible')} ${c('divider')} {
        height: 0;
      }
      ${c('vertical')}${c('kind-thin')} ${c('divider-handle')},
      ${c('vertical')}${c('kind-invisible')} ${c('divider-handle')} {
        height: 8px;
        width: 100%;
        top: 50%;
        left: 0;
        transform: translateY(-50%);
      }
      ${c('vertical')}${c('kind-thin')} ${c('divider-handle')}::after,
      ${c('vertical')}${c('kind-invisible')} ${c('divider-handle')}::after {
        width: 100%;
      }
      ${c('vertical')}${c('kind-thin')} ${c('divider-handle')}::after {
        height: 1px;
      }
      ${c('vertical')}${c('kind-invisible')} ${c('divider-handle')}::after {
        height: 0;
      }
      ${c('vertical')}${c('kind-thin')} ${c('divider-handle')}:hover::after,
      ${c('vertical')}${c('kind-thin')} ${c('divider-handle')}:focus::after,
      ${c('vertical')}${c('kind-thin')} ${c('divider-handle')}:active::after,
      ${c('vertical')}${c('kind-invisible')} ${c('divider-handle')}:hover::after,
      ${c('vertical')}${c('kind-invisible')} ${c('divider-handle')}:focus::after,
      ${c('vertical')}${c('kind-invisible')} ${c('divider-handle')}:active::after {
        height: 0.25rem;
      }
    `,
  },
});
