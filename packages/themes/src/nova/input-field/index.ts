import { createThemePart, css } from '@ngneers/controls-themes/api';
import { baseStyles } from '@ngneers/controls-themes/base';
import {
  animationTemplate,
  colorsTemplate,
  fontTemplate,
  sizesTemplate,
} from '@ngneers/controls-themes/nova/base';
import { inputFieldControlTemplate } from '@ngneers/controls-themes/templates/input-field';

export const inputFieldStyles = createThemePart({
  controlTemplate: inputFieldControlTemplate,
  base: baseStyles.inputField,
  dependencies: [colorsTemplate, sizesTemplate, animationTemplate, fontTemplate],
  root: {
    css: ({ v, c, d }) => {
      const invalidDisabledSelector = `
        ${c('invalid')}:disabled,
        .ng-invalid.ng-touched:disabled ${c('root')},
        ${c('root')}:has(.ng-invalid.ng-touched:disabled),
        ${c('root')}:has(${d('input', 'invalid')}:disabled),
        ${c('root')}:has([aria-invalid='true'][disabled])
      `;

      const invalidReadonlySelector = `
          ${c('invalid')}:read-only,
          .ng-invalid.ng-touched:read-only ${c('root')},
          ${c('root')}:has(.ng-invalid.ng-touched:read-only),
          ${c('root')}:has(${d('input', 'invalid')}:read-only),
          ${c('invalid')}[aria-readonly],
          .ng-invalid.ng-touched[aria-readonly] ${c('root')},
          ${c('root')}:has(.ng-invalid.ng-touched[aria-readonly]),
          ${c('root')}:has(${d('input', 'invalid')}[aria-readonly]),
          ${c('root')}:has([aria-invalid='true'][aria-readonly='true'])
        `;

      function getFloating(klass: string) {
        return `${klass}:has(${d('input', 'root')}:focus),
          ${klass}:has(${d('input', 'root')}:not(${d('input', 'empty')}))`;
      }

      return css`
        ${c('root')} {
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
          outline-offset: -1px;
          overflow: auto;
          /** line-height + vertical padding + border */
          --baseHeight: calc(1lh + 2 * ${v('size.padding.sm')} + 2px);
          height: max(var(--baseHeight), fit-content);

          /* regular */
          &:hover {
            border-color: ${v('color.surface.500')};
          }
          &:focus-within {
            border-color: ${v('color.primary.500')};
            outline-color: ${v('color.primary.500')};
            outline-width: 2px;
          }
        }

        /* disabled */
        ${c('disabled')}, ${c('root')}:has(${d('input', 'root')}:disabled), ${c(
          'root'
        )}:has([role='combobox'][disabled]), :disabled ${c('root')},
        ${c('root')}:has(${d('input', 'root')}[disabled]) {
          background: ${v('color.disabled.background')};
          border-color: ${v('color.disabled.border')};
          color: ${v('color.disabled.text')};
          &:hover {
            border-color: ${v('color.disabled.border')};
          }
          &:focus-within {
            border-color: ${v('color.disabled.border')};
            outline-width: 0;
          }
        }

        /* read-only */
        ${c('readonly')}, ${c('root')}:has(${d('input', 'root')}:read-only), ${c(
          'root'
        )}:has([aria-readonly='true']) {
          border-color: ${v('color.disabled.border')};
          &:hover {
            border-color: ${v('color.disabled.border')};
          }
          &:focus-within {
            border-color: ${v('color.disabled.border')};
            outline-color: ${v('color.disabled.border')};
          }
        }

        /* invalid */
        ${c('invalid')}, .ng-invalid.ng-touched ${c('root')}, ${c(
          'root'
        )}:has(.ng-invalid.ng-touched), ${c('root')}:has(${d('input', 'invalid')}), ${c(
          'root'
        )}:has([aria-invalid='true']) {
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

        /* Label Styles */
        ${c('label')} {
          color: ${v('color.surface.600')};
          font-size: ${v('font.size.xs')};
          font-weight: ${v('font.weight.medium')};

          max-width: 100%;
          white-space: pre;
          overflow: hidden;
          text-overflow: ellipsis;

          transition-duration: ${v('anim.time.fade')};
          transition-timing-function: ${v('anim.ease.fade')};
        }

        /* Label over */
        ${c('labelKind-over')}, ${c('labelKind-floatOver')} {
          position: relative;
          ${c('label')} {
            position: absolute;
            top: 0;
            transform: translateY(-100%);
            left: 0;
            padding: 0 ${v('size.padding.md')};
            transition-property: top, transform, font-size;
          }
        }
        /* float: not floating */
        ${c('labelKind-floatOver')}:not(${getFloating(c('labelKind-floatOver'))}) {
          ${c('label')} {
            font-size: 1rem;
            pointer-events: none;
            top: 50%;
            transform: translateY(-50%);
          }
        }

        /* Label in */
        ${c('labelKind-in')}, ${c('labelKind-floatIn')} {
          position: relative;
          ${c('root')} {
            padding-top: 1.2rem;
            height: max(calc(var(--baseHeight) + 1.2rem), fit-content);
          }
          ${c('label')} {
            position: absolute;
            padding: ${v('size.padding.sm')} ${v('size.padding.md')};
            transform: translateY(0);
            top: 0;
            transition-property: top, transform, font-size;
          }
        }
        /* float: not floating */
        ${c('labelKind-floatIn')}:not(${getFloating(c('labelKind-floatIn'))}) {
          ${c('label')} {
            font-size: 1rem;
            pointer-events: none;
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
            max-width: calc(100% - ${v('size.padding.md')} * 2);
            transform: translateY(-55%);
            transition-property: top, left, font-size, transform, padding;

            &:before {
              content: '';
              z-index: -1;
              position: absolute;
              top: 55%;
              transform: translateY(-50%) scale(1);
              left: 0;
              width: 100%;
              height: 5px;
              background: ${v('color.background')};
              transition: transform ${v('anim.time.fade')} ${v('anim.ease.fade')};
            }
          }
        }
        /* float: not floating */
        ${c('labelKind-floatOn')}:not(${getFloating(c('labelKind-floatOn'))}) {
          ${c('label')} {
            font-size: 1rem;
            pointer-events: none;
            padding: 0 ${v('size.padding.md')};
            left: 0;
            transform: translateY(-50%);
            top: 50%;
            &:before {
              transform: translateY(-50%) scale(0);
            }
          }
        }

        /* Label hidden */
        ${c('labelKind-hidden')} ${c('label')} {
          display: none;
        }
      `;
    },
  },
});
