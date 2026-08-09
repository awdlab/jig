import { createThemePart, css } from '@awdlab/jig-themes/api';
import { baseStyles } from '@awdlab/jig-themes/base';
import {
  colorsTemplate,
  fontTemplate,
  sizesTemplate,
  themedColors,
} from '@awdlab/jig-themes/material/base';
import { chipControlTemplate } from '@awdlab/jig-themes/templates/chip';

export const chipStyles = createThemePart({
  controlTemplate: chipControlTemplate,
  base: baseStyles.chip,
  dependencies: [colorsTemplate, sizesTemplate, fontTemplate],
  root: {
    css: ({ v, c, d }) => css`
      ${themedColors(c, v)}

      /* MD3 chips are tonal filled shapes with an 8dp corner radius, not the
         full pill nova used — there is no kind axis on this control to opt
         back into a pill, so this is the single default look. */
      ${c('root')} {
        background: color-mix(in srgb, var(--theme-color-500) 12%, transparent);
        border-radius: ${v('size.rounded.md')};
      }

      ${c('content')} {
        padding: ${v('size.padding.sm')} ${v('size.padding.lg')};
        font-size: ${v('font.size.sm')};
        font-weight: ${v('font.weight.medium')};
        line-height: 1.25rem;
        background: none;
        color: var(--theme-color-700-on-50);
        border: none;
      }

      /* State layers overlay currentColor (the tonal-on-container text color)
         rather than the raw --theme-color-500, since the chip surface is
         already tinted. */
      ${c('close-button')} {
        cursor: pointer;
        padding: 0 ${v('size.padding.md')} 0 calc(${v('size.padding.sm')} / 2);
        background: none;
        color: inherit;
        border: none;
        border-top-right-radius: ${v('size.rounded.md')};
        border-bottom-right-radius: ${v('size.rounded.md')};
        font-size: 0.75rem;
        transition: background 0.15s ease;

        &:hover {
          background: color-mix(in srgb, currentColor 8%, transparent);
        }

        &:focus-visible {
          background: color-mix(in srgb, currentColor 12%, transparent);
        }

        &:active {
          background: color-mix(in srgb, currentColor 12%, transparent);
        }
      }

      ${c('actionable')} {
        ${c('content')} {
          cursor: pointer;
          border-radius: ${v('size.rounded.md')};
          transition: background 0.15s ease;
        }

        &:has(${c('content')}:hover) {
          background: color-mix(in srgb, currentColor 8%, transparent);
        }

        &:has(${c('content')}:focus-visible) {
          background: color-mix(in srgb, currentColor 12%, transparent);
        }

        &:has(${c('content')}:active) {
          background: color-mix(in srgb, currentColor 12%, transparent);
        }
      }

      ${c('closable')} {
        ${c('content')} {
          padding-right: calc(${v('size.padding.sm')} / 2);
          border-top-right-radius: 0;
          border-bottom-right-radius: 0;
        }
      }
    `,
  },
});
