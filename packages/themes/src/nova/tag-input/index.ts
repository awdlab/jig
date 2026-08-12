import { createThemePart, css } from '@awdlab/jig-themes/api';
import { baseStyles } from '@awdlab/jig-themes/base';
import {
  colorsTemplate,
  controlRing,
  fontTemplate,
  ringTemplate,
  sizesTemplate,
} from '@awdlab/jig-themes/nova/base';
import { tagInputControlTemplate } from '@awdlab/jig-themes/templates/tag-input';

export const tagInputStyles = createThemePart({
  controlTemplate: tagInputControlTemplate,
  base: baseStyles.tagInput,
  dependencies: [colorsTemplate, sizesTemplate, fontTemplate, ringTemplate],
  root: {
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
        /* Keeps wrapped rows off the field's top and bottom edges. */
        padding-block: calc(${v('size.padding.sm')} / 2);
      }
      /* A tag reads as an outlined pill: the surface palette reverses in dark mode,
         so shade 50 stays a hairline off the field background in both. */
      ${c('tag')} {
        gap: ${v('size.padding.sm')};
        padding: 0 ${v('size.padding.sm')};
        border: 1px solid ${v('color.surface.300')};
        border-radius: ${v('size.rounded.sm')};
        background: ${v('color.surface.50')};
        color: ${v('color.text')};
        font-size: ${v('font.size.sm')};
        line-height: 1.125rem;
      }
      ${c('tag-remove')} {
        color: ${v('color.surface.600')};
        border-radius: ${v('size.rounded.sm')};
        /* The icon is sized by font-size (1em), like the chip's close button. */
        font-size: 0.75rem;
        padding-inline: calc(${v('size.padding.sm')} / 2);

        &:hover {
          color: ${v('color.text')};
        }
        &:active {
          opacity: 0.5;
        }
        &:focus-visible {
          outline: 2px solid ${controlRing(v)};
          outline-offset: 1px;
        }
      }
      /* A disabled field's background is the same grey the tag fill uses, which
         would swallow the outline — drop the fill and keep the border. */
      ${c('field')}:has(${d('input', 'root')}:disabled) {
        ${c('tag')} {
          background: transparent;
          border-color: ${v('color.disabled.border')};
          color: ${v('color.disabled.text')};
        }
      }
    `,
  },
});
