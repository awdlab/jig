import { createThemePart, css } from '@ngneers/controls-themes/api';
import { inputFieldControlTemplate } from '@ngneers/controls-themes/templates/input-field';

export const inputFieldStyles = createThemePart({
  controlTemplate: inputFieldControlTemplate,
  dependencies: [],
  root: {
    css: ({ v, c, d }) => css`
      ${c()} {
        cursor: text;
        display: inline-flex;
        align-items: center;
        width: 100%;
        overflow: auto;
        min-height: fit-content;
        &:has(textarea) {
          resize: both;
        }

        & ${d('input')} {
          padding: 0;
          background: transparent;
          border: none;
          width: 100%;
          outline: none;
          resize: none;
        }

        &:has(${d('input')}:disabled) {
          cursor: default;
        }
        &:has(${d('input')}[aria-readonly]),
        &:has(${d('input')}:read-only) {
          cursor: default;
        }
      }

      ${c()}:has(${d('input', 'empty')}) ${c('clear-button')} {
        display: none;
      }
    `,
  },
});
