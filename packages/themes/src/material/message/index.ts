import { createThemePart, css } from '@ngneers/controls-themes/api';
import { baseStyles } from '@ngneers/controls-themes/base';
import {
  colorsTemplate,
  fontTemplate,
  sizesTemplate,
  themedColors,
} from '@ngneers/controls-themes/material/base';
import { messageControlTemplate } from '@ngneers/controls-themes/templates/message';

export const messageStyles = createThemePart({
  controlTemplate: messageControlTemplate,
  base: baseStyles.message,
  dependencies: [colorsTemplate, sizesTemplate, fontTemplate],
  root: {
    css: ({ v, c }) => css`
      ${themedColors(c, v)}

      ${c('root')} {
        gap: ${v('size.padding.md')};
        /* MD3 tonal container: a translucent tint of the kind color over the
           surrounding surface, rather than a precomputed light shade. */
        background: color-mix(in srgb, var(--theme-color-500) 12%, transparent);
        color: var(--theme-color-700-on-50);
        padding: ${v('size.padding.md')} ${v('size.padding.lg')};
        border-radius: ${v('size.rounded.md')};
        font-size: ${v('font.size.md')};
        border: 1px solid var(--theme-color-500);
      }

      ${c('icon')} {
        color: var(--theme-color-foreground);
        font-size: 1.15rem;
        line-height: 1;
        margin-top: 0.125rem;
      }

      ${c('content')} {
        line-height: 1.5;
      }

      ${c('kind-outlined')} {
        background: transparent;
        border-width: 2px;
      }

      ${c('kind-simple')} {
        background: transparent;
        border: none;
        padding: ${v('size.padding.sm')} ${v('size.padding.md')};
      }
    `,
  },
});
