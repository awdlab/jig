import { createThemePart, css } from '@ngneers/controls-themes/api';
import { splitterControlTemplate } from '@ngneers/controls-themes/templates/splitter';

export const splitterStyles = createThemePart({
  controlTemplate: splitterControlTemplate,
  dependencies: [],
  root: {
    css: ({ v, c }) => css`
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
    `,
  },
});
