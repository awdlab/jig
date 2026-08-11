import { createThemePart, css } from '@awdlab/jig-themes/api';
import { baseStyles } from '@awdlab/jig-themes/base';
import {
  animationTemplate,
  colorsTemplate,
  fieldInvalidRing,
  fieldNeutralRing,
  fieldRing,
  fontTemplate,
  ringTemplate,
  sizesTemplate,
} from '@awdlab/jig-themes/nova/base';
import { inputFieldControlTemplate } from '@awdlab/jig-themes/templates/input-field';

export const inputFieldStyles = createThemePart({
  controlTemplate: inputFieldControlTemplate,
  base: baseStyles.inputField,
  dependencies: [colorsTemplate, sizesTemplate, animationTemplate, fontTemplate, ringTemplate],
  root: {
    css: ({ v, c, d }) => {
      const invalidDisabledSelector = `
        ${c('invalid')}:disabled,
        .ng-invalid.ng-touched:disabled ${c('root')},
        ${c('root')}:has(.ng-invalid.ng-touched:disabled),
        ${c('root')}:has(${d('input', 'invalid')}:disabled),
        ${c('root')}:has([aria-invalid='true'][disabled])
      `;

      // `:read-only` also matches disabled inputs, so every use excludes them — the
      // disabled rules come first and must not be overridden by the read-only ones.
      const invalidReadonlySelector = `
          ${c('invalid')}:read-only:not(:disabled),
          .ng-invalid.ng-touched:read-only:not(:disabled) ${c('root')},
          ${c('root')}:has(.ng-invalid.ng-touched:read-only:not(:disabled)),
          ${c('root')}:has(${d('input', 'invalid')}:read-only:not(:disabled)),
          ${c('invalid')}[aria-readonly],
          .ng-invalid.ng-touched[aria-readonly] ${c('root')},
          ${c('root')}:has(.ng-invalid.ng-touched[aria-readonly]),
          ${c('root')}:has(${d('input', 'invalid')}[aria-readonly]),
          ${c('root')}:has([aria-invalid='true'][aria-readonly='true'])
        `;

      // Float when the field is focused or its projected control reports content.
      // The `filled` class is set component-side from the control's `empty` signal,
      // so this works for select/calendar/mask-input, not just native inputs.
      function getFloating(klass: string) {
        return `${klass}:focus-within,
          ${klass}${c('filled')}`;
      }

      return css`
        ${c('root')} {
          border-radius: ${v('size.rounded.md')};
          border-color: ${v('color.border')};
          border-width: 1px;
          border-style: solid;
          /* Published for the base theme, which hands this padding to the projected input. */
          --fieldPadY: ${v('size.padding.sm')};
          --fieldPadX: ${v('size.padding.lg')};
          padding: var(--fieldPadY) var(--fieldPadX);
          background: ${v('color.surface.50')};
          color: ${v('color.text')};
          transition:
            border-color 0.15s ease,
            color 0.15s ease,
            outline-color 0.15s ease;
          outline-color: transparent;
          outline-width: 3px;
          outline-style: solid;
          outline-offset: 0;
          /** The shared control height as a floor; content (textarea, chips) still grows it.
              Must be min-height — height: max(..., fit-content) is invalid CSS and gets dropped. */
          --baseHeight: ${v('size.height.control')};
          min-height: var(--baseHeight);

          /* regular */
          &:hover {
            border-color: ${v('color.primary.500')};
          }
          &:focus-within {
            border-color: ${v('color.primary.500')};
            outline-color: ${fieldRing(v)};
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
          /* The root carries tabindex="-1", so a click focuses it even when the
             input is disabled — keep the ring fully transparent so nothing fades
             in or out. */
          &:focus-within {
            border-color: ${v('color.disabled.border')};
            outline-color: transparent;
          }
        }

        /* read-only */
        ${c('readonly')}:not(${c('disabled')}), ${c('root')}:has(${d(
          'input',
          'root'
        )}:read-only:not(:disabled)), ${c('root')}:has([aria-readonly='true']:not([disabled])) {
          border-color: ${v('color.disabled.border')};
          &:hover {
            border-color: ${v('color.disabled.border')};
          }
          &:focus-within {
            border-color: ${v('color.disabled.border')};
            outline-color: ${fieldNeutralRing(v)};
          }
        }

        /* invalid — the projected control gates its own aria-invalid (via its
           invalidOn trigger), so it's trustworthy here; the field just reflects
           it. Reactive/template forms use the native .ng-invalid.ng-touched. */
        ${c('invalid')},
        .ng-invalid.ng-touched ${c('root')},
        ${c('root')}:has(.ng-invalid.ng-touched),
        ${c('root')}:has(${d('input', 'invalid')}),
        ${c('root')}:has([aria-invalid='true']) {
          border-color: ${v('color.invalid.border')};
          &:hover {
            border-color: ${v('color.invalid.border')};
          }
          &:focus-within {
            border-color: ${v('color.invalid.border')};
            outline-color: ${fieldInvalidRing(v)};
          }
        }

        /* invalid & disabled — red border stays, but no focus ring (see disabled). */
        ${invalidDisabledSelector} {
          border-color: ${v('color.invalid.border')};
          &:hover {
            border-color: ${v('color.invalid.border')};
          }
          &:focus-within {
            border-color: ${v('color.invalid.border')};
            outline-color: transparent;
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
            outline-color: ${fieldInvalidRing(v)};
          }
        }

        ${c('clear-button')} {
          font-size: calc(1em * 0.9);
          color: ${v('color.surface.600')};
          &:hover {
            color: ${v('color.surface.700')};
          }
        }

        /* Label Styles */
        ${c('label')} {
          color: ${v('color.surface.700')};
          font-size: ${v('font.size.sm')};
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
            /* Published for the base theme, so the input claims the label strip too. */
            --fieldPadTop: 1.2rem;
            padding-top: var(--fieldPadTop);
            min-height: calc(var(--baseHeight) + 1.2rem);
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
            left: ${v('size.padding.lg')};
            max-width: calc(100% - ${v('size.padding.lg')} * 2);
            transform: translateY(-55%);
            transition-property: top, left, font-size, transform, padding;

            &:before {
              content: '';
              z-index: -1;
              position: absolute;
              top: 50%;
              transform: translateY(-50%) scale(1);
              left: 0;
              width: 100%;
              height: 6px;
              background: ${v('color.surface.50')};
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
