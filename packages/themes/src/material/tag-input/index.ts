import { createThemePart, css } from '@awdlab/jig-themes/api';
import { baseStyles } from '@awdlab/jig-themes/base';
import { colorsTemplate, fontTemplate, sizesTemplate } from '@awdlab/jig-themes/material/base';
import { tagInputControlTemplate } from '@awdlab/jig-themes/templates/tag-input';

export const tagInputStyles = createThemePart({
  controlTemplate: tagInputControlTemplate,
  base: baseStyles.tagInput,
  dependencies: [colorsTemplate, sizesTemplate, fontTemplate],
  root: {
    // MD3 input chip: outlined, transparent surface, 4dp corner.
    css: ({ v, c, d }) => css`
      ${c('tags')} {
        gap: ${v('size.padding.sm')};
      }
      /* Keeps the typed text off the last tag, in place of the field inset the text field
         carries while the row is empty. Padding rather than a gap, so the width the row
         reserves is unchanged and short tag rows don't start overflowing. */
      ${c('tags')}:not(:empty) + ${d('input')} {
        padding-inline-start: ${v('size.padding.md')};
      }
      ${c('multiline')} {
        row-gap: ${v('size.padding.sm')};
        padding-block: calc(${v('size.padding.sm')} / 2);
      }
      ${c('tag')} {
        gap: ${v('size.padding.sm')};
        padding: 0 ${v('size.padding.md')};
        border: 1px solid ${v('color.border')};
        border-radius: ${v('size.rounded.md')};
        background: transparent;
        color: ${v('color.text')};
        font-size: ${v('font.size.sm')};
        line-height: 1.125rem;
      }
      /* MD3 state layer on the trailing icon rather than a color shift. */
      ${c('tag-remove')} {
        color: ${v('color.surface.600')};
        border-radius: ${v('size.rounded.md')};
        /* The icon is sized by font-size (1em), like the chip's close button. */
        font-size: 0.75rem;
        padding-inline: calc(${v('size.padding.sm')} / 2);
        transition: background 0.15s ease;

        &:hover {
          color: ${v('color.text')};
          background: color-mix(in srgb, currentColor 8%, transparent);
        }
        &:active {
          background: color-mix(in srgb, currentColor 12%, transparent);
        }
        &:focus-visible {
          outline: 2px solid color-mix(in srgb, ${v('color.primary.500')} 50%, transparent);
          outline-offset: 1px;
        }
      }
      ${c('field')}:has(${d('input', 'root')}:disabled) {
        ${c('tag')} {
          border-color: ${v('color.disabled.border')};
          color: ${v('color.disabled.text')};
        }
      }
    `,
  },
});
