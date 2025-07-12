import {
  buildVariationCombinationStyles,
  createThemePart,
  createVariableTemplate,
  css,
  repeatVariables,
} from '@ngneers/controls-themes/api';
import { colorsTemplate } from '@ngneers/controls-themes/nova/base';
import { splitterControlTemplate } from '@ngneers/controls-themes/templates/splitter';
import { subKey } from 'packages/themes/src/api/utils/sub-key';

const handleStates = ['', 'hover', 'focus', 'active'] as const;

export const splitterVariables = createVariableTemplate({
  scope: 'splitter',
  variables: {
    handle: {
      size: null,
      ...repeatVariables(handleStates, {
        color: null,
      }),
    },
  },
});

export const splitterStyles = createThemePart({
  controlTemplate: splitterControlTemplate,
  variables: [splitterVariables],
  dependencies: [colorsTemplate],
  root: {
    values: {
      handle: {
        size: '0.25rem',
        color: '{color.surface.200}',
        hover: {
          color: '{color.surface.300}',
        },
        focus: {
          color: '{color.surface.300}',
        },
        active: {
          color: '{color.surface.400}',
        },
      },
    },
    css: ({ v, c }) =>
      css`
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
        }

        ${c('horizontal')} {
          ${c('divider')}, ${c('divider-handle')} {
            height: 100%;
            width: ${v('splitter.handle.size')};
            cursor: col-resize;
          }
        }

        ${c('vertical')} {
          ${c('divider')}, ${c('divider-handle')} {
            height: ${v('splitter.handle.size')};
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
      ` +
      buildVariationCombinationStyles(
        [handleStates],
        state => css`
          ${c('divider-handle')}${state ? `:${state}` : ''} {
            background: ${v(subKey('splitter.handle', state, 'color'))};
          }
        `
      ),
  },
});
