import { createThemePart, css } from '@ngneers/controls-themes/api';
import { colorsTemplate } from '@ngneers/controls-themes/nova/base';
import { splitterControlTemplate } from '@ngneers/controls-themes/templates/splitter';

export const splitterStyles = createThemePart({
  controlTemplate: splitterControlTemplate,
  dependencies: [colorsTemplate],
  root: {
    css: ({ v, c }) => css`
      ${c()} {
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
        background: ${v('color.surface.100')};
        &:hover {
          background: ${v('color.surface.200')};
        }
        &:focus {
          background: ${v('color.surface.300')};
        }
        &:active {
          background: ${v('color.surface.400')};
        }
      }

      ${c('horizontal')} {
        ${c('divider')}, ${c('divider-handle')} {
          height: 100%;
          width: 0.25rem;
          cursor: col-resize;
        }
      }

      ${c('vertical')} {
        ${c('divider')}, ${c('divider-handle')} {
          height: 0.25rem;
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
