import { createThemePart, css } from '@ngneers/controls-themes/api';
import { baseStyles } from '@ngneers/controls-themes/base';
import {
  animationTemplate,
  colorsTemplate,
  sizesTemplate,
} from '@ngneers/controls-themes/nova/base';
import { inputFieldControlTemplate } from '@ngneers/controls-themes/templates/input-field';

export const inputFieldStyles = createThemePart({
  controlTemplate: inputFieldControlTemplate,
  base: baseStyles.inputField,
  dependencies: [colorsTemplate, sizesTemplate, animationTemplate],
  root: {
    css: ({ v, c, d }) => {
      const invalidDisabledSelector = `
        ${c('invalid')}:disabled,
        .ng-invalid.ng-touched:disabled ${c()},
        ${c()}:has(.ng-invalid.ng-touched:disabled),
        ${c()}:has(${d('input', 'invalid')}:disabled)
      `;

      const invalidReadonlySelector = `
          ${c('invalid')}:read-only,
          .ng-invalid.ng-touched:read-only ${c()},
          ${c()}:has(.ng-invalid.ng-touched:read-only),
          ${c()}:has(${d('input', 'invalid')}:read-only),
          ${c('invalid')}[aria-readonly],
          .ng-invalid.ng-touched[aria-readonly] ${c()},
          ${c()}:has(.ng-invalid.ng-touched[aria-readonly]),
          ${c()}:has(${d('input', 'invalid')}[aria-readonly])
        `;

      function getFloating(klass: string) {
        return `${klass}:has(${d('input')}:focus),
          ${klass}:has(${d('input')}:not(${d('input', 'empty')}))`;
      }

      return css`
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

        ${c('label')} {
          color: ${v('color.surface.700')};
          font-size: 0.85rem;

          transition-duration: ${v('anim.time.fade')};
          transition-timing-function: ${v('anim.ease.fade')};
        }

        /* disabled */
        ${c()}:has(${d('input')}:disabled), :disabled ${c()} {
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
        ${c()}:has(${d('input')}:read-only), ${c()}:has(${d('input')}[aria-readonly]) {
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
        ${c(
          'invalid'
        )}, .ng-invalid.ng-touched ${c()}, ${c()}:has(.ng-invalid.ng-touched), ${c()}:has(${d(
          'input',
          'invalid'
        )}) {
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
        ${invalidDisabledSelector} {
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
        ${invalidReadonlySelector} {
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

        /* Label over */
        ${c('labelKind-over')}, ${c('labelKind-floatOver')} {
          --topPadding: calc(1rem + 2 * ${v('size.padding.sm')});
          position: relative;
          padding-top: var(--topPadding);
          ${c('label')} {
            position: absolute;
            top: 0;
            left: 0;
            padding: ${v('size.padding.sm')} ${v('size.padding.md')};
            transition-property: top, transform, font-size;
          }
        }
        /* float: not floating */
        ${c('labelKind-floatOver')}:not(${getFloating(c('labelKind-floatOver'))}) {
          ${c('label')} {
            font-size: 1rem;
            top: calc(50% + var(--topPadding) / 2);
            transform: translateY(-50%);
          }
        }

        /* Label in */
        ${c('labelKind-in')}, ${c('labelKind-floatIn')} {
          position: relative;
          ${c()} {
            padding-top: 1.5rem;
          }
          ${c('label')} {
            position: absolute;
            padding: ${v('size.padding.sm')} ${v('size.padding.md')};
            transform: translateY(1px);
            top: 0;
            transition-property: top, transform, font-size;
          }
        }
        /* float: not floating */
        ${c('labelKind-floatIn')}:not(${getFloating(c('labelKind-floatIn'))}) {
          ${c('label')} {
            font-size: 1rem;
            top: 50%;
            transform: translateY(-50%);
          }
        }

        /* Label on */
        ${c('labelKind-on')}, ${c('labelKind-floatOn')} {
          position: relative;
          ${c('label')} {
            position: absolute;
            padding: ${v('size.padding.sm')} 4px;
            top: 0;
            left: ${v('size.padding.md')};
            transform: translateY(-50%);
            transition-property: top, transform, left, font-size;

            &:before {
              content: '';
              z-index: -1;
              position: absolute;
              left: 0;
              bottom: 50%;
              width: 100%;
              height: 3px;
              transform: translateY(calc(100% - 0.5px));
              background: ${v('color.background')};
            }
          }
        }
        /* float: not floating */
        ${c('labelKind-floatOn')}:not(${getFloating(c('labelKind-floatOn'))}) {
          ${c('label')} {
            font-size: 1rem;
            left: calc(${v('size.padding.md')} - 4px);
            top: 50%;
            transform: translateY(-50%);
            &:before {
              display: none;
            }
          }
        }
      `;
    },
  },
});
