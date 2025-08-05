import { createThemePart, css } from '@ngneers/controls-themes/api';
import { colorsTemplate, sizesTemplate } from '@ngneers/controls-themes/nova/base';
import { inputFieldControlTemplate } from '@ngneers/controls-themes/templates/input-field';

export const inputFieldStyles = createThemePart({
  controlTemplate: inputFieldControlTemplate,
  dependencies: [colorsTemplate, sizesTemplate],
  root: {
    css: ({ v, c }) => css`
      ${c()} {
        border-radius: ${v('size.rounded.md')};
        border-color: ${v('color.surface.300')};
        border-width: 1px;
        border-style: solid;
        padding: ${v('size.padding.sm')} ${v('size.padding.md')};
        background: ${v('color.background')};
        color: ${v('color.text')};
        transition:
          border-color 0.1s ease-in-out,
          color 0.1s ease-in-out,
          outline-color 0.1s ease-in-out;
        outline-color: transparent;
        outline-width: 0;
        outline-style: solid;
        cursor: text;
        display: inline-flex;
        align-items: center;
        width: 100%;
        &:hover {
          border-color: ${v('color.surface.500')};
        }
        &:focus-within,
        :focus {
          border-color: ${v('color.primary.default')};
          outline-color: ${v('color.primary.default')};
          outline-width: 1px;
        }
        &:disabled {
          cursor: disabled;
        }
      }
      .ng-invalid.ng-touched ${c()}, ${c()}:has(.ng-invalid.ng-touched) {
        border-color: ${v('color.error.default')};
        &:hover {
          border-color: ${v('color.error.default')};
        }
        &:focus-within {
          border-color: ${v('color.error.default')};
          outline-color: ${v('color.error.default')};
        }
        &:disabled {
          cursor: disabled;
        }
      }
      ${c('readonly')} {
      }
    `,
  },
});
