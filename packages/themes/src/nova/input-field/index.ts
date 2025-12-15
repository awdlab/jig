import { createThemePart, css } from '@ngneers/controls-themes/api';
import { baseStyles } from '@ngneers/controls-themes/base';
import { colorsTemplate, sizesTemplate } from '@ngneers/controls-themes/nova/base';
import { inputFieldControlTemplate } from '@ngneers/controls-themes/templates/input-field';

export const inputFieldStyles = createThemePart({
  controlTemplate: inputFieldControlTemplate,
  base: baseStyles.inputField,
  dependencies: [colorsTemplate, sizesTemplate],
  root: {
    css: ({ v, c, d }) => css`
      ${c()} {
        border-radius: ${v('size.rounded.md')};
        border-color: ${v('color.border')};
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
        outline-offset: -2px;
        overflow: auto;
        /** line-height + vertical padding + border */
        height: calc(1lh + 2 * ${v('size.padding.sm')} + 2px);

        /* regular */
        &:hover {
          border-color: ${v('color.surface.500')};
        }
        &:focus-within,
        :focus {
          border-color: ${v('color.primary.500')};
          outline-color: ${v('color.primary.500')};
          outline-width: 1px;
        }
      }
      /* disabled */
      ${c()}:has(${d('input')}:disabled),
      :disabled ${c()} {
        background: ${v('color.disabled.background')};
        border-color: ${v('color.disabled.border')};
        color: ${v('color.disabled.text')};
        &:hover {
          border-color: ${v('color.disabled.border')};
        }
        &:focus-within,
        :focus {
          border-color: ${v('color.disabled.border')};
          outline-width: 0;
        }
      }

      /* read-only */
      ${c()}:has(${d('input')}:read-only),
      ${c()}:has(${d('input')}[aria-readonly]) {
        border-color: ${v('color.disabled.border')};
        &:hover {
          border-color: ${v('color.disabled.border')};
        }
        &:focus-within,
        :focus {
          border-color: ${v('color.disabled.border')};
          outline-color: ${v('color.disabled.border')};
        }
      }

      /* invalid */
      ${c('invalid')},
      .ng-invalid.ng-touched ${c()},
      ${c()}:has(.ng-invalid.ng-touched),
      ${c()}:has(${d('input', 'invalid')}) {
        border-color: ${v('color.invalid.border')};
        &:hover {
          border-color: ${v('color.invalid.border')};
        }
        &:focus-within {
          border-color: ${v('color.invalid.border')};
          outline-color: ${v('color.invalid.border')};
        }
      }

      /* invalid & disabled */
      ${c('invalid')}:disabled,
      .ng-invalid.ng-touched:disabled ${c()},
      ${c()}:has(.ng-invalid.ng-touched:disabled),
      ${c()}:has(${d('input', 'invalid')}:disabled) {
        border-color: ${v('color.invalid.border')};
        &:hover {
          border-color: ${v('color.invalid.border')};
        }
        &:focus-within {
          border-color: ${v('color.invalid.border')};
          outline-color: ${v('color.invalid.border')};
        }
      }

      /* invalid & read-only */
      ${c('invalid')}:read-only,
      .ng-invalid.ng-touched:read-only ${c()},
      ${c()}:has(.ng-invalid.ng-touched:read-only),
      ${c()}:has(${d('input', 'invalid')}:read-only),
      ${c('invalid')}[aria-readonly],
      .ng-invalid.ng-touched[aria-readonly] ${c()},
      ${c()}:has(.ng-invalid.ng-touched[aria-readonly]),
      ${c()}:has(${d('input', 'invalid')}[aria-readonly]) {
        border-color: ${v('color.invalid.border')};
        &:hover {
          border-color: ${v('color.invalid.border')};
        }
        &:focus-within {
          border-color: ${v('color.invalid.border')};
          outline-color: ${v('color.invalid.border')};
        }
      }

      ${c('clear-button')} {
        font-size: calc(1em * 0.9);
        color: ${v('color.surface.500')};
        &:hover {
          color: ${v('color.surface.700')};
        }
      }
    `,
  },
});
