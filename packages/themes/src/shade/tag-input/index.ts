import { createThemePart, css } from '@awdlab/jig-themes/api';
import { baseStyles } from '@awdlab/jig-themes/base';
import {
  colorsTemplate,
  focusRingStyles,
  fontTemplate,
  sizesTemplate,
} from '@awdlab/jig-themes/shade/base';
import { tagInputControlTemplate } from '@awdlab/jig-themes/templates/tag-input';

export const tagInputStyles = createThemePart({
  controlTemplate: tagInputControlTemplate,
  base: baseStyles.tagInput,
  dependencies: [colorsTemplate, sizesTemplate, fontTemplate],
  root: {
    // A tag is the shadcn `secondary` badge, bordered so it reads as a chip on the field surface.
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
        background: ${v('color.secondary.base')};
        color: ${v('color.secondary.foreground')};
        font-size: ${v('font.size.xs')};
        font-weight: ${v('font.weight.medium')};
        line-height: 1.125rem;
      }
      ${c('tag-remove')} {
        color: ${v('color.muted.foreground')};
        border-radius: ${v('size.rounded.md')};
        /* The icon is sized by font-size (1em), like the chip's close button. */
        font-size: 0.75rem;
        padding-inline: calc(${v('size.padding.sm')} / 2);

        &:hover {
          color: ${v('color.foreground')};
        }
        &:active {
          opacity: 0.5;
        }
        &:focus-visible {
          ${focusRingStyles(v)}
        }
      }
      /* A disabled tag keeps only its border, so it doesn't read as an active chip. */
      ${c('field')}:has(${d('input', 'root')}:disabled) ${c('tag')} {
        background: transparent;
        color: ${v('color.muted.foreground')};
      }
    `,
  },
});
