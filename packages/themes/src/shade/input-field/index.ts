import { createThemePart, css } from '@awdlab/jig-themes/api';
import { baseStyles } from '@awdlab/jig-themes/base';
import {
  animationTemplate,
  colorsTemplate,
  fontTemplate,
  sizesTemplate,
} from '@awdlab/jig-themes/shade/base';
import { inputFieldControlTemplate } from '@awdlab/jig-themes/templates/input-field';

export const inputFieldStyles = createThemePart({
  controlTemplate: inputFieldControlTemplate,
  base: baseStyles.inputField,
  dependencies: [colorsTemplate, sizesTemplate, animationTemplate, fontTemplate],
  root: {
    // Label-kind positioning is preserved verbatim from the structural theme; only colors and
    // the focus treatment (shadcn box-shadow ring) are restyled to shade tokens.
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
          /* Control text baseline (shadcn 0.875rem) so field-based controls (input, select,
           * date pickers) don't inherit the larger ambient page size. */
          font-size: ${v('font.size.sm')};
          border-radius: ${v('size.rounded.md')};
          border-color: ${v('color.input')};
          border-width: 1px;
          border-style: solid;
          /* Published for the base theme, which hands this padding to the projected input. */
          --fieldPadY: ${v('size.padding.sm')};
          --fieldPadX: ${v('size.padding.md')};
          padding: var(--fieldPadY) var(--fieldPadX);
          background: ${v('color.background')};
          color: ${v('color.foreground')};
          box-shadow: none;
          transition:
            border-color 0.15s ease-in-out,
            color 0.15s ease-in-out,
            box-shadow 0.15s ease-in-out;
          /** line-height + vertical padding + border */
          --baseHeight: calc(1lh + 2 * ${v('size.padding.sm')} + 2px);
          height: max(var(--baseHeight), fit-content);

          /* regular */
          &:focus-within {
            border-color: ${v('color.ring')};
            box-shadow: 0 0 0 3px color-mix(in srgb, ${v('color.ring')} 50%, transparent);
          }
        }

        /* The wrapper owns the border, radius, shadow and focus ring — suppress the nested
         * input's own so they don't stack into a visible double border/ring (base already
         * drops the inner border). */
        ${c('root')} ${d('input', 'root')} {
          box-shadow: none;
          border-radius: 0;
        }

        /* disabled: dim only, never recolored */
        ${c('disabled')}, ${c('root')}:has(${d('input', 'root')}:disabled), ${c(
          'root'
        )}:has([role='combobox'][disabled]), :disabled ${c('root')},
        ${c('root')}:has(${d('input', 'root')}[disabled]) {
          opacity: 0.5;
          cursor: default;
          &:focus-within {
            box-shadow: none;
          }
        }

        /* read-only: muted fill, readable, clearly non-editable */
        ${c('readonly')}, ${c('root')}:has(${d('input', 'root')}:read-only), ${c(
          'root'
        )}:has([aria-readonly='true']) {
          background: ${v('color.muted.base')};
          border-color: ${v('color.border')};
          &:focus-within {
            border-color: ${v('color.border')};
            box-shadow: none;
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
          border-color: ${v('color.destructive.base')};
          &:focus-within {
            border-color: ${v('color.destructive.base')};
            box-shadow: 0 0 0 3px
              color-mix(in srgb, ${v('color.destructive.base')} 20%, transparent);
          }
        }

        /* invalid & disabled */
        ${invalidDisabledSelector} {
          border-color: ${v('color.destructive.base')};
        }

        /* invalid & read-only */
        ${invalidReadonlySelector} {
          border-color: ${v('color.destructive.base')};
        }

        ${c('clear-button')} {
          font-size: calc(1em * 0.9);
          color: ${v('color.muted.foreground')};
          &:hover {
            color: ${v('color.foreground')};
          }
        }

        /* Label Styles */
        ${c('label')} {
          color: ${v('color.muted.foreground')};
          font-size: ${v('font.size.xs')};
          font-weight: ${v('font.weight.medium')};

          /* Sit above field adornments (e.g. spin buttons that bleed to the top border) so a
           * floated 'on'/'over' label is never painted over by a leading/trailing control. */
          z-index: 2;

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
            /* Match the normalized field text size (see root) so the resting label doesn't
             * render larger than the input text it sits over. */
            font-size: ${v('font.size.sm')};
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
            transition-property: top, transform, font-size;
          }
        }
        /* float: not floating */
        ${c('labelKind-floatIn')}:not(${getFloating(c('labelKind-floatIn'))}) {
          ${c('label')} {
            font-size: ${v('font.size.sm')};
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
            font-size: ${v('font.size.sm')};
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
