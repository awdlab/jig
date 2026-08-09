import { createThemePart, css } from '@awdlab/jig-themes/api';
import { baseStyles } from '@awdlab/jig-themes/base';
import {
  animationTemplate,
  colorsTemplate,
  fontTemplate,
  sizesTemplate,
} from '@awdlab/jig-themes/material/base';
import { inputFieldControlTemplate } from '@awdlab/jig-themes/templates/input-field';

// MD3 label float variants that show a visible, positionable label (all but 'hidden').
const FLOATABLE_LABEL_KINDS = ['over', 'floatOver', 'in', 'floatIn', 'on', 'floatOn'] as const;

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

      // MD3 only tints the label once the field itself is actually focused (having a value
      // while blurred keeps the resting/active size but not the primary color).
      const focusedLabelSelector = FLOATABLE_LABEL_KINDS.map(
        kind => `${c(`labelKind-${kind}`)}:has(${d('input', 'root')}:focus)`
      ).join(',\n');

      return css`
        /* Base root == MD3 outlined text field (the DEFAULT look). Applied to c('root')
           directly — not gated behind c('kind-outlined') — so a bare <jig-input-field>
           with no kind still renders the outlined chrome. kind=filled overrides below. */
        ${c('root')} {
          border-radius: ${v('size.rounded.md')};
          /* Published for the base theme, which hands this padding to the projected input. */
          --fieldPadY: ${v('size.padding.sm')};
          --fieldPadX: ${v('size.padding.md')};
          padding: var(--fieldPadY) var(--fieldPadX);
          color: ${v('color.text')};
          background: transparent;
          border: 1px solid ${v('color.border')};
          outline: 2px solid transparent;
          outline-offset: -2px;
          transition:
            border-color ${v('anim.time.snappyFade')} ${v('anim.ease.snappyFade')},
            box-shadow ${v('anim.time.snappyFade')} ${v('anim.ease.snappyFade')},
            background ${v('anim.time.snappyFade')} ${v('anim.ease.snappyFade')},
            color ${v('anim.time.snappyFade')} ${v('anim.ease.snappyFade')};
          overflow: auto;
          /** line-height + vertical padding + border */
          --baseHeight: calc(1lh + 2 * ${v('size.padding.sm')} + 2px);
          height: max(var(--baseHeight), fit-content);

          &:hover {
            border-color: ${v('color.surface.500')};
          }
          &:focus-within {
            border-color: ${v('color.primary.foreground')};
            outline-color: ${v('color.primary.foreground')};
          }
        }

        /* kind: filled — MD3 filled text field: tonal surface, animated underline */
        ${c('kind-filled')} ${c('root')} {
          position: relative;
          background: ${v('color.surface.100')};
          border: none;
          border-radius: ${v('size.rounded.md')} ${v('size.rounded.md')} 0 0;

          /* resting 1px divider */
          &::after {
            content: '';
            position: absolute;
            inset: auto 0 0 0;
            height: 1px;
            background: ${v('color.border')};
          }
          /* 2px active indicator, grows in from the center on focus */
          &::before {
            content: '';
            position: absolute;
            inset: auto 0 0 0;
            height: 2px;
            background: ${v('color.primary.foreground')};
            transform: scaleX(0);
            transition: transform ${v('anim.time.fade')} ${v('anim.ease.fade')};
          }
          &:hover::after {
            background: ${v('color.surface.700')};
          }
          &:focus-within::before {
            transform: scaleX(1);
          }
        }

        /* filled: invalid/disabled recolor the underline instead of a border */
        ${c('kind-filled')} ${c('invalid')}::after,
        ${c('kind-filled')} ${c('invalid')}::before,
        ${c('kind-filled')} ${c('root')}:has(${d('input', 'invalid')})::after,
        ${c('kind-filled')} ${c('root')}:has(${d('input', 'invalid')})::before,
        ${c('kind-filled')} ${c('root')}:has([aria-invalid='true'])::after,
        ${c('kind-filled')} ${c('root')}:has([aria-invalid='true'])::before {
          background: ${v('color.invalid.border')};
        }
        ${c('kind-filled')} ${c('disabled')}::after,
        ${c('kind-filled')} ${c('root')}:has(${d('input', 'root')}:disabled)::after {
          background: ${v('color.disabled.border')};
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

        /* Label Styles — MD3 floating label: active (floated) is smaller + regular weight,
           resting (large, in-place) is medium weight; see the per-kind blocks below. */
        ${c('label')} {
          color: ${v('color.surface.600')};
          font-size: ${v('font.size.xs')};
          font-weight: ${v('font.weight.normal')};

          max-width: 100%;
          white-space: pre;
          overflow: hidden;
          text-overflow: ellipsis;

          transition-duration: ${v('anim.time.fade')};
          transition-timing-function: ${v('anim.ease.fade')};
        }

        /* Active label takes the primary color, but only while actually focused. */
        ${focusedLabelSelector} {
          ${c('label')} {
            color: ${v('color.primary.foreground')};
          }
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
            transition-property: top, transform, font-size, color;
          }
        }
        /* float: not floating */
        ${c('labelKind-floatOver')}:not(${getFloating(c('labelKind-floatOver'))}) {
          ${c('label')} {
            font-size: 1rem;
            font-weight: ${v('font.weight.medium')};
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
            height: max(calc(var(--baseHeight) + 1.2rem), fit-content);
          }
          ${c('label')} {
            position: absolute;
            padding: ${v('size.padding.sm')} ${v('size.padding.md')};
            transform: translateY(0);
            top: 0;
            transition-property: top, transform, font-size, color;
          }
        }
        /* float: not floating */
        ${c('labelKind-floatIn')}:not(${getFloating(c('labelKind-floatIn'))}) {
          ${c('label')} {
            font-size: 1rem;
            font-weight: ${v('font.weight.medium')};
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
            transition-property: top, left, font-size, transform, padding, color;

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
            font-weight: ${v('font.weight.medium')};
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
